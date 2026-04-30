import sharp from 'sharp'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const svg   = readFileSync(join(__dir, '../src/assets/img/icon.svg'))
const out   = join(__dir, '../public')

const icons = [
  { name: 'pwa-64x64.png',              size: 64  },
  { name: 'pwa-192x192.png',            size: 192 },
  { name: 'pwa-512x512.png',            size: 512 },
  { name: 'maskable-icon-512x512.png',  size: 512 },
  { name: 'apple-touch-icon-180x180.png', size: 180 },
]

for (const { name, size } of icons) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(join(out, name))
  console.log(`✓ ${name}`)
}

// favicon.ico (48×48 encapsulé)
await sharp(svg)
  .resize(48, 48)
  .png()
  .toFile(join(out, 'favicon-48.png'))

// Réencoder en .ico via PNG renommé (navigateurs acceptent PNG en .ico)
import { copyFileSync } from 'fs'
copyFileSync(join(out, 'favicon-48.png'), join(out, 'favicon.ico'))
import { unlinkSync } from 'fs'
unlinkSync(join(out, 'favicon-48.png'))
console.log('✓ favicon.ico')
