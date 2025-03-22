# TimeCapsule Security Guide

This document provides technical details about the security measures implemented in the TimeCapsule application.

## Encryption Architecture

TimeCapsule uses a hybrid encryption approach to ensure maximum security while maintaining performance:

### Key Generation & Management

1. **RSA Key Pair Generation**: When you first use the app, a 2048-bit RSA key pair is generated:
   - Public key: Used to encrypt content keys
   - Private key: Used to decrypt content keys (never leaves your device)

2. **Key Storage**:
   - Keys are stored in your browser's local storage
   - Private key is encrypted with your password using PBKDF2 key derivation
   - No keys are transmitted to our servers unencrypted

3. **Key Recovery**:
   - You can export your keys as a recovery phrase
   - This allows you to restore access from a new device
   - Always keep your recovery phrase in a secure location

### Content Encryption Flow

1. **Content Preparation**:
   - When creating a capsule, your content (text, images, videos, files) is prepared for encryption

2. **Per-Content Encryption**:
   - For each piece of content:
     - A unique AES-256 content key is generated
     - Content is encrypted using this key with AES-GCM mode (provides both confidentiality and integrity)
     - The initialization vector (IV) is generated randomly for each encryption operation

3. **Key Encryption**:
   - The AES content key is encrypted with the recipient's public RSA key
   - This encrypted key is stored with the encrypted content

4. **Storage**:
   - Only encrypted data is stored

### Decryption Flow

1. **Access Control**:
   - When accessing a capsule, permission is verified based on privacy settings

2. **Key Decryption**:
   - The recipient uses their private key to decrypt the content key
   - The private key is first decrypted using the user's password

3. **Content Decryption**:
   - The decrypted content key is used to decrypt the actual content
   - Decryption happens entirely in the browser

## Security Features

### End-to-End Encryption

- All encryption and decryption happens in your browser
- Neither the server nor any third party can access unencrypted data
- Even if our servers were compromised, your data remains encrypted

### Zero-Knowledge Architecture

- We don't store your encryption keys
- We can't access your encrypted data
- We can't reset your password or recover your content if you lose your keys

### Password Protection

- Capsules can be protected with an additional password
- Password hashing uses PBKDF2 with a high iteration count and unique salt
- Incorrect password attempts are rate-limited

### Self-Destructing Capsules

- Self-destructing capsules are permanently deleted after being viewed
- The countdown timer starts immediately upon opening
- Once deleted, the content cannot be recovered

## Security Best Practices

1. **Use Strong Passwords**:
   - Choose a unique, strong password for your TimeCapsule account
   - Consider using a password manager

2. **Backup Your Recovery Phrase**:
   - Store your recovery phrase in a secure location
   - Without it, you may lose access to your capsules if you change devices

3. **Verify Recipient Public Keys**:
   - For sensitive content, verify recipients' public keys through a secondary channel

4. **Use Additional Protection**:
   - For highly sensitive content, use the password protection feature
   - Send the password through a different communication channel

5. **Check Privacy Settings**:
   - Always verify the privacy settings before creating a capsule
   - Use the most restrictive setting appropriate for your content

## Security Auditing

The TimeCapsule encryption library is regularly audited for security vulnerabilities. We follow industry best practices for secure coding and maintain a responsible disclosure program for security researchers.

## Questions or Concerns

If you have questions about our security practices or want to report a potential security issue, please contact us at security@timecapsule.app. 