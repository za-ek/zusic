<template>
  <select v-model="i18n.locale">
    <option
            :value="lang"
            v-for="(name, lang) in languageList"
            :key="lang"
    >
      {{name}}
    </option>
  </select>
</template>

<script>
export default {
  data () {
    return {
      language: 'en',
      languageList: {
        en: 'English',
        es: 'Español',
        ru: 'Русский'
      }
    }
  },
  created () {
    this.language = this.i18n.locale
  }
}
</script>
