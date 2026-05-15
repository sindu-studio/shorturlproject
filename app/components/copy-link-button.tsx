'use client'

import { Copy } from 'lucide-react';

interface CopyLinkButtonProps {
  shortCode: string;
}

export function CopyLinkButton({ shortCode }: CopyLinkButtonProps) {
  function handleCopy() {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl).catch(() => {
      alert('Failed to copy link');
    });
  }

  return (
    <button 
      className="p-2 hover:bg-muted rounded-md transition-colors" 
      title="Copy link"
      onClick={handleCopy}
    >
      <Copy className="size-4" />
    </button>
  );
}
