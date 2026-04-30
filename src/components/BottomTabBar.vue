<template>
  <nav class="oi-tabbar">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="oi-tabbar__tab"
      :class="{ '--active': isActive(tab), '--disabled': tab.requiresCollection && !hasCollection }"
      @click.prevent="navigate(tab)"
    >
      <div class="oi-tabbar__indicator" />
      <span class="oi-tabbar__glyph" v-html="tab.icon" />
      <span class="oi-tabbar__label">{{ tab.name }}</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDiscogsStore } from '@/stores/store'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useDiscogsStore()
const hasCollection = computed(() => store.collection.length > 0)

const tabs = computed(() => [
  {
    path: '/search',
    name: t('nav.search'),
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  },
  {
    path: '/',
    name: t('nav.collection'),
    requiresCollection: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`,
  },
  {
    path: '/randomize',
    name: t('nav.random'),
    requiresCollection: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>`,
  },
  {
    path: '/about',
    name: t('nav.about'),
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  },
])

const isActive = (tab) => {
  if (tab.path === '/') return route.path === '/'
  return route.path.startsWith(tab.path)
}

const navigate = (tab) => {
  if (tab.requiresCollection && !hasCollection.value) return
  router.push(tab.path)
}
</script>

<style lang="scss" scoped>
.oi-tabbar {
  display: none;

  @media (max-width: #{$oi-bp-mobile}) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 900;
    background: color-mix(in srgb, var(--oisogs-bg) 92%, transparent);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-top: 1px solid var(--oisogs-rule);
    padding-bottom: env(safe-area-inset-bottom);
  }

  &__tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 0 8px;
    text-decoration: none;
    color: var(--oisogs-mute);
    position: relative;
    transition: color 0.15s;
    cursor: pointer;

    &.--active {
      color: var(--oisogs-accent);

      .oi-tabbar__indicator { opacity: 1; }
    }

    &.--disabled {
      opacity: 0.25;
      pointer-events: none;
    }
  }

  &__indicator {
    position: absolute;
    top: 0;
    left: 24px; right: 24px;
    height: 2px;
    background: var(--oisogs-accent);
    opacity: 0;
    transition: opacity 0.15s;
  }

  &__glyph {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(svg) {
      width: 100%;
      height: 100%;
    }
  }

  &__label {
    font-family: $oi-font-sans;
    font-size: 0.9rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-weight: 500;
  }
}
</style>
