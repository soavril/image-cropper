'use client';

import { Button } from '@/components/ui/Button';
import type { PlatformSpec } from '@/types';

interface DownloadButtonProps {
  blob: Blob | null;
  platform: PlatformSpec;
  disabled?: boolean;
}

export function DownloadButton({
  blob,
  platform,
  disabled = false,
}: DownloadButtonProps) {
  const handleDownload = () => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${platform.name}_photo_fixed.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // TODO: Analytics event
    // trackEvent('download', { platform: platform.id });
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={disabled || !blob}
      size="lg"
      className="w-full"
    >
      📥 수정된 사진 다운로드
    </Button>
  );
}
