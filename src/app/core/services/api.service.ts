import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  retry?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl || 'http://localhost:3000/api';

  /**
   * HTTP GET request
   */
  get<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    const url = this.getFullUrl(endpoint);
    return this.http.get<T>(url, {
      headers: options?.headers,
      params: options?.params
    }).pipe(
      retry(options?.retry || 0),
      catchError(this.handleError)
    );
  }

  /**
   * HTTP POST request
   */
  post<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    const url = this.getFullUrl(endpoint);
    return this.http.post<T>(url, body, {
      headers: options?.headers,
      params: options?.params
    }).pipe(
      retry(options?.retry || 0),
      catchError(this.handleError)
    );
  }

  /**
   * HTTP PUT request
   */
  put<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    const url = this.getFullUrl(endpoint);
    return this.http.put<T>(url, body, {
      headers: options?.headers,
      params: options?.params
    }).pipe(
      retry(options?.retry || 0),
      catchError(this.handleError)
    );
  }

  /**
   * HTTP DELETE request
   */
  delete<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    const url = this.getFullUrl(endpoint);
    return this.http.delete<T>(url, {
      headers: options?.headers,
      params: options?.params
    }).pipe(
      retry(options?.retry || 0),
      catchError(this.handleError)
    );
  }

  /**
   * HTTP PATCH request
   */
  patch<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    const url = this.getFullUrl(endpoint);
    return this.http.patch<T>(url, body, {
      headers: options?.headers,
      params: options?.params
    }).pipe(
      retry(options?.retry || 0),
      catchError(this.handleError)
    );
  }

  /**
   * Build full URL from endpoint
   */
  private getFullUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    return `${this.baseUrl}/${endpoint.replace(/^\//, '')}`;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
