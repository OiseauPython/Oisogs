<template>
  <header>
    <div class="app-title">
      <h1>Oisogs</h1>
    </div>

    <!-- Desktop Navigation -->
    <div class="navigation-action-container desktop-nav" v-if="!isMobile">
      <nav>
        <div
          class="nav-indicator"
          :style="{
            transform: `translateX(${indicatorPosition}px)`,
            width: `${indicatorWidth}px`,
          }"
        ></div>
        <RouterLink
          v-for="(link, index) in links"
          :key="index"
          :to="link.path"
          :ref="(el) => (linkRefs[index] = el)"
        >
          {{ link.name }}
        </RouterLink>
      </nav>
      <div v-if="store.collection.length" class="action-container">
        <button class="reset-button" @click="handleReset">Chercher une autre collection</button>
        <img class="profil-img" :src="store.userProfile.avatar_url" alt="Image de profil" />
      </div>
    </div>

    <!-- Mobile Navigation Trigger -->
    <div class="mobile-nav-trigger" v-if="isMobile">
      <img
        v-if="store.collection.length && store.userProfile.avatar_url"
        class="profil-img mobile-profil-img"
        :src="store.userProfile.avatar_url"
        alt="Image de profil"
      />
      <BurgerButton @toggle="toggleMobileMenu" :is-open="isMobileMenuOpen" />
    </div>

    <!-- Mobile Menu Panel -->
    <MobileNavMenu
      :is-open="isMobileMenuOpen"
      :links="links"
      @close="closeMobileMenu"
      @reset-collection="handleResetAndCloseMenu"
    />
  </header>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useDiscogsStore } from '@/stores/store'
import BurgerButton from './BurgerButton.vue'
import MobileNavMenu from './MobileNavMenu.vue'

const store = useDiscogsStore()
const route = useRoute()
const linkRefs = ref([])
const indicatorPosition = ref(0)
const indicatorWidth = ref(0)

const isMobile = ref(false)
const isMobileMenuOpen = ref(false)

const links = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'À propos' },
  { path: '/randomize', name: 'Randomize' },
]

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768 // Breakpoint pour mobile
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const updateIndicator = () => {
  if (isMobile.value) return // Pas d'indicateur en mobile
  nextTick(() => {
    const activeLink = linkRefs.value.find(
      (link) => link && link.$el && link.$el.href && link.$el.href.includes(route.path),
    )

    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink.$el
      indicatorPosition.value = offsetLeft
      indicatorWidth.value = offsetWidth
    }
  })
}

watch(() => route.path, updateIndicator, { immediate: true })
watch(isMobile, updateIndicator) // Mettre à jour l'indicateur si on passe de mobile à desktop

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  updateIndicator()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})

// Reset
const handleReset = () => {
  store.resetStore()
}

const handleResetAndCloseMenu = () => {
  handleReset()
  closeMobileMenu()
}
</script>

<style lang="scss" scoped>
// Les imports sont gérés par Vite dans vite.config.js

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 3rem;
  position: sticky;
  margin-bottom: 2rem;
  top: 0;
  left: 0;
  right: 0;
  z-index: 900;
  background-color: rgba(30, 30, 40, 0.75);
  backdrop-filter: blur(5.1px);
  -webkit-backdrop-filter: blur(5.1px);

  .app-title {
    h1 {
      font-weight: 500;
      font-size: 2.6rem;
      text-align: center;
      margin: 0;
    }

    h3 {
      display: none;
      margin: 0;
    }
  }

  .desktop-nav {
    // Styles spécifiques pour le conteneur desktop si besoin
    display: flex; // S'assure qu'il est flex par défaut
    height: 5rem;
    gap: 0.5rem;
  }

  .navigation-action-container {
    // Ces styles s'appliquent maintenant à .desktop-nav
    nav {
      background: rgba(255, 255, 255, 0.16);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      border-radius: $round-radius;
      padding: 0;
      display: flex;
      align-items: center;
      position: relative;

      .nav-indicator {
        position: absolute;
        height: 100%;
        background: rgba(255, 255, 255, 0.3);
        border-radius: $round-radius;
        transition: all 0.3s ease;
        z-index: 0;
      }

      a {
        padding: 1.25rem 2rem;
        border-radius: $round-radius;
        text-decoration: none;
        position: relative;
        z-index: 1;
        transition: color 0.3s ease;
        color: white;

        &.router-link-active {
          color: white;
        }

        &:visited:not(.router-link-active) {
          color: unset;
        }
      }
    }

    .action-container {
      display: flex;
      gap: 0.5rem;
      .profil-img {
        width: 5rem;
        height: 5rem;
        object-fit: cover;
        border-radius: $round-radius;
      }
      .reset-button {
        border-radius: $round-radius;
        background: rgba(255, 255, 255, 0.16);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        border-radius: $round-radius;
        border: none;
        color: white;
        font-size: $font-size-base;
        padding: 0 2rem;
        cursor: pointer;
        width: 20rem;
      }
    }
  }

  .mobile-nav-trigger {
    display: flex;
    align-items: center;
    gap: 1rem; // Espace entre l'image de profil et le bouton burger

    .mobile-profil-img {
      width: 40px; // Taille ajustée pour mobile
      height: 40px;
      object-fit: cover;
      border-radius: 50%; // Rond pour mobile
    }
  }
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none !important;
  }
}

@media (min-width: 920px) {
  .mobile-nav-trigger {
    display: none !important;
  }
  header {
    .app-title {
      h3 {
        display: inherit;
      }
    }
  }
}
</style>
