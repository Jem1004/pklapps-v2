"use client"
import { useState, useEffect, useRef } from "react"
import { useSession, signOut } from "../../../node_modules/next-auth/react"
import { useReactToPrint } from 'react-to-print'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { formatDate, formatDateForInput } from "@/lib/utils"
import { CalendarDays, FileText, Edit, Save, X, List, LogOut, Download } from "lucide-react"
import JurnalList from "@/components/JurnalList"
import PrintableJurnal from "@/components/PrintableJurnal"

interface Jurnal {
  id: string
  tanggal: string
  kegiatan: string
  dokumentasi?: string
}

export default function DashboardJurnalPage() {
  const { data: session, status } = useSession()
  
  // Move all useState hooks to the top, before any conditional returns
  const [jurnal, setJurnal] = useState<Jurnal | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(formatDateForInput(new Date()))
  const [formData, setFormData] = useState({
    kegiatan: "",
    dokumentasi: ""
  })
  const [activeTab, setActiveTab] = useState<'today' | 'list'>('today')
  const printRef = useRef<HTMLDivElement>(null)
  const [isPrintReady, setIsPrintReady] = useState(false)
  const todayPrintRef = useRef<HTMLDivElement>(null)

  // Fetch jurnal for selected date
  const fetchJurnal = async (date: string) => {
    try {
      const response = await fetch(`/api/jurnal?date=${date}`)
      const result = await response.json()
      
      if (result.data) {
        setJurnal(result.data)
        setFormData({
          kegiatan: result.data.kegiatan,
          dokumentasi: result.data.dokumentasi || ""
        })
      } else {
        setJurnal(null)
        setFormData({ kegiatan: "", dokumentasi: "" })
      }
    } catch (error) {
      console.error("Error fetching jurnal:", error)
    }
  }

  useEffect(() => {
    if (session?.user && activeTab === 'today') {
      fetchJurnal(selectedDate)
    }
  }, [session, selectedDate, activeTab])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = jurnal ? "/api/jurnal" : "/api/jurnal"
      const method = jurnal ? "PUT" : "POST"
      const payload = jurnal 
        ? { id: jurnal.id, ...formData }
        : { tanggal: selectedDate, ...formData }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok) {
        await fetchJurnal(selectedDate)
        setIsEditing(false)
        alert(result.message)
      } else {
        alert(result.error || "Terjadi kesalahan")
      }
    } catch (error) {
      console.error("Error submitting jurnal:", error)
      alert("Terjadi kesalahan saat menyimpan jurnal")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (jurnal) {
      setFormData({
        kegiatan: jurnal.kegiatan,
        dokumentasi: jurnal.dokumentasi || ""
      })
    }
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' })
  }

  // Print function for single jurnal
  const handlePrintSingle = useReactToPrint({
    contentRef: printRef,
    documentTitle: `jurnal-pkl-${session?.user?.name?.replace(/\s+/g, '-')}-${selectedDate}`,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: Arial, sans-serif;
          padding: 20px;
          margin: 0;
        }
        .print-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .print-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 20px;
        }
        .print-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #1f2937;
        }
        .print-subtitle {
          font-size: 18px;
          margin-bottom: 10px;
          color: #374151;
        }
        .print-date {
          font-size: 14px;
          color: #6b7280;
        }
        .jurnal-content {
          margin-top: 20px;
        }
        .field-label {
          font-weight: bold;
          margin-bottom: 8px;
          color: #374151;
        }
        .field-content {
          margin-bottom: 20px;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background-color: #f9fafb;
          line-height: 1.6;
        }
        .no-jurnal {
          text-align: center;
          color: #6b7280;
          font-style: italic;
          margin-top: 40px;
        }
      }
    `
  })

  // Add print function for today's journal
  const handlePrintToday = useReactToPrint({
    contentRef: todayPrintRef,
    documentTitle: `jurnal-pkl-${session?.user?.name?.replace(/\s+/g, '-')}-${selectedDate}`,
    onBeforePrint: () => {
      return new Promise((resolve) => {
        if (jurnal && isPrintReady) {
          resolve()
        } else {
          setTimeout(resolve, 500)
        }
      })
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `
  })

  useEffect(() => {
    if (jurnal) {
      setTimeout(() => setIsPrintReady(true), 100)
    }
  }, [jurnal])

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Anda belum login. Silakan login terlebih dahulu.</p>
          <Button 
            onClick={() => window.location.href = '/auth/login'}
            className="mt-4"
          >
            Login
          </Button>
        </div>
      </div>
    )
  }

  // Check if user is student
  if (session?.user?.role !== 'STUDENT') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Akses ditolak. Halaman ini hanya untuk siswa.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
        {/* Header with Logout */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard Jurnal PKL</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Selamat datang, {session.user.name}
            </p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-gray-100 p-1 rounded-lg w-full sm:w-fit">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                activeTab === 'today'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Jurnal Hari Ini
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                activeTab === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4 mr-2" />
              Daftar Jurnal
            </button>
          </div>
        </div>

        {activeTab === 'today' ? (
          <>
            {/* Date Selector */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <CalendarDays className="h-5 w-5" />
                  Pilih Tanggal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Label htmlFor="date" className="text-sm font-medium">Tanggal:</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full sm:w-auto"
                  />
                  <span className="text-sm text-muted-foreground">
                    {formatDate(new Date(selectedDate))}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Jurnal Form/Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span className="text-lg sm:text-xl">{jurnal ? "Jurnal Hari Ini" : "Buat Jurnal Baru"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {jurnal && !isEditing && (
                      <Button onClick={handleEdit} variant="outline" size="sm" className="w-full sm:w-auto">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Jurnal
                      </Button>
                    )}
                    {jurnal && (
                      <Button onClick={handlePrintSingle} variant="outline" size="sm" className="w-full sm:w-auto">
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {jurnal && !isEditing ? (
                  // Display existing jurnal
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Kegiatan:</Label>
                      <div className="mt-1 p-3 bg-muted rounded-md">
                        <p className="whitespace-pre-wrap text-sm sm:text-base">{jurnal.kegiatan}</p>
                      </div>
                    </div>
                    {jurnal.dokumentasi && (
                      <div>
                        <Label className="text-sm font-medium">Dokumentasi:</Label>
                        <div className="mt-1 p-3 bg-muted rounded-md">
                          <p className="text-sm sm:text-base break-all">{jurnal.dokumentasi}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Form for create/edit
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="kegiatan">Deskripsi Kegiatan *</Label>
                      <Textarea
                        id="kegiatan"
                        placeholder="Tuliskan kegiatan yang dilakukan hari ini..."
                        value={formData.kegiatan}
                        onChange={(e) => setFormData(prev => ({ ...prev, kegiatan: e.target.value }))}
                        required
                        rows={6}
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dokumentasi">Dokumentasi (Opsional)</Label>
                      <Input
                        id="dokumentasi"
                        type="text"
                        placeholder="Link atau nama file dokumentasi"
                        value={formData.dokumentasi}
                        onChange={(e) => setFormData(prev => ({ ...prev, dokumentasi: e.target.value }))}
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "Menyimpan..." : (jurnal ? "Update Jurnal" : "Simpan Jurnal")}
                      </Button>
                      {isEditing && (
                        <Button type="button" variant="outline" onClick={handleCancelEdit} className="w-full sm:w-auto">
                          <X className="h-4 w-4 mr-2" />
                          Batal
                        </Button>
                      )}
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Hidden print content for single jurnal */}
            <div ref={printRef} className="hidden">
              <div className="print-container">
                <div className="print-header">
                  <h1 className="print-title">Jurnal Praktik Kerja Lapangan</h1>
                  <h2 className="print-subtitle">{session?.user?.name}</h2>
                  <p className="print-date">Tanggal: {formatDate(new Date(selectedDate))}</p>
                  <p className="print-date">Dicetak pada: {formatDate(new Date())}</p>
                </div>
                
                {jurnal ? (
                  <div className="jurnal-content">
                    <div>
                      <div className="field-label">Kegiatan:</div>
                      <div className="field-content">{jurnal.kegiatan}</div>
                    </div>
                    
                    {jurnal.dokumentasi && (
                      <div>
                        <div className="field-label">Dokumentasi:</div>
                        <div className="field-content">{jurnal.dokumentasi}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="no-jurnal">
                    Tidak ada jurnal untuk tanggal {formatDate(new Date(selectedDate))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <JurnalList />
        )}
      </div>
    </div>
)} // End of DashboardJurnalPage component

