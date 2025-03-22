"use client";

import { v4 as uuidv4 } from 'uuid';
import { TimeCapsule, CapsuleStatus, EncryptedContent, Recipient, DeliveryCondition } from '@/types/timeCapsule';
import * as encryptionUtils from './encryption';

// Mock database for demonstration (in a real app, this would be a database service)
const CAPSULES_STORAGE_KEY = 'timecapsule-encrypted-capsules';

interface CapsuleCreateParams {
  title: string;
  description?: string;
  contents: {
    type: 'text' | 'image' | 'video' | 'audio' | 'file';
    data: string | File;
  }[];
  recipients: Recipient[];
  deliveryConditions: DeliveryCondition[];
  selfDestruct?: {
    enabled: boolean;
    delay: number;
  };
  isAnonymous: boolean;
  visibility: 'private' | 'recipients' | 'public';
}

// Load capsules from localStorage
function loadCapsules(): TimeCapsule[] {
  if (typeof window === 'undefined') return [];
  
  const storedCapsules = localStorage.getItem(CAPSULES_STORAGE_KEY);
  if (!storedCapsules) return [];
  
  try {
    return JSON.parse(storedCapsules);
  } catch (error) {
    console.error('Failed to parse stored capsules', error);
    return [];
  }
}

// Save capsules to localStorage
function saveCapsules(capsules: TimeCapsule[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CAPSULES_STORAGE_KEY, JSON.stringify(capsules));
}

// Get all capsules for a user
export function getCapsulesByUser(userId: string): TimeCapsule[] {
  const capsules = loadCapsules();
  return capsules.filter(capsule => 
    capsule.creatorId === userId || 
    capsule.recipients.some(recipient => recipient.id === userId)
  );
}

// Get a specific capsule by ID with privacy check
export function getCapsuleById(capsuleId: string, requestingUserId?: string): TimeCapsule | null {
  const capsules = loadCapsules();
  const capsule = capsules.find(capsule => capsule.id === capsuleId);
  
  if (!capsule) return null;
  
  // Check privacy settings
  if (capsule.visibility === 'private' && capsule.creatorId !== requestingUserId) {
    // Private capsules are only accessible to the creator
    return null;
  }
  
  if (capsule.visibility === 'recipients' && 
      capsule.creatorId !== requestingUserId && 
      !capsule.recipients.some(recipient => recipient.id === requestingUserId)) {
    // Specific recipient capsules are only accessible to the creator and recipients
    return null;
  }
  
  return capsule;
}

// Get all public capsules for the explore page
export function getPublicCapsules(): TimeCapsule[] {
  const capsules = loadCapsules();
  
  // First filter out all capsules that are marked as private
  const publicCapsules = capsules.filter(capsule => {
    // Only return capsules that are explicitly marked as public visibility
    const isPublic = capsule.visibility === 'public';
    
    // Only include capsules that are in a viewable state
    const isViewable = (
      capsule.status === CapsuleStatus.SCHEDULED || 
      capsule.status === CapsuleStatus.DELIVERED || 
      capsule.status === CapsuleStatus.OPENED
    );
    
    // Debug logging for privacy filtering
    if (typeof window !== 'undefined' && window.localStorage.getItem('debug-privacy')) {
      console.log(`Capsule ${capsule.id}: ${capsule.title}`, { 
        visibility: capsule.visibility, 
        isPublic, 
        status: capsule.status, 
        isViewable, 
        isIncluded: isPublic && isViewable 
      });
    }
    
    return isPublic && isViewable;
  });
  
  // Debug logging for final results
  if (typeof window !== 'undefined' && window.localStorage.getItem('debug-privacy')) {
    console.log(`Found ${publicCapsules.length} public capsules out of ${capsules.length} total`);
  }
  
  return publicCapsules;
}

