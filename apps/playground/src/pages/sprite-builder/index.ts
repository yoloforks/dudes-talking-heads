import { createApp } from 'vue'

import { router } from './router.js'
import App from './sprite-builder.vue'

import './index.css'

createApp(App).use(router).mount('#app')

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    location.reload()
  })
}
