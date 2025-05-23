import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: Role;
      isActive: boolean;
      firstName: string;
      lastName: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: Role;
    isActive: boolean;
    firstName: string;
    lastName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    isActive: boolean;
    firstName: string;
    lastName: string;
  }
}
