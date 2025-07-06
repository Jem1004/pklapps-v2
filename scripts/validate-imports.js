#!/usr/bin/env node

/**
 * Script untuk validasi import path yang benar
 * Mencegah penggunaan import path yang salah seperti:
 * - ../node_modules/package
 * - ./node_modules/package
 * - @/src/generated/prisma
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Warna untuk output console
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

// Pola import yang tidak diizinkan
const forbiddenPatterns = [
  {
    pattern: /from ["']\.\.?\/node_modules\//g,
    message: 'Import dari node_modules dengan relative path tidak diizinkan',
    suggestion: 'Gunakan import langsung dari package name'
  },
  {
    pattern: /from ["']@\/src\/generated\/prisma["']/g,
    message: 'Import dari @/src/generated/prisma tidak diizinkan',
    suggestion: 'Gunakan import { Type } from "@prisma/client"'
  },
  {
    pattern: /import.*from ["']\.\.?\/node_modules\//g,
    message: 'Import statement dengan relative path ke node_modules',
    suggestion: 'Gunakan package name langsung'
  }
]

// Pola import yang direkomendasikan
const recommendedPatterns = [
  {
    wrong: 'relative path to node_modules',
    correct: 'direct package import'
  },
  {
    wrong: 'node_modules/@prisma/client',
    correct: '@prisma/client'
  },
  {
    wrong: '@/src/generated/prisma',
    correct: '@prisma/client'
  }
]

let totalErrors = 0
let totalFiles = 0
let checkedFiles = 0

function validateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    let fileErrors = 0
    
    lines.forEach((line, lineNumber) => {
      forbiddenPatterns.forEach(({ pattern, message, suggestion }) => {
        const matches = line.match(pattern)
        if (matches) {
          if (fileErrors === 0) {
            console.log(`\n${colors.red}❌ ${filePath}${colors.reset}`)
          }
          
          console.log(`   ${colors.yellow}Line ${lineNumber + 1}:${colors.reset} ${message}`)
          console.log(`   ${colors.blue}Found:${colors.reset} ${line.trim()}`)
          console.log(`   ${colors.green}Suggestion:${colors.reset} ${suggestion}`)
          
          fileErrors++
          totalErrors++
        }
      })
    })
    
    return fileErrors
  } catch (error) {
    console.error(`${colors.red}Error reading file ${filePath}:${colors.reset}`, error.message)
    return 0
  }
}

function showRecommendations() {
  console.log(`\n${colors.blue}📚 Rekomendasi Import Pattern:${colors.reset}`)
  recommendedPatterns.forEach(({ wrong, correct }) => {
    console.log(`${colors.red}❌ ${wrong}${colors.reset}`)
    console.log(`${colors.green}✅ ${correct}${colors.reset}\n`)
  })
}

function validateImports() {
  console.log(`${colors.blue}🔍 Memvalidasi import paths...${colors.reset}\n`)
  
  // Pattern untuk file TypeScript dan JavaScript
  const filePatterns = [
    '**/*.ts',
    '**/*.tsx',
    '**/*.js',
    '**/*.jsx'
  ]
  
  const ignorePatterns = [
    'node_modules/**',
    '.next/**',
    'dist/**',
    'build/**',
    '.git/**',
    'coverage/**'
  ]
  
  filePatterns.forEach(pattern => {
    const files = glob.sync(pattern, { ignore: ignorePatterns })
    totalFiles += files.length
    
    files.forEach(file => {
      checkedFiles++
      const errors = validateFile(file)
      
      if (errors === 0) {
        // File bersih, tidak perlu output
      }
    })
  })
  
  // Summary
  console.log(`\n${colors.blue}📊 Hasil Validasi:${colors.reset}`)
  console.log(`Files checked: ${checkedFiles}`)
  console.log(`Total errors: ${totalErrors}`)
  
  if (totalErrors === 0) {
    console.log(`${colors.green}✅ Semua import paths sudah benar!${colors.reset}`)
  } else {
    console.log(`${colors.red}❌ Ditemukan ${totalErrors} error dalam import paths${colors.reset}`)
    showRecommendations()
    
    console.log(`\n${colors.yellow}💡 Tips:${colors.reset}`)
    console.log('1. Gunakan package name langsung untuk dependencies')
    console.log('2. Gunakan @prisma/client untuk Prisma types')
    console.log('3. Gunakan alias @ untuk internal modules')
    console.log('4. Hindari relative path ke node_modules')
    
    process.exit(1)
  }
}

// Jalankan validasi
if (require.main === module) {
  validateImports()
}

module.exports = { validateImports, forbiddenPatterns }