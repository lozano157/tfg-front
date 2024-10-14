import { createApp } from 'vue'
import { createPinia } from 'pinia'
// @ts-ignore
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import es from './locales/es.json'
import en from './locales/en.json'

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi'
  }
})

const i18n = createI18n({
  locale: 'es', // Idioma por defecto
  fallbackLocale: 'en', // Idioma de respaldo
  messages: {
    es,
    en,
  }
});

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(i18n)
export { i18n, app };
app.mount('#app')
