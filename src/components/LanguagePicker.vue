<template>
  <select v-model="i18n.locale">
    <option
            :value="lang"
            v-for="(lang) in languageList"
            :key="lang"
    >
      {{localeNames ? i18n.t(lang) : nativeName[lang]}}
    </option>
  </select>
</template>

<script>
export default {
  data () {
    return {
      languageList: [
        'en', 'es', 'ru'
      ],
      nativeName: {
        en: 'English',
        es: 'Español',
        ru: 'Русский'
      }
    }
  },
  props: ['localeNames']
}
</script>
