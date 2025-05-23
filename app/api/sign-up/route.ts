// app/api/sign-up/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import  prisma  from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, phone, dateOfBirth } =
      await request.json();

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        {
          message: "Email, password, first name, and last name are required",
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        role: Role.USER,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        createdAt: true,
      },
    });

    // In a real app, you would send a verification email here
    // await sendVerificationEmail(email);

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
