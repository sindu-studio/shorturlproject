import { db } from '@/db';
import { shortenedLinks } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function getUserLinks(userId: string) {
  return await db
    .select()
    .from(shortenedLinks)
    .where(eq(shortenedLinks.userId, userId))
    .orderBy(desc(shortenedLinks.updatedAt));
}

export async function createLink(userId: string, originalUrl: string, customSlug?: string) {
  const shortCode = customSlug || generateShortCode();
  
  return await db
    .insert(shortenedLinks)
    .values({
      shortCode,
      originalUrl,
      userId,
    })
    .returning();
}

export async function updateLink(linkId: number, userId: string, originalUrl: string) {
  return await db
    .update(shortenedLinks)
    .set({
      originalUrl,
      updatedAt: new Date(),
    })
    .where(and(eq(shortenedLinks.id, linkId), eq(shortenedLinks.userId, userId)))
    .returning();
}

export async function deleteLink(linkId: number, userId: string) {
  return await db
    .delete(shortenedLinks)
    .where(and(eq(shortenedLinks.id, linkId), eq(shortenedLinks.userId, userId)))
    .returning();
}

function generateShortCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
