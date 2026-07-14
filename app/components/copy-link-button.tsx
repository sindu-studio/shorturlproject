'use client'

import { Copy } from 'lucide-react';

interface CopyLinkButtonProps {
  shortCode: string;
}

/**
 * Renders an icon button that copies the full shortened URL for the given short code to the clipboard.
 * @param props.shortCode - The short code segment appended to the site origin to form the shortened URL.
 */
export function CopyLinkButton({ shortCode }: CopyLinkButtonProps) {
  /** Copies the shortened URL to the clipboard, alerting the user if the copy fails. */
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
