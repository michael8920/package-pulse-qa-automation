# Package Pulse QA Automation

![Package Pulse Logo](assets/logo.ico)

## 🚀 Overview

A focused test suite demonstrating QA automation skills using Playwright and TypeScript. Showcases expertise in:

- **Visual Regression**: Theme consistency and component layout validation
- **Performance**: TTFB, FCP, and memory usage monitoring
- **Cross-Browser**: Consistent behavior across major browsers
- **Architecture**: Page Object Model and modern testing practices

## ✨ Key Features

- **Visual Testing**

  - Theme consistency (Light/Dark)
  - Component layout validation
  - Cross-browser comparisons

- **Performance Testing**

  - Page load metrics
  - Memory usage
  - Network optimization
  - Runtime validation

- **E2E & Functional**
  - Chart data visualization
  - Interactive elements
  - Data loading/rendering
  - User flows

## 🛠️ Tech Stack

- **Framework**: Playwright
- **Language**: TypeScript
- **Testing**: E2E, Visual Regression, Performance, Smoke

## 🏗️ Project Structure

```
tests/
├── e2e/              # End-to-end test suites
│   └── chart.spec.ts # Chart functionality and data visualization tests
│
├── performance/      # Performance test suites
│   ├── loading.spec.ts    # Page load performance metrics
│   ├── memory.spec.ts     # Memory usage monitoring
│   ├── network.spec.ts    # Network asset optimization
│   └── runtime.spec.ts    # Runtime performance validation
│
├── visual/          # Visual regression tests
│   ├── layout.spec.ts     # Component layout consistency
│   └── theme.spec.ts      # Theme switching and appearance
│
└── smoke/           # Basic functionality tests
    └── smoke.spec.ts      # Critical path validation
```

## 🚦 Getting Started

1. **Prerequisites**

   ```bash
   Node.js >= 16
   npm >= 8
   ```

2. **Installation & Running**
   ```bash
   npm install           # Installation

   npm test              # Run all tests
   
   npm run test:visual   # Visual tests only
   npm run test:performance # Performance tests only
   npm run test:smoke # Smoke tests only
   npm run test:e2e # E2E tests only
   ```

## 👥 Contact

Michał - michal.sobocinski@hotmail.com
