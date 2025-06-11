import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersistedstate)

app.use(router)
app.use(pinia)
app.use(vuetify)
app.use(Toast)

app.mount('#app')
