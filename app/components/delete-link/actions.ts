'use server'

import { revalidatePath } from 'next/cache';
import { currentUser } from '@clerk/nextjs/server';
import { deleteLink } from '@/data/links';

interface DeleteLinkInput {
  id: number;
}

export async function deleteLinkAction(input: DeleteLinkInput): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Authenticate user
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Call helper function with userId for ownership verification
    await deleteLink(input.id, user.id);

    // 3. Revalidate dashboard to refresh data
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error deleting link:', error);
    return { success: false, error: 'Failed to delete link' };
  }
}
