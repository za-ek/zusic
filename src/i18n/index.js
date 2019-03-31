import en from './en'
import ru from './ru'
import es from './es'

import VueI18n from 'vue-i18n'

const messages = {
  ru,
  en,
  es
}

const i18n = {
  install: (Vue, options) => {
    Vue.use(VueI18n)

    Vue.prototype.i18n = new VueI18n({
      locale: (options && 'locale' in options) ? options.locale : 'en',
      fallbackLocale: 'en',
      messages,
    })
  }
}

export default i18n