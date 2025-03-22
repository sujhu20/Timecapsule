import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format file size for display
 * @param bytes Size in bytes
 * @returns Formatted string (e.g., "5.2 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " bytes";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
}

/**
 * Check if a file is an image based on its type
 * @param fileType MIME type of the file
 * @returns Boolean indicating if the file is an image
 */
export function isImageFile(fileType: string): boolean {
  return fileType.startsWith('image/');
}

/**
 * Generate a mock cloud storage URL for the file
 * @param fileName Name of the file
 * @param contentType Type of content (image, video, etc)
 * @returns Mock URL to the "stored" file
 */
export function getMockCloudUrl(fileName: string, contentType: string): string {
  // In a real implementation, this would be replaced with actual API calls to a cloud storage provider
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/\s/g, '_');
  
  // Mock URLs for different storage providers based on content type
  const storageMap: Record<string, string> = {
    image: 'https://storage.cloudinary.com/timecapsul/',
    video: 'https://storage.firebase.googleapis.com/timecapsul-media/',
    audio: 'https://storage.cloudinary.com/timecapsul/',
    ar: 'https://storage.firebase.googleapis.com/timecapsul-ar/',
    mixed: 'https://storage.cloudinary.com/timecapsul/',
  };
  
  const baseUrl = storageMap[contentType] || 'https://storage.example.com/';
  return `${baseUrl}${timestamp}-${sanitizedName}`;
}
