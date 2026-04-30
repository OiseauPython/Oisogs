<template>
  <Transition name="slide-up">
    <div v-if="visible" class="install-prompt">
      <div class="install-prompt__icon">
        <img src="/pwa-64x64.png" alt="Oisogs" />
      </div>
      <div class="install-prompt__text">
        <p class="install-prompt__title">{{ t('install.title') }}</p>
        <p class="install-prompt__sub" v-if="!isIos">{{ t('install.sub_android') }}</p>
        <p class="install-prompt__sub" v-else>{{ t('install.sub_ios') }}</p>
      </div>
      <div class="install-prompt__actions">
        <button v-if="!isIos" class="install-prompt__btn --primary" @click="install">
          {{ t('install.btn_install') }}
        </button>
        <button class="install-prompt__btn --ghost" @click="dismiss">{{ t('install.btn_later') }}</button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const DISMISSED_KEY = 'pwa-prompt-dismissed'

const visible = ref(false)
const isIos = ref(false)
const deferredPrompt = ref(null)

const isRunningStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true

const dismiss = () => {
  visible.value = false
  localStorage.setItem(DISMISSED_KEY, Date.now().toString())
}

const install = async () => {
  if (!deferredPrompt.value) return
  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice
  if (outcome === 'accepted') {
    visible.value = false
  }
  deferredPrompt.value = null
}

onMounted(() => {
  if (isRunningStandalone()) return

  const dismissed = localStorage.getItem(DISMISSED_KEY)
  if (dismissed) {
    const daysSince = (Date.now() - Number(dismissed)) / (1000 * 60 * 60 * 24)
    if (daysSince < 7) return
  }

  const ua = navigator.userAgent
  isIos.value = /iphone|ipad|ipod/i.test(ua) && !window.MSStream

  if (isIos.value) {
    setTimeout(() => (visible.value = true), 3000)
    return
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    setTimeout(() => (visible.value = true), 3000)
  })
})
</script>

<style lang="scss" scoped>
.install-prompt {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: min(42rem, calc(100vw - 3rem));
  background: var(--oisogs-bg);
  border: 1px solid var(--oisogs-rule-strong);
  padding: 1.6rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.4rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);

  &__icon img {
    width: 4.8rem;
    height: 4.8rem;
  }

  &__text {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-family: $oi-font-serif;
    font-size: 1.5rem;
    font-style: italic;
    margin: 0 0 0.2rem;
    color: var(--oisogs-ink);
  }

  &__sub {
    font-family: $oi-font-sans;
    font-size: 1.2rem;
    margin: 0;
    color: var(--oisogs-mute);
  }

  &__share-icon {
    display: inline-block;
    border: 1px solid var(--oisogs-rule-strong);
    padding: 0 0.4rem;
    font-size: 1rem;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    flex-shrink: 0;
  }

  &__btn {
    border: 1px solid var(--oisogs-rule-strong);
    background: none;
    font-family: $oi-font-sans;
    font-size: 1.2rem;
    padding: 0.6rem 1.4rem;
    cursor: pointer;
    white-space: nowrap;
    color: var(--oisogs-ink);
    transition: background 0.12s, color 0.12s;

    &.--primary {
      background: var(--oisogs-accent);
      border-color: var(--oisogs-accent);
      color: var(--oisogs-bg);
      font-weight: 600;
    }

    &.--ghost {
      color: var(--oisogs-mute);
      &:hover { color: var(--oisogs-ink); }
    }
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(2rem);
}
</style>
