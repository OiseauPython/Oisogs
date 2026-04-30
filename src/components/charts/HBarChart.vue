<template>
  <div class="oi-hbar">
    <div v-for="(item, i) in items" :key="item.name" class="oi-hbar__row">
      <div class="oi-hbar__track" :style="{ height: height + 'px' }">
        <!-- Label sombre — visible dans la zone non remplie -->
        <span class="oi-hbar__label">{{ item.name }}</span>
        <!-- Fill — clipe le label clair à sa largeur -->
        <div
          class="oi-hbar__fill"
          :style="{ width: pct(item) + '%', background: color, transitionDelay: i * 50 + 'ms' }"
        >
          <span class="oi-hbar__label oi-hbar__label--light">{{ item.name }}</span>
        </div>
      </div>
      <span class="oi-hbar__value">{{ item.count }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  color: { type: String, default: 'var(--oisogs-accent)' },
  height: { type: Number, default: 26 },
})

const maxCount = computed(() => Math.max(...props.items.map((i) => i.count)))
const pct = (item) => (item.count / maxCount.value) * 100
</script>

<style lang="scss" scoped>
.oi-hbar {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    align-items: center;
  }

  &__track {
    position: relative;
    background: var(--oisogs-bg-panel);
    border-radius: 2px;
    overflow: hidden;
  }

  &__fill {
    position: absolute;
    top: 0; bottom: 0; left: 0;
    border-radius: 2px;
    overflow: hidden; // ← clipe le label clair
    transition: width 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  &__label {
    position: absolute;
    left: 10px;
    top: 0; bottom: 0;
    display: flex;
    align-items: center;
    font-family: $oi-font-sans;
    font-size: 1.2rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    white-space: nowrap;
    color: var(--oisogs-ink); // sombre → lisible sur fond crème

    &--light {
      color: var(--oisogs-accent-ink); // clair → lisible sur fond brun
    }
  }

  &__value {
    font-family: $oi-font-display;
    font-size: 1.4rem;
    color: var(--oisogs-ink-soft);
    @include oi-tnum;
    min-width: 36px;
    text-align: right;
  }
}
</style>
