import NextAuth from "../../../../node_modules/next-auth"
import { authOptions } from "../../../../lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }