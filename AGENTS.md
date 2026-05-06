# Agent Instructions

**🔴 CRITICAL REQUIREMENT: ALWAYS READ THE RELEVANT DOCUMENTATION IN `/doc` BEFORE GENERATING ANY CODE**

Do not skip this step. Every code change must be preceded by reading the appropriate documentation file. If you cannot access or find the relevant doc file, stop and ask the user before proceeding.

---

This document provides comprehensive guidelines for LLMs to follow when working on this Short URL Project. These standards ensure consistency, maintainability, and adherence to the project's established practices.

## Table of Contents

- [Quick Start](#quick-start)
- [Technology Stack](#technology-stack)
- [Key Guidelines](#key-guidelines)
- [Documentation Structure](#documentation-structure)
- [Breaking Changes & Deprecations](#breaking-changes--deprecations)

## Quick Start

### ⚠️ CRITICAL: Before Writing ANY Code

**🔴 YOU MUST ALWAYS READ THE RELEVANT DOCUMENTATION IN `/doc` BEFORE GENERATING ANY CODE**

This is not optional. Every code change requires:

1. **ALWAYS read the relevant `.md` file in `/doc`** for the area you're working on - **DO NOT SKIP THIS STEP**
2. Check deprecation notices - Next.js 16 has breaking changes from earlier versions
3. Follow the type-first approach - Always define proper TypeScript types
4. Use the established patterns - Reference existing code for examples

**If you cannot find or read a relevant documentation file, ASK THE USER before proceeding with code generation.**

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

### 1. TypeScript Standards
- **Always use strict mode** (enabled in tsconfig.json)
- Define explicit types for all function parameters and returns
- Avoid `any` type - use `unknown` and narrow types appropriately
- See [TypeScript Standards](/doc/typescript-standards.md) for detailed patterns

### 2. React Component Standards
- **Use Server Components by default** in Next.js App Router
- Mark client components with `'use client'` only when necessary
- Type all props explicitly with interfaces/types
- Use composition over prop drilling
- See [Component Standards](/doc/component-standards.md) for patterns and examples

### 3. Database Standards
- Use Drizzle ORM for all database operations
- Define schemas in `/db/schema.ts`
- Always use parameterized queries (Drizzle handles this)
- See [Database Standards](/doc/database-standards.md) for ORM patterns

### 4. Styling Standards
- Use Tailwind CSS for all styling
- Follow the utility-first approach
- Leverage CVA (class-variance-authority) for complex component variants
- Import utilities from `@/lib/utils` (cn helper)
- See [Styling Standards](/doc/styling-standards.md) for conventions

### 5. UI Component Standards (shadcn/ui)
- **All UI elements must use shadcn/ui** - no custom components
- Use shadcn/ui components from `/components/ui` directory
- Compose components instead of creating new ones
- Customize styling through Tailwind CSS only
- Maintain component accessibility and type safety
- See [shadcn/ui Standards](/doc/shadcn-ui-standards.md) for implementation patterns

### 6. API Route Standards
- Use typed route handlers with `NextRequest` and `NextResponse`
- Handle errors gracefully with proper HTTP status codes
- Validate all request data
- Use middleware for cross-cutting concerns
- See [API Standards](/doc/api-standards.md) for patterns

### 7. File Structure
- Maintain the established directory layout
- Co-locate related files
- Use barrel exports for cleaner imports
- See [File Structure](/doc/file-structure.md) for organization

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
- See [Authentication Standards](/doc/authentication-standards.md) for implementation patterns

## Documentation Structure

**🔴 CRITICAL: ALWAYS refer to the relevant `.md` file in `/doc` BEFORE generating ANY code.**

The `/doc` directory contains detailed, required guidelines for specific implementation areas:

- [TypeScript Standards](/doc/typescript-standards.md) - Required for all TypeScript code
- [Component Standards](/doc/component-standards.md) - Required for all React components
- [Database Standards](/doc/database-standards.md) - Required for database operations
- [Styling Standards](/doc/styling-standards.md) - Required for styling
- [shadcn/ui Standards](/doc/shadcn-ui-standards.md) - Required for UI components
- [API Standards](/doc/api-standards.md) - Required for API routes
- [File Structure](/doc/file-structure.md) - Required for file organization
- [Authentication Standards](/doc/authentication-standards.md) - Required for auth implementation

**DO NOT skip reading the relevant documentation. Every code generation must begin with reading the appropriate guide.**

## Breaking Changes & Deprecations

### Next.js 16 Breaking Changes

⚠️ **IMPORTANT**: Next.js 16 has significant changes from earlier versions.

- **App Router is required** - Pages directory is deprecated
- **Server Components by default** - Client components require explicit `'use client'` directive
- **New metadata API** - Use `Metadata` type from `next`
- **Streaming is automatic** - Suspense works differently than previous versions

### Before Writing Any Code

**YOU MUST**:
1. **ALWAYS read the relevant documentation file in `/doc`** for the feature/area you're working on
2. Read breaking changes: `node_modules/next/dist/docs/`
3. Check the current Next.js 16 documentation
4. Reference existing code patterns in this project
5. Test your code against the actual Next.js 16 behavior

**⚠️ FAILURE TO READ THE RELEVANT /doc FILE BEFORE CODE GENERATION VIOLATES PROJECT STANDARDS.**

### Common Pitfalls to Avoid

- ❌ Don't assume Pages Router patterns work
- ❌ Don't mix Server and Client Components without understanding the implications
- ❌ Don't use `useRouter` in Server Components
- ❌ Don't import server-only code in client components
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
