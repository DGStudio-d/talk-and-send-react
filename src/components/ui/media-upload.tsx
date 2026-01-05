import { useState, useRef } from 'react';
import { Upload, Image, Music, Video, X, Eye, Play, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { QuizService, MediaType, FILE_UPLOAD_CONFIGS } from '@/api/services/quizService';
import { useToast } from './use-toast';

export interface MediaFile {
  id: string;
  url: string;
  thumbnail_url?: string;
  original_name: string;
  size: number;
  mime_type: string;
  created_at: string;
}

export interface MediaUploadProps {
  mediaType: MediaType;
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: string) => void;
  existingUrl?: string;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
}

export const MediaUpload = ({
  mediaType,
  onUploadComplete,
  onUploadError,
  existingUrl,
  disabled = false,
  className,
  showPreview = true,
}: MediaUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(existingUrl || null);
  const [dragOver, setDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const config = FILE_UPLOAD_CONFIGS[mediaType];

  const handleFileSelect = async (files: FileList) => {
    if (disabled || uploading) return;

    const file = files[0]; // Only handle single file
    if (!file) return;
    
    try {
      // Validate file
      QuizService.validateMediaFile(file, mediaType);
      await uploadFile(file);
    } catch (error: any) {
      const errorMessage = error.message || 'Invalid file';
      toast({
        title: 'Upload Error',
        description: errorMessage,
        variant: 'destructive',
      });
      onUploadError?.(errorMessage);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    
    try {
      const result = await QuizService.uploadMedia(file, mediaType);
      setUploadedUrl(result.url);
      onUploadComplete(result.url);
      
      toast({
        title: 'Upload Successful',
        description: `${mediaType} uploaded successfully`,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Upload failed';
      toast({
        title: 'Upload Error',
        description: errorMessage,
        variant: 'destructive',
      });
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedUrl(null);
    onUploadComplete(''); // Clear the URL
    
    toast({
      title: 'File Removed',
      description: 'Media file removed successfully',
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getMediaIcon = () => {
    switch (mediaType) {
      case 'image':
        return <Image className="h-8 w-8" />;
      case 'audio':
        return <Music className="h-8 w-8" />;
      case 'video':
        return <Video className="h-8 w-8" />;
      default:
        return <Upload className="h-8 w-8" />;
    }
  };

  const getMediaTypeLabel = () => {
    switch (mediaType) {
      case 'image':
        return 'Image';
      case 'audio':
        return 'Audio';
      case 'video':
        return 'Video';
      default:
        return 'Media';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Upload Area */}
      {!uploadedUrl && (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
            dragOver && !disabled
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={config.allowedMimeTypes.join(',')}
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            disabled={disabled}
          />

          <div className="text-center">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <div className="text-lg font-medium text-gray-900 mb-2">
                  Uploading {getMediaTypeLabel()}...
                </div>
              </div>
            ) : (
              <>
                <div className="text-gray-400 mb-4">
                  {getMediaIcon()}
                </div>
                <div className="text-lg font-medium text-gray-900 mb-2">
                  Upload {getMediaTypeLabel()}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  Drop files here or click to browse
                </div>
                <div className="text-xs text-gray-400">
                  Supports: {config.allowedExtensions.join(', ').toUpperCase()} (max {formatFileSize(config.maxSize)})
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Uploaded File Preview */}
      {uploadedUrl && showPreview && (
        <div className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {mediaType === 'image' ? (
                    <img
                      src={uploadedUrl}
                      alt="Uploaded media"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : mediaType === 'audio' ? (
                    <Volume2 className="h-8 w-8 text-gray-400" />
                  ) : (
                    <Play className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">
                      {getMediaTypeLabel()} uploaded successfully
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {mediaType}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {uploadedUrl}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {mediaType === 'audio' && (
                    <audio controls className="h-8">
                      <source src={uploadedUrl} />
                    </audio>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;