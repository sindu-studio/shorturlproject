import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl mx-auto flex-col gap-6 py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Dashboard</CardTitle>
            <CardDescription>
              Manage your short URLs and track analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your dashboard content will appear here.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