// Create a new encrypted time capsule
export async function createEncryptedCapsule(
  creatorId: string,
  userPublicKey: string,
  params: CapsuleCreateParams
): Promise<TimeCapsule> {
  // Process and encrypt the contents
  const encryptedContents: EncryptedContent[] = [];
  
  for (const content of params.contents) {
    if (content.type === 'text' && typeof content.data === 'string') {
      // For each recipient, encrypt the content with their public key
      for (const recipient of params.recipients) {
        // Generate a one-time content key
        const contentKey = await encryptionUtils.generateContentKey();
        
        // Encrypt the content with the content key
        const { encryptedData, iv } = await encryptionUtils.encryptContent(
          content.data,
          contentKey
        );
        
        // Encrypt the content key with the recipient's public key
        const encryptedKey = await encryptionUtils.encryptContentKey(
          contentKey,
          recipient.publicKey
        );
        
        encryptedContents.push({
          type: content.type,
          encryptedData,
          encryptedKey,
          iv
        });
      }
    } else if (content.data instanceof File) {
      // Handle file encryption (images, videos, etc.)
      for (const recipient of params.recipients) {
        // Generate a one-time content key
        const contentKey = await encryptionUtils.generateContentKey();
        
        // Encrypt the file with the content key
        const { encryptedData, iv, fileName, fileType } = await encryptionUtils.encryptFile(
          content.data,
          contentKey
        );
        
        // Encrypt the content key with the recipient's public key
        const encryptedKey = await encryptionUtils.encryptContentKey(
          contentKey,
          recipient.publicKey
        );
        
        encryptedContents.push({
          type: content.type,
          encryptedData,
          encryptedKey,
          iv,
          metadata: {
            fileName,
            fileType,
            fileSize: content.data.size
          }
        });
      }
    }
  }
  
  // Create the new capsule
  const newCapsule: TimeCapsule = {
    id: uuidv4(),
    creatorId,
    title: params.title,
    description: params.description,
    contents: encryptedContents,
    recipients: params.recipients,
    deliveryConditions: params.deliveryConditions,
    selfDestruct: params.selfDestruct,
    status: CapsuleStatus.DRAFT,
    createdAt: new Date().toISOString(),
    isAnonymous: params.isAnonymous,
    visibility: params.visibility,
    auditTrail: [
      {
        event: 'created',
        timestamp: new Date().toISOString(),
        userId: creatorId,
      }
    ]
  };
  
  // Calculate scheduled delivery date if it's a date-based delivery
  const dateCondition = params.deliveryConditions.find(condition => condition.type === 'date');
  if (dateCondition && dateCondition.params.date) {
    newCapsule.scheduledFor = dateCondition.params.date;
    newCapsule.status = CapsuleStatus.SCHEDULED;
  }
  
  // Save the capsule
  const capsules = loadCapsules();
  capsules.push(newCapsule);
  saveCapsules(capsules);
  
  return newCapsule;
}

// Update a capsule
export function updateCapsule(capsuleId: string, updates: Partial<TimeCapsule>): TimeCapsule | null {
  const capsules = loadCapsules();
  const index = capsules.findIndex(capsule => capsule.id === capsuleId);
  
  if (index === -1) return null;
  
  // Prevent updating certain fields
  const { id, creatorId, createdAt, ...allowedUpdates } = updates;
  
  // Update the capsule
  const updatedCapsule = {
    ...capsules[index],
    ...allowedUpdates,
    auditTrail: [
      ...(capsules[index].auditTrail || []),
      {
        event: 'modified',
        timestamp: new Date().toISOString(),
        userId: capsules[index].creatorId,
      }
    ]
  };
  
  capsules[index] = updatedCapsule;
  saveCapsules(capsules);
  
  return updatedCapsule;
}

// Delete a capsule
export function deleteCapsule(capsuleId: string): boolean {
  const capsules = loadCapsules();
  const updatedCapsules = capsules.filter(capsule => capsule.id !== capsuleId);
  
  if (updatedCapsules.length === capsules.length) {
    return false; // Capsule not found
  }
  
  saveCapsules(updatedCapsules);
  return true;
}

// Mark a capsule as delivered
export function markCapsuleAsDelivered(capsuleId: string): TimeCapsule | null {
  const capsules = loadCapsules();
  const index = capsules.findIndex(capsule => capsule.id === capsuleId);
  
  if (index === -1) return null;
  
  capsules[index] = {
    ...capsules[index],
    status: CapsuleStatus.DELIVERED,
    deliveredAt: new Date().toISOString(),
    auditTrail: [
      ...(capsules[index].auditTrail || []),
      {
        event: 'delivered',
        timestamp: new Date().toISOString(),
      }
    ]
  };
  
  saveCapsules(capsules);
  return capsules[index];
}

