'use server'

import { revalidatePath } from 'next/cache';
import { currentUser } from '@clerk/nextjs/server';
import { updateLink } from '@/data/links';
import { UpdateLinkSchema } from '@/lib/schemas';

interface UpdateLinkInput {
  id: number;
  originalUrl: string;
}

/**
 * Server action that updates the destination URL of an existing short link owned by the current user.
 * Authenticates the caller via Clerk, validates the input against `UpdateLinkSchema`, persists the change,
 * and revalidates the dashboard route so the updated link is reflected in cached data.
 * @param input - The id of the link to update and its new original URL.
 * @returns An object indicating whether the update succeeded, with an `error` message when it did not.
 */
export async function updateLinkAction(input: UpdateLinkInput): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Authenticate user
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Validate input
    const validation = UpdateLinkSchema.safeParse(input);
    if (!validation.success) {
      const firstError = validation.error.flatten().fieldErrors;
      const errorMessage = Object.values(firstError)[0]?.[0] || 'Invalid input';
      return { success: false, error: errorMessage };
    }

    // 3. Call helper function
    await updateLink(validation.data.id, user.id, validation.data.originalUrl);

    // 4. Revalidate dashboard to refresh data
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error updating link:', error);
    return { success: false, error: 'Failed to update link' };
  }
}
