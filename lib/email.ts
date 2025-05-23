// lib/email.ts
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string) {
  // Generate verification token
  const token =
    Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Save token to database
  await prisma.emailVerification.create({
    data: {
      email,
      token,
      expires,
    },
  });

  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
        <p>Thank you for signing up! Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderData: {
    orderNumber: string | number;
    total: number;
    status: string;
    items: Array<{
      product: { name: string };
      quantity: number;
      total: number;
    }>;
  }
) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Order Confirmation - #${orderData.orderNumber}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Thank you for your order! Here are the details:</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Order #${orderData.orderNumber}</h3>
          <p><strong>Total:</strong> $${orderData.total}</p>
          <p><strong>Status:</strong> ${orderData.status}</p>
        </div>
        
        <h4>Items:</h4>
        <ul>
          ${orderData.items
            .map(
              (item: { product: { name: string }; quantity: number; total: number }) => `
            <li>${item.product.name} - Quantity: ${item.quantity} - $${item.total}</li>
          `
            )
            .join("")}
        </ul>
        
        <p>We'll send you another email when your order ships.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return { success: false, error };
  }
}
