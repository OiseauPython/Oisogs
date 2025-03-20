<template>
  <div class="word-cloud-container">
    <h2 class="card-title">{{ title }}</h2>
    <vue-wordcloud
      :words="words"
      :color="getRandomColor"
      :font-family="'Roboto, sans-serif'"
      :font-size-ratio="5"
      :spacing="0.5"
      :rotation="0"
      @wordclick="handleWordClick"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import VueWordcloud from 'vuewordcloud'

const props = defineProps({
  words: {
    type: Array,
    required: true,
  },
  maxHeight: {
    type: Number,
    default: 200,
  },
  title: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(['word-selected'])

const colors = [
  'rgba(255, 99, 132)',
  'rgba(54, 162, 235)',
  'rgba(255, 206, 86)',
  'rgba(75, 192, 192)',
  'rgba(255, 255, 255)',
]

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}

function handleWordClick(word) {
  emit('word-selected', word)
}
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;
@use '@/assets/mixin.scss' as *;
.word-cloud-container {
  @include card-background;
  overflow: hidden;
  height: inherit;
}
</style>
