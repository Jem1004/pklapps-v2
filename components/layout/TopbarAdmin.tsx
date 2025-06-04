'use client'

import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Menu, LogOut, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

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
        className="fixed top-0 right-0 h-16 bg-white border-b border-slate-200 shadow-sm z-30 hidden lg:flex items-center justify-between px-6"
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-2 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div>
            <h2 className="font-semibold text-slate-800">Selamat datang kembali!</h2>
            <p className="text-sm text-slate-500">Kelola sistem PKL dengan mudah</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 hover:bg-slate-100">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-slate-800">{session?.user?.name}</div>
                  <Badge variant="secondary" className="text-xs">
                    {session?.user?.role}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>

      {/* Mobile Topbar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 shadow-sm z-30 flex items-center justify-between px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMobileMenu}
          className="p-2"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-slate-800 text-sm">{session?.user?.name}</div>
            <Badge variant="secondary" className="text-xs">
              {session?.user?.role}
            </Badge>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="p-2 text-red-600"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </header>
    </>
  )
}