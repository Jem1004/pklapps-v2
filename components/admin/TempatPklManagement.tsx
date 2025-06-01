"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/../components/ui/card"
import { Button } from "@/../components/ui/button"
import { Input } from "@/../components/ui/input"
import { Label } from "@/../components/ui/label"
import { Textarea } from "@/../components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/../components/ui/dialog"
import { Plus, Edit, Trash2, Building, Search, MapPin, Phone, Mail, User } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const tempatPklSchema = z.object({
  nama: z.string().min(2, "Nama tempat PKL minimal 2 karakter"),
  alamat: z.string().min(5, "Alamat minimal 5 karakter"),
  telepon: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  namaContact: z.string().optional(),
})

type TempatPklFormData = z.infer<typeof tempatPklSchema>

interface TempatPkl {
  id: string
  nama: string
  alamat: string
  telepon?: string
  email?: string
  namaContact?: string
  createdAt: string
  _count: {
    students: number
  }
}

export default function TempatPklManagement() {
  const [tempatPkl, setTempatPkl] = useState<TempatPkl[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTempat, setEditingTempat] = useState<TempatPkl | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<TempatPklFormData>({
    resolver: zodResolver(tempatPklSchema)
  })

  const fetchTempatPkl = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/tempat-pkl')
      const result = await response.json()
      
      if (response.ok) {
        // Fix: API returns array directly, not wrapped in data property
        setTempatPkl(result || [])
      } else {
        console.error('Error fetching tempat PKL:', result.error)
      }
    } catch (error) {
      console.error('Error fetching tempat PKL:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTempatPkl()
  }, [])

  const onSubmit = async (data: TempatPklFormData) => {
    try {
      const method = editingTempat ? 'PUT' : 'POST'
      const body = editingTempat ? { ...data, id: editingTempat.id } : data
      
      const response = await fetch('/api/admin/tempat-pkl', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      const result = await response.json()
      
      if (response.ok) {
        await fetchTempatPkl()
        setIsDialogOpen(false)
        setEditingTempat(null)
        reset()
      } else {
        alert(result.error || 'Terjadi kesalahan')
      }
    } catch (error) {
      console.error('Error saving tempat PKL:', error)
      alert('Terjadi kesalahan saat menyimpan tempat PKL')
    }
  }

  const handleEdit = (tempat: TempatPkl) => {
    setEditingTempat(tempat)
    setValue("nama", tempat.nama)
    setValue("alamat", tempat.alamat)
    setValue("telepon", tempat.telepon || "")
    setValue("email", tempat.email || "")
    setValue("namaContact", tempat.namaContact || "")
    setIsDialogOpen(true)
  }

  const handleDelete = async (tempatId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tempat PKL ini?')) return
    
    try {
      const response = await fetch(`/api/admin/tempat-pkl?id=${tempatId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchTempatPkl()
      } else {
        const result = await response.json()
        alert(result.error || 'Terjadi kesalahan saat menghapus tempat PKL')
      }
    } catch (error) {
      console.error('Error deleting tempat PKL:', error)
      alert('Terjadi kesalahan saat menghapus tempat PKL')
    }
  }

  const filteredTempatPkl = tempatPkl.filter(tempat => 
    tempat.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tempat.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Manajemen Tempat PKL
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingTempat(null); reset() }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Tempat PKL
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingTempat ? 'Edit Tempat PKL' : 'Tambah Tempat PKL Baru'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="nama">Nama Tempat PKL</Label>
                    <Input
                      id="nama"
                      {...register("nama")}
                      placeholder="Nama perusahaan/instansi"
                    />
                    {errors.nama && (
                      <p className="text-sm text-red-600">{errors.nama.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="alamat">Alamat</Label>
                    <Textarea
                      id="alamat"
                      {...register("alamat")}
                      placeholder="Alamat lengkap tempat PKL"
                      rows={3}
                    />
                    {errors.alamat && (
                      <p className="text-sm text-red-600">{errors.alamat.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="telepon">Telepon (Opsional)</Label>
                    <Input
                      id="telepon"
                      {...register("telepon")}
                      placeholder="Nomor telepon"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email (Opsional)</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="email@tempat-pkl.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="namaContact">Nama Contact Person (Opsional)</Label>
                    <Input
                      id="namaContact"
                      {...register("namaContact")}
                      placeholder="Nama kontak di tempat PKL"
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingTempat ? 'Update' : 'Simpan'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false)
                        setEditingTempat(null)
                        reset()
                      }}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari berdasarkan nama atau alamat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Tempat PKL List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTempatPkl.map((tempat) => (
                <Card key={tempat.id} className="border-l-4 border-l-green-200">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{tempat.nama}</h3>
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {tempat._count.students} siswa
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{tempat.alamat}</span>
                          </div>
                          {tempat.telepon && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 flex-shrink-0" />
                              <span>{tempat.telepon}</span>
                            </div>
                          )}
                          {tempat.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 flex-shrink-0" />
                              <span>{tempat.email}</span>
                            </div>
                          )}
                          {tempat.namaContact && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 flex-shrink-0" />
                              <span>Contact: {tempat.namaContact}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(tempat)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(tempat.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredTempatPkl.length === 0 && (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada tempat PKL</h3>
                  <p className="text-gray-500">Belum ada tempat PKL yang sesuai dengan pencarian.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}