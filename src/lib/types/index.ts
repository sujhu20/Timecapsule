export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
}

export type CapsuleStatus = 'draft' | 'scheduled' | 'delivered' | 'public';
export type CapsulePrivacy = 'private' | 'public' | 'specific';
export type CapsuleType = 'text' | 'image' | 'video' | 'audio' | 'mixed';

export interface Capsule {
  id: string;
  title: string;
  description?: string;
  content: string;
  type: CapsuleType;
  status: CapsuleStatus;
  privacy: CapsulePrivacy;
  createdAt: Date;
  scheduledFor: Date;
  userId: string;
  recipients?: string[];
  attachments?: Attachment[];
  isBlockchainSecured?: boolean;
  nftTokenId?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  capsuleId: string;
}

export interface CapsuleFormData {
  title: string;
  description: string;
  content: string;
  type: CapsuleType;
  privacy: CapsulePrivacy;
  scheduledFor: Date;
  recipients?: string[];
  attachments?: File[];
  isBlockchainSecured?: boolean;
} 