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
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateLinkForm } from './create-link-form';

export function CreateLinkDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSuccess() {
    setIsOpen(false);
    onSuccess?.();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" />
        Create Link
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Short Link</DialogTitle>
          <DialogDescription>
            Convert your long URL into a short, shareable link
          </DialogDescription>
        </DialogHeader>
        <CreateLinkForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
