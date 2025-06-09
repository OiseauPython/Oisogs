<template>
  <transition name="slide-fade">
    <div v-if="isOpen" class="mobile-nav-menu-overlay" @click.self="$emit('close')">
      <div class="mobile-nav-menu-panel">
        <nav>
          <RouterLink
            v-for="(link, index) in links"
            :key="index"
            :to="link.path"
            @click="$emit('close')"
          >
            {{ link.name }}
          </RouterLink>
        </nav>
        <button
          v-if="store.collection.length"
          class="reset-button-mobile"
          @click="$emit('resetCollection')"
        >
          Chercher une autre collection
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useDiscogsStore } from '@/stores/store'

const store = useDiscogsStore()

defineProps({
  isOpen: Boolean,
  links: Array,
})
defineEmits(['close', 'resetCollection'])
</script>

<style lang="scss" scoped>
.mobile-nav-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5.1px);
  -webkit-backdrop-filter: blur(5.1px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.mobile-nav-menu-panel {
  background-color: $background;
  width: 28rem;
  height: 28rem;
  padding: 2rem;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: $card-radius;
  border-bottom-right-radius: $card-radius;

  nav {
    display: flex;
    flex-direction: column;

    a {
      color: white;
      text-decoration: none;
      font-size: 1.8rem;
      padding: 10px;
      border-radius: 5px;
      width: fit-content;
      &:hover,
      &.router-link-active {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .reset-button-mobile {
    // Styles similaires à votre .reset-button existant, adaptés si besoin
    background: rgba(255, 255, 255, 0.16);
    border: none;
    color: white;
    padding: 20px 15px;
    font-size: 1.8rem;
    border-radius: $round-radius;
    cursor: pointer;
    margin-top: auto;
  }
}

// Transition pour l'apparition/disparition
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}
.slide-fade-enter-active .mobile-nav-menu-panel,
.slide-fade-leave-active .mobile-nav-menu-panel {
  transition: transform 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-from .mobile-nav-menu-panel,
.slide-fade-leave-to .mobile-nav-menu-panel {
  transform: translateY(-100%);
}
</style>
