import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { HomeContent } from './components/home-content';

export default async function HomePage(): Promise<JSX.Element> {
  const { userId } = await auth();

  // Redirect authenticated users to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  // Show home page only to unauthenticated users
  return <HomeContent />;
}
