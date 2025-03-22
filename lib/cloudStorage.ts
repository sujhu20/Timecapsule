import { getMockCloudUrl, formatFileSize } from './utils';

/**
 * Interface for file metadata
 */
interface FileMetadata {
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  url: string;
}

/**
 * Mock cloud storage client for handling file uploads
 * This is a simplified implementation that simulates actual cloud storage
 * In a real application, this would be replaced with actual SDK calls
 */
class CloudStorageClient {
  private files: Map<string, FileMetadata> = new Map();
  
  /**
   * Upload a file to the cloud storage
   * @param file The file to upload
   * @param contentType The category of content (image, video, etc.)
   * @param onProgress Optional callback for upload progress
   * @returns Promise resolving to the cloud storage URL
   */
  async uploadFile(
    file: File, 
    contentType: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    // Validate file size
    const maxSizeMap: Record<string, number> = {
      image: 10 * 1024 * 1024, // 10MB
      video: 100 * 1024 * 1024, // 100MB
      audio: 50 * 1024 * 1024, // 50MB
      ar: 100 * 1024 * 1024, // 100MB
    };
    
    const maxSize = maxSizeMap[contentType] || 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size is ${formatFileSize(maxSize)}.`);
    }
    
    // Simulate upload with progress
    let progress = 0;
    const totalSteps = 10;
    
    for (let i = 0; i <= totalSteps; i++) {
      progress = (i / totalSteps) * 100;
      onProgress?.(progress);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Generate cloud URL and store file metadata
    const url = getMockCloudUrl(file.name, contentType);
    
    const metadata: FileMetadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      url
    };
    
    this.files.set(url, metadata);
    return url;
  }
  
  /**
   * Get file metadata by URL
   * @param url The cloud storage URL
   * @returns The file metadata or null if not found
   */
  getFileMetadata(url: string): FileMetadata | null {
    return this.files.get(url) || null;
  }
  
  /**
   * Delete a file from cloud storage
   * @param url The cloud storage URL
   * @returns Promise resolving to boolean indicating success
   */
  async deleteFile(url: string): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.files.delete(url);
  }
}

// Export a singleton instance
export const cloudStorage = new CloudStorageClient(); 