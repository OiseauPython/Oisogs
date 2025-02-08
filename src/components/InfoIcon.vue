<template>
  <div class="tool-tip">
    <i class="tool-tip__icon">?</i>
    <p class="tool-tip__info">
      <span class="info">{{ tooltipData }}</span>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  tooltipData: {
    type: Object,
    required: true,
  },
})

const showTooltip = ref(false)
</script>

<style lang="scss" scoped>
.tool-tip {
  $icon-size: 20px;
  $primary-color: #27b1f0;
  $bg-color: #262626;
  $accent-color: #fa00f3;

  display: inline-block;
  position: relative;
  margin-left: 0.5em;

  &__icon {
    background: $primary-color;
    border-radius: 50%; // plus moderne que 10px pour un cercle parfait
    cursor: pointer;
    display: inline-block;
    font-style: italic;
    font-family: 'Times New Roman', Times, serif;
    height: $icon-size;
    line-height: 1.3em;
    text-align: center;
    width: $icon-size;
    transition: background-color 0.2s ease; // animation douce

    &:hover {
      background-color: white;
    }
  }

  &__info {
    display: none;
    background: $bg-color;
    border: 1px solid $primary-color;
    border-radius: 3px;
    font-size: 0.875em;
    padding: 1em;
    position: absolute;
    left: 30px;
    top: -20px;
    width: 250px;
    z-index: 2;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); // ajout d'une ombre

    // Flèche du tooltip
    &::before,
    &::after {
      content: '';
      position: absolute;
      left: -10px;
      top: 7px;
      border-style: solid;
      border-width: 10px 10px 10px 0;
      border-color: transparent $primary-color;
    }

    &::after {
      left: -8px;
      border-right-color: $bg-color;
    }

    .info {
      display: block;

      &__title {
        color: $accent-color;
        margin-bottom: 0.5em; // espace sous le titre
      }
    }
  }

  // États au survol et focus
  &:hover,
  &:focus {
    .tool-tip__info {
      display: inline-block;
      animation: fadeIn 0.2s ease; // animation d'apparition
    }
  }
}

// Support pour l'accessibilité
a:focus + .tool-tip .tool-tip__info {
  display: inline-block;
}

// Animation d'apparition
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
