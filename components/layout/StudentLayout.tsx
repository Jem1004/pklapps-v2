'use client'

import StudentHeader from './StudentHeader'
import StudentMainNav from './StudentMainNav'

interface StudentLayoutProps {
  children: React.ReactNode
  showNav?: boolean
}

export default function StudentLayout({ children, showNav = true }: StudentLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      {showNav && <StudentMainNav />}
      <main className="pb-4 md:pb-8">
        {children}
      </main>
    </div>
  )
}