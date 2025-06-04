'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { formatDateForInput } from "@/lib/utils"
import { format } from "date-fns"
import { 
  CalendarDays, 
  FileText, 
  Edit, 
  Save, 
  X, 
  List, 
  Download,
  Plus,
  Loader2,
  MessageSquare,
  BarChart3
} from "lucide-react"
import JurnalList from "@/components/JurnalList"
import { toast } from "sonner"
import StudentMinimalLayout from '@/components/layout/StudentMinimalLayout'

export default function DashboardJurnalPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  interface Jurnal {
    kegiatan: string;
    dokumentasi?: string;
  }
  
  const [jurnal, setJurnal] = useState<Jurnal | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(formatDateForInput(new Date()))
  const [formData, setFormData] = useState({
    kegiatan: "",
    dokumentasi: ""
  })
  const [activeTab, setActiveTab] = useState<'today' | 'list'>('today')
  const [activeSubmenu, setActiveSubmenu] = useState<'create' | 'recap' | 'comments'>('create')

  // Load jurnal data for selected date
  useEffect(() => {
    const loadJurnal = async () => {
      if (!session?.user) return
      
      setIsLoading(true)
      try {
        const response = await fetch(`/api/jurnal?tanggal=${selectedDate}`)
        const data = await response.json()
        
        if (data.success && data.data) {
          setJurnal(data.data)
          setFormData({
            kegiatan: data.data.kegiatan || "",
            dokumentasi: data.data.dokumentasi || ""
          })
        } else {
          setJurnal(null)
          setFormData({ kegiatan: "", dokumentasi: "" })
        }
      } catch (error) {
        console.error('Error loading jurnal:', error)
        setJurnal(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadJurnal()
  }, [selectedDate, session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.kegiatan.trim()) {
      toast.error('Kegiatan harus diisi')
      return
    }
    
    setIsLoading(true)
    
    try {
      const method = jurnal ? 'PUT' : 'POST'
      const response = await fetch('/api/jurnal', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tanggal: selectedDate,
          kegiatan: formData.kegiatan,
          dokumentasi: formData.dokumentasi
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(jurnal ? 'Jurnal berhasil diperbarui' : 'Jurnal berhasil disimpan')
        setJurnal(data.data)
        setIsEditing(false)
      } else {
        toast.error(data.message || 'Gagal menyimpan jurnal')
      }
    } catch (error) {
      console.error('Error saving jurnal:', error)
      toast.error('Terjadi kesalahan saat menyimpan jurnal')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      kegiatan: jurnal?.kegiatan || "",
      dokumentasi: jurnal?.dokumentasi || ""
    })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="h-8 w-8 text-blue-600" />
        </motion.div>
      </div>
    )
  }

  if (status === "unauthenticated" || session?.user?.role !== 'STUDENT') {
    return null
  }

  return (
    <StudentMinimalLayout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Submenu untuk Jurnal */}
        <div className="mb-6">
          <div className="flex space-x-4 border-b border-gray-200 overflow-x-auto">
            <button 
              onClick={() => setActiveSubmenu('create')}
              className={`pb-2 px-1 border-b-2 font-medium whitespace-nowrap ${
                activeSubmenu === 'create' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              Buat Jurnal
            </button>
            <button 
              onClick={() => setActiveSubmenu('recap')}
              className={`pb-2 px-1 border-b-2 font-medium whitespace-nowrap ${
                activeSubmenu === 'recap' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              Rekap Jurnal
            </button>
            <button 
              onClick={() => setActiveSubmenu('comments')}
              className={`pb-2 px-1 border-b-2 font-medium whitespace-nowrap ${
                activeSubmenu === 'comments' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
            </button>
          </div>
        </div>

        {activeSubmenu === 'create' && (
          <>
            {/* Date Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="shadow-sm mb-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <CalendarDays className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    Pilih Tanggal
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="date" className="text-sm font-medium mb-2 block">
                        Tanggal:
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="h-12 md:h-10 text-base md:text-sm"
                      />
                    </div>
                    <div className="flex-1 pt-6 md:pt-0">
                      <p className="text-sm md:text-base text-gray-600 font-medium">
                        {format(new Date(selectedDate), 'EEEE, dd MMMM yyyy')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Jurnal Form/Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <FileText className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                      {jurnal ? "Jurnal Hari Ini" : "Buat Jurnal Baru"}
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {jurnal && !isEditing && (
                        <Button 
                          onClick={() => {
                            setIsEditing(true);
                            setFormData({
                              kegiatan: jurnal?.kegiatan || "",
                              dokumentasi: jurnal?.dokumentasi || ""
                            });
                          }}
                          variant="outline" 
                          size="sm" 
                          className="h-10 md:h-9"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                      {jurnal && (
                        <Button 
                          onClick={() => {
                            toast.info("Export functionality coming soon")
                          }}
                          variant="outline" 
                          size="sm" 
                          className="h-10 md:h-9"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <>
                      {jurnal && !isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                              Kegiatan:
                            </Label>
                            <div className="p-4 bg-gray-50 rounded-lg border">
                              <p className="text-sm md:text-base text-gray-900 whitespace-pre-wrap">
                                {jurnal.kegiatan}
                              </p>
                            </div>
                          </div>
                          {jurnal.dokumentasi && (
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                Dokumentasi:
                              </Label>
                              <div className="p-4 bg-gray-50 rounded-lg border">
                                <p className="text-sm md:text-base text-gray-900 whitespace-pre-wrap">
                                  {jurnal.dokumentasi}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="kegiatan" className="text-sm font-medium">
                              Kegiatan <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="kegiatan"
                              placeholder="Deskripsikan kegiatan yang dilakukan hari ini..."
                              value={formData.kegiatan}
                              onChange={(e) => setFormData(prev => ({ ...prev, kegiatan: e.target.value }))}
                              className="min-h-[120px] text-sm md:text-base resize-none"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="dokumentasi" className="text-sm font-medium">
                              Dokumentasi (Opsional)
                            </Label>
                            <Textarea
                              id="dokumentasi"
                              placeholder="Tambahkan dokumentasi atau catatan tambahan..."
                              value={formData.dokumentasi}
                              onChange={(e) => setFormData(prev => ({ ...prev, dokumentasi: e.target.value }))}
                              className="min-h-[80px] text-sm md:text-base resize-none"
                            />
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button 
                              type="submit" 
                              className="flex-1 h-12 md:h-10 text-base md:text-sm font-medium"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Menyimpan...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-2" />
                                  {jurnal ? 'Perbarui Jurnal' : 'Simpan Jurnal'}
                                </>
                              )}
                            </Button>
                            {isEditing && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleCancel}
                                className="flex-1 sm:flex-none h-12 md:h-10 text-base md:text-sm"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Batal
                              </Button>
                            )}
                          </div>
                        </form>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {activeSubmenu === 'recap' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                  Rekap Jurnal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <JurnalList />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeSubmenu === 'comments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                  Komentar Guru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fitur komentar guru akan segera tersedia</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </StudentMinimalLayout>
  )
}