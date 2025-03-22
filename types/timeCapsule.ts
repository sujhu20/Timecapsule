export interface Recipient {
  id: string;
  name: string;
  email: string;
  publicKey: string; // Recipient's public key for encryption
}

export interface EncryptedContent {
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  encryptedData: string; // Base64 encrypted content
  encryptedKey: string; // Base64 encrypted content key
  iv: string; // Base64 initialization vector
  metadata?: {
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    thumbnailUrl?: string;
  };
}

export enum CapsuleStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  DELIVERED = 'delivered',
  OPENED = 'opened',
}

export interface DeliveryCondition {
  type: 'date' | 'location' | 'event' | 'password' | 'biometric';
  params: {
    date?: string; // ISO date string
    latitude?: number;
    longitude?: number;
    radius?: number; // meters
    eventName?: string; 
    passwordHash?: string;
    passwordSalt?: string;
    biometricType?: string;
  };
}

export interface TimeCapsule {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  
  // Encrypted content
  contents: EncryptedContent[];
  
  // Recipients
  recipients: Recipient[];
  
  // Delivery settings
  deliveryConditions: DeliveryCondition[];
  
  // Self-destruct settings
  selfDestruct?: {
    enabled: boolean;
    delay: number; // seconds after opening
  };
  
  // Status information
  status: CapsuleStatus;
  createdAt: string; // ISO date string
  scheduledFor?: string; // ISO date string
  deliveredAt?: string; // ISO date string
  openedAt?: string; // ISO date string
  
  // Privacy settings
  isAnonymous: boolean;
  visibility: 'private' | 'recipients' | 'public';
  
  // Audit trail
  auditTrail?: {
    event: 'created' | 'modified' | 'delivered' | 'opened';
    timestamp: string; // ISO date string
    userId?: string;
    metadata?: Record<string, any>;
  }[];
} 