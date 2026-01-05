import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface UploadedFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
}

export const FileUpload = ({
  onFileSelect,
  acceptedTypes = ['.csv', '.xlsx', '.xls'],
  maxSize = 10, // 10MB default
  multiple = false,
  disabled = false,
  className,
  children,
}: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (acceptedTypes.length > 0 && !acceptedTypes.includes(fileExtension)) {
      return `File type must be one of: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const handleFiles = (files: FileList) => {
    const validFiles: File[] = [];
    const newUploadedFiles: UploadedFile[] = [];

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      const uploadedFile: UploadedFile = {
        file,
        id: Math.random().toString(36).substr(2, 9),
        status: error ? 'error' : 'pending',
        error,
      };

      newUploadedFiles.push(uploadedFile);
      
      if (!error) {
        validFiles.push(file);
      }
    });

    if (!multiple) {
      setUploadedFiles(newUploadedFiles.slice(-1));
      onFileSelect(validFiles.slice(-1));
    } else {
      setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
      onFileSelect(validFiles);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearAll = () => {
    setUploadedFiles([]);
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
          isDragOver && !disabled
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes.join(',')}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
        />

        {children || (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to browse
            </div>
            <div className="text-sm text-gray-500">
              Supports: {acceptedTypes.join(', ')} (max {maxSize}MB)
            </div>
          </div>
        )}
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Selected Files ({uploadedFiles.length})
            </h4>
            {uploadedFiles.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
          </div>

          {uploadedFiles.map((uploadedFile) => (
            <div
              key={uploadedFile.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {uploadedFile.file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {uploadedFile.status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {uploadedFile.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                {uploadedFile.status === 'uploading' && (
                  <div className="w-5 h-5">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(uploadedFile.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Error Messages */}
          {uploadedFiles.some(f => f.error) && (
            <div className="mt-2 space-y-1">
              {uploadedFiles
                .filter(f => f.error)
                .map(f => (
                  <div key={f.id} className="text-sm text-red-600">
                    {f.file.name}: {f.error}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;