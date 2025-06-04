'use client'

import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TopbarProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  onToggleMobileMenu: () => void
}

export default function Topbar({ 
  sidebarCollapsed, 
  onToggleSidebar, 
  onToggleMobileMenu 
}: TopbarProps) {
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' })
  }

  const getUserDisplayName = () => {
    if (!session?.user?.name) return 'User'
    const name = session.user.name
    if (session.user.role === 'ADMIN') {
      return 'Administrator'
    }
    return name.length > 15 ? name.substring(0, 15) + '...' : name
  }

  const getRoleDisplay = () => {
    return session?.user?.role === 'ADMIN' ? 'Admin' : 'Guru'
  }

  return (
    <>
      {/* Desktop Topbar */}
      <motion.header
        initial={false}
        animate={{ 
          marginLeft: sidebarCollapsed ? 80 : 280,
          width: sidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 280px)'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 z-30 h-16 bg-white border-b border-gray-100 shadow-sm lg:block hidden"
      >
        <div className="flex h-full items-center justify-between px-6">
          {/* Left Section - Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-50"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </Button>
          
          {/* Right Section - User Info & Logout */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-500">
                {getRoleDisplay()}
              </p>
            </div>
            
            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Topbar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex h-full items-center justify-between px-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMobileMenu}
            className="p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          {/* User Info & Logout */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-500">
                {getRoleDisplay()}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
    </>
  )
}