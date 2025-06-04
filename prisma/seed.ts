import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Hash password untuk semua user
  const hashedPassword = await bcrypt.hash('password123', 12)

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@smkmutu.sch.id',
      name: 'Administrator',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create Teacher Users
  const teacher1 = await prisma.user.upsert({
    where: { username: 'teacher1' },
    update: {},
    create: {
      username: 'teacher1',
      email: 'teacher1@smkmutu.sch.id',
      name: 'Budi Santoso',
      passwordHash: hashedPassword,
      role: 'TEACHER',
    },
  })

  const teacher2 = await prisma.user.upsert({
    where: { username: 'teacher2' },
    update: {},
    create: {
      username: 'teacher2',
      email: 'teacher2@smkmutu.sch.id',
      name: 'Sari Dewi',
      passwordHash: hashedPassword,
      role: 'TEACHER',
    },
  })

  // Create Teacher records
  const teacherRecord1 = await prisma.teacher.upsert({
    where: { userId: teacher1.id },
    update: {},
    create: {
      userId: teacher1.id,
      nip: '198501012010011001',
    },
  })

  const teacherRecord2 = await prisma.teacher.upsert({
    where: { userId: teacher2.id },
    update: {},
    create: {
      userId: teacher2.id,
      nip: '198502022010012002',
    },
  })

  // Create Tempat PKL - Fixed to match current schema
  const tempatPkl1 = await prisma.tempatPkl.upsert({
    where: { id: 'tempat1' },
    update: {},
    create: {
      id: 'tempat1',
      nama: 'PT. Teknologi Maju',
      alamat: 'Jl. Sudirman No. 123, Jakarta',
      // Removed telepon and namaContact as they don't exist in current schema
      // pinAbsensi will be auto-generated with default cuid()
      // isActive defaults to true
    },
  })

  const tempatPkl2 = await prisma.tempatPkl.upsert({
    where: { id: 'tempat2' },
    update: {},
    create: {
      id: 'tempat2',
      nama: 'CV. Digital Kreatif',
      alamat: 'Jl. Gatot Subroto No. 456, Bandung',
      // Removed telepon and namaContact as they don't exist in current schema
    },
  })

  // ... existing code ...
  // Create Student Users
  const student1 = await prisma.user.upsert({
    where: { username: 'student1' },
    update: {},
    create: {
      username: 'student1',
      email: 'student1@smkmutu.sch.id',
      name: 'Andi Pratama',
      passwordHash: hashedPassword,
      role: 'STUDENT',
    },
  })

  const student2 = await prisma.user.upsert({
    where: { username: 'student2' },
    update: {},
    create: {
      username: 'student2',
      email: 'student2@smkmutu.sch.id',
      name: 'Budi Setiawan',
      passwordHash: hashedPassword,
      role: 'STUDENT',
    },
  })

  const student3 = await prisma.user.upsert({
    where: { username: 'student3' },
    update: {},
    create: {
      username: 'student3',
      email: 'student3@smkmutu.sch.id',
      name: 'Citra Maharani',
      passwordHash: hashedPassword,
      role: 'STUDENT',
    },
  })

  // Create Student records dengan mapping
  const studentRecord1 = await prisma.student.upsert({
    where: { userId: student1.id },
    update: {},
    create: {
      userId: student1.id,
      nisn: '2024001001',
      kelas: 'XII RPL 1',
      jurusan: 'Rekayasa Perangkat Lunak',
      tempatPklId: tempatPkl1.id,
      teacherId: teacherRecord1.id, // Mapping ke guru pembimbing
    },
  })

  const studentRecord2 = await prisma.student.upsert({
    where: { userId: student2.id },
    update: {},
    create: {
      userId: student2.id,
      nisn: '2024001002',
      kelas: 'XII RPL 1',
      jurusan: 'Rekayasa Perangkat Lunak',
      tempatPklId: tempatPkl2.id,
      teacherId: teacherRecord2.id, // Mapping ke guru pembimbing
    },
  })

  const studentRecord3 = await prisma.student.upsert({
    where: { userId: student3.id },
    update: {},
    create: {
      userId: student3.id,
      nisn: '2024001003',
      kelas: 'XII RPL 2',
      jurusan: 'Rekayasa Perangkat Lunak',
      // Belum dimapping (untuk testing)
    },
  })

  // Create sample journal entries
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  await prisma.jurnal.upsert({
    where: {
      studentId_tanggal: {
        studentId: studentRecord1.id,
        tanggal: today
      }
    },
    update: {},
    create: {
      studentId: studentRecord1.id,
      tanggal: today,
      kegiatan: 'Mempelajari framework React dan membuat komponen dasar untuk aplikasi web.',
      dokumentasi: null,
    },
  })

  await prisma.jurnal.upsert({
    where: {
      studentId_tanggal: {
        studentId: studentRecord1.id,
        tanggal: yesterday
      }
    },
    update: {},
    create: {
      studentId: studentRecord1.id,
      tanggal: yesterday,
      kegiatan: 'Mengikuti briefing proyek dan setup environment development.',
      dokumentasi: null,
    },
  })

  await prisma.jurnal.upsert({
    where: {
      studentId_tanggal: {
        studentId: studentRecord2.id,
        tanggal: today
      }
    },
    update: {},
    create: {
      studentId: studentRecord2.id,
      tanggal: today,
      kegiatan: 'Belajar database design dan implementasi dengan PostgreSQL.',
      dokumentasi: null,
    },
  })

  console.log('Seed data created successfully!')
  console.log('Login credentials:')
  console.log('Admin - username: admin, password: password123')
  console.log('Teacher 1 - username: teacher1, password: password123')
  console.log('Teacher 2 - username: teacher2, password: password123')
  console.log('Student 1 - username: student1, password: password123 (mapped to teacher1)')
  console.log('Student 2 - username: student2, password: password123 (mapped to teacher2)')
  console.log('Student 3 - username: student3, password: password123 (not mapped yet)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })