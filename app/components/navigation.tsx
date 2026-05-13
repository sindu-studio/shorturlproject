'use client';

import { useAuth } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <header className="border-b">
        <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto w-full">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            Short URL
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="border-b">
      <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto w-full">
        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Short URL
        </div>
        <div className="flex gap-4 items-center">
          {!userId ? (
            <>
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </>
          ) : (
            <UserButton />
          )}
        </div>
      </nav>
    </header>
  );
}
