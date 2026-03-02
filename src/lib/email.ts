import nodemailer from 'nodemailer';

// Create a transporter using nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.resend.com',
  port: Number(process.env.EMAIL_SERVER_PORT) || 465,
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// Send a verification email
export async function sendVerificationEmail(to: string, token: string): Promise<boolean> {
  // In development mode, log the verification link but don't try to send an email
  if (process.env.NODE_ENV === 'development') {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
    const verificationUrl = `${baseUrl}/verify-email?token=${token}`;
    
    console.log('='.repeat(80));
    console.log('[DEV MODE] Email verification bypassed');
    console.log(`To: ${to}`);
    console.log(`Verification URL: ${verificationUrl}`);
    console.log('='.repeat(80));
    
    // In development, we consider this a success even though no email was sent
    return true;
  }

  // In production, actually send the email
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
    const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'notifications@timecapsul.app',
      to,
      subject: 'Verify your email address for Timecapsul',
      text: `Please verify your email address by clicking on the following link: ${verificationUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Welcome to Timecapsul!</h2>
          <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p>If the button doesn't work, you can also click on this link:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't sign up for Timecapsul, you can safely ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;" />
          <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Timecapsul. All rights reserved.</p>
        </div>
      `,
    });
    
    console.log(`Verification email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
} 