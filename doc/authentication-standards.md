# Authentication & Authorization Standards

This document outlines the standards for implementing authentication and authorization in the Short URL Project. All authentication must use Clerk via `@clerk/nextjs` — no alternative authentication methods are permitted.

## Table of Contents

- [Overview](#overview)
- [Clerk Configuration](#clerk-configuration)
- [Protected Routes](#protected-routes)
- [Redirect Patterns](#redirect-patterns)
- [Modal Implementation](#modal-implementation)
- [Best Practices](#best-practices)
- [What NOT to Do](#what-not-to-do)
- [Common Patterns](#common-patterns)

## Overview

### Core Principles

- **Clerk is mandatory**: `@clerk/nextjs` is the ONLY authentication method
- **Layered security**: Protect routes at multiple levels (middleware, component, API)
- **User experience**: Sign in/sign up always presented as modals, never page redirects
- **Server-first**: Leverage Next.js Server Components for auth checks
- **Explicit client boundaries**: Mark client components with `'use client'` when necessary

### Architecture

```
Public Routes
├── Homepage (/) → redirects authenticated users to /dashboard
├── Sign in modal (via Clerk)
└── Sign up modal (via Clerk)

Protected Routes
├── Dashboard (/dashboard) → requires authentication
└── User pages → require authentication + authorization
```

## Clerk Configuration

### Installation & Setup

Ensure `@clerk/nextjs` is installed in `package.json`:

```json
{
  "dependencies": {
    "@clerk/nextjs": "^5.x.x",
    "next": "^16.2.4",
    "react": "^19.x.x"
  }
}
```

### Environment Variables

Create `.env.local` with Clerk credentials:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Root Layout Configuration

The root layout must include `ClerkProvider` at the top level:

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Short URL Project',
  description: 'Create and manage short URLs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

## Protected Routes

### Server Component Protection

Use `auth()` to protect Server Components. This is the preferred approach:

```typescript
// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage(): Promise<JSX.Element> {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, user {userId}!</p>
    </div>
  );
}
```

### Client Component Protection

For client components, use the `useAuth()` hook:

```typescript
// app/dashboard/components/user-settings.tsx
'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function UserSettings(): JSX.Element {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/');
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Settings</h2>
      <p>User ID: {userId}</p>
    </div>
  );
}
```

### Middleware Protection

Use middleware to protect routes globally:

```typescript
// middleware.ts (at root level)
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest))(?:.*))'],
};
```

## Redirect Patterns

### Homepage Authenticated User Redirect

Redirect authenticated users from the homepage to `/dashboard`:

```typescript
// app/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import HomeContent from './components/home-content';

export default async function HomePage(): Promise<JSX.Element> {
  const { userId } = await auth();

  // Redirect authenticated users to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  // Show home page only to unauthenticated users
  return <HomeContent />;
}
```

### Post-Auth Redirect

Configure post-authentication redirects in environment variables:

```bash
# Users are redirected here after sign in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard

# Users are redirected here after sign up
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Manual Redirect After Auth Check

For dynamic redirects, manually redirect after auth:

```typescript
// app/protected/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage(): Promise<JSX.Element> {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  if (!userHasPermission(userId)) {
    redirect('/dashboard/unauthorized');
  }

  return <div>Protected Content</div>;
}
```

## Modal Implementation

### Sign In Modal

Render the sign-in modal via Clerk's `<SignIn />` component:

```typescript
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  );
}
```

### Sign Up Modal

Render the sign-up modal via Clerk's `<SignUp />` component:

```typescript
// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp />
    </div>
  );
}
```

### Modal Trigger from Homepage

Use `useAuth()` to conditionally show modal triggers on the homepage:

```typescript
// app/components/home-header.tsx
'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HomeHeader(): JSX.Element {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    return <header>Loading...</header>;
  }

  return (
    <header className="flex justify-between items-center p-4">
      <h1>Short URL</h1>
      {!userId ? (
        <div className="space-x-2">
          <Link href="/sign-in">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Sign Up</Button>
          </Link>
        </div>
      ) : (
        <Link href="/dashboard">
          <Button>Dashboard</Button>
        </Link>
      )}
    </header>
  );
}
```

### User Menu with Sign Out

Implement a user menu with sign-out functionality:

```typescript
// app/components/user-menu.tsx
'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function UserMenu(): JSX.Element {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="flex items-center gap-4">
      <span>{user?.emailAddresses[0]?.emailAddress}</span>
      <Button
        onClick={() => signOut({ redirectUrl: '/' })}
        variant="outline"
      >
        Sign Out
      </Button>
    </div>
  );
}
```

## Best Practices

### 1. Verify Auth at Multiple Levels

Use both middleware and component-level checks:

```typescript
// middleware.ts - first line of defense
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect(); // Throws RedirectToSignIn if unauthorized
  }
});
```

```typescript
// app/dashboard/page.tsx - additional check
const { userId } = await auth();
if (!userId) {
  redirect('/');
}
```

### 2. Use Server Components for Auth Checks

Always prefer Server Components for authentication logic:

```typescript
// ✅ GOOD: Server Component auth check
export default async function ProtectedPage(): Promise<JSX.Element> {
  const { userId } = await auth();
  if (!userId) redirect('/');
  return <div>Protected content</div>;
}
```

```typescript
// ❌ AVOID: Client-side only auth check
'use client';
export function ProtectedPage(): JSX.Element {
  const { userId } = useAuth();
  if (!userId) return null; // Race condition possible
  return <div>Protected content</div>;
}
```

### 3. Handle Loading States

Always handle the `isLoaded` state in client components:

```typescript
'use client';

