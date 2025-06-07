<!-- VinylLoader.vue -->
<template>
  <div class="vinyl-container" :class="{ 'is-spinning': isLoading }">
    <img class="vinyl_loader" src="@/assets/img/vinyl-loader.png" alt="Vinyl Loader" />
  </div>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
// Les imports sont gérés par Vite dans vite.config.js

.vinyl-container {
  position: absolute;
  bottom: -30rem;
  height: 60rem;
  right: 1rem;
  width: 50%;
  @media (max-width: 768px) {
    z-index: -1;
    right: 20rem;
  }

  .vinyl_loader {
    height: 100%;
    animation: rotate 2s linear infinite paused;
    transition: 1s ease-out;
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3));
  }

  &.is-spinning .vinyl_loader {
    animation-play-state: running;
    transform: rotate(-0.3turn);
  }
}

@keyframes rotate {
  to {
    rotate: 1turn;
  }
}
</style>
