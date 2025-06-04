import { withAuth } from "./node_modules/next-auth/middleware"
import { NextResponse } from "./node_modules/next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Jika user sudah login dan mengakses halaman auth, redirect ke dashboard
    if (token && pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL(getDashboardUrl(token.role as string), req.url))
    }

    // Jika user belum login dan mengakses halaman protected, redirect ke login
    if (!token && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    // Jika user login tapi mengakses dashboard yang salah, redirect ke dashboard yang benar
    if (token && pathname.startsWith("/dashboard")) {
      const allowedPaths = getAllowedDashboardPaths(token.role as string)
      
      // Cek apakah user mengakses path yang diizinkan untuk rolenya
      const isAllowed = allowedPaths.some(path => pathname.startsWith(path))
      
      if (!isAllowed) {
        return NextResponse.redirect(new URL(getDashboardUrl(token.role as string), req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Halaman public yang tidak perlu auth
        if (pathname === "/" || pathname.startsWith("/auth")) {
          return true
        }
        
        // Halaman protected perlu token
        if (pathname.startsWith("/dashboard")) {
          return !!token
        }
        
        return true
      },
    },
  }
)

function getDashboardUrl(role: string): string {
  switch (role) {
    case "STUDENT":
      return "/dashboard/jurnal" // Default landing page untuk student
    case "TEACHER":
      return "/dashboard/guru"
    case "ADMIN":
      return "/dashboard/admin"
    default:
      return "/auth/login"
  }
}

// Fungsi baru untuk menentukan path yang diizinkan per role
function getAllowedDashboardPaths(role: string): string[] {
  switch (role) {
    case "STUDENT":
      return ["/dashboard/jurnal", "/dashboard/absensi"]
      case "TEACHER":
        return ["/dashboard/guru", "/dashboard/guru/absensi"]
      case "ADMIN":
        return ["/dashboard/admin", "/dashboard/admin/absensi"]
    default:
      return []
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/(absensi)/:path*"  // Tambahkan ini
  ]
}
