<template>
  <section class="stat-card" :class="variant">
    <h2 class="stat-card__title">{{ title }}</h2>
    <div class="stat-card__value">
      {{ value }}
      <span v-if="suffix" class="stat-card__suffix">{{ suffix }}</span>
    </div>
    <div v-if="description" class="stat-card__description">
      {{ description }}
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [Number, String],
    required: true,
  },
  suffix: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary'].includes(value),
  },
  format: {
    type: String,
    default: 'number', // 'number', 'percentage', 'currency'
  },
})
</script>

<style lang="scss" scoped>
.stat-card {
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--card-bg, #fff);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  width: fit-content;

  &:hover {
    transform: translateY(-2px);
  }

  // Variants
  &.primary {
    background: var(--primary-bg, #e3f2fd);
  }

  &.secondary {
    background: var(--secondary-bg, #f5f5f5);
  }

  &__title {
    font-size: 0.875rem;
    color: var(--text-secondary, #666);
    margin: 0 0 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__value {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--text-primary, #333);
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
  }

  &__suffix {
    font-size: 0.875rem;
    color: var(--text-secondary, #666);
  }

  &__description {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary, #666);
  }
}
</style>
