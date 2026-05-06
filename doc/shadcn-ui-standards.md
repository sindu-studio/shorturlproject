# shadcn/ui Standards

This document outlines the standards for using shadcn/ui components in the Short URL Project. All UI elements must use shadcn/ui components — custom components are not permitted.

## Table of Contents

- [Overview](#overview)
- [Core Principles](#core-principles)
- [Installation & Setup](#installation--setup)
- [Component Usage](#component-usage)
- [Styling & Customization](#styling--customization)
- [Available Components](#available-components)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [What NOT to Do](#what-not-to-do)

## Overview

shadcn/ui provides a collection of high-quality, accessible, and reusable components built on Radix UI primitives and styled with Tailwind CSS. This project leverages shadcn/ui to ensure consistency, accessibility, and reduced development time.

### Benefits

- **Accessibility out-of-the-box**: Built on Radix UI with WCAG compliance
- **Highly customizable**: Use Tailwind CSS for styling without breaking functionality
- **Copy-paste approach**: Components are copy-pasted into your codebase, not NPM dependencies
- **TypeScript support**: Full type safety for all components
- **Consistent UX**: Standardized component behavior across the application

## Core Principles

- **shadcn/ui is mandatory**: Use shadcn/ui for all UI elements
- **No custom components**: Do not create custom button, input, or other UI components
- **Composition first**: Combine existing shadcn/ui components rather than building new ones
- **Tailwind customization**: Extend component styling exclusively through Tailwind CSS
- **Type safety**: All component props must be properly typed

## Installation & Setup

### Initialize shadcn/ui

shadcn/ui is already configured in this project via `components.json`. Components are available in the `/components/ui` directory.

### Adding New Components

To add a new shadcn/ui component:

```bash
# Use the CLI to add components
npx shadcn-ui@latest add [component-name]
```

Available components from shadcn/ui include:
- `button`
- `input`
- `select`
- `dropdown-menu`
- `dialog`
- `alert-dialog`
- `sheet`
- `form`
- `card`
- And many more...

## Component Usage

### Importing Components

All shadcn/ui components are located in `/components/ui/`. Import them directly:

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
```

### Basic Examples

#### Button

```typescript
import { Button } from '@/components/ui/button';

export function MyComponent() {
  return (
    <div>
      <Button>Click me</Button>
      <Button variant="outline">Outlined</Button>
      <Button variant="destructive">Delete</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}
```

#### Input

```typescript
import { Input } from '@/components/ui/input';

export function SearchForm() {
  const [value, setValue] = useState('');
  
  return (
    <Input
      type="text"
      placeholder="Enter search term..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

#### Card

```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function InfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description</CardDescription>
      </CardHeader>
      <CardContent>
        Content goes here
      </CardContent>
    </Card>
  );
}
```

## Styling & Customization

### Theme Customization

Modify component appearance using Tailwind CSS classes through the `className` prop:

```typescript
import { Button } from '@/components/ui/button';

export function CustomButton() {
  return (
    <Button className="rounded-full px-6 py-3 text-lg">
      Custom Styled Button
    </Button>
  );
}
```

### Using CVA (Class Variance Authority)

For complex component variants, use CVA to manage conditional classes:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from '@/components/ui/button';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border transparent bg-primary text-primary-foreground',
        secondary: 'border transparent bg-secondary text-secondary-foreground',
        destructive: 'border transparent bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
```

### Theme Colors

All shadcn/ui components respect the Tailwind CSS theme configuration. Modify colors in `tailwind.config.ts` for global theming.

## Available Components

Common shadcn/ui components available in this project:

| Component | Use Case |
|-----------|----------|
| `Button` | User actions, form submission |
| `Input` | Text entry, search fields |
| `Card` | Content containers |
| `Dialog` | Modal content |
| `AlertDialog` | Confirmation dialogs |
| `Sheet` | Slide-out panels |
| `Select` | Dropdown selections |
| `Checkbox` | Toggle options |
| `Radio` | Mutually exclusive choices |
| `Form` | Complex form handling |
| `Textarea` | Multi-line text input |
| `Badge` | Labels and tags |
| `Alert` | Important messages |
| `DropdownMenu` | Context menus |

## Best Practices

### 1. Type All Props

Always define explicit types for component props:

```typescript
interface MyComponentProps {
  title: string;
  isLoading?: boolean;
  onSubmit: (data: string) => void;
}

export function MyComponent({ title, isLoading, onSubmit }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={() => onSubmit(title)} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </Button>
    </div>
  );
}
```

### 2. Use Composition

Combine multiple shadcn/ui components instead of creating new ones:

```typescript
// ✅ Good: Compose multiple components
export function UserProfile({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Edit Profile</Button>
      </CardContent>
    </Card>
  );
}
```

### 3. Leverage Variants

Use built-in component variants instead of creating custom versions:

```typescript
// ✅ Good: Use variants
<Button variant="outline">Cancel</Button>
<Button variant="destructive">Delete</Button>

// ❌ Bad: Creating custom button
<button className="custom-button-style">Custom</button>
```

### 4. Maintain Accessibility

shadcn/ui components are accessible by default. Preserve accessibility when customizing:

```typescript
// ✅ Good: Maintains ARIA attributes
<Input
  id="email"
  type="email"
  placeholder="Enter email"
  aria-describedby="email-error"
/>

// ❌ Bad: Removes accessibility features
<input type="email" style={{ padding: '8px' }} />
```

## Common Patterns

### Form with shadcn/ui

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginForm() {
  const [email, setEmail] = useState('');

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### Modal Dialog

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function ConfirmDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to proceed?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## What NOT to Do

### ❌ Don't Create Custom Components

```typescript
// ❌ WRONG: Custom button component
export function CustomButton({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{ padding: '10px', border: '1px solid black' }}
    >
      {children}
    </button>
  );
}
```

### ❌ Don't Skip Type Safety

```typescript
// ❌ WRONG: Using `any` type
export function MyForm(props: any) {
  return <Input {...props} />;
}
```

### ❌ Don't Override Accessibility

```typescript
// ❌ WRONG: Removing semantic HTML
<div onClick={() => alert('clicked')}>Click me</div>

// ✅ CORRECT: Use shadcn/ui button
<Button onClick={() => alert('clicked')}>Click me</Button>
```

### ❌ Don't Mix Styled Components

```typescript
// ❌ WRONG: Mixing shadcn/ui with custom styling
<Button style={{ color: 'red', padding: '20px' }}>Submit</Button>

// ✅ CORRECT: Use Tailwind classes
<Button className="text-red-600 px-5 py-5">Submit</Button>
```

## See Also

- [Component Standards](/doc/component-standards.md)
- [Styling Standards](/doc/styling-standards.md)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
