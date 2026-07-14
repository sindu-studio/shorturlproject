'use client'

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { EditLinkForm } from './edit-link-form';

interface EditLinkDialogProps {
  linkId: number;
  originalUrl: string;
  onSuccess?: () => void;
}

/**
 * Renders an edit icon button that opens a dialog for editing a short link's destination URL.
 */
export function EditLinkDialog({ linkId, originalUrl, onSuccess }: EditLinkDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  /** Closes the dialog and notifies the parent that the edit completed successfully. */
  function handleSuccess() {
    setIsOpen(false);
    onSuccess?.();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="p-2 hover:bg-muted rounded-md transition-colors">
        <Edit className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Update the original URL for this short link
          </DialogDescription>
        </DialogHeader>
        <EditLinkForm linkId={linkId} originalUrl={originalUrl} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
