<template>
  <div class="stat-card" :class="variant">
    <h2 class="stat-card__title">{{ title }}</h2>
    <div class="stat-card__value">
      {{ value }}
      <span v-if="suffix" class="stat-card__suffix">{{ suffix }}</span>
    </div>
    <div v-if="description" class="stat-card__description">
      {{ description }}
    </div>
  </div>
</template>

<script setup>
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
// Les imports sont gérés par Vite dans vite.config.js


.stat-card {
  padding: 1rem;
  border-radius: $card-radius;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  // Variants
  &.primary {
    background: rgba(255, 255, 255, 0.16);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5.1px);
    -webkit-backdrop-filter: blur(5.1px);

    .stat-card__title {
      color: white;
      margin: 0 0 0.5rem;
      letter-spacing: 0.5px;
    }

    .stat-card__value {
      font-weight: bold;
      color: red;
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
    }

    .stat-card__suffix {
      color: white;
    }

    .stat-card__description {
      margin-top: 0.5rem;
      color: white;
    }
  }

  &.secondary {
    background: var(--secondary-bg, #f5f5f5);
  }
}
</style>
