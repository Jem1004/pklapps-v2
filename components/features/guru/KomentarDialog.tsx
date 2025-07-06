"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDate } from "@/lib/utils"
import { Save, X } from "lucide-react"

interface JurnalComment {
  id: string
  comment: string
  createdAt: string
  teacher: {
    user: {
      name: string
    }
  }
}

interface JurnalData {
  id: string
  tanggal: string
  kegiatan: string
  dokumentasi?: string
  student: {
    user: {
      name: string
    }
    nisn: string
    kelas: string
    jurusan: string
  }
  comments: JurnalComment[]
}

interface KomentarDialogProps {
  jurnal: JurnalData
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function KomentarDialog({ jurnal, isOpen, onClose, onSuccess }: KomentarDialogProps) {
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const hasExistingComment = jurnal.comments.length > 0
  const existingComment = hasExistingComment ? jurnal.comments[jurnal.comments.length - 1] : null

  useEffect(() => {
    if (isOpen) {
      setComment(existingComment?.comment || "")
    }
  }, [isOpen, existingComment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/guru/komentar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jurnalId: jurnal.id,
          comment: comment.trim(),
          commentId: existingComment?.id
        }),
      })

      const result = await response.json()

      if (response.ok) {
        onSuccess()
        onClose()
        setComment("")
      } else {
        alert(result.error || 'Terjadi kesalahan')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Terjadi kesalahan saat menyimpan komentar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setComment("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {hasExistingComment ? 'Edit Komentar' : 'Beri Komentar'}
          </DialogTitle>
          <DialogDescription>
            Jurnal {jurnal.student.user.name} - {formatDate(new Date(jurnal.tanggal))}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Journal Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Kegiatan Siswa:</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
              {jurnal.kegiatan}
            </p>
            {jurnal.dokumentasi && (
              <div className="mt-2">
                <span className="text-sm font-medium">Dokumentasi: </span>
                <a 
                  href={jurnal.dokumentasi} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm break-all"
                >
                  {jurnal.dokumentasi}
                </a>
              </div>
            )}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="comment">Komentar *</Label>
              <Textarea
                id="comment"
                placeholder="Berikan komentar atau feedback untuk jurnal siswa..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={6}
                className="mt-1"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                <X className="h-4 w-4 mr-2" />
                Batal
              </Button>
              <Button type="submit" disabled={isLoading || !comment.trim()}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Menyimpan...' : (hasExistingComment ? 'Update Komentar' : 'Simpan Komentar')}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}