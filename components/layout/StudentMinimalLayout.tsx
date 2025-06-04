'use client'

import StudentHeader from './StudentHeader'
import StudentMainNavigation from './StudentMainNavigation'

interface StudentMinimalLayoutProps {
  children: React.ReactNode
  showNavigation?: boolean
}

export default function StudentMinimalLayout({ 
  children, 
  showNavigation = true 
}: StudentMinimalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      {showNavigation && <StudentMainNavigation />}
      <main className="pb-4 md:pb-8">
        {children}
      </main>
    </div>
  )
}