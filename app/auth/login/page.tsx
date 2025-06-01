"use client"

import { useState } from "react"
import { signIn, getSession } from "../../../node_modules/next-auth/react"
import { useRouter } from "../../../node_modules/next/navigation"
import { Button } from "@/../components/ui/button"
import { Input } from "@/../components/ui/input"
import { Label } from "@/../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/../components/ui/card"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Username atau password salah")
      } else {
        // Get session to check role
        const session = await getSession()
        if (session?.user?.role === "STUDENT") {
          router.push("/dashboard/jurnal")
        } else if (session?.user?.role === "TEACHER") {
          router.push("/dashboard/teacher")
        } else if (session?.user?.role === "ADMIN") {
          router.push("/dashboard/admin")
        }
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardHeader className="text-sm text-muted-foreground"></CardHeader>
            Masukkan username dan password untuk mengakses sistem jurnal PKL
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}