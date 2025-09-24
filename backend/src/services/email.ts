import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email: string, userId: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Verification email would be sent to ${email} for user ${userId}`);
    return;
  }

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${userId}`;

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Verify Your Email - Spotify Clone',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1db954;">Welcome to Spotify Clone!</h2>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="background-color: #1db954; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The Spotify Clone Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Password reset email would be sent to ${email} with token ${resetToken}`);
    return;
  }

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Reset Your Password - Spotify Clone',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1db954;">Password Reset Request</h2>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetUrl}" style="background-color: #1db954; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Spotify Clone Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email: string, username: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Welcome email would be sent to ${email} for user ${username}`);
    return;
  }

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Welcome to Spotify Clone!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1db954;">Welcome to Spotify Clone, ${username}!</h2>
        <p>Your account has been successfully created and verified. You can now enjoy unlimited music streaming!</p>
        <h3>What's next?</h3>
        <ul>
          <li>Explore our vast music library</li>
          <li>Create your first playlist</li>
          <li>Discover new artists and songs</li>
          <li>Connect with friends and share music</li>
        </ul>
        <p>Happy listening!</p>
        <p>Best regards,<br>The Spotify Clone Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};
