"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Download, FileText, CheckCircle, XCircle } from "lucide-react"
import Papa from 'papaparse'

interface ImportResult {
  success: number
  failed: number
  errors: Array<{
    row: number
    username: string
    error: string
  }>
}

export default function ImportUsers() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  const downloadTemplate = () => {
    const csvContent = "username,nama_lengkap,email,password,role,nisn,kelas,jurusan\nstudent1,John Doe,john@example.com,,STUDENT,1234567890,XII,RPL\nteacher1,Jane Smith,jane@example.com,mypassword123,TEACHER,,,\nstudent2,Bob Johnson,,defaultpass,STUDENT,0987654321,XI,TKJ"
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template_import_users.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setImportResult(null)
    } else {
      alert('Silakan pilih file CSV yang valid')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    
    try {
      // Parse CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const rawData = results.data as Array<{
            username: string
            nama_lengkap: string
            email: string
            password: string
            role: string
            nisn: string
            kelas: string
            jurusan: string
          }>

          // Filter out empty or invalid rows
          const validData = rawData.filter(row => 
            row.username && row.username.trim() !== '' &&
            row.nama_lengkap && row.nama_lengkap.trim() !== '' &&
            row.role && row.role.trim() !== ''
          )

          if (validData.length === 0) {
            alert('Tidak ada data valid yang ditemukan dalam file CSV')
            setIsUploading(false)
            return
          }

          // Send to API
          const response = await fetch('/api/admin/import-users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ users: validData })
          })

          const result = await response.json()
          
          if (response.ok) {
            setImportResult(result)
          } else {
            alert(result.error || 'Terjadi kesalahan saat import')
            console.error('Import error details:', result.details)
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error)
          alert('Error parsing CSV file')
          setIsUploading(false)
        }
      })
    } catch (error) {
      console.error('Upload error:', error)
      alert('Terjadi kesalahan saat upload')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Users dari CSV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Download Template */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Template CSV</h3>
            <p className="text-sm text-blue-700 mb-3">
              Download template CSV untuk memastikan format yang benar:
            </p>
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template CSV
            </Button>
          </div>

          {/* Format Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Format CSV:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>username:</strong> Username untuk login (wajib)</li>
              <li>• <strong>nama_lengkap:</strong> Nama lengkap (wajib)</li>
              <li>• <strong>email:</strong> Email pengguna (opsional, auto-generate jika kosong)</li>
              <li>• <strong>password:</strong> Password (kosong = auto generate "pkl2025!")</li>
              <li>• <strong>role:</strong> STUDENT atau TEACHER (wajib)</li>
              <li>• <strong>nisn:</strong> NISN untuk siswa (wajib untuk STUDENT)</li>
              <li>• <strong>kelas:</strong> Kelas siswa (opsional untuk STUDENT)</li>
              <li>• <strong>jurusan:</strong> Jurusan siswa (opsional untuk STUDENT)</li>
            </ul>
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="csvFile">Pilih File CSV</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mt-2"
            />
          </div>

          {file && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>File terpilih: {file.name}</span>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? 'Mengupload...' : 'Upload dan Import'}
          </Button>

          {/* Import Results */}
          {importResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-green-600">{importResult.success}</p>
                        <p className="text-sm text-gray-600">Berhasil diimport</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
                        <p className="text-sm text-gray-600">Gagal diimport</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {importResult.errors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Error Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="text-sm p-2 bg-red-50 rounded border-l-4 border-red-400">
                          <p><strong>Baris {error.row}:</strong> {error.username}</p>
                          <p className="text-red-700">{error.error}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}