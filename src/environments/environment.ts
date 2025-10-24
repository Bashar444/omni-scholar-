export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'OmniScholar',
  version: '0.1.0',
  scholarGraph: {
    useLive: false,
    liveSources: ['CrossRef', 'arXiv', 'PubMed'],
    cacheTtlMs: 2 * 60 * 1000 // 2 minutes
  }
};
