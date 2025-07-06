import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { 
          label: "Username", 
          type: "text", 
          placeholder: "Masukkan username" 
        },
        password: { 
          label: "Password", 
          type: "password" 
        }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          // Cari user berdasarkan username
          const user = await prisma.user.findUnique({
            where: {
              username: credentials.username
            }
          })

          if (!user) {
            return null
          }

          // Verifikasi password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          )

          if (!isPasswordValid) {
            return null
          }

          // Return user object untuk session
          return {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Simpan role ke dalam token saat login
      if (user) {
        token.role = user.role
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      // Tambahkan role dan username ke session
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as Role
        session.user.username = token.username as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login",
  },
}