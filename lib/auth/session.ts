import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'
import type { Session } from 'next-auth'

/**
 * Get authenticated session for server actions
 * Throws error if user is not authenticated
 */
export async function getAuthenticatedSession(): Promise<Session & { user: { id: string } }> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  return session as Session & { user: { id: string } }
}

/**
 * Get session without throwing error
 * Returns null if user is not authenticated
 */
export async function getOptionalSession(): Promise<Session | null> {
  return await getServerSession(authOptions)
}