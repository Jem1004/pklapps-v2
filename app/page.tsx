"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/../components/ui/button"
import { Card } from "@/../components/ui/card"
import { Badge } from "@/../components/ui/badge"
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  FileText, 
  Eye, 
  MapPin, 
  Download,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  const features = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Pencatatan Jurnal Harian",
      description: "Catat aktivitas PKL setiap hari dengan interface yang intuitif",
      color: "bg-blue-500"
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Pemantauan Real-time",
      description: "Guru dapat memantau perkembangan siswa secara langsung",
      color: "bg-green-500"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Mapping Siswa & Guru",
      description: "Sistem pemetaan otomatis siswa ke guru pembimbing",
      color: "bg-purple-500"
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: "Export ke PDF",
      description: "Unduh jurnal dalam format PDF untuk dokumentasi",
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Platform PKL SMK MUTU PPU
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent leading-tight">
                Aplikasi Jurnal
                <span className="block text-blue-600">PKL SMK MUTU</span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Catat kegiatan PKL harianmu dengan mudah dan terdokumentasi dalam satu platform terintegrasi
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => router.push('/auth/login')}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Masuk Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Illustration */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="space-y-4">
                {/* Mock Interface */}
                <div className="bg-blue-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <BookOpen className="h-6 w-6" />
                    <span className="font-semibold">Jurnal PKL Hari Ini</span>
                  </div>
                  <div className="space-y-2 text-blue-100">
                    <div className="h-2 bg-blue-400 rounded w-3/4" />
                    <div className="h-2 bg-blue-400 rounded w-1/2" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-100 rounded-xl p-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                    <div className="text-sm font-medium text-green-800">Tugas Selesai</div>
                  </div>
                  <div className="bg-purple-100 rounded-xl p-4">
                    <Users className="h-6 w-6 text-purple-600 mb-2" />
                    <div className="text-sm font-medium text-purple-800">Bimbingan</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-lg border">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Fitur Utama
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Platform untuk mengelola kegiatan Praktik Kerja Lapangan Siswa SMK Muhammadiyah 1 Penajam Paser Utara
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Jurnal PKL SMK</h3>
                  <p className="text-slate-400 text-sm">Platform PKL Terintegrasi</p>
                </div>
              </div>
              <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                Solusi lengkap untuk mengelola dan memantau kegiatan Praktik Kerja Lapangan
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Akses Cepat</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/auth/login" className="hover:text-white transition-colors">Login Siswa</a></li>
                <li><a href="/auth/login" className="hover:text-white transition-colors">Login Guru</a></li>
                <li><a href="/auth/login" className="hover:text-white transition-colors">Login Admin</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-6 text-center text-slate-400 text-sm">
            <p>&copy; 2025 Jurnal PKL SMK. Develop by Jem From Astrodigiso.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}