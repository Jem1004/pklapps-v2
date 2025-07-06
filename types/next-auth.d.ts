import { Role } from "@prisma/client"
import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    username: string
    role: Role
  }

  interface Session {
    user: {
      id: string
      name: string
      username: string
      role: Role
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
    username: string
  }
}