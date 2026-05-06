import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  base: "/", 
  // WHY:
  // Vercel par assets (/assets/index.js) sahi path se load ho
  // warna HTML return hota hai instead of JS → jo ab ho raha hai
})