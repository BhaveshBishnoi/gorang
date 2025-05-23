// pages/api/auth/verify-email.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Find verification record
    const verification = await prisma.emailVerification.findUnique({
      where: { token },
    });

    if (!verification) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Check if token is expired
    if (verification.expires < new Date()) {
      await prisma.emailVerification.delete({
        where: { token },
      });
      return res.status(400).json({ message: "Token has expired" });
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { email: verification.email },
      data: { emailVerified: new Date() },
    });

    // Delete the verification token
    await prisma.emailVerification.delete({
      where: { token },
    });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
