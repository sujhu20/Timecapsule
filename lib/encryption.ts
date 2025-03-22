"use client";

import { webcrypto } from 'crypto';

// Use native Web Crypto API or Node.js crypto module depending on environment
const crypto = typeof window !== 'undefined' ? window.crypto : webcrypto;

/**
 * Generates a new RSA key pair for asymmetric encryption
 * @returns Promise with public and private key in PEM format
 */
export async function generateKeyPair(): Promise<{ publicKey: string, privateKey: string }> {
  try {
    // Generate RSA key pair
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true, // extractable
      ["encrypt", "decrypt"]
    );

    // Export the keys in SPKI and PKCS8 formats
    const publicKeyBuffer = await crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKeyBuffer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    // Convert ArrayBuffers to Base64 strings
    const publicKey = arrayBufferToBase64(publicKeyBuffer);
    const privateKey = arrayBufferToBase64(privateKeyBuffer);

    return { publicKey, privateKey };
  } catch (error) {
    console.error("Error generating key pair:", error);
    throw new Error("Failed to generate encryption keys");
  }
}

/**
 * Generates a symmetric AES-256 key for content encryption
 * @returns Promise with the AES key in Base64 format
 */
export async function generateContentKey(): Promise<string> {
  try {
    // Generate a random AES-256 key
    const key = await crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true, // extractable
      ["encrypt", "decrypt"]
    );

    // Export the key
    const keyBuffer = await crypto.subtle.exportKey("raw", key);
    
    // Convert to Base64
    return arrayBufferToBase64(keyBuffer);
  } catch (error) {
    console.error("Error generating content key:", error);
    throw new Error("Failed to generate content encryption key");
  }
}

/**
 * Encrypts data using AES-GCM
 * @param data Data to encrypt (string)
 * @param keyBase64 AES key in Base64 format
 * @returns Promise with encrypted data and IV in Base64 format
 */
export async function encryptContent(data: string, keyBase64: string): Promise<{ encryptedData: string, iv: string }> {
  try {
    const keyBuffer = base64ToArrayBuffer(keyBase64);
    
    // Import the AES key
    const key = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      {
        name: "AES-GCM",
      },
      false, // non-extractable
      ["encrypt"]
    );
    
    // Generate a random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
        tagLength: 128, // standard tag length
      },
      key,
      dataBuffer
    );
    
    // Convert encrypted data and IV to Base64
    const encryptedData = arrayBufferToBase64(encryptedBuffer);
    const ivBase64 = arrayBufferToBase64(iv);
    
    return { encryptedData, iv: ivBase64 };
  } catch (error) {
    console.error("Error encrypting content:", error);
    throw new Error("Failed to encrypt content");
  }
}

/**
 * Decrypts data using AES-GCM
 * @param encryptedData Encrypted data in Base64 format
 * @param ivBase64 IV in Base64 format
 * @param keyBase64 AES key in Base64 format
 * @returns Promise with decrypted data as string
 */
export async function decryptContent(encryptedData: string, ivBase64: string, keyBase64: string): Promise<string> {
  try {
    const encryptedBuffer = base64ToArrayBuffer(encryptedData);
    const ivBuffer = base64ToArrayBuffer(ivBase64);
    const keyBuffer = base64ToArrayBuffer(keyBase64);
    
    // Import the AES key
    const key = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      {
        name: "AES-GCM",
      },
      false, // non-extractable
      ["decrypt"]
    );
    
    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: ivBuffer,
        tagLength: 128, // standard tag length
      },
      key,
      encryptedBuffer
    );
    
    // Convert decrypted data to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error("Error decrypting content:", error);
    throw new Error("Failed to decrypt content");
  }
}

/**
 * Encrypts the content key using recipient's public key
 * @param contentKeyBase64 Content key in Base64 format
 * @param publicKeyBase64 Recipient's public key in Base64 format
 * @returns Promise with encrypted content key in Base64 format
 */
export async function encryptContentKey(contentKeyBase64: string, publicKeyBase64: string): Promise<string> {
  try {
    const contentKeyBuffer = base64ToArrayBuffer(contentKeyBase64);
    const publicKeyBuffer = base64ToArrayBuffer(publicKeyBase64);
    
    // Import the public key
    const publicKey = await crypto.subtle.importKey(
      "spki",
      publicKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      false, // non-extractable
      ["encrypt"]
    );
    
    // Encrypt the content key with the public key
    const encryptedKeyBuffer = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      contentKeyBuffer
    );
    
    // Convert encrypted key to Base64
    return arrayBufferToBase64(encryptedKeyBuffer);
  } catch (error) {
    console.error("Error encrypting content key:", error);
    throw new Error("Failed to encrypt content key");
  }
}

/**
 * Decrypts the content key using recipient's private key
 * @param encryptedKeyBase64 Encrypted content key in Base64 format
 * @param privateKeyBase64 Recipient's private key in Base64 format
 * @returns Promise with decrypted content key in Base64 format
 */
export async function decryptContentKey(encryptedKeyBase64: string, privateKeyBase64: string): Promise<string> {
  try {
    const encryptedKeyBuffer = base64ToArrayBuffer(encryptedKeyBase64);
    const privateKeyBuffer = base64ToArrayBuffer(privateKeyBase64);
    
    // Import the private key
    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      false, // non-extractable
      ["decrypt"]
    );
    
    // Decrypt the content key
    const contentKeyBuffer = await crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      encryptedKeyBuffer
    );
    
    // Convert content key to Base64
    return arrayBufferToBase64(contentKeyBuffer);
  } catch (error) {
    console.error("Error decrypting content key:", error);
    throw new Error("Failed to decrypt content key");
  }
}

