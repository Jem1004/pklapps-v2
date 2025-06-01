"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/../components/ui/dialog"
import { Button } from "@/../components/ui/button"
import { Input } from "@/../components/ui/input"
import { Textarea } from "@/../components/ui/textarea"
import { Label } from "@/../components/ui/label"
import { Save, X } from "lucide-react"

interface JurnalData {
  id: string
  tanggal: string
  kegiatan: string
  dokumentasi?: string
}

interface EditJurnalDialogProps {
  jurnal: JurnalData
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EditJurnalDialog({ jurnal, isOpen, onClose, onSuccess }: EditJurnalDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    kegiatan: jurnal.kegiatan,
    dokumentasi: jurnal.dokumentasi || ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/jurnal', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: jurnal.id,
          ...formData
        })
      })

      const result = await response.json()

      if (response.ok) {
        onSuccess()
        onClose()
        alert(result.message)
      } else {
        alert(result.error || 'Terjadi kesalahan')
      }
    } catch (error) {
      console.error('Error updating jurnal:', error)
      alert('Terjadi kesalahan saat memperbarui jurnal')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      kegiatan: jurnal.kegiatan,
      dokumentasi: jurnal.dokumentasi || ""
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Jurnal</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tanggal">Tanggal</Label>
            <Input
              id="tanggal"
              type="date"
              value={jurnal.tanggal}
              disabled
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="kegiatan">Deskripsi Kegiatan *</Label>
            <Textarea
              id="kegiatan"
              placeholder="Tuliskan kegiatan yang dilakukan hari ini..."
              value={formData.kegiatan}
              onChange={(e) => setFormData(prev => ({ ...prev, kegiatan: e.target.value }))}
              required
              rows={6}
              className="mt-1"
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
              className="mt-1"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}