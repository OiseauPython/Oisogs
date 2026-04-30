<template>
  <div class="oi-bars">
    <div class="oi-bars__cols" :style="{ height: height + 'px', '--cols': data.length }">
      <div
        v-for="(d, i) in data"
        :key="d.label"
        class="oi-bars__col"
        @mouseenter="hover = i"
        @mouseleave="hover = null"
        @click="$emit('bar-click', d)"
      >
        <Transition name="oi-bars-tip">
          <div v-if="hover === i" class="oi-bars__tooltip">{{ d.count }}</div>
        </Transition>
        <div class="oi-bars__track" />
        <div
          class="oi-bars__fill"
          :style="{
            height: fillPct(d) + '%',
            opacity: hover === null || hover === i ? 1 : 0.35,
            transitionDelay: i * 60 + 'ms',
          }"
        />
      </div>
    </div>
    <div class="oi-bars__labels" :style="{ '--cols': data.length }">
      <span v-for="d in data" :key="d.label" class="oi-bars__label">{{ d.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data:   { type: Array,  required: true }, // [{ label, count }]
  height: { type: Number, default: 160 },
})

defineEmits(['bar-click'])

const hover    = ref(null)
const maxCount = computed(() => Math.max(...props.data.map((d) => d.count)))
const fillPct  = (d) => (d.count / maxCount.value) * 100
</script>

<style lang="scss" scoped>
.oi-bars {
  &__cols {
    display: grid;
    grid-template-columns: repeat(var(--cols, 8), 1fr);
    gap: 8px;
    align-items: end;
  }

  &__col {
    position: relative;
    height: 100%;
    cursor: pointer;
  }

  &__track {
    position: absolute;
    inset: 0;
    background: var(--oisogs-bg-panel);
  }

  &__fill {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: var(--oisogs-accent);
    transition: height 1.2s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.15s;
  }

  &__tooltip {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(100% + 8px);
    background: var(--oisogs-ink);
    color: var(--oisogs-bg);
    font-family: $oi-font-sans;
    font-size: 1.1rem;
    padding: 4px 8px;
    white-space: nowrap;
    @include oi-tnum;
    pointer-events: none;
    z-index: 10;
  }

  &__labels {
    display: grid;
    grid-template-columns: repeat(var(--cols, 8), 1fr);
    gap: 8px;
    margin-top: 8px;
  }

  &__label {
    font-family: $oi-font-sans;
    font-size: 1rem;
    text-align: center;
    color: var(--oisogs-mute);
    @include oi-tnum;
  }
}

.oi-bars-tip-enter-active,
.oi-bars-tip-leave-active { transition: opacity 0.1s; }
.oi-bars-tip-enter-from,
.oi-bars-tip-leave-to     { opacity: 0; }
</style>
