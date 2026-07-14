'use server'

import { currentUser } from '@clerk/nextjs/server';
import { createLink } from '@/data/links';
import { CreateLinkSchema } from '@/lib/schemas';

interface CreateLinkInput {
  originalUrl: string;
  customSlug?: string;
}

/**
 * Server action that authenticates the current user, validates the submitted URL/slug, and persists a new shortened link.
 * @param input - The original URL and optional custom slug to create the link with.
 * @returns An object indicating whether creation succeeded, with an error message when it did not.
 */
export async function createLinkAction(input: CreateLinkInput): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Authenticate user
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Validate input
    const validation = CreateLinkSchema.safeParse(input);
    if (!validation.success) {
      const firstError = validation.error.flatten().fieldErrors;
      const errorMessage = Object.values(firstError)[0]?.[0] || 'Invalid input';
      return { success: false, error: errorMessage };
    }

    // 3. Call helper function
    await createLink(user.id, validation.data.originalUrl, validation.data.customSlug);

    return { success: true };
  } catch (error) {
    console.error('Error creating link:', error);
    return { success: false, error: 'Failed to create link' };
  }
}
