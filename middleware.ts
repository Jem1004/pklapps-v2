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
      const correctDashboard = getDashboardUrl(token.role as string)
      
      // Cek apakah user mengakses dashboard yang sesuai dengan rolenya
      if (!pathname.startsWith(correctDashboard)) {
        return NextResponse.redirect(new URL(correctDashboard, req.url))
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
      return "/dashboard/jurnal"
    case "TEACHER":
      return "/dashboard/guru"
    case "ADMIN":
      return "/dashboard/admin"
    default:
      return "/auth/login"
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*"
  ]
}