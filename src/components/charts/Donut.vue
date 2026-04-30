<template>
  <div class="oi-donut" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" style="transform: rotate(-90deg)">
      <circle
        :cx="size / 2" :cy="size / 2" :r="r"
        fill="none" :stroke="trackColor" :stroke-width="thickness"
      />
      <circle
        v-for="(seg, i) in segments" :key="seg.name"
        :cx="size / 2" :cy="size / 2" :r="r"
        fill="none"
        :stroke="colors[i % colors.length]"
        :stroke-width="hover === i ? thickness + 3 : thickness"
        :stroke-dasharray="`${seg.len} ${circumference - seg.len}`"
        :stroke-dashoffset="-seg.offset"
        class="oi-donut__seg"
        :style="{ opacity: hover === null || hover === i ? 1 : 0.3 }"
        @mouseenter="hover = i"
        @mouseleave="hover = null"
      />
    </svg>
    <div class="oi-donut__center">
      <template v-if="hover !== null">
        <span class="oi-donut__center-label">{{ data[hover].name }}</span>
        <span class="oi-donut__center-value">{{ data[hover].pct ? data[hover].pct.toFixed(1) + '%' : data[hover].count }}</span>
      </template>
      <template v-else>
        <span v-if="centerLabel" class="oi-donut__center-label">{{ centerLabel }}</span>
        <span class="oi-donut__center-value">{{ centerValue ?? total }}</span>
      </template>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'DonutChart' })
import { ref, computed } from 'vue'

const props = defineProps({
  data: { type: Array, required: true },
  size: { type: Number, default: 220 },
  thickness: { type: Number, default: 28 },
  colors: { type: Array, default: () => ['#ffd67e', '#c69552', '#b78445', '#8a6232', '#5a8aa8', '#7a7095', '#c5b389', '#4a5a85', '#9c8458'] },
  trackColor: { type: String, default: 'var(--oisogs-bg-panel)' },
  centerLabel: { type: String, default: '' },
  centerValue: { type: [Number, String], default: null },
})

const hover = ref(null)
const r = computed(() => props.size / 2 - props.thickness / 2)
const circumference = computed(() => 2 * Math.PI * r.value)
const total = computed(() => props.data.reduce((s, d) => s + d.count, 0))

const segments = computed(() => {
  let offset = 0
  return props.data.map((d) => {
    const len = (d.count / total.value) * circumference.value
    const seg = { name: d.name, len, offset }
    offset += len
    return seg
  })
})
</script>

<style lang="scss" scoped>
.oi-donut {
  position: relative;
  flex-shrink: 0;

  &__seg {
    transition: stroke-width 0.15s, opacity 0.15s;
    cursor: pointer;
  }

  &__center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    color: var(--oisogs-ink);
    gap: 2px;
  }

  &__center-label {
    font-family: $oi-font-sans;
    font-size: 1rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--oisogs-mute);
  }

  &__center-value {
    font-family: $oi-font-display;
    font-weight: 300;
    font-size: 2.6rem;
    line-height: 1;
    @include oi-tnum;
    color: var(--oisogs-ink);
  }
}
</style>
