import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateLinkDialog } from '@/app/components/create-link/create-link-dialog';
import { EditLinkDialog } from '@/app/components/edit-link/edit-link-dialog';
import { DeleteLinkDialog } from '@/app/components/delete-link/delete-link-dialog';
import { CopyLinkButton } from '@/app/components/copy-link-button';
import { getUserLinks } from '@/data/links';
import { ExternalLink } from 'lucide-react';

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const links = await getUserLinks(userId);

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl mx-auto flex-col gap-6 py-8 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your short URLs and track analytics</p>
          </div>
          <CreateLinkDialog />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Links</CardTitle>
            <CardDescription>
              {links.length === 0 ? 'No links yet. Create your first short link to get started.' : `You have ${links.length} short link${links.length !== 1 ? 's' : ''}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {links.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Click the &quot;Create Link&quot; button to add your first short URL.
              </p>
            ) : (
              <div className="space-y-3">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-semibold text-primary truncate">
                          {link.shortCode}
                        </code>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {link.originalUrl}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated {link.updatedAt?.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-4 shrink-0">
                      <CopyLinkButton shortCode={link.shortCode} />
                      <a
                        href={`/${link.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-muted rounded-md transition-colors"
                        title="Open link"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                      <EditLinkDialog linkId={link.id} originalUrl={link.originalUrl} />
                      <DeleteLinkDialog linkId={link.id} shortCode={link.shortCode} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
