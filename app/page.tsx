'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Clock,
  BookOpen,
  BarChart3,
  Shield,
  Smartphone,
  Users,
  CheckCircle,
  ArrowRight,
  Calendar,
  MapPin,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      if (session.user.role === 'STUDENT') {
        router.push('/absensi')
      } else if (session.user.role === 'TEACHER') {
        router.push('/dashboard/guru')
      } else if (session.user.role === 'ADMIN') {
        router.push('/dashboard/admin')
      }
    }
  }, [session, router])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const features = [
    {
      icon: Clock,
      title: 'Absensi Online',
      description: 'Sistem absensi dengan PIN yang mudah dan aman. Siswa dapat mencatat kehadiran masuk dan pulang secara real-time.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: BookOpen,
      title: 'Jurnal Harian Siswa',
      description: 'Rekam aktivitas PKL harian dengan mudah. Dokumentasi kegiatan yang terstruktur dan mudah diakses.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: BarChart3,
      title: 'Monitoring Real-time',
      description: 'Guru dan admin dapat memantau keaktifan siswa secara langsung dengan dashboard yang informatif.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: Users,
      title: 'Multi-Role Akses',
      description: 'Sistem aman dengan akses berbeda untuk siswa, guru, dan admin. Setiap role memiliki fitur yang sesuai.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ]

  const demoData = [
    {
      name: 'Ahmad Rizki',
      status: 'Hadir',
      time: '07:30',
      location: 'PT. Teknologi Maju'
    },
    {
      name: 'Siti Nurhaliza',
      status: 'Hadir',
      time: '07:45',
      location: 'CV. Digital Solutions'
    },
    {
      name: 'Budi Santoso',
      status: 'Hadir',
      time: '08:00',
      location: 'Toko Elektronik Jaya'
    }
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <GraduationCap className="h-8 w-8 text-blue-600" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PKL System</h1>
                <p className="text-xs text-gray-500">SMK Management</p>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/auth/login')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
                🎓 Sistem PKL SMK Modern
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Sistem PKL SMK
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                  {' '}Digital
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Monitoring & Absensi PKL Siswa SMK Secara Online. 
                Kelola kehadiran dan jurnal harian dengan mudah, aman, dan real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => router.push('/auth/login')}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg h-12 px-8 text-base"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Mulai Sekarang
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base border-2 hover:bg-gray-50"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  Lihat Demo
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500 ml-2">PKL Dashboard</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Waktu Sekarang</span>
                    </div>
                    <span className="text-blue-600 font-mono font-bold">
                      {currentTime.toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {demoData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          {item.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
              ✨ Fitur Unggulan
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih PKL System?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sistem yang dirancang khusus untuk kebutuhan monitoring PKL siswa SMK dengan teknologi modern
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`h-full hover:shadow-lg transition-all duration-300 border-2 ${feature.borderColor} ${feature.bgColor}`}>
                    <CardHeader className="pb-4">
                      <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Security & Mobile Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100">
                🔒 Keamanan & Kemudahan
              </Badge>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Aman, Mudah, dan Mobile Friendly
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Keamanan Data Terjamin</h4>
                    <p className="text-gray-600 text-sm">Sistem autentikasi berlapis dan enkripsi data untuk melindungi informasi siswa</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Smartphone className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Responsif di Semua Device</h4>
                    <p className="text-gray-600 text-sm">Akses mudah dari smartphone, tablet, atau komputer dengan tampilan yang optimal</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Interface User-Friendly</h4>
                    <p className="text-gray-600 text-sm">Desain intuitif yang mudah dipahami oleh siswa, guru, dan admin</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Mobile App View</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">📱 Absen Masuk</span>
                    <Badge className="bg-green-100 text-green-700 text-xs">Aktif</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">📝 Jurnal Harian</span>
                    <Badge className="bg-blue-100 text-blue-700 text-xs">Tersedia</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">📊 Rekap Data</span>
                    <Badge className="bg-purple-100 text-purple-700 text-xs">Real-time</Badge>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Siap Memulai Digitalisasi PKL?
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan sistem PKL modern yang memudahkan monitoring dan administrasi
            </p>
            <Button 
              onClick={() => router.push('/auth/login')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg h-12 px-8 text-base font-semibold"
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Masuk ke Sistem
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">PKL System</h3>
                  <p className="text-sm text-gray-400">SMK Management</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sistem monitoring dan absensi PKL siswa SMK yang modern, aman, dan mudah digunakan.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Fitur Utama</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Absensi Online Real-time</li>
                <li>• Jurnal Harian Digital</li>
                <li>• Dashboard Monitoring</li>
                <li>• Multi-Role Access</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📧 support@pklsystem.com</li>
                <li>📱 +62 xxx-xxxx-xxxx</li>
                <li>📍 SMK Negeri/Swasta</li>
                <li>🕒 Senin - Jumat, 08:00-16:00</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 PKL System. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-400">Version 1.0.0</span>
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                Next.js + Tailwind
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}