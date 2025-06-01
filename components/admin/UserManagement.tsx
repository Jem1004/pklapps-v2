"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/../components/ui/card"
import { Button } from "@/../components/ui/button"
import { Input } from "@/../components/ui/input"
import { Label } from "@/../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/../components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/../components/ui/dialog"
import { Badge } from "@/../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/../components/ui/table"
import { Plus, Edit, Trash2, User, Search, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const userSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
  role: z.enum(["STUDENT", "TEACHER"], { required_error: "Role harus dipilih" }),
  nisn: z.string().optional(),
  kelas: z.string().optional(),
  jurusan: z.string().optional(),
  nip: z.string().optional(),
})

type UserFormData = z.infer<typeof userSchema>

interface User {
  id: string
  username: string
  name: string
  email?: string
  role: "STUDENT" | "TEACHER" | "ADMIN"
  createdAt: string
  student?: {
    nisn: string
    kelas: string
    jurusan: string
  }
  teacher?: {
    nip: string
  }
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("ALL")
  const [viewMode, setViewMode] = useState<"table" | "card">("card")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<UserFormData>({
    resolver: zodResolver(userSchema)
  })

  const watchedRole = watch("role")

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/users')
      const result = await response.json()
      
      if (response.ok) {
        setUsers(result.data || [])
      } else {
        console.error('Error fetching users:', result.error)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const onSubmit = async (data: UserFormData) => {
    try {
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users'
      const method = editingUser ? 'PUT' : 'POST'
      
      // Don't send password if editing and password is empty
      const submitData = { ...data }
      if (editingUser && !data.password) {
        delete submitData.password
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (response.ok) {
        await fetchUsers()
        setIsDialogOpen(false)
        reset()
        setEditingUser(null)
      } else {
        console.error('Error saving user:', result.error)
        alert(result.error || 'Terjadi kesalahan')
      }
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Terjadi kesalahan saat menyimpan data')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setValue("username", user.username)
    setValue("name", user.name)
    setValue("email", user.email || "")
    setValue("role", user.role === "ADMIN" ? "TEACHER" : user.role)
    setValue("password", "") // Don't pre-fill password
    
    if (user.student) {
      setValue("nisn", user.student.nisn)
      setValue("kelas", user.student.kelas)
      setValue("jurusan", user.student.jurusan)
    }
    
    if (user.teacher) {
      setValue("nip", user.teacher.nip)
    }
    
    setIsDialogOpen(true)
  }

  const handleDelete = async (userId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchUsers()
        } else {
          const result = await response.json()
          console.error('Error deleting user:', result.error)
          alert(result.error || 'Terjadi kesalahan saat menghapus user')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Terjadi kesalahan saat menghapus user')
      }
    }
  }

  const handleAddNew = () => {
    setEditingUser(null)
    reset()
    setIsDialogOpen(true)
  }

  const handleViewDetail = (user: User) => {
    setSelectedUser(user)
    setIsDetailDialogOpen(true)
  }

  // Filter and search logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.student?.nisn && user.student.nisn.includes(searchTerm)) ||
      (user.teacher?.nip && user.teacher.nip.includes(searchTerm))
    
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN": return "bg-red-100 text-red-800"
      case "TEACHER": return "bg-blue-100 text-blue-800"
      case "STUDENT": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Manajemen User
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari berdasarkan nama, username, NISN, atau NIP..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={(value) => {
              setRoleFilter(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Role</SelectItem>
                <SelectItem value="STUDENT">Siswa</SelectItem>
                <SelectItem value="TEACHER">Guru</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                Tabel
              </Button>
              <Button
                variant={viewMode === "card" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("card")}
              >
                Kartu
              </Button>
            </div>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah User
            </Button>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Menampilkan {paginatedUsers.length} dari {filteredUsers.length} user
              {roleFilter !== "ALL" && ` (${roleFilter.toLowerCase()})`}
            </p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Table View */}
              {viewMode === "table" && (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Detail</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {user.role === "STUDENT" ? "Siswa" : user.role === "TEACHER" ? "Guru" : "Admin"}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.email || "-"}</TableCell>
                          <TableCell>
                            {user.student && (
                              <div className="text-sm">
                                <div>NISN: {user.student.nisn}</div>
                                <div>Kelas: {user.student.kelas}</div>
                                <div>Jurusan: {user.student.jurusan}</div>
                              </div>
                            )}
                            {user.teacher && (
                              <div className="text-sm">
                                <div>NIP: {user.teacher.nip}</div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetail(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Card View */}
              {viewMode === "card" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedUsers.map((user) => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{user.name}</h3>
                            <p className="text-sm text-gray-600">@{user.username}</p>
                          </div>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role === "STUDENT" ? "Siswa" : user.role === "TEACHER" ? "Guru" : "Admin"}
                          </Badge>
                        </div>
                        
                        {user.email && (
                          <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                        )}
                        
                        {user.student && (
                          <div className="text-sm space-y-1 mb-3">
                            <p><span className="font-medium">NISN:</span> {user.student.nisn}</p>
                            <p><span className="font-medium">Kelas:</span> {user.student.kelas}</p>
                            <p><span className="font-medium">Jurusan:</span> {user.student.jurusan}</p>
                          </div>
                        )}
                        
                        {user.teacher && (
                          <div className="text-sm mb-3">
                            <p><span className="font-medium">NIP:</span> {user.teacher.nip}</p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(user)}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Detail
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm || roleFilter !== "ALL" 
                      ? "Tidak ada user yang sesuai dengan filter"
                      : "Belum ada user yang terdaftar"
                    }
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Tambah User Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email (Opsional)</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">
                Password {editingUser && "(Kosongkan jika tidak ingin mengubah)"}
              </Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value) => setValue("role", value as "STUDENT" | "TEACHER")}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Siswa</SelectItem>
                  <SelectItem value="TEACHER">Guru</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            {watchedRole === "STUDENT" && (
              <>
                <div>
                  <Label htmlFor="nisn">NISN</Label>
                  <Input id="nisn" {...register("nisn")} />
                </div>
                <div>
                  <Label htmlFor="kelas">Kelas</Label>
                  <Input id="kelas" {...register("kelas")} placeholder="Contoh: XII RPL 1" />
                </div>
                <div>
                  <Label htmlFor="jurusan">Jurusan</Label>
                  <Input id="jurusan" {...register("jurusan")} placeholder="Contoh: Rekayasa Perangkat Lunak" />
                </div>
              </>
            )}

            {watchedRole === "TEACHER" && (
              <div>
                <Label htmlFor="nip">NIP</Label>
                <Input id="nip" {...register("nip")} />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingUser ? "Update" : "Tambah"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  reset()
                  setEditingUser(null)
                }}
              >
                Batal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Nama Lengkap</Label>
                  <p className="text-sm">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Username</Label>
                  <p className="text-sm">{selectedUser.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-sm">{selectedUser.email || "-"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Role</Label>
                  <Badge className={getRoleBadgeColor(selectedUser.role)}>
                    {selectedUser.role === "STUDENT" ? "Siswa" : selectedUser.role === "TEACHER" ? "Guru" : "Admin"}
                  </Badge>
                </div>
              </div>
              
              {selectedUser.student && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Informasi Siswa</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">NISN</Label>
                      <p className="text-sm">{selectedUser.student.nisn}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Kelas</Label>
                      <p className="text-sm">{selectedUser.student.kelas}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-500">Jurusan</Label>
                      <p className="text-sm">{selectedUser.student.jurusan}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedUser.teacher && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Informasi Guru</h4>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">NIP</Label>
                    <p className="text-sm">{selectedUser.teacher.nip}</p>
                  </div>
                </div>
              )}
              
              <div className="border-t pt-4">
                <Label className="text-sm font-medium text-gray-500">Tanggal Dibuat</Label>
                <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}