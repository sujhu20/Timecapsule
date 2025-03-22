export interface CapsuleFormData {
  title: string;
  description?: string;
  content: string;
  mediaUrl?: string;
  type: "text" | "image" | "video" | "audio" | "mixed" | "ar";
  privacy: "private" | "public" | "specific" | "generational";
  scheduledFor: Date;
  isBlockchainSecured: boolean;
  useAIFutureVisual: boolean;
  useConditionalLock: boolean;
  unlockCondition: "date" | "location" | "event" | "biometric";
  locationData?: string;
  eventCondition?: string;
  allowReplies: boolean;
  isPartOfChallenge: boolean;
  challengeId?: string;
  use3DMemoryScrapbook: boolean;
  memoryScrapbookStyle?: "floating" | "timeline" | "orbit" | "gallery";
  useARPlacement: boolean;
  useTimeTravelEffect: boolean;
  useMemorySoundscape: boolean;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  participants: number;
  category: "climate" | "culture" | "technology" | "peace" | "other";
  endDate: Date;
}

export interface CapsuleResponse {
  id: string;
  capsuleId: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

export interface Capsule {
  id: string;
  title: string;
  description?: string;
  content: string;
  mediaUrl?: string;
  type: "text" | "image" | "video" | "audio" | "mixed" | "ar";
  privacy: "private" | "public" | "specific" | "generational";
  createdAt: Date;
  scheduledFor: Date;
  isBlockchainSecured: boolean;
  useAIFutureVisual?: boolean;
  useConditionalLock?: boolean;
  unlockCondition?: "date" | "location" | "event" | "biometric";
  locationData?: string;
  eventCondition?: string;
  allowReplies?: boolean;
  isPartOfChallenge?: boolean;
  challengeId?: string;
  status: "pending" | "delivered" | "opened";
  createdBy: string;
  recipientId?: string;
  aiPreviewImage?: string;
} 