import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserLinks } from '@/data/links';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkCard } from './components/link-card';
import Link from 'next/link';

/**
 * Home route: shows a marketing landing page with sign-in/sign-up links for anonymous visitors, or the signed-in user's list of shortened links.
 */
export default async function HomePage() {
  const { userId } = await auth();

  // If not logged in, show landing page
  if (!userId) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Shorten Your URLs</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Create beautiful, short URLs that look professional and work everywhere.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/sign-up">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline">Sign In</Button>
          </Link>
        </div>
      </div>
    </div>;
  }

  // Fetch user's links
  const links = await getUserLinks(userId);

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black min-h-screen">
      <main className="flex flex-1 w-full max-w-4xl mx-auto flex-col gap-6 py-8 px-4 w-full">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-zinc-950 dark:text-white">Your Links</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              {links.length} shortened {links.length === 1 ? 'link' : 'links'}
            </p>
          </div>
          <Link href="/dashboard">
            <Button>Create New Link</Button>
          </Link>
        </div>

        {links.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                No shortened links yet. Create one to get started!
              </p>
              <Link href="/dashboard">
                <Button>Create Your First Link</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <LinkCard
                key={link.id}
                id={link.id}
                shortCode={link.shortCode}
                originalUrl={link.originalUrl}
                createdAt={link.createdAt}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
