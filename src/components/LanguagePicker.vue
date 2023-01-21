<template>
  <select @change="update">
    <option v-for="key in Object.keys(languages)" :key="key" :value="key" :selected="key === selected">{{languages[key]}}</option>
  </select>
</template>

<script>
export default {
  computed: {
    selected() {
      return this.i18n.locale
    }
  },
  data() {
    return {
      languages: {
        en: 'English',
        es: 'Español',
        ru: 'Русский',
      }
    }
  },
  methods: {
    update(e) {
      this.i18n.locale = e.target.value;
      localStorage.setItem('locale', e.target.value);
    }
  }
}
</script>
