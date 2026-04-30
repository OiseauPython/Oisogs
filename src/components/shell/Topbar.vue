<template>
  <header class="oi-topbar">
    <div class="oi-topbar__left">
      <div class="oi-topbar__logo">
        <img src="@/assets/img/logo.svg" alt="Oisogs" class="oi-logo-light" />
        <img src="@/assets/img/logo-white.svg" alt="Oisogs" class="oi-logo-dark" />
      </div>
      <div class="oi-topbar__divider" />
      <nav class="oi-topbar__nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="oi-topbar__nav-item"
          :class="{ '--active': isActive(item), '--disabled': item.requiresCollection && !hasCollection }"
          :aria-disabled="item.requiresCollection && !hasCollection ? 'true' : undefined"
          @click.prevent="navigate(item)"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>

    <div class="oi-topbar__right">
      <div v-if="store.userProfile" class="oi-topbar__sync">
        <span class="oi-topbar__sync-dot" />
        <span class="oi-topbar__sync-label">{{ store.userProfile.username }}</span>
      </div>
      <div class="oi-topbar__lang">
        <button class="oi-topbar__lang-btn" :class="{ '--active': locale === 'fr' }" @click="locale = 'fr'">FR</button>
        <span class="oi-topbar__lang-sep">|</span>
        <button class="oi-topbar__lang-btn" :class="{ '--active': locale === 'en' }" @click="locale = 'en'">EN</button>
      </div>
      <button
        v-if="hasCollection"
        class="oi-topbar__reset"
        :title="t('nav.reset')"
        @click="store.resetStore()"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
      </button>
    </div>
  </header>

  <!-- Mobile topbar -->
  <header class="oi-topbar-mobile">
    <div class="oi-topbar-mobile__logo">
      <img src="@/assets/img/logo.svg" alt="Oisogs" class="oi-logo-light" style="height: 40px" />
      <img src="@/assets/img/logo-white.svg" alt="Oisogs" class="oi-logo-dark" style="height: 40px" />
    </div>
    <div class="oi-topbar-mobile__right">
      <div class="oi-topbar__lang">
        <button class="oi-topbar__lang-btn" :class="{ '--active': locale === 'fr' }" @click="locale = 'fr'">FR</button>
        <span class="oi-topbar__lang-sep">|</span>
        <button class="oi-topbar__lang-btn" :class="{ '--active': locale === 'en' }" @click="locale = 'en'">EN</button>
      </div>
      <button
        v-if="hasCollection"
        class="oi-topbar__reset"
        @click="store.resetStore()"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
defineOptions({ name: 'AppTopbar' })
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDiscogsStore } from '@/stores/store'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useDiscogsStore()
const hasCollection = computed(() => store.collection.length > 0)

const navItems = computed(() => [
  { path: '/search', label: t('nav.search') },
  { path: '/', label: t('nav.collection'), requiresCollection: true },
  { path: '/randomize', label: t('nav.random'), requiresCollection: true },
  { path: '/about', label: t('nav.about') },
])

const isActive = (item) => {
  if (item.path === '/') return route.path === '/'
  return route.path.startsWith(item.path)
}

const navigate = (item) => {
  if (item.requiresCollection && !hasCollection.value) return
  router.push(item.path)
}
</script>

<style lang="scss" scoped>
.oi-topbar {
  display: none;

  @media (min-width: #{$oi-bp-mobile}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 40px;
    @include oi-divider;
    font-family: $oi-font-sans;
    background: var(--oisogs-bg);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 10px;

    img { height: 46px; }
  }

  &__edition {
    font-size: 1rem;
    color: var(--oisogs-mute);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 500;
  }

  &__divider {
    height: 18px;
    width: 1px;
    background: var(--oisogs-rule-strong);
  }

  &__nav {
    display: flex;
    gap: 24px;
  }

  &__nav-item {
    font-size: 1.3rem;
    letter-spacing: 0.02em;
    color: var(--oisogs-mute);
    font-weight: 400;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    position: relative;
    font-family: inherit;
    transition: color 0.15s;

    &.--active {
      color: var(--oisogs-ink);
      font-weight: 500;

      &::after {
        content: '';
        position: absolute;
        left: 0; right: 0;
        bottom: -23px;
        height: 2px;
        background: var(--oisogs-accent);
      }
    }

    &.--disabled {
      opacity: 0.3;
      pointer-events: none;
    }

    &:hover:not(.--disabled) { color: var(--oisogs-ink); }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__sync {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border: 1px solid var(--oisogs-rule);
    border-radius: 999px;
  }

  &__sync-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--oisogs-cool);
    flex-shrink: 0;
  }

  &__sync-label {
    font-size: 1.1rem;
    color: var(--oisogs-ink-soft);
    letter-spacing: 0.03em;
  }

  &__lang {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__lang-sep {
    font-size: 1rem;
    color: var(--oisogs-rule-strong);
    user-select: none;
  }

  &__lang-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-family: $oi-font-sans;
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: var(--oisogs-mute);
    padding: 0;
    transition: color 0.15s;

    &.--active {
      color: var(--oisogs-ink);
    }

    &:not(.--active):hover {
      color: var(--oisogs-ink-soft);
    }
  }

  &__reset {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--oisogs-mute);
    width: 28px;
    height: 28px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s;

    svg { width: 16px; height: 16px; }

    &:hover { color: var(--oisogs-ink); }
  }
}

.oi-topbar-mobile {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  padding: calc(env(safe-area-inset-top) + 8px) 20px 8px;
  @include oi-divider;
  background: var(--oisogs-bg);
  position: sticky;
  top: 0;
  z-index: 100;

  @media (min-width: #{$oi-bp-mobile}) { display: none; }
}
</style>
