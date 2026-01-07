'use client';

import { useState, useCallback, useRef } from 'react';
import { validateImageType, validateImageSize, compressImage } from '@/lib/image-utils';

interface ScreenshotUploaderProps {
  onUpload: (file: File | Blob) => void;
  disabled?: boolean;
}

export default function ScreenshotUploader({ onUpload, disabled }: ScreenshotUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setError('');
    setProcessing(true);

    // Validate file type
    if (!validateImageType(file)) {
      setError('Please upload a PNG, JPG, or HEIC image');
      setProcessing(false);
      return;
    }

    // Validate file size
    const sizeCheck = validateImageSize(file);
    if (!sizeCheck.valid) {
      setError('Image is too large. Please choose a smaller file (max 25MB)');
      setProcessing(false);
      return;
    }

    let processedFile: File | Blob = file;

    // Compress if needed
    if (sizeCheck.needsCompression) {
      try {
        processedFile = await compressImage(file);
      } catch {
        setError('Failed to process image. Please try again.');
        setProcessing(false);
        return;
      }
    }

    setProcessing(false);
    onUpload(processedFile);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging ? 'border-primary bg-primary/10' : 'border-white/20 hover:border-white/40'}
          ${disabled || processing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/heic"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || processing}
        />

        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div>
            <p className="text-lg font-medium">
              {processing ? 'Processing...' : 'Upload Screenshot'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Drag & drop or tap to select
            </p>
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, HEIC • Max 25MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
