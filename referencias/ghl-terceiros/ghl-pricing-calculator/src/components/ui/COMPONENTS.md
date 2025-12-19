# Component Quick Reference

## All Components

| Component | File | Description | Radix UI |
|-----------|------|-------------|----------|
| **Accordion** | `accordion.tsx` | Collapsible content sections | ✅ |
| **Badge** | `badge.tsx` | Status indicators and labels | ❌ |
| **Button** | `button.tsx` | Interactive buttons with variants | ❌ |
| **Card** | `card.tsx` | Content container with sections | ❌ |
| **Input** | `input.tsx` | Text input with label support | ❌ |
| **Select** | `select.tsx` | Dropdown selection menu | ✅ |
| **Slider** | `slider.tsx` | Range input slider | ✅ |
| **Tabs** | `tabs.tsx` | Tabbed interface | ✅ |
| **Tooltip** | `tooltip.tsx` | Contextual hover information | ✅ |

## Component Hierarchy

### Card Family
```
Card
├── CardHeader
│   ├── CardTitle
│   └── CardDescription
├── CardContent
└── CardFooter
```

### Accordion Family
```
Accordion
└── AccordionItem
    ├── AccordionTrigger
    └── AccordionContent
```

### Select Family
```
Select
├── SelectTrigger
│   └── SelectValue
└── SelectContent
    ├── SelectGroup (optional)
    │   └── SelectLabel
    ├── SelectItem
    └── SelectSeparator (optional)
```

### Tabs Family
```
Tabs
├── TabsList
│   └── TabsTrigger
└── TabsContent
```

### Tooltip Family
```
TooltipProvider (root level)
└── Tooltip
    ├── TooltipTrigger
    └── TooltipContent
```

## Variants & Sizes

### Button
**Variants:**
- `default` - Blue primary button
- `outline` - Bordered button
- `ghost` - Transparent button
- `destructive` - Red danger button

**Sizes:**
- `sm` - Small (h-9, px-3)
- `default` - Medium (h-10, px-4)
- `lg` - Large (h-11, px-8)

### Badge
**Variants:**
- `default` - Blue
- `secondary` - Gray
- `success` - Green
- `warning` - Yellow
- `destructive` - Red

## Common Props

### All Components
- `className` - Additional CSS classes (merged with cn)
- `ref` - React ref (via forwardRef)

### Radix Components
All Radix-based components accept their respective primitive props.

See [Radix UI Documentation](https://www.radix-ui.com/primitives) for specific props.

## Styling Patterns

### Color Scale
```
Primary:   blue-600  →  blue-700  →  blue-800
Secondary: slate-100 →  slate-200 →  slate-300
Text:      slate-900 (primary), slate-500 (secondary)
Borders:   slate-200, slate-300
```

### Focus States
All interactive components use:
```css
focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:ring-offset-2
```

### Shadows
```
shadow-sm  - Subtle elevation
shadow     - Medium elevation (default)
shadow-lg  - High elevation (modals, popovers)
```

### Border Radius
```
rounded-lg - 0.5rem (8px) - Default for all components
```

## Animation Classes

Used by Accordion and Select:
```
animate-accordion-down
animate-accordion-up
fade-in-0, fade-out-0
zoom-in-95, zoom-out-95
slide-in-from-*
```

## Import Patterns

### Named Imports
```tsx
import { Button, Card, Input } from "@/components/ui";
```

### Direct Imports
```tsx
import { Button } from "@/components/ui/button";
```

### Component-Specific
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
```

## Dependencies

### Required Packages
```json
{
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "class-variance-authority": "^0.7.0",
  "lucide-react": "^0.300.0",
  "@radix-ui/react-accordion": "^1.1.0",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-slider": "^1.1.0",
  "@radix-ui/react-tabs": "^1.0.0",
  "@radix-ui/react-tooltip": "^1.0.0"
}
```

## File Structure
```
src/
├── components/
│   └── ui/
│       ├── accordion.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── slider.tsx
│       ├── tabs.tsx
│       ├── tooltip.tsx
│       ├── index.ts
│       ├── examples.tsx
│       ├── README.md
│       ├── SETUP.md
│       └── COMPONENTS.md (this file)
└── lib/
    └── utils.ts
```

## Accessibility Features

| Component | ARIA | Keyboard | Screen Reader |
|-----------|------|----------|---------------|
| Accordion | ✅ | ✅ | ✅ |
| Button | ✅ | ✅ | ✅ |
| Select | ✅ | ✅ | ✅ |
| Slider | ✅ | ✅ | ✅ |
| Tabs | ✅ | ✅ | ✅ |
| Tooltip | ✅ | ✅ | ✅ |

## Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- Mobile Safari: ✅ iOS 12+
- Chrome Android: ✅ Latest

## Performance Notes

- All components use React.forwardRef
- Radix components are tree-shakeable
- No runtime CSS-in-JS (Tailwind only)
- Minimal bundle size impact (~50KB total)

## Common Issues

### Issue: Components not styled
**Solution:** Ensure Tailwind CSS is configured and imported

### Issue: Select dropdown not visible
**Solution:** Check z-index conflicts (Select uses z-50)

### Issue: Tooltip not showing
**Solution:** Wrap app with `<TooltipProvider>`

### Issue: TypeScript errors
**Solution:** Ensure @types/react is installed and TSConfig has path aliases

## Examples in Action

See `examples.tsx` for 8 complete examples:
1. ✓ Pricing Card
2. ✓ Settings Form
3. ✓ Tabbed Interface
4. ✓ FAQ Accordion
5. ✓ Status Dashboard
6. ✓ Button Variants
7. ✓ Form Validation
8. ✓ Pricing Calculator
