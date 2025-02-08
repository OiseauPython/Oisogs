<template>
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
@use '@/assets/variables.scss' as *;

.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-height: 100vh;
  overflow-x: hidden;

  .dashboard {
    width: 100%;
  }
}

@media (min-width: 920px) {
  .wrapper {
  }
}
</style>
