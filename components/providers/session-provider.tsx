"use client"

import { SessionProvider } from "../../node_modules/next-auth/react"
import { ReactNode } from "../../node_modules/@types/react"

interface Props {
  children: ReactNode
}

export default function NextAuthSessionProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>
}