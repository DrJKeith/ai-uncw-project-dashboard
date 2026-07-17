import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
const customDomain = process.env.PAGES_CUSTOM_DOMAIN === 'true'
const base = process.env.GITHUB_ACTIONS === 'true' && repository && !customDomain ? `/${repository}/` : '/'

export default defineConfig({
  plugins: [react()],
  base,
})