import { useAuth } from '@clerk/nextjs';

export function Component(): JSX.Element {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return <div>Content for {userId}</div>;
}
```

### 4. Type User Data Properly

Use Clerk types for user data:

```typescript
import type { User } from '@clerk/nextjs/server';

async function getUserData(userId: string): Promise<User | null> {
  const { user } = await auth();
  if (!user) return null;
  return user;
}
```

### 5. Secure API Routes

Protect API routes with `auth()`:

```typescript
// app/api/user/profile/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ userId });
}
```

## What NOT to Do

### ❌ Don't Use Alternative Auth Methods

Never implement custom authentication or use other providers:

```typescript
// ❌ WRONG: Custom JWT implementation
const token = jwt.sign({ userId }, SECRET_KEY);

// ❌ WRONG: Other providers
import { signInWithGoogle } from 'firebase/auth';

// ✅ CORRECT: Use Clerk only
import { auth } from '@clerk/nextjs/server';
const { userId } = await auth();
```

### ❌ Don't Expose Auth Checks Only in Client

Never rely solely on client-side auth checks:

```typescript
// ❌ WRONG: Only client-side protection
'use client';
if (useAuth().userId) {
  return <ProtectedContent />;
}

// ✅ CORRECT: Server-side protection first
const { userId } = await auth();
if (!userId) redirect('/');
```

### ❌ Don't Skip Middleware Protection

Always protect routes via middleware:

```typescript
// ❌ WRONG: No middleware protection
// Routes only have component-level checks

// ✅ CORRECT: Middleware + component protection
// middleware.ts protects routes
// Components verify auth()
```

### ❌ Don't Hardcode Redirect URLs

Use environment variables for redirect URLs:

```typescript
// ❌ WRONG: Hardcoded URLs
redirect('https://example.com/dashboard');

// ✅ CORRECT: Environment-based redirects
const afterSignInUrl = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL;
redirect(afterSignInUrl || '/dashboard');
```

### ❌ Don't Store Sensitive Data in Client

Never expose secrets in client-side code:

```typescript
// ❌ WRONG: Secret in client component
export const API_KEY = 'sk_test_...';

// ✅ CORRECT: Secrets in server-only files
// Use CLERK_SECRET_KEY in middleware/server functions only
```

## Common Patterns

### Pattern 1: Protected Dashboard with Layout

```typescript
// app/dashboard/layout.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserMenu } from '@/components/user-menu';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return (
    <div>
      <nav className="flex justify-between p-4 border-b">
        <h1>Dashboard</h1>
        <UserMenu />
      </nav>
      <main>{children}</main>
    </div>
  );
}
```

### Pattern 2: Conditional Content Based on Auth

```typescript
// app/components/feature-section.tsx
import { auth } from '@clerk/nextjs/server';
import { SignInCTA } from './sign-in-cta';
import { FeatureContent } from './feature-content';

export async function FeatureSection(): Promise<JSX.Element> {
  const { userId } = await auth();

  return (
    <section>
      {userId ? (
        <FeatureContent userId={userId} />
      ) : (
        <SignInCTA />
      )}
    </section>
  );
}
```

### Pattern 3: API Route with Permission Check

```typescript
// app/api/short-urls/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const body = await req.json();

  // Create short URL for authenticated user
  const shortUrl = await createShortUrl(body, userId);

  return NextResponse.json(shortUrl);
}
```

### Pattern 4: Role-Based Access Control

```typescript
// lib/auth-utils.ts
import { auth } from '@clerk/nextjs/server';

export async function requireAdmin(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Authentication required');
  }

  const isAdmin = await checkUserRole(userId, 'admin');
  if (!isAdmin) {
    throw new Error('Admin access required');
  }

  return userId;
}

// app/admin/page.tsx
import { requireAdmin } from '@/lib/auth-utils';

export default async function AdminPage(): Promise<JSX.Element> {
  const adminId = await requireAdmin();

  return <div>Admin panel for {adminId}</div>;
}
```

## Troubleshooting

### Session Not Persisting

Ensure `ClerkProvider` wraps your entire app in the root layout.

### Redirect Loop

Check that post-sign-in redirect URL doesn't point back to sign-in page. Use `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`.

### useAuth() Hook Returns undefined

Verify the component is wrapped with `'use client'` directive and is within `ClerkProvider`.

### API Returns 401 Unexpectedly

Confirm you're calling `await auth()` and checking `userId` exists before proceeding.

## Related Documentation

- [Next.js App Router Standards](/doc/component-standards.md)
- [API Route Standards](/doc/api-standards.md)
- [TypeScript Standards](/doc/typescript-standards.md)
- [Clerk Official Documentation](https://clerk.com/docs)
