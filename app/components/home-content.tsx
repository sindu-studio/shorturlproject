'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, Zap, BarChart3, Lock, Share2, Clock } from 'lucide-react';

/**
 * Renders the marketing landing page (hero, features, and call-to-action sections), redirecting
 * signed-in users to the dashboard instead of showing the marketing content.
 */
export function HomeContent() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  // Redirect to dashboard if user is authenticated
  useEffect(() => {
    if (isLoaded && user) {
      router.push('/dashboard');
    }
  }, [isLoaded, user, router]);

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content if user is authenticated (redirect in progress)
  if (user) {
    return null;
  }
  const features = [
    {
      icon: Link2,
      title: 'Create Short URLs',
      description: 'Convert long URLs into clean, shareable short links in seconds',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Tracking',
      description: 'Monitor clicks, traffic sources, and visitor information in real-time',
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your links are encrypted and kept private with optional password protection',
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Copy and share your shortened URLs instantly across all platforms',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Redirects happen instantly with blazing-fast global performance',
    },
    {
      icon: Clock,
      title: 'Expiration Control',
      description: 'Set custom expiration times for your links or keep them permanent',
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-black dark:to-zinc-950">
      {/* Hero Section */}
      <section className="w-full px-4 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white mb-6">
            Shorten Your URLs, Amplify Your Reach
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            Create beautiful, short URLs that look professional and work everywhere. Track performance, share with confidence, and manage your links with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 py-20 sm:py-32 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Everything you need to manage and track your shortened URLs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                  <CardHeader>
                    <div className="mb-4">
                      <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 py-20 sm:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            Join thousands of users who are simplifying their URLs and tracking their performance.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="w-full sm:w-auto">
              Create Your First Short URL
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}