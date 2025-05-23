import { DefaultSession, NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "USER" as Role,
          isActive: true,
          firstName: profile.given_name || null,
          lastName: profile.family_name || null,
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.password) {
            throw new Error(
              "Please sign in with Google or reset your password"
            );
          }

          if (!user.isActive) {
            throw new Error(
              "Your account has been disabled. Please contact support."
            );
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { updatedAt: new Date() },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? "",
            image: user.image ?? "",
            role: user.role,
            isActive: user.isActive,
            firstName: user.firstName ?? undefined,
            lastName: user.lastName ?? undefined,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (existingUser) {
            // Update existing user with Google info if not already set
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
                updatedAt: new Date(),
              },
            });

            // Set user properties for JWT callback
            user.id = existingUser.id;
            user.role = existingUser.role;
            user.isActive = existingUser.isActive;
            user.firstName = existingUser.firstName ?? undefined;
            user.lastName = existingUser.lastName ?? undefined;
          }
          return true;
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isActive = user.isActive;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }

      // Refresh user data from database periodically or on update
      if (trigger === "update" || !token.role) {
        if (token.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: token.email },
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                isActive: true,
                firstName: true,
                lastName: true,
              },
            });

            if (dbUser) {
              token.id = dbUser.id;
              token.name = dbUser.name;
              token.email = dbUser.email;
              token.picture = dbUser.image;
              token.role = dbUser.role;
              token.isActive = dbUser.isActive;
              token.firstName = dbUser.firstName ?? undefined;
              token.lastName = dbUser.lastName ?? undefined;
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.isActive = token.isActive as boolean;
        session.user.firstName = token.firstName as string | undefined;
        session.user.lastName = token.lastName as string | undefined;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(`User ${user.email} signed in via ${account?.provider}`);
    },
    async signOut({ token }) {
      console.log(`User ${token?.email} signed out`);
    },
    async createUser({ user }) {
      console.log(`New user created: ${user.email}`);
      // Send welcome email (implement your email service here)
      // await sendWelcomeEmail(user.email, user.name)
    },
  },
  debug: process.env.NODE_ENV === "development",
};

// Type augmentation for NextAuth
declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
    isActive: boolean;
    firstName: string | null;
    lastName: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      isActive: boolean;
      firstName?: string | null;
      lastName?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    isActive: boolean;
    firstName: string | null;
    lastName: string | null;
  }
}
