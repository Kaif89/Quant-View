import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-xl space-y-6 animate-fade-in">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-foreground">About QuantView</h1>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">QuantView Research Lab</strong> is a transparent financial research dashboard
            that exposes the math behind market predictions. Unlike black-box trading platforms, every model coefficient,
            MSE score, and prediction formula is visible and auditable.
          </p>
          <p>
            Built with React, TypeScript, Recharts, and Tailwind CSS. All data is mock — this is a
            frontend demonstration of dashboard UI patterns for quantitative research.
          </p>
          <h2 className="text-foreground font-semibold text-lg pt-2">Stack</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>React 18 + TypeScript</li>
            <li>Tailwind CSS with design tokens</li>
            <li>Recharts for data visualization</li>
            <li>shadcn/ui component primitives</li>
            <li>Mock JSON data (no backend required)</li>
          </ul>
          <h2 className="text-foreground font-semibold text-lg pt-2">Mock Data</h2>
          <p>
            Stock data is generated at runtime in <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">src/mocks/sample-stocks.ts</code>.
            Edit model coefficients and MSE values there to test different prediction scenarios.
          </p>
        </div>
      </div>
    </div>
  );
}
