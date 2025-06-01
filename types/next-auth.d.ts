import { Role } from "@/src/generated/prisma"
import "../node_modules/next-auth"
import "../node_modules/next-auth/jwt"

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