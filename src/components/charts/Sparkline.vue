<template>
  <svg :width="w" :height="h" :viewBox="`0 0 ${w} ${h}`" class="oi-sparkline">
    <path v-if="fill" :d="fillPath" :fill="color" :opacity="fillOpacity" />
    <path :d="linePath" fill="none" :stroke="color" :stroke-width="strokeWidth" stroke-linejoin="round" stroke-linecap="round" />
  </svg>
</template>

<script setup>
defineOptions({ name: 'SparklineChart' })
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, required: true },
  w: { type: Number, default: 200 },
  h: { type: Number, default: 40 },
  color: { type: String, default: 'currentColor' },
  strokeWidth: { type: Number, default: 1.5 },
  fill: { type: Boolean, default: false },
  fillOpacity: { type: Number, default: 0.15 },
})

const points = computed(() => {
  const max = Math.max(...props.data)
  const min = Math.min(...props.data)
  const range = max - min || 1
  const step = props.w / (props.data.length - 1)
  return props.data.map((v, i) => [
    i * step,
    props.h - ((v - min) / range) * (props.h - 4) - 2,
  ])
})

const linePath = computed(() =>
  points.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' '),
)

const fillPath = computed(() => {
  const last = points.value[points.value.length - 1]
  return `${linePath.value} L${last[0]} ${props.h} L0 ${props.h} Z`
})
</script>

<style scoped>
.oi-sparkline { display: block; }
</style>
