import { createApp } from 'vue'

import App from './App.vue'

import './style.css'

createApp(App).mount('#app')

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    location.reload()
  })
}
