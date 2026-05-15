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

export function EditLinkDialog({ linkId, originalUrl, onSuccess }: EditLinkDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

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
