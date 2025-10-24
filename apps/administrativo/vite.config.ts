import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import Unfonts from 'unplugin-fonts/vite'
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    plugins: [
      tailwindcss(),
      react(),
      Unfonts({
        google: {
          families: [{ name: 'Open Sans', styles: 'wght@300;400;500;600;700;800' }],
        },
      }),
    ],
  }
})
