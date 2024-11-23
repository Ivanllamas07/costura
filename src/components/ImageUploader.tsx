import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  className?: string;
}

export function ImageUploader({ onImageUpload, className }: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary',
        className
      )}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p className="text-lg font-medium text-gray-600">
        {isDragActive ? 'Suelta la imagen aquí' : 'Arrastra y suelta tu imagen aquí'}
      </p>
      <p className="mt-2 text-sm text-gray-500">o haz clic para seleccionar un archivo</p>
      <p className="mt-1 text-xs text-gray-400">Soporta PNG, JPG/JPEG, GIF</p>
    </div>
  );
}