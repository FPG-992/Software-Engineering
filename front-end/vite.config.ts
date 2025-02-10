import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Resolve the expected certificate file paths
const sslDir = path.resolve(__dirname, '../back-end/src/SSL')
const keyPath = path.join(sslDir, 'key.pem')
const certPath = path.join(sslDir, 'cert.pem')

// Check if the SSL certificate files exist
let httpsOptions: { key: Buffer; cert: Buffer } | false = false
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  }
} else {
  console.warn('SSL certificate files not found. Running without HTTPS.')
}

export default defineConfig({
  plugins: [react()],
  server: {
    https: httpsOptions,
    port: 3000,
  },
})
