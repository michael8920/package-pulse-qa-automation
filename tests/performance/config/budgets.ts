export const performanceBudgets = {
  timing: {
    ttfb: 200, // Time to First Byte (ms)
    fcp: 1800, // First Contentful Paint (ms)
    lcp: 2500, // Largest Contentful Paint (ms)
    tti: 3800, // Time to Interactive (ms)
  },
  resources: {
    maxRequests: 50, // Maximum number of requests
    totalSize: 1.5 * 1024 * 1024, // 1.5MB total size
  },
};
