import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, AlertTriangle } from "lucide-react"
import { AbsensiData } from "../actions"
import { TipeAbsensi } from "@prisma/client"

interface AbsensiCardProps {
  absensi: AbsensiData
}

export default function AbsensiCard({ absensi }: AbsensiCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date: Date | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (tipe: TipeAbsensi) => {
    if (tipe === TipeAbsensi.MASUK) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          MASUK
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          PULANG
        </Badge>
      )
    }
  }

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">
                {formatDate(absensi.tanggal)}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {absensi.tempatPkl.nama}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {getStatusBadge(absensi.tipe)}
              {absensi.diLuarWaktu && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Di luar waktu
                </Badge>
              )}
            </div>
          </div>

          {/* Waktu */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Jam Masuk</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatTime(absensi.waktuMasuk)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Jam Pulang</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatTime(absensi.waktuPulang)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}