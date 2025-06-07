<template>
  <div class="bg"></div>
  <NavBar />
  <div class="wrapper">
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
  padding-top: 1rem;
  padding-left: 3rem;
  padding-right: 3rem;

  .dashboard {
    width: 100%;
    flex-grow: 1;
  }
}

@media (max-width: 768px) {
  // Aligné avec le breakpoint de base.scss
  .wrapper {
    padding: 1rem 1rem 2rem 1rem;
  }
}
</style>
