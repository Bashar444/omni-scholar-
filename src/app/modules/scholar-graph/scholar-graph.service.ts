import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin, of, throwError } from 'rxjs';
import { catchError, delay, map, switchMap, retryWhen, scan } from 'rxjs/operators';
import { PaperResult, Source } from './state/scholar-graph.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ScholarGraphService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // very simple in-memory cache per query+source
  private cache = new Map<string, { ts: number; data: PaperResult[] }>();
  // emits when a rate limit is encountered
  readonly rateLimit$ = new Subject<string>();

  private mockData: PaperResult[] = [
    { id: '1', title: 'Deep Learning for Biology', authors: ['A. Smith', 'B. Lee'], year: 2021, source: 'arXiv' },
    { id: '2', title: 'Graph Neural Networks in Practice', authors: ['C. Zhao'], year: 2022, source: 'PubMed' },
    { id: '3', title: 'Citations and Networks', authors: ['D. Kumar', 'E. Park'], year: 2019, source: 'CrossRef' },
  ];

  search(query: string, selectedSources: Source[] = []): Observable<PaperResult[]> {
    const q = query.trim();
    if (!q) return of([]);

    let useLive = !!environment.scholarGraph?.useLive;
    if (this.isBrowser) {
      const o = window.localStorage.getItem('sg.useLive');
      if (o != null) useLive = o === 'true';
    }
    const sources: Source[] = (selectedSources && selectedSources.length)
      ? selectedSources
      : ['CrossRef', 'arXiv', 'PubMed'];

    if (!useLive) {
      // Mock-only path
      return of(this.filterMock(q, sources)).pipe(delay(300));
    }

    const tasks = sources.map(src => {
      switch (src) {
        case 'CrossRef':
          return this.searchCrossRef(q);
        case 'arXiv':
          return this.searchArxiv(q);
        case 'PubMed':
          return this.searchPubMed(q);
        default:
          return of<PaperResult[]>([]);
      }
    });

    return forkJoin(tasks).pipe(
      map(arrays => arrays.flat()),
      // On any failure, just fall back to mock for selected sources
      catchError(() => of(this.filterMock(q, sources)))
    );
  }

  private filterMock(q: string, selectedSources: Source[]): PaperResult[] {
    const lower = q.toLowerCase();
    const byText = this.mockData.filter(p => p.title.toLowerCase().includes(lower));
    return selectedSources.length ? byText.filter(p => selectedSources.includes(p.source)) : byText;
  }

  private searchCrossRef(query: string): Observable<PaperResult[]> {
    const key = `crossref:${query}`;
    const now = Date.now();
    const ttl = environment.scholarGraph?.cacheTtlMs ?? 120000;
    const cached = this.cache.get(key);
    if (cached && now - cached.ts < ttl) {
      return of(cached.data);
    }

    // CrossRef API: https://api.crossref.org/works?query=...
    const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=10`;
  return this.getJsonWithRetry<any>(url, 'CrossRef').pipe(
      map(resp => {
        const items = resp?.message?.items ?? [];
        const results: PaperResult[] = items.map((it: any, idx: number) => {
          const authors = Array.isArray(it.author)
            ? it.author.slice(0, 6).map((a: any) => [a.given, a.family].filter(Boolean).join(' ')).filter(Boolean)
            : [];
          const year = Array.isArray(it.issued?.['date-parts']) && it.issued['date-parts'][0]?.[0]
            ? Number(it.issued['date-parts'][0][0])
            : (it['published-print']?.['date-parts']?.[0]?.[0] ?? it['published-online']?.['date-parts']?.[0]?.[0] ?? null);
          const title = Array.isArray(it.title) ? (it.title[0] ?? 'Untitled') : (it.title ?? 'Untitled');
          const doi = it.DOI ?? `${Date.now()}-${idx}`;
          return {
            id: doi,
            title,
            authors,
            year: typeof year === 'number' ? year : new Date().getFullYear(),
            source: 'CrossRef' as const,
          } satisfies PaperResult;
        });
        this.cache.set(key, { ts: now, data: results });
        return results;
      }),
      // On SSR or network failure, fallback empty to let caller compose
      catchError((err) => {
        if (err?.status === 429) this.rateLimit$.next('CrossRef');
        return of<PaperResult[]>([]);
      })
    );
  }

  private searchArxiv(query: string): Observable<PaperResult[]> {
    const key = `arxiv:${query}`;
    const now = Date.now();
    const ttl = environment.scholarGraph?.cacheTtlMs ?? 120000;
    const cached = this.cache.get(key);
    if (cached && now - cached.ts < ttl) {
      return of(cached.data);
    }

    // arXiv returns Atom XML; only try in browser (DOMParser). If not browser, return empty.
    if (!this.isBrowser) return of<PaperResult[]>([]);

    const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=10`;
  return this.getTextWithRetry(url, 'arXiv').pipe(
      map(text => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');
        const entries = Array.from(xml.getElementsByTagName('entry'));
        const results: PaperResult[] = entries.map((entry, idx) => {
          const id = entry.getElementsByTagName('id')[0]?.textContent || `${Date.now()}-${idx}`;
          const title = (entry.getElementsByTagName('title')[0]?.textContent || 'Untitled').replace(/\s+/g, ' ').trim();
          const authors = Array.from(entry.getElementsByTagName('author'))
            .map(a => a.getElementsByTagName('name')[0]?.textContent || '')
            .filter(Boolean)
            .slice(0, 6);
          const yearText = entry.getElementsByTagName('published')[0]?.textContent || '';
          const year = yearText ? new Date(yearText).getFullYear() : new Date().getFullYear();
          return { id, title, authors, year, source: 'arXiv' as const };
        });
        this.cache.set(key, { ts: now, data: results });
        return results;
      }),
      catchError((err) => {
        if (err?.status === 429) this.rateLimit$.next('arXiv');
        return of<PaperResult[]>([]);
      })
    );
  }

  private searchPubMed(query: string): Observable<PaperResult[]> {
    const key = `pubmed:${query}`;
    const now = Date.now();
    const ttl = environment.scholarGraph?.cacheTtlMs ?? 120000;
    const cached = this.cache.get(key);
    if (cached && now - cached.ts < ttl) {
      return of(cached.data);
    }

    // Use E-utilities esearch + esummary; JSON mode. CORS should allow GET.
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=10&term=${encodeURIComponent(query)}`;
  return this.getJsonWithRetry<any>(searchUrl, 'PubMed').pipe(
      map(res => (res?.esearchresult?.idlist as string[]) || []),
      // If no ids, short-circuit
      switchMap(ids => {
        if (!ids.length) return of<PaperResult[]>([]);
        const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(',')}`;
  return this.getJsonWithRetry<any>(summaryUrl, 'PubMed').pipe(
          map(res => {
            const resultObj = res?.result || {};
            const uidList: string[] = (res?.result?.uids as string[]) || [];
            const results: PaperResult[] = uidList.map((uid, idx) => {
              const item = resultObj[uid] || {};
              const title = (item.title as string) || 'Untitled';
              const authors = Array.isArray(item.authors)
                ? (item.authors as any[]).slice(0, 6).map(a => a?.name || '').filter(Boolean)
                : [];
              // pubdate may be like "2021 Jan"; extract year
              const pubdate: string = item.pubdate || '';
              const yearMatch = pubdate.match(/\b(\d{4})\b/);
              const year = yearMatch ? Number(yearMatch[1]) : new Date().getFullYear();
              return { id: uid, title, authors, year, source: 'PubMed' as const };
            });
            this.cache.set(key, { ts: now, data: results });
            return results;
          })
        );
      }),
      catchError((err) => {
        if (err?.status === 429) this.rateLimit$.next('PubMed');
        return of<PaperResult[]>([]);
      })
    );
  }

  private getJsonWithRetry<T>(url: string, source: string): Observable<T> {
    return this.http.get<T>(url, { observe: 'body' as const }).pipe(
      retryWhen(errors => errors.pipe(
        scan((acc, err) => {
          const status = err?.status ?? 0;
          if (status === 429 && acc < 1) {
            return acc + 1; // retry once
          }
          throw err;
        }, 0),
        delay(1000)
      )),
      catchError(err => {
        if (err?.status === 429) this.rateLimit$.next(source);
        return throwError(() => err);
      })
    );
  }

  private getTextWithRetry(url: string, source: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' as const }).pipe(
      retryWhen(errors => errors.pipe(
        scan((acc, err) => {
          const status = err?.status ?? 0;
          if (status === 429 && acc < 1) {
            return acc + 1;
          }
          throw err;
        }, 0),
        delay(1000)
      )),
      catchError(err => {
        if (err?.status === 429) this.rateLimit$.next(source);
        return throwError(() => err);
      })
    );
  }
}
