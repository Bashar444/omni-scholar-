export const environment = {
  production: true,
  apiUrl: 'https://scholar.omniumhub.me/api',
  appName: 'OmniScholar',
  version: '0.1.0',
  scholarGraph: {
    useLive: true,
    liveSources: ['CrossRef', 'arXiv', 'PubMed'],
    cacheTtlMs: 2 * 60 * 1000
  },
};
