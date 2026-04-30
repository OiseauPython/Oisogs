<template>
  <Teleport to="body">
    <Transition name="oi-popup">
      <div v-if="visible" class="oi-popup-overlay" @click.self="$emit('close')">
        <div class="oi-popup" role="dialog">

          <div class="oi-popup__header">
            <div v-if="kicker" class="oi-popup__kicker">{{ kicker }}</div>
            <div class="oi-popup__title">{{ title }}</div>
            <button class="oi-popup__close" @click="$emit('close')" :aria-label="t('popup.close')">✕</button>
          </div>

          <div class="oi-popup__body">
            <slot />
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineOptions({ name: 'OiPopup' })

const props = defineProps({
  visible: { type: Boolean, required: true },
  title:   { type: String,  required: true },
  kicker:  { type: String,  default: '' },
})

const emit = defineEmits(['close'])

function onKeydown(e) {
  if (e.key === 'Escape' && props.visible) emit('close')
}

watch(() => props.visible, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) document.addEventListener('keydown', onKeydown)
  else   document.removeEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style lang="scss" scoped>
.oi-popup-overlay {
  position: fixed;
  top: 0; left: 0; right: 0;
  bottom: calc(58px + env(safe-area-inset-bottom));
  background: rgba(0, 0, 0, 0.55);
  z-index: 950;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (min-width: #{$oi-bp-mobile}) {
    bottom: 0;
    align-items: center;
  }
}

.oi-popup {
  background: var(--oisogs-bg);
  border: 1px solid var(--oisogs-rule);
  border-bottom: none;
  width: 100%;
  max-width: 680px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;

  @media (min-width: #{$oi-bp-mobile}) {
    border: 1px solid var(--oisogs-rule);
    max-height: 75vh;
  }

  &__header {
    padding: 32px 40px 24px;
    border-bottom: 1px solid var(--oisogs-rule);
    position: relative;
    flex-shrink: 0;

    @media (max-width: #{$oi-bp-mobile}) {
      padding: 24px 20px 20px;
    }
  }

  &__kicker {
    font-family: $oi-font-sans;
    font-size: 1rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--oisogs-accent);
    margin-bottom: 6px;
  }

  &__title {
    font-family: $oi-font-display;
    font-weight: 800;
    font-size: 3.2rem;
    line-height: 1;
    letter-spacing: -0.03em;
    color: var(--oisogs-ink);
    padding-right: 48px;

    @media (max-width: #{$oi-bp-mobile}) {
      font-size: 2.4rem;
    }
  }

  &__close {
    position: absolute;
    top: 28px;
    right: 32px;
    background: none;
    border: 1px solid var(--oisogs-rule);
    color: var(--oisogs-mute);
    font-size: 1.2rem;
    width: 32px;
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.12s, border-color 0.12s;
    flex-shrink: 0;

    &:hover {
      color: var(--oisogs-ink);
      border-color: var(--oisogs-rule-strong);
    }
  }

  &__body {
    overflow-y: auto;
    flex: 1;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: var(--oisogs-rule-strong); }
  }
}

// ─── Transition ───────────────────────────────────────────────────────────────

.oi-popup-enter-active,
.oi-popup-leave-active {
  transition: opacity 0.2s ease;
  .oi-popup { transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1); }
}

.oi-popup-enter-from,
.oi-popup-leave-to {
  opacity: 0;
  .oi-popup { transform: translateY(24px); }
}
</style>
