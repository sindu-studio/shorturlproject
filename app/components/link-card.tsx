'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Trash2 } from 'lucide-react';

interface LinkCardProps {
  id: number;
  shortCode: string;
  originalUrl: string;
  createdAt: Date;
}

export function LinkCard({ id, shortCode, originalUrl, createdAt }: LinkCardProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${shortCode}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <code className="text-lg font-semibold text-blue-600 dark:text-blue-400 truncate">
                {shortCode}
              </code>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
              {originalUrl}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
              Created {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Visit
              </Button>
            </a>
            <Button size="sm" variant="ghost" className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
