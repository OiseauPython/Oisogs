<template>
  <button
    class="burger-button"
    @click="$emit('toggle')"
    :aria-expanded="isOpen.toString()"
    aria-label="Menu"
  >
    <span class="burger-icon" :class="{ 'is-open': isOpen }">
      <span></span>
      <span></span>
      <span></span>
    </span>
  </button>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
})
defineEmits(['toggle'])
</script>

<style lang="scss" scoped>
.burger-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 10px !important;
  z-index: 1100;
  @include card-background;
  width: 4rem;
  height: 4rem;
  border-radius: $round-radius;
}

.burger-icon {
  display: block;
  position: relative;
  width: 2rem;
  height: 1.5rem;

  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: white;
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;
  }

  span:nth-child(1) {
    top: -0.1rem;
  }
  span:nth-child(2) {
    top: 0.65rem;
  }
  span:nth-child(3) {
    top: 1.4rem;
  }

  &.is-open span:nth-child(1) {
    top: 0.65rem;
    transform: rotate(135deg);
  }
  &.is-open span:nth-child(2) {
    opacity: 0;
    left: -1rem;
  }
  &.is-open span:nth-child(3) {
    top: 0.65rem;
    transform: rotate(-135deg);
  }
}
</style>
