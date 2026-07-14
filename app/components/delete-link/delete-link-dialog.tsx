'use client'

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteLinkAction } from './actions';

interface DeleteLinkDialogProps {
  linkId: number;
  shortCode: string;
  onSuccess?: () => void;
}

/**
 * Renders a trash-icon trigger that opens a confirmation dialog for deleting a short link,
 * showing a loading state while the deletion is in progress and an error message on failure.
 */
export function DeleteLinkDialog({ linkId, shortCode, onSuccess }: DeleteLinkDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Submits the delete request for this link and closes the dialog on success. */
  async function handleDelete() {
    setError(null);
    setIsLoading(true);

    try {
      const result = await deleteLinkAction({ id: linkId });

      if (result.success) {
        setIsOpen(false);
        onSuccess?.();
      } else {
        setError(result.error || 'Failed to delete link');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="p-2 hover:bg-muted rounded-md transition-colors">
        <Trash2 className="size-4 text-destructive" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Link</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the short link &quot;{shortCode}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            {error}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