/**
 * Helper function to convert ArrayBuffer to Base64 string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Helper function to convert Base64 string to ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Splits a secret into multiple shares using Shamir's Secret Sharing
 * This is a simplified implementation for demonstration purposes
 * @param secret The secret to split
 * @param numShares Total number of shares to create
 * @param threshold Minimum shares needed to reconstruct
 * @returns Array of secret shares
 */
export function splitSecret(secret: string, numShares: number, threshold: number): string[] {
  // This is a placeholder - in a real implementation, you would use a library like secrets.js
  // or implement the full Shamir's Secret Sharing algorithm
  const shares: string[] = [];
  for (let i = 0; i < numShares; i++) {
    shares.push(`share-${i}-${secret.substring(0, 10)}`);
  }
  return shares;
}

/**
 * Combines secret shares to reconstruct the original secret
 * This is a simplified implementation for demonstration purposes
 * @param shares Array of secret shares
 * @returns The reconstructed secret
 */
export function combineShares(shares: string[]): string {
  // This is a placeholder - in a real implementation, you would use a library like secrets.js
  // or implement the full Shamir's Secret Sharing algorithm
  if (shares.length === 0) return "";
  const firstShare = shares[0];
  const secretPart = firstShare.split('-')[2];
  return secretPart;
}

/**
 * Encrypts a file using AES-GCM
 * @param file File object to encrypt
 * @param keyBase64 AES key in Base64 format
 * @returns Promise with encrypted file data and IV
 */
export async function encryptFile(file: File, keyBase64: string): Promise<{ encryptedData: string, iv: string, fileName: string, fileType: string }> {
  try {
    // Read the file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    const keyBuffer = base64ToArrayBuffer(keyBase64);
    
    // Import the AES key
    const key = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      {
        name: "AES-GCM",
      },
      false, // non-extractable
      ["encrypt"]
    );
    
    // Generate a random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the file data
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
        tagLength: 128,
      },
      key,
      fileBuffer
    );
    
    // Convert encrypted data and IV to Base64
    const encryptedData = arrayBufferToBase64(encryptedBuffer);
    const ivBase64 = arrayBufferToBase64(iv);
    
    return { 
      encryptedData, 
      iv: ivBase64,
      fileName: file.name,
      fileType: file.type
    };
  } catch (error) {
    console.error("Error encrypting file:", error);
    throw new Error("Failed to encrypt file");
  }
}

/**
 * Decrypts a file using AES-GCM
 * @param encryptedData Encrypted file data in Base64 format
 * @param ivBase64 IV in Base64 format
 * @param keyBase64 AES key in Base64 format
 * @param fileName Original file name
 * @param fileType Original file type
 * @returns Promise with decrypted file
 */
export async function decryptFile(
  encryptedData: string, 
  ivBase64: string, 
  keyBase64: string, 
  fileName: string, 
  fileType: string
): Promise<File> {
  try {
    const encryptedBuffer = base64ToArrayBuffer(encryptedData);
    const ivBuffer = base64ToArrayBuffer(ivBase64);
    const keyBuffer = base64ToArrayBuffer(keyBase64);
    
    // Import the AES key
    const key = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      {
        name: "AES-GCM",
      },
      false, // non-extractable
      ["decrypt"]
    );
    
    // Decrypt the file data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: ivBuffer,
        tagLength: 128,
      },
      key,
      encryptedBuffer
    );
    
    // Create a new file with the decrypted data
    return new File([decryptedBuffer], fileName, { type: fileType });
  } catch (error) {
    console.error("Error decrypting file:", error);
    throw new Error("Failed to decrypt file");
  }
}

// Authentication-related functions

/**
 * Generates a hash of a password using PBKDF2
 * @param password The password to hash
 * @param salt Optional salt (generated if not provided)
 * @returns Promise with hashed password and salt
 */
export async function hashPassword(password: string, providedSalt?: string): Promise<{ hash: string, salt: string }> {
  try {
    const encoder = new TextEncoder();
    
    // Generate salt if not provided
    let salt: Uint8Array;
    if (providedSalt) {
      salt = base64ToArrayBuffer(providedSalt) as Uint8Array;
    } else {
      salt = crypto.getRandomValues(new Uint8Array(16));
    }
    
    // Import password as key material
    const passwordKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    
    // Derive key using PBKDF2
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      passwordKey,
      256
    );
    
    return {
      hash: arrayBufferToBase64(hashBuffer),
      salt: arrayBufferToBase64(salt)
    };
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
}

/**
 * Verifies a password against a stored hash
 * @param password The password to verify
 * @param storedHash The stored hash
 * @param storedSalt The stored salt
 * @returns Promise with boolean indicating if password matches
 */
export async function verifyPassword(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
  try {
    const { hash } = await hashPassword(password, storedSalt);
    return hash === storedHash;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}

/**
 * Generates a cryptographically secure random token (e.g., for 2FA)
 * @param length Length of the token to generate
 * @returns Random token as string
 */
export function generateToken(length: number = 6): string {
  const digits = "0123456789";
  let token = "";
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    token += digits[randomValues[i] % digits.length];
  }
  
  return token;
} 