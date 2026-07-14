'use client'

import { useState } from 'react';
import { updateLinkAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

interface EditLinkFormProps {
  linkId: number;
  originalUrl: string;
  onSuccess: () => void;
}

/**
 * Renders a form for editing a short link's destination URL and submitting the change via `updateLinkAction`.
 */
export function EditLinkForm({ linkId, originalUrl, onSuccess }: EditLinkFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState(originalUrl);

  /** Submits the updated URL to the server action and reports the outcome via loading/error state. */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await updateLinkAction({
        id: linkId,
        originalUrl: url,
      });

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Failed to update link');
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
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Updating...' : 'Update Link'}
      </Button>
    </form>
  );
}
