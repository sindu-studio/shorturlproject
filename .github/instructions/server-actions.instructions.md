---
description: Read this file before implementing data mutations and server actions in the project.
---

# Server Actions Standards

This document outlines the standards for implementing server actions in the Short URL Project. Server actions are the ONLY method for mutating data in this application.

## Table of Contents

- [Overview](#overview)
- [File Structure](#file-structure)
- [Implementing Server Actions](#implementing-server-actions)
- [Data Validation](#data-validation)
- [Authentication Checks](#authentication-checks)
- [Database Operations](#database-operations)
- [Code Examples](#code-examples)
- [Common Pitfalls](#common-pitfalls)

## Overview

### Core Principles

- **Server actions only**: ALL data mutations must be done via server actions — no direct API routes for mutations
- **Client component calls**: Server actions are always called from client components using the `'use client'` directive
- **Typed data**: ALL data passed to server actions MUST have explicit TypeScript types (never use `FormData` type)
- **Validation**: ALL server actions MUST validate input data using Zod
- **Auth first**: Server actions MUST verify the user is logged in before performing database operations
- **Helper functions**: Database operations use helper functions in `/data` directory, not direct Drizzle queries

## File Structure

Server action files follow this structure:

```
app/
├── components/
│   └── create-link/
│       ├── create-link-form.tsx      # Client component
│       └── actions.ts                 # Server actions (colocated)
└── dashboard/
    ├── page.tsx
    └── actions.ts                     # Server actions for dashboard
```

**Key rule**: Action files MUST be named `actions.ts` and colocated in the same directory as the component that calls them.

## Implementing Server Actions

### 1. Define the Server Action

```typescript
// app/components/create-link/actions.ts
'use server'

import { currentUser } from '@clerk/nextjs/server'
import { createLink } from '@/data/links'
import { CreateLinkSchema } from '@/lib/schemas'
import { z } from 'zod'

interface CreateLinkInput {
  originalUrl: string
  customSlug?: string
}

export async function createLinkAction(input: CreateLinkInput): Promise<{ success: boolean; error?: string }> {
  // 1. Authenticate user
  const user = await currentUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // 2. Validate input
  const validation = CreateLinkSchema.safeParse(input)
  if (!validation.success) {
    return { success: false, error: 'Invalid input' }
  }

  // 3. Call helper function (not direct Drizzle query)
  const result = await createLink(user.id, validation.data.originalUrl, validation.data.customSlug)
  
  return { success: true }
}
```

### 2. Call from Client Component

```typescript
// app/components/create-link/create-link-form.tsx
'use client'

import { createLinkAction } from './actions'

export function CreateLinkForm() {
  async function handleSubmit(formData: FormData) {
    const input = {
      originalUrl: formData.get('originalUrl') as string,
      customSlug: formData.get('customSlug') as string,
    }
    
    const result = await createLinkAction(input)
    if (result.success) {
      // Handle success
    } else {
      // Handle error
    }
  }

  return (
    <form action={handleSubmit}>
      {/* form fields */}
    </form>
  )
}
```

## Data Validation

### Use Zod for Validation

All input must be validated with Zod schemas:

```typescript
// lib/schemas.ts
import { z } from 'zod'

export const CreateLinkSchema = z.object({
  originalUrl: z.string().url('Invalid URL'),
  customSlug: z.string().min(3).max(20).optional(),
})

export type CreateLinkInput = z.infer<typeof CreateLinkSchema>
```

### Validation in Server Action

```typescript
'use server'

import { CreateLinkSchema } from '@/lib/schemas'

export async function createLinkAction(input: unknown) {
  // Parse and validate
  const validatedData = CreateLinkSchema.parse(input)
  
  // Proceed with validated data
}
```

## Authentication Checks

Every server action MUST verify the user is authenticated before proceeding. Never throw errors — always return an error object:

```typescript
'use server'

import { currentUser } from '@clerk/nextjs/server'

export async function protectedAction(input: any): Promise<{ success: boolean; error?: string }> {
  // Always check auth first
  const user = await currentUser()
  
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }
  
  // Use user.id for scoped operations
  const userSpecificData = await getUserData(user.id)
  
  // ... continue with logic
  return { success: true }
}
```

## Database Operations

### Use Helper Functions in `/data`

Create helper functions in the `/data` directory that wrap Drizzle queries:

```typescript
// data/links.ts
import { db } from '@/db'
import { links } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function createLink(
  userId: string,
  originalUrl: string,
  customSlug?: string
): Promise<{ id: string }> {
  const [result] = await db.insert(links).values({
    userId,
    originalUrl,
    slug: customSlug,
  }).returning({ id: links.id })

  return result
}

export async function getLinksByUser(userId: string) {
  return db.query.links.findMany({
    where: eq(links.userId, userId),
  })
}
```

### Server Actions Call Helper Functions

```typescript
// app/components/create-link/actions.ts
'use server'

import { createLink } from '@/data/links'  // ✅ Use helper function

export async function createLinkAction(input: CreateLinkInput) {
  const user = await currentUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // ✅ Call helper function
  const result = await createLink(user.id, input.originalUrl, input.customSlug)

  return { success: true, linkId: result.id }
}
```

## Code Examples

### Complete Example: Create Link

**Client Component** (`app/components/create-link/create-link-form.tsx`):
```typescript
'use client'

import { createLinkAction } from './actions'
import { useState } from 'react'

export function CreateLinkForm() {
  const [error, setError] = useState<string>()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const result = await createLinkAction({
      originalUrl: formData.get('originalUrl') as string,
      customSlug: formData.get('customSlug') as string,
    })

    if (!result.success) {
      setError(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="originalUrl" type="url" required />
      <input name="customSlug" type="text" />
      <button type="submit">Create Link</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
```

**Server Action** (`app/components/create-link/actions.ts`):
```typescript
'use server'

import { currentUser } from '@clerk/nextjs/server'
import { createLink } from '@/data/links'
import { CreateLinkSchema } from '@/lib/schemas'

interface CreateLinkInput {
  originalUrl: string
  customSlug?: string
}

export async function createLinkAction(
  input: CreateLinkInput
): Promise<{ success: boolean; error?: string }> {
  // 1. Auth check
  const user = await currentUser()
  if (!user) {
    return { success: false, error: 'You must be signed in' }
  }

  // 2. Validate input
  const validated = CreateLinkSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: 'Invalid input' }
  }

  // 3. Call helper function (not Drizzle directly)
  try {
    await createLink(user.id, validated.data.originalUrl, validated.data.customSlug)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to create link' }
  }
}
```

## Common Pitfalls

### ❌ Don't Do This

- **Throw errors**: Never use `throw` in server actions; return error objects instead
- **Direct Drizzle in actions**: Server actions should NOT import `db` directly
- **FormData types**: Don't type server action parameters as `FormData`
- **Skip validation**: Never skip Zod validation
- **Skip auth checks**: Always check `currentUser()` first
- **Async without `'use server'`**: All server actions need the directive
- **Import in wrong place**: Don't import server actions in server components

### ✅ Do This

- **Use helper functions**: All DB operations via `/data` helpers
- **Explicit types**: Define clear TypeScript interfaces
- **Zod validation**: Always validate input
- **Auth first**: Check user before DB operations
- **Error handling**: Return typed error responses
- **Colocate actions.ts**: Keep actions with their components
