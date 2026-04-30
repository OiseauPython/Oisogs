<template>
  <div class="oi-section-head">
    <div class="oi-section-head__kicker">{{ kicker }}</div>
    <h2 class="oi-section-head__title">{{ title }}</h2>
    <p v-if="dek" class="oi-section-head__dek">{{ dek }}</p>
  </div>
</template>

<script setup>
defineProps({
  kicker: { type: String, required: true },
  title: { type: String, required: true },
  dek: { type: String, default: '' },
})
</script>

<style lang="scss" scoped>
.oi-section-head {
  margin-bottom: 28px;

  &__kicker {
    @include oi-label(1rem, 0.2em);
    color: var(--oisogs-accent); // override mute → accent pour les sections
    margin-bottom: 6px;
  }

  &__title {
    font-family: $oi-font-serif;
    color: var(--oisogs-ink);
    font-weight: 400;
    font-size: 3.2rem;
    letter-spacing: -0.03em;
    margin: 0;
    line-height: 1.05;

    @media (max-width: #{$oi-bp-mobile}) {
      font-size: 2.2rem;
    }
  }

  &__dek {
    font-family: $oi-font-sans;
    color: var(--oisogs-ink-soft);
    font-size: 1.3rem;
    line-height: 1.55;
    margin: 10px 0 0;
    max-width: 540px;
  }
}
</style>
