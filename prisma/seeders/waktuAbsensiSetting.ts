import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedWaktuAbsensiSetting() {
  console.log('🕐 Seeding Global WaktuAbsensiSetting...')

  try {
    // Check if global setting already exists
    const existingSetting = await prisma.waktuAbsensiSetting.findFirst({
      where: { isActive: true }
    })

    if (existingSetting) {
      console.log('✅ Global WaktuAbsensiSetting already exists')
      console.log(`   - Current setting: ${existingSetting.jamMasukMulai.slice(0,5)}-${existingSetting.jamMasukSelesai.slice(0,5)} (Masuk), ${existingSetting.jamPulangMulai.slice(0,5)}-${existingSetting.jamPulangSelesai.slice(0,5)} (Pulang)`)
      return
    }

    // Create default global setting
    const globalSetting = await prisma.waktuAbsensiSetting.create({
      data: {
        jamMasukMulai: '07:00:00',
        jamMasukSelesai: '10:00:00',
        jamPulangMulai: '13:00:00',
        jamPulangSelesai: '17:00:00',
        isActive: true,
        version: 1
      }
    })

    console.log('✅ Created global WaktuAbsensiSetting')
    console.log(`   - Setting: ${globalSetting.jamMasukMulai.slice(0,5)}-${globalSetting.jamMasukSelesai.slice(0,5)} (Masuk), ${globalSetting.jamPulangMulai.slice(0,5)}-${globalSetting.jamPulangSelesai.slice(0,5)} (Pulang)`)

  } catch (error) {
    console.error('❌ Error seeding WaktuAbsensiSetting:', error)
    throw error
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedWaktuAbsensiSetting()
    .then(() => {
      console.log('✅ WaktuAbsensiSetting seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ WaktuAbsensiSetting seeding failed:', error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}