export const performanceBudgets = {
  timing: {
    ttfb: 200, 
    fcp: 1800, 
    lcp: 2500, 
    tti: 3800, 
  },
  resources: {
    maxRequests: 50,
    totalSize: 1.5 * 1024 * 1024, 
    maxAssetSize: 1 * 1024 * 1024, 
    allowedStatusCodes: [200, 304], 
  },
};
