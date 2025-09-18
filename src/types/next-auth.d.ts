// src/types/next-auth.d.ts

import type { DefaultSession } from "next-auth"
import type { JWT as DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: "ADMIN" | "STAFF" | "PELAKSANA"
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: "ADMIN" | "STAFF" | "PELAKSANA"
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: "ADMIN" | "STAFF" | "PELAKSANA"
  }
}
