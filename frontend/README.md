# QuantView — Quantitative Research Platform

A modern, AI-powered quantitative finance research platform built with React, TypeScript, and Vite. QuantView provides real-time stock data visualization, regression-based predictions, and portfolio analytics for quantitative researchers and traders.

## Features

- **Stock Data Visualization**: Interactive OHLCV charts with candlestick and line chart support
- **Regression Overlays**: Machine learning-based price predictions with confidence bands
- **Portfolio Analytics**: Allocation breakdowns and sector performance tracking
- **Real-time Data**: Live market data integration via Alpha Vantage API
- **Authentication**: Secure user management with Clerk
- **Modern UI**: Dark mode by default with smooth animations using Framer Motion and GSAP

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **State Management**: TanStack Query
- **Authentication**: Clerk
- **Testing**: Vitest
- **Animation**: Framer Motion, GSAP, Lenis

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
bun install
# or
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```

### Development

```bash
# Start development server
bun run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
# Production build
bun run build

# Development build
bun run build:dev
```

### Testing

```bash
# Run tests
bun run test

# Watch mode
bun run test:watch
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # App layout (sidebar, etc.)
│   └── widgets/      # Reusable widgets (ticker strip, etc.)
├── pages/
│   ├── Home.tsx      # Landing page
│   ├── Dashboard.tsx # Main dashboard
│   ├── About.tsx     # About page
│   └── Login.tsx     # Authentication
├── hooks/
│   ├── useAuth.tsx   # Authentication hooks
│   ├── useStock.tsx  # Stock data hooks
│   └── useTheme.tsx  # Theme management
├── types/
│   ├── stock.ts      # Stock data types
│   └── auth.ts       # Authentication types
└── lib/
    └── utils.ts      # Utility functions
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `dev` | Start development server |
| `build` | Build for production |
| `build:dev` | Build in development mode |
| `lint` | Run ESLint |
| `preview` | Preview production build |
| `test` | Run tests |
| `test:watch` | Run tests in watch mode |

## License

MIT