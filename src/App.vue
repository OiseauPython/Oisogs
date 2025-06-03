<template>
  <div class="bg"></div>
  <div class="wrapper">
    <NavBar />
    <section class="dashboard">
      <RouterView />
    </section>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<style lang="scss" scoped>
// Les imports sont gérés par Vite dans vite.config.js

.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
}

.wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;

  .dashboard {
    width: 100%;
  }
}

@media (min-width: 920px) {
  .wrapper {
    /* Vos styles ici */
  }
}
</style>
