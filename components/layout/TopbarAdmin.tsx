'use client'

import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Menu, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TopbarAdminProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  onToggleMobileMenu: () => void
}

export default function TopbarAdmin({ 
  sidebarCollapsed, 
  onToggleSidebar, 
  onToggleMobileMenu 
}: TopbarAdminProps) {
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' })
  }

  const getUserDisplayName = () => {
    if (!session?.user?.name) return 'Admin'
    const name = session.user.name
    return name.length > 20 ? name.substring(0, 20) + '...' : name
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
        className="fixed top-0 z-30 h-20 bg-white/95 backdrop-blur-sm border-b border-blue-100 shadow-sm lg:block hidden"
      >
        <div className="flex h-full items-center justify-between px-8">
          {/* Left Section - Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-3 hover:bg-blue-50 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </Button>
          
          {/* Right Section - User Info & Logout */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-blue-600">
                  Administrator
                </p>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-3 hover:bg-red-50 hover:text-red-600 transition-colors rounded-xl"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Topbar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-blue-100 shadow-sm">
        <div className="flex h-full items-center justify-between px-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMobileMenu}
            className="p-2 hover:bg-blue-50 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          {/* Mobile User Info & Logout */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-blue-600">Admin</p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
    </>
  )
}