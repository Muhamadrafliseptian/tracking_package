import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/css/main.css'
import './components/core_style/style'
import './components/core_style/style.css'
import 'leaflet/dist/leaflet'
import store from './stores'
import App from './App.vue'
import router from './router'
const app = createApp(App)

app.use(createPinia())
app.use(store)
app.use(router)

app.mount('#app')
