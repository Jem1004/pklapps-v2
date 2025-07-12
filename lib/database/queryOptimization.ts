import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

/**
 * Optimized query helpers for better database performance
 * These functions implement best practices for Prisma queries
 */

// Optimized student queries
export const studentQueries = {
  // Get students with minimal data for lists
  async getStudentsMinimal() {
    return prisma.student.findMany({
      select: {
        id: true,
        nisn: true,
        kelas: true,
        jurusan: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true
          }
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })
  },

  // Get students by class with pagination
  async getStudentsByClass(kelas: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit
    
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where: { kelas },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true
            }
          },
          tempatPkl: {
            select: {
              id: true,
              nama: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          user: {
            name: 'asc'
          }
        }
      }),
      prisma.student.count({ where: { kelas } })
    ])

    return {
      students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  },

  // Get student with full details
  async getStudentById(id: string) {
    return prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true
          }
        },
        tempatPkl: true,
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true
              }
            }
          }
        }
      }
    })
  },

  // Get students with mapping details for admin student mapping page
  async getStudentsWithMapping() {
    return prisma.student.findMany({
      select: {
        id: true,
        nisn: true,
        kelas: true,
        jurusan: true,
        teacherId: true,
        tempatPklId: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true
          }
        },
        teacher: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true
              }
            }
          }
        },
        tempatPkl: {
          select: {
            id: true,
            nama: true,
            alamat: true
          }
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })
  },

  // Get unmapped students for bulk mapping
  async getUnmappedStudents() {
    return prisma.student.findMany({
      where: {
        tempatPklId: null
      },
      select: {
        id: true,
        nisn: true,
        kelas: true,
        jurusan: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })
  }
}

// Optimized jurnal queries
export const jurnalQueries = {
  // Get recent jurnals with pagination
  async getRecentJurnals(page = 1, limit = 10) {
    const skip = (page - 1) * limit
    
    const [jurnals, total] = await Promise.all([
      prisma.jurnal.findMany({
        include: {
          student: {
            select: {
              id: true,
              nisn: true,
              kelas: true,
              user: {
                select: {
                  name: true
                }
              }
            }
          },
          _count: {
            select: {
              comments: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.jurnal.count()
    ])

    return {
      jurnals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  },

  // Get jurnals by date range
  async getJurnalsByDateRange(startDate: Date, endDate: Date, studentId?: string) {
    const where: Prisma.JurnalWhereInput = {
      tanggal: {
        gte: startDate,
        lte: endDate
      }
    }

    if (studentId) {
      where.studentId = studentId
    }

    return prisma.jurnal.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            nisn: true,
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        tanggal: 'desc'
      }
    })
  },

  // Get jurnal statistics
  async getJurnalStats(studentId?: string) {
    const where: Prisma.JurnalWhereInput = studentId ? { studentId } : {}
    
    const [total, thisMonth, thisWeek] = await Promise.all([
      prisma.jurnal.count({ where }),
      prisma.jurnal.count({
        where: {
          ...where,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.jurnal.count({
        where: {
          ...where,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ])

    return { total, thisMonth, thisWeek }
  }
}

// Optimized absensi queries
export const absensiQueries = {
  // Get absensi by date range with pagination
  async getAbsensiByDateRange(
    startDate: Date, 
    endDate: Date, 
    studentId?: string,
    page = 1,
    limit = 10
  ) {
    const skip = (page - 1) * limit
    const where: Prisma.AbsensiWhereInput = {
      tanggal: {
        gte: startDate,
        lte: endDate
      }
    }

    if (studentId) {
      where.studentId = studentId
    }

    const [absensis, total] = await Promise.all([
      prisma.absensi.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              nisn: true,
              user: {
                select: {
                  name: true
                }
              }
            }
          },
          tempatPkl: {
            select: {
              nama: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          tanggal: 'desc'
        }
      }),
      prisma.absensi.count({ where })
    ])

    return {
      absensis,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  },

  // Get absensi statistics
  async getAbsensiStats(studentId?: string) {
    const where: Prisma.AbsensiWhereInput = studentId ? { studentId } : {}
    
    const [total, thisMonth, today] = await Promise.all([
      prisma.absensi.count({ where }),
      prisma.absensi.count({
        where: {
          ...where,
          tanggal: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.absensi.count({
        where: {
          ...where,
          tanggal: new Date()
        }
      })
    ])

    return { total, thisMonth, today }
  }
}

// Optimized dashboard queries
export const dashboardQueries = {
  // Get dashboard statistics with single optimized query
  async getDashboardStats() {
    const [userStats, studentStats, jurnalStats, absensiStats] = await Promise.all([
      // User statistics
      prisma.user.groupBy({
        by: ['role'],
        _count: {
          id: true
        }
      }),
      
      // Student statistics
      prisma.student.groupBy({
        by: ['kelas'],
        _count: {
          id: true
        }
      }),
      
      // Jurnal statistics
      Promise.all([
        prisma.jurnal.count(),
        prisma.jurnal.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }),
        prisma.jurnal.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        })
      ]),
      
      // Absensi statistics
      Promise.all([
        prisma.absensi.count(),
        prisma.absensi.count({
          where: {
            tanggal: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }),
        prisma.absensi.count({
          where: {
            tanggal: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        })
      ])
    ])

    const [totalJurnals, todayJurnals, monthlyJurnals] = jurnalStats
    const [totalAbsensis, todayAbsensis, monthlyAbsensis] = absensiStats

    return {
      users: userStats.reduce((acc, stat) => {
        acc[stat.role.toLowerCase()] = stat._count.id
        return acc
      }, {} as Record<string, number>),
      students: {
        total: studentStats.reduce((sum, stat) => sum + stat._count.id, 0),
        byClass: studentStats.reduce((acc, stat) => {
          acc[stat.kelas] = stat._count.id
          return acc
        }, {} as Record<string, number>)
      },
      jurnals: {
        total: totalJurnals,
        today: todayJurnals,
        thisMonth: monthlyJurnals
      },
      absensis: {
        total: totalAbsensis,
        today: todayAbsensis,
        thisMonth: monthlyAbsensis
      }
    }
  }
}

// Query performance monitoring
export const queryPerformance = {
  // Wrapper for monitoring query execution time
  async withTiming<T>(queryName: string, queryFn: () => Promise<T>): Promise<T> {
    const start = Date.now()
    try {
      const result = await queryFn()
      const duration = Date.now() - start
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Query ${queryName} took ${duration}ms`)
      }
      
      return result
    } catch (error) {
      const duration = Date.now() - start
      console.error(`Query ${queryName} failed after ${duration}ms:`, error)
      throw error
    }
  }
}