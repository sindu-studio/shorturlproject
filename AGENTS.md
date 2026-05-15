# Agent Instructions

This document provides comprehensive guidelines for LLMs to follow when working on this Short URL Project. These standards ensure consistency, maintainability, and adherence to the project's established practices.

## Table of Contents

- [Quick Start](#quick-start)
- [Technology Stack](#technology-stack)
- [Key Guidelines](#key-guidelines)
- [Documentation Structure](#documentation-structure)
- [Breaking Changes & Deprecations](#breaking-changes--deprecations)

## Quick Start

### Project Setup

- **Node.js**: Latest LTS
- **Package Manager**: npm
- **Build Tool**: Next.js 16.2.4 with TypeScript

## Technology Stack

```
Frontend:
├── Next.js 16.2.4 (App Router)
├── React 19
├── TypeScript 5
├── Tailwind CSS 4
└── @base-ui/react 1.4.1

Backend:
├── Next.js API Routes
├── Drizzle ORM 0.45.2
├── Neon Database (Postgres)
└── Serverless Driver

UI Components:
├── shadcn/ui components
├── lucide-react (icons)
├── class-variance-authority (CVA)
└── @clerk/nextjs (authentication)

Developer Tools:
├── ESLint 9
├── TypeScript strict mode
├── tsx (TypeScript runner)
└── drizzle-kit (migrations)
```

## Key Guidelines

### 6. API Route Standards
- Use typed route handlers with `NextRequest` and `NextResponse`
- Handle errors gracefully with proper HTTP status codes
- Validate all request data
- Use middleware for cross-cutting concerns

### 7. File Structure
### 8. Code Quality
- Run `npm run lint` before committing
- All code must pass ESLint with no warnings
- Write self-documenting code with clear variable names
- Add comments for complex logic, not obvious code

### 9. Authentication & Security
- **Clerk is the ONLY authentication method** - no alternative auth approaches
- Use Clerk for authentication via `@clerk/nextjs`
- Protect routes via middleware and component-level checks
- Implement sign-in/sign-up as modals only
- Always verify user identity in protected routes
- Never expose secrets in client-side code
- Use environment variables for configuration
## Documentation Structure

## Breaking Changes & Deprecations

### Next.js 16 Breaking Changes

⚠️ **IMPORTANT**: Next.js 16 has significant changes from earlier versions.

- **App Router is required** - Pages directory is deprecated
- **Server Components by default** - Client components require explicit `'use client'` directive
- **New metadata API** - Use `Metadata` type from `next`
- **Streaming is automatic** - Suspense works differently than previous versions

### Common Pitfalls to Avoid

- ❌ Don't assume Pages Router patterns work
- ❌ Don't mix Server and Client Components without understanding the implications
- ❌ Don't use `useRouter` in Server Components
- ❌ Don't import server-only code in client components
- ❌ **NEVER use `middleware.ts`** - It is deprecated in Next.js 16. Use `proxy.ts` instead
- ✅ Do use the `'use server'` directive for server actions
- ✅ Do leverage Suspense for streaming UI
- ✅ Do test client/server boundaries carefully

## Development Workflow

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Lint code
npm run lint

# Build for production
npm build

# Start production server
npm start
```

## Getting Help

When implementing features:

1. Check `/doc` files for patterns
2. Look at existing code for examples
3. Test locally before submitting
4. Run linters to catch issues early
5. Refer to official docs when in doubt

## Version Lock

- Next.js: 16.2.4 (LOCKED - breaking changes between versions)
- React: 19.2.4
- TypeScript: 5.x
- Tailwind CSS: 4.x

**Do not upgrade major versions without consulting the team.**
