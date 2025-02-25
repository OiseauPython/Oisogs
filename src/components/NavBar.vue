<template>
  <header>
    <div class="app-title">
      <h1>Oisogs</h1>
    </div>

    <div class="navigation-action-container">
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
  </header>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useDiscogsStore } from '@/stores/store'

const store = useDiscogsStore()
const route = useRoute()
const linkRefs = ref([])
const indicatorPosition = ref(0)
const indicatorWidth = ref(0)

const links = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'À propos' },
  { path: '/randomize', name: 'Randomize' },
]

const updateIndicator = () => {
  nextTick(() => {
    const activeLink = linkRefs.value.find((link) => link.$el.href.includes(route.path))

    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink.$el
      indicatorPosition.value = offsetLeft
      indicatorWidth.value = offsetWidth
    }
  })
}

watch(() => route.path, updateIndicator, { immediate: true })

onMounted(() => {
  updateIndicator()
})

// Reset
const handleReset = () => {
  store.resetStore()
}
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3rem 0;
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
  .navigation-action-container {
    display: flex;
    height: 5rem;
    gap: 0.5rem;

    nav {
      background: rgba(255, 255, 255, 0.16);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(5.1px);
      -webkit-backdrop-filter: blur(5.1px);
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
        border-radius: $round-radius;
      }
      .reset-button {
        border-radius: $round-radius;
        background: rgba(255, 255, 255, 0.16);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5.1px);
        -webkit-backdrop-filter: blur(5.1px);
        border-radius: $round-radius;
        border: none;
        color: white;
        font-size: $font-size-base;
        padding: 0 2rem;
        cursor: pointer;
      }
    }
  }
}

@media (min-width: 920px) {
  header {
    position: inherit;
    bottom: inherit;
    .app-title {
      h1 {
      }

      h3 {
        display: inherit;
      }
    }
  }
}
</style>
