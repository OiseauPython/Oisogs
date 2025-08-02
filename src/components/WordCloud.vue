<template>
  <div class="word-cloud-container">
    <h2 class="card-title">{{ title }}</h2>
    <Vue3WordCloud
      :words="words"
      :color="color"
      :font-family="'Roboto, sans-serif'"
      :font-size-ratio="5"
      :spacing="0.5"
      :rotation="0"
      style="height: 80%; width: 100%"
    >
      <template v-slot="{ text, weight, word }">
        <div :title="weight" style="cursor: pointer;" @click="handleWordClick(word)">
          {{ text }}
        </div>
      </template>
    </Vue3WordCloud>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import Vue3WordCloud from 'vue3-word-cloud'

const props = defineProps({
  words: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(['word-selected'])

const appColors = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
]

const color = ([, weight]) => {
  // Simple example: cycle through colors based on weight
  const index = Math.floor(weight % appColors.length)
  return appColors[index]
}

function handleWordClick(word) {
  emit('word-selected', word)
}
</script>

<style lang="scss" scoped>
// Les imports sont gérés par Vite dans vite.config.js


.word-cloud-container {
  @include card-background;
  overflow: hidden;
  height: inherit;
}
</style>
