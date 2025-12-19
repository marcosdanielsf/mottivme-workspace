# UI Components Setup Guide

## Installation

Install all required dependencies:

```bash
npm install clsx tailwind-merge class-variance-authority lucide-react
npm install @radix-ui/react-accordion @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-tabs @radix-ui/react-tooltip
```

## TypeScript Configuration

Ensure your `tsconfig.json` includes path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Tailwind Configuration

Add these animations to your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [],
}
```

## App-Level Setup

For tooltips to work globally, wrap your app with `TooltipProvider`:

```tsx
// app/layout.tsx or pages/_app.tsx
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
```

## Usage

Import components from the index file:

```tsx
import { Button, Card, CardHeader, CardTitle, Input } from "@/components/ui";
```

Or import individually:

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

## Verification

Test that everything works:

```tsx
import { Button } from "@/components/ui/button";

export default function TestPage() {
  return <Button>Hello World</Button>;
}
```

If you see a styled blue button, you're all set!

## Troubleshooting

### "Cannot find module '@/components/ui'"

- Check your `tsconfig.json` has the correct path alias
- Restart your TypeScript server
- Ensure the path `src/components/ui` exists

### "Module not found: Can't resolve '@radix-ui/...'"

- Run `npm install` to ensure all dependencies are installed
- Check that package.json includes all Radix UI packages

### Styles not applying

- Verify Tailwind is configured correctly
- Check that `src/**/*.{tsx,jsx}` is in your Tailwind content array
- Make sure your CSS imports the Tailwind directives:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

### TypeScript errors about missing types

- Install type definitions: `npm install -D @types/react @types/react-dom`
- Ensure TypeScript version is 4.5 or higher

## Next Steps

1. Check out `examples.tsx` for usage patterns
2. Read `README.md` for component documentation
3. Start building your pricing calculator!
