/**
 * File utility functions for handling file uploads and validation
 */

export interface FileValidationOptions {
  maxSize?: number; // in MB
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate a file against the given options
 */
export const validateFile = (
  file: File,
  options: FileValidationOptions = {}
): FileValidationResult => {
  const {
    maxSize = 10, // 10MB default
    allowedTypes = [],
    allowedExtensions = ['.csv', '.xlsx', '.xls']
  } = options;

  // Check file size
  if (file.size > maxSize * 1024 * 1024) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSize}MB`
    };
  }

  // Check MIME type if specified
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`
    };
  }

  // Check file extension
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (allowedExtensions.length > 0 && !allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `File extension must be one of: ${allowedExtensions.join(', ')}`
    };
  }

  return { isValid: true };
};

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Check if file is a CSV file
 */
export const isCSVFile = (file: File): boolean => {
  const extension = getFileExtension(file.name).toLowerCase();
  return extension === 'csv' || file.type === 'text/csv';
};

/**
 * Check if file is an Excel file
 */
export const isExcelFile = (file: File): boolean => {
  const extension = getFileExtension(file.name).toLowerCase();
  const excelTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  return ['xlsx', 'xls'].includes(extension) || excelTypes.includes(file.type);
};

/**
 * Download a blob as a file
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Read file as text (for CSV files)
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

/**
 * Read file as array buffer (for Excel files)
 */
export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as ArrayBuffer);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Generate a unique filename with timestamp
 */
export const generateUniqueFilename = (originalName: string, prefix?: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const extension = getFileExtension(originalName);
  const baseName = originalName.replace(`.${extension}`, '');
  
  return `${prefix ? prefix + '_' : ''}${baseName}_${timestamp}.${extension}`;
};

/**
 * Supported file types for quiz import
 */
export const QUIZ_IMPORT_FILE_TYPES = {
  CSV: {
    extensions: ['.csv'],
    mimeTypes: ['text/csv', 'application/csv'],
    description: 'CSV files'
  },
  EXCEL: {
    extensions: ['.xlsx', '.xls'],
    mimeTypes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    description: 'Excel files'
  }
};

/**
 * Get all supported file extensions for quiz import
 */
export const getAllowedQuizImportExtensions = (): string[] => {
  return [
    ...QUIZ_IMPORT_FILE_TYPES.CSV.extensions,
    ...QUIZ_IMPORT_FILE_TYPES.EXCEL.extensions
  ];
};

/**
 * Get all supported MIME types for quiz import
 */
export const getAllowedQuizImportMimeTypes = (): string[] => {
  return [
    ...QUIZ_IMPORT_FILE_TYPES.CSV.mimeTypes,
    ...QUIZ_IMPORT_FILE_TYPES.EXCEL.mimeTypes
  ];
};