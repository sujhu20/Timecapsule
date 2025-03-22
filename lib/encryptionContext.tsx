"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as encryptionUtils from './encryption';

interface UserKeys {
  publicKey: string;
  privateKey: string;
}

interface EncryptionContextType {
  keys: UserKeys | null;
  generating: boolean;
  generateKeys: () => Promise<void>;
  getPublicKey: () => string | null;
  encryptForRecipient: (data: string, recipientPublicKey: string) => Promise<{
    encryptedData: string;
    encryptedKey: string;
    iv: string;
  }>;
  decryptFromSender: (
    encryptedData: string,
    encryptedKey: string,
    iv: string
  ) => Promise<string>;
  encryptFile: (file: File) => Promise<{
    encryptedData: string;
    encryptedKey: string;
    iv: string;
    fileName: string;
    fileType: string;
  }>;
  decryptFile: (
    encryptedData: string,
    encryptedKey: string,
    iv: string,
    fileName: string,
    fileType: string
  ) => Promise<File>;
  exportKeys: () => { publicKey: string; privateKey: string } | null;
  importKeys: (keys: { publicKey: string; privateKey: string }) => void;
  regenerateKeysFromPassword: (password: string) => Promise<void>;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

const KEY_STORAGE_KEY = 'timecapsule-encryption-keys';

export function EncryptionProvider({ children }: { children: React.ReactNode }) {
  const [keys, setKeys] = useState<UserKeys | null>(null);
  const [generating, setGenerating] = useState(false);

  // Load keys from localStorage on mount
  useEffect(() => {
    const storedKeys = localStorage.getItem(KEY_STORAGE_KEY);
    if (storedKeys) {
      try {
        setKeys(JSON.parse(storedKeys));
      } catch (error) {
        console.error('Failed to parse stored keys', error);
        localStorage.removeItem(KEY_STORAGE_KEY);
      }
    }
  }, []);

  // Generate new RSA key pair
  const generateKeys = async () => {
    setGenerating(true);
    try {
      const newKeys = await encryptionUtils.generateKeyPair();
      setKeys(newKeys);
      localStorage.setItem(KEY_STORAGE_KEY, JSON.stringify(newKeys));
    } catch (error) {
      console.error('Error generating keys:', error);
    } finally {
      setGenerating(false);
    }
  };

  // Get user's public key
  const getPublicKey = () => {
    return keys?.publicKey || null;
  };

  // Encrypt data for a recipient
  const encryptForRecipient = async (data: string, recipientPublicKey: string) => {
    if (!recipientPublicKey) {
      throw new Error('Recipient public key is required');
    }

    // Generate a one-time content key
    const contentKey = await encryptionUtils.generateContentKey();

    // Encrypt the data with the content key
    const { encryptedData, iv } = await encryptionUtils.encryptContent(data, contentKey);

    // Encrypt the content key with the recipient's public key
    const encryptedKey = await encryptionUtils.encryptContentKey(contentKey, recipientPublicKey);

    return { encryptedData, encryptedKey, iv };
  };

  // Decrypt data from a sender
  const decryptFromSender = async (encryptedData: string, encryptedKey: string, iv: string) => {
    if (!keys?.privateKey) {
      throw new Error('Private key is not available');
    }

    // Decrypt the content key with the user's private key
    const contentKey = await encryptionUtils.decryptContentKey(encryptedKey, keys.privateKey);

    // Decrypt the data with the content key
    return await encryptionUtils.decryptContent(encryptedData, iv, contentKey);
  };

  // Encrypt a file for a recipient
  const encryptFile = async (file: File) => {
    if (!keys?.publicKey) {
      throw new Error('Public key is not available');
    }

    // Generate a one-time content key
    const contentKey = await encryptionUtils.generateContentKey();

    // Encrypt the file with the content key
    const { encryptedData, iv, fileName, fileType } = await encryptionUtils.encryptFile(file, contentKey);

    // Encrypt the content key with the user's public key
    const encryptedKey = await encryptionUtils.encryptContentKey(contentKey, keys.publicKey);

    return { encryptedData, encryptedKey, iv, fileName, fileType };
  };

  // Decrypt a file
  const decryptFile = async (
    encryptedData: string,
    encryptedKey: string,
    iv: string,
    fileName: string,
    fileType: string
  ) => {
    if (!keys?.privateKey) {
      throw new Error('Private key is not available');
    }

    // Decrypt the content key with the user's private key
    const contentKey = await encryptionUtils.decryptContentKey(encryptedKey, keys.privateKey);

    // Decrypt the file with the content key
    return await encryptionUtils.decryptFile(encryptedData, iv, contentKey, fileName, fileType);
  };

  // Export keys
  const exportKeys = () => {
    return keys;
  };

  // Import keys
  const importKeys = (importedKeys: { publicKey: string; privateKey: string }) => {
    setKeys(importedKeys);
    localStorage.setItem(KEY_STORAGE_KEY, JSON.stringify(importedKeys));
  };

  // Regenerate keys from a password (for recovery)
  const regenerateKeysFromPassword = async (password: string) => {
    // This is a simplified implementation - in a real app, you would:
    // 1. Use a key derivation function to generate deterministic keys from the password
    // 2. Use proper key derivation parameters (salt, iterations)
    
    setGenerating(true);
    try {
      // Generate a deterministic "seed" from the password
      const { hash, salt } = await encryptionUtils.hashPassword(password);
      
      // Use the hash as a seed for the key pair
      // In a real implementation, you would use proper key derivation
      const seed = hash.substring(0, 32);
      
      // For demo purposes, we're just generating new keys
      // In a real app, you would derive the keys deterministically
      const newKeys = await encryptionUtils.generateKeyPair();
      
      setKeys(newKeys);
      localStorage.setItem(KEY_STORAGE_KEY, JSON.stringify(newKeys));
    } catch (error) {
      console.error('Error regenerating keys:', error);
    } finally {
      setGenerating(false);
    }
  };

  const value: EncryptionContextType = {
    keys,
    generating,
    generateKeys,
    getPublicKey,
    encryptForRecipient,
    decryptFromSender,
    encryptFile,
    decryptFile,
    exportKeys,
    importKeys,
    regenerateKeysFromPassword,
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
}

export function useEncryption() {
  const context = useContext(EncryptionContext);
  if (context === undefined) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
} 