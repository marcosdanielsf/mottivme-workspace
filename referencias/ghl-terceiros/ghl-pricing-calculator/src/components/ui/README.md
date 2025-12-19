# UI Component Library

A comprehensive set of reusable UI components built with React, TypeScript, Tailwind CSS, and Radix UI primitives.

## Design System

### Colors
- **Primary:** `blue-600` (hover: `blue-700`, active: `blue-800`)
- **Background:** `slate-50` / `white`
- **Text:** `slate-900` (primary), `slate-500` (secondary)
- **Borders:** `slate-200`, `slate-300`

### Spacing & Borders
- **Border Radius:** `rounded-lg` (0.5rem)
- **Shadows:** `shadow-sm`, `shadow`, `shadow-lg`
- **Focus Rings:** `ring-2 ring-blue-500 ring-offset-2`

## Components

### Button

Versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="default">Click me</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Link Style</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

**Props:**
- `variant`: `default` | `outline` | `ghost` | `destructive`
- `size`: `sm` | `default` | `lg`

### Card

Container component with header, content, and footer sections.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input

Text input with optional label support.

```tsx
import { Input } from "@/components/ui/input";

<Input label="Email" type="email" placeholder="you@example.com" />
<Input type="text" placeholder="No label" />
```

**Props:**
- `label`: Optional string for automatic label generation
- All standard HTML input attributes

### Badge

Small status indicators with color variants.

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="default">New</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Error</Badge>
```

**Props:**
- `variant`: `default` | `secondary` | `success` | `warning` | `destructive`

### Tabs

Tabbed interface for organizing content.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Overview</TabsTrigger>
    <TabsTrigger value="tab2">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <p>Overview content</p>
  </TabsContent>
  <TabsContent value="tab2">
    <p>Details content</p>
  </TabsContent>
</Tabs>
```

### Slider

Range input slider with customizable values.

```tsx
import { Slider } from "@/components/ui/slider";

<Slider
  defaultValue={[50]}
  max={100}
  step={1}
  onValueChange={(value) => console.log(value)}
/>
```

**Props:**
- All Radix UI Slider props
- Styled track, range, and thumb

### Select

Dropdown select with searchable options.

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

**Additional Components:**
- `SelectGroup`: Group related options
- `SelectLabel`: Label for option groups
- `SelectSeparator`: Visual separator between options

### Tooltip

Contextual information on hover.

```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      <p>Helpful information</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Note:** Wrap your app with `TooltipProvider` at the root level for best performance.

### Accordion

Collapsible content sections.

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>
      <p>Content for section 1</p>
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>
      <p>Content for section 2</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

**Props:**
- `type`: `single` | `multiple`
- `collapsible`: Allow closing all items (for `single` type)

## Utilities

### cn() Function

The `cn()` utility merges Tailwind classes with proper precedence handling.

```tsx
import { cn } from "@/lib/utils";

// Override component styles
<Button className={cn("w-full", someCondition && "bg-red-600")}>
  Custom Button
</Button>
```

## Installation Requirements

This component library requires the following dependencies:

```bash
npm install clsx tailwind-merge class-variance-authority
npm install @radix-ui/react-accordion @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-tabs @radix-ui/react-tooltip
npm install lucide-react
```

## TypeScript Support

All components are fully typed with TypeScript and use `forwardRef` for proper ref handling.

```tsx
const buttonRef = useRef<HTMLButtonElement>(null);

<Button ref={buttonRef}>Click me</Button>
```

## Customization

All components accept a `className` prop for custom styling:

```tsx
<Card className="max-w-md mx-auto shadow-2xl">
  <CardHeader className="bg-blue-50">
    <CardTitle className="text-3xl">Custom Styled Card</CardTitle>
  </CardHeader>
</Card>
```

## Accessibility

- All components follow WAI-ARIA guidelines
- Keyboard navigation support
- Screen reader friendly
- Focus management with visible focus indicators

## Best Practices

1. **Import from index**: Use `@/components/ui` for cleaner imports
2. **Consistent spacing**: Use Tailwind's spacing scale
3. **Semantic HTML**: Components use appropriate HTML elements
4. **Responsive design**: Test components at different breakpoints
5. **Dark mode ready**: Color scheme uses Tailwind's color palette

## Examples

### Form with Validation

```tsx
<Card>
  <CardHeader>
    <CardTitle>Login</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <Input label="Email" type="email" required />
    <Input label="Password" type="password" required />
  </CardContent>
  <CardFooter>
    <Button className="w-full">Sign In</Button>
  </CardFooter>
</Card>
```

### Settings Panel

```tsx
<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
  </TabsList>

  <TabsContent value="general" className="space-y-4">
    <Input label="Display Name" />
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="est">Eastern Time</SelectItem>
        <SelectItem value="cst">Central Time</SelectItem>
      </SelectContent>
    </Select>
  </TabsContent>

  <TabsContent value="notifications">
    <Accordion type="single" collapsible>
      <AccordionItem value="email">
        <AccordionTrigger>Email Notifications</AccordionTrigger>
        <AccordionContent>
          Configure email preferences...
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </TabsContent>
</Tabs>
```

## License

These components are based on Radix UI primitives and are designed for use in your projects.
