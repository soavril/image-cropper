'use client';

import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { imageConfig } from '@/lib/config';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  disabled?: boolean;
}

export function ImageUploader({ onUpload, disabled = false }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file && isValidFile(file)) {
        onUpload(file);
      }
    },
    [disabled, onUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && isValidFile(file)) {
        onUpload(file);
      }
      // Reset input
      e.target.value = '';
    },
    [onUpload]
  );

  const isValidFile = (file: File): boolean => {
    const validTypes = imageConfig.supportedFormats as readonly string[];
    const maxSize = imageConfig.maxUploadSizeMB * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      alert('JPG 또는 PNG 파일만 업로드 가능합니다.');
      return false;
    }

    if (file.size > maxSize) {
      alert(`파일 크기는 ${imageConfig.maxUploadSizeMB}MB 이하여야 합니다.`);
      return false;
    }

    return true;
  };

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all',
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        aria-label="사진 선택"
      />

      <div className="pointer-events-none">
        <div className="text-4xl mb-4">📷</div>
        <p className="text-lg font-medium text-gray-700 mb-2">
          사진을 여기에 드래그하거나
        </p>
        <p className="text-blue-600 font-medium mb-4">클릭하여 선택하세요</p>
        <p className="text-sm text-gray-500">
          JPG, PNG 지원 · 최대 {imageConfig.maxUploadSizeMB}MB
        </p>
      </div>
    </div>
  );
}