// Mark a capsule as opened by recipient
export function markCapsuleAsOpened(capsuleId: string, recipientId: string): TimeCapsule | null {
  const capsules = loadCapsules();
  const index = capsules.findIndex(capsule => capsule.id === capsuleId);
  
  if (index === -1) return null;
  
  // Check if the user is a recipient
  const isRecipient = capsules[index].recipients.some(recipient => recipient.id === recipientId);
  if (!isRecipient && capsules[index].creatorId !== recipientId) {
    return null; // Not authorized to open
  }
  
  capsules[index] = {
    ...capsules[index],
    status: CapsuleStatus.OPENED,
    openedAt: new Date().toISOString(),
    auditTrail: [
      ...(capsules[index].auditTrail || []),
      {
        event: 'opened',
        timestamp: new Date().toISOString(),
        userId: recipientId,
      }
    ]
  };
  
  saveCapsules(capsules);
  
  // Handle self-destruct if enabled
  if (capsules[index].selfDestruct?.enabled) {
    const { delay } = capsules[index].selfDestruct;
    
    // Schedule deletion after the delay
    setTimeout(() => {
      deleteCapsule(capsuleId);
    }, delay * 1000);
  }
  
  return capsules[index];
}

// Decrypt a capsule's contents for a recipient
export async function decryptCapsuleContents(
  capsule: TimeCapsule,
  privateKey: string
): Promise<Array<{ type: string; data: string | File; metadata?: any }>> {
  const decryptedContents = [];
  
  for (const content of capsule.contents) {
    try {
      // Decrypt the content key with the recipient's private key
      const contentKey = await encryptionUtils.decryptContentKey(
        content.encryptedKey,
        privateKey
      );
      
      if (content.type === 'text') {
        // Decrypt text content
        const decryptedText = await encryptionUtils.decryptContent(
          content.encryptedData,
          content.iv,
          contentKey
        );
        
        decryptedContents.push({
          type: content.type,
          data: decryptedText
        });
      } else {
        // Decrypt file content
        if (content.metadata?.fileName && content.metadata?.fileType) {
          const decryptedFile = await encryptionUtils.decryptFile(
            content.encryptedData,
            content.iv,
            contentKey,
            content.metadata.fileName,
            content.metadata.fileType
          );
          
          decryptedContents.push({
            type: content.type,
            data: decryptedFile,
            metadata: content.metadata
          });
        }
      }
    } catch (error) {
      console.error('Failed to decrypt content:', error);
      // Continue with other contents even if one fails
    }
  }
  
  return decryptedContents;
}

// Check if a delivery condition is met
export function isDeliveryConditionMet(condition: DeliveryCondition): boolean {
  switch (condition.type) {
    case 'date':
      if (!condition.params.date) return false;
      const deliveryDate = new Date(condition.params.date);
      return new Date() >= deliveryDate;
      
    case 'location':
      // In a real app, this would use the browser's geolocation API
      // For the demo, we'll just return false
      return false;
      
    case 'event':
      // In a real app, this would check against a database of events
      // For the demo, we'll just return false
      return false;
      
    case 'password':
      // This would be checked at the time of opening with a user-provided password
      return false;
      
    case 'biometric':
      // In a real app, this would use the WebAuthn API
      // For the demo, we'll just return false
      return false;
      
    default:
      return false;
  }
}

// Check if a password meets the delivery condition
export async function verifyPasswordDeliveryCondition(
  condition: DeliveryCondition, 
  providedPassword: string
): Promise<boolean> {
  if (condition.type !== 'password') return false;
  
  const { passwordHash, passwordSalt } = condition.params;
  if (!passwordHash || !passwordSalt) return false;
  
  return await encryptionUtils.verifyPassword(providedPassword, passwordHash, passwordSalt);
}

// Get capsules eligible for delivery
export function getCapsulesEligibleForDelivery(): TimeCapsule[] {
  const capsules = loadCapsules();
  const eligibleCapsules = capsules.filter(capsule => {
    // Only check scheduled capsules
    if (capsule.status !== CapsuleStatus.SCHEDULED) return false;
    
    // Check if any delivery condition is met
    return capsule.deliveryConditions.some(condition => isDeliveryConditionMet(condition));
  });
  
  return eligibleCapsules;
}

// Process delivery of eligible capsules
export function processDeliveries(): void {
  const eligibleCapsules = getCapsulesEligibleForDelivery();
  
  eligibleCapsules.forEach(capsule => {
    markCapsuleAsDelivered(capsule.id);
    
    // In a real app, you would also:
    // 1. Send notifications to recipients
    // 2. Update the server state
    // 3. Log the delivery
  });
} 