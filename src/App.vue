<template>
  <div class="bg" />
  <Topbar />
  <main class="oi-main">
    <RouterView />
  </main>
  <BottomTabBar />
  <InstallPrompt />
</template>

<script setup>
import { RouterView } from 'vue-router'
import Topbar from './components/shell/Topbar.vue'
import BottomTabBar from './components/BottomTabBar.vue'
import InstallPrompt from './components/InstallPrompt.vue'
</script>

<style lang="scss" scoped>
.bg {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: -2;
  background: var(--oisogs-bg);
}

.oi-main {
  @media (max-width: #{$oi-bp-mobile}) {
    padding-bottom: calc(64px + env(safe-area-inset-bottom));
  }
}
</style>
