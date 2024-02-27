import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [vue(), dts()],
  build: {
    sourcemap: true,
    lib: {
      entry: './src/index.ts',
      name: 'dudes',
      fileName: 'dudes'
    },
    rollupOptions: {
      external: [
        'vue',
        'gsap'
      ],
      output: {
        exports: 'default',
        globals: {
          vue: 'Vue',
          gsap: 'gsap'
        }
      }
    }
  }
})
