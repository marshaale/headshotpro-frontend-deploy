'use client';

import { Upload, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';

type PhotoUploadProps = {
  onUploadSuccess: (file: File) => void;
  onUploadError: (error: string) => void;
  selectedFile?: File | null;
  setSelectedFile: (file: File | null) => void;
};

export function PhotoUpload({
  onUploadSuccess,
  onUploadError,
  setSelectedFile,
  selectedFile,
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0]?.errors?.[0];

        if (error?.code === 'file-too-large') {
          onUploadError('File size must be less than 10MB');
        } else if (error?.code === 'file-invalid-type') {
          onUploadError('Please select an image file');
        } else {
          onUploadError(error?.message || 'Invalid file');
        }

        return;
      }

      const file = acceptedFiles[0];

      if (!file) return;

      setSelectedFile(file);

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Notify parent
      onUploadSuccess(file);
    },
    [onUploadSuccess, onUploadError],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024,
  });

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`
            relative cursor-pointer rounded-lg border-2 border-dashed p-12
            text-center transition-colors
            ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary hover:bg-accent'
            }
          `}
        >
          <input {...getInputProps()} />

          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />

          <p className="mt-4 text-sm font-medium text-foreground">
            {isDragActive
              ? 'Drop your image here'
              : 'Click to upload or drag and drop'}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG, or WEBP (max 10MB)
          </p>
        </div>
      ) : (
        <div className="relative rounded-lg border border-border bg-card p-4">
          <Button
            onClick={handleRemove}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 rounded-full shadow-md"
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md">
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {selectedFile?.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
