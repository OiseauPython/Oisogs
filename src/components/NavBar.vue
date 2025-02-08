<template>
  <header>
    <div class="app-title">
      <h1>Oisogs</h1>
    </div>

    <div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">À propos</RouterLink>
      </nav>
      <div v-if="store.collection.length">
        <button class="reset-button" @click="handleReset">Chercher une autre collection</button>
        <img class="profil-img" :src="store.userProfile.avatar_url" alt="Image de profil" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useDiscogsStore } from '@/stores/store'

const store = useDiscogsStore()

// Reset
const handleReset = () => {
  store.resetStore()
}
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

header {
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .app-title {
    h1 {
      font-weight: 500;
      font-size: 2.6rem;
      text-align: center;
      margin: 3rem 0 0 0;
    }

    h3 {
      display: none;
      margin: 0;
    }
  }
  .profil-img {
    width: 5rem;
    border-radius: 50%;
  }
}

@media (min-width: 920px) {
  header {
    position: inherit;
    bottom: inherit;
    justify-content: start;
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
