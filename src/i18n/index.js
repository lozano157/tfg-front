
import { createI18n } from 'vue-i18n'
import es from '../locales/es.json'
import en from '../locales/en.json'

const i18n = createI18n({
    legacy: false, // Set to false to use Composition API
    globalInjection: true, // Make i18n globally available
    locale: 'es',
    fallbackLocale: 'en',
    messages: {
        es,
        en
    }
})

export default i18n