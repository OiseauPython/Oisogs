<template>
  <div class="word-cloud-container">
    <vue-wordcloud
      :words="words"
      :color="getRandomColor"
      :font-family="'Roboto, sans-serif'"
      :font-size-ratio="3.5"
      :spacing="0.2"
      :rotation="0"
      @wordclick="handleWordClick"
    />
  </div>
</template>

<script>
import VueWordcloud from 'vuewordcloud'

export default {
  name: 'WordCloud',
  components: { 'vue-wordcloud': VueWordcloud },
  props: {
    words: {
      type: Array,
      required: true,
    },
    maxHeight: {
      type: Number,
      default: 200,
    },
  },
  data() {
    return {
      colors: ['#F8F8FF', '#F5F5F5', '#FFF5EE', '#CEEFFF'],
    }
  },
  methods: {
    getRandomColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)]
    },
    handleWordClick(word) {
      this.$emit('word-selected', word)
    },
    // Fonction personnalisée pour le tooltip
    customTooltip(word) {
      return `${word.text} (${word.weight} occurrences)`
    },
  },
}
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;
.word-cloud-container {
  background: rgba(255, 255, 255, 0.16);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.1px);
  -webkit-backdrop-filter: blur(5.1px);
  border-radius: $card-radius;
  padding: 3rem;
  overflow: hidden;
}
</style>
