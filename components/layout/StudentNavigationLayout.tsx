'use client'

import StudentHeader from './StudentHeader'
import StudentMainNav from './StudentMainNav'
import StudentSubNav from './StudentSubNav'

interface StudentNavigationLayoutProps {
  children: React.ReactNode
  showNavigation?: boolean
}

export default function StudentNavigationLayout({ 
  children, 
  showNavigation = true 
}: StudentNavigationLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      {showNavigation && (
        <>
          <StudentMainNav />
          <StudentSubNav />
        </>
      )}
      <main className="pb-4 md:pb-8">
        {children}
      </main>
    </div>
  )
}