'use client'

import { useState } from 'react';
import { createLinkAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

/**
 * Renders a form for submitting a URL (and optional custom slug) to create a shortened link, showing loading and error states.
 * @param onSuccess - Callback invoked after the link is successfully created.
 */
export function CreateLinkForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');

  /** Submits the form data to the create-link server action and handles the resulting success or error state. */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await createLinkAction({
        originalUrl,
        customSlug: customSlug || undefined,
      });

      if (result.success) {
        setOriginalUrl('');
        setCustomSlug('');
        onSuccess();
      } else {
        setError(result.error || 'Failed to create link');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="originalUrl" className="text-sm font-medium">
          Original URL
        </label>
        <Input
          id="originalUrl"
          type="url"
          placeholder="https://example.com/very/long/url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="customSlug" className="text-sm font-medium">
          Custom Slug (Optional)
        </label>
        <Input
          id="customSlug"
          type="text"
          placeholder="my-link"
          value={customSlug}
          onChange={(e) => setCustomSlug(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Leave blank to generate a random slug (3-20 characters)
        </p>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Creating...' : 'Create Short Link'}
      </Button>
    </form>
  );
}
