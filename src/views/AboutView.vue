<template>
  <div class="about">

    <!-- ─── Hero ──────────────────────────────────────────────────────────── -->
    <section class="about__section about__section--hero">
      <div class="about__hero-text">
        <div class="about__meta-row">
          <span class="about__kicker">{{ t('about.kicker') }}</span>
        </div>
        <h1 class="about__hero-title">{{ t('about.title') }}</h1>
        <p class="about__hero-desc">{{ t('about.desc') }}</p>
      </div>
      <div class="about__hero-logo">
        <img src="@/assets/img/logo.svg" alt="Oisogs" class="oi-logo-light" />
        <img src="@/assets/img/logo-white.svg" alt="Oisogs" class="oi-logo-dark" />
      </div>
    </section>

    <!-- ─── Fonctionnalités ───────────────────────────────────────────────── -->
    <section class="about__section about__feature-grid">
      <div
        v-for="(f, i) in features"
        :key="f.title"
        class="about__feature-cell"
        :class="{ '--no-right': i === features.length - 1 }"
      >
        <div class="about__feature-kicker">{{ f.kicker }}</div>
        <div class="about__feature-title">{{ f.title }}</div>
        <p class="about__feature-desc">{{ f.desc }}</p>
      </div>
    </section>

    <!-- ─── Sous le capot ────────────────────────────────────────────────── -->
    <section class="about__section about__stack">
      <div class="about__stack-label">{{ t('about.stack_label') }}</div>
      <div class="about__stack-tags">
        <span v-for="tag in stack" :key="tag" class="about__stack-tag">{{ tag }}</span>
      </div>
    </section>

    <!-- ─── Confidentialité ──────────────────────────────────────────────── -->
    <section class="about__section">
      <div class="about__section-kicker">{{ t('about.privacy_kicker') }}</div>
      <h2 class="about__section-title">{{ t('about.privacy_title') }}</h2>
      <p class="about__section-dek">{{ t('about.privacy_desc') }}</p>
    </section>

    <!-- ─── Footer ───────────────────────────────────────────────────────── -->
    <footer class="about__footer">
      <span>{{ t('about.footer_legal') }}</span>
      <span>{{ t('about.footer_credit') }}</span>
    </footer>

  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const features = computed(() => [
  { kicker: t('about.f1_kicker'), title: t('about.f1_title'), desc: t('about.f1_desc') },
  { kicker: t('about.f2_kicker'), title: t('about.f2_title'), desc: t('about.f2_desc') },
  { kicker: t('about.f3_kicker'), title: t('about.f3_title'), desc: t('about.f3_desc') },
])

const stack = computed(() => ['Vue.js', 'PWA', 'Discogs API', t('about.no_tracking'), 'Open source'])
</script>

<style lang="scss" scoped>
.about {
  // ─── Section base ─────────────────────────────────────────────────────────

  &__section {
    padding: 56px 40px;
    border-bottom: 1px solid var(--oisogs-rule);

    @media (max-width: #{$oi-bp-mobile}) {
      padding: 32px 20px;
    }
  }

  // ─── Hero ─────────────────────────────────────────────────────────────────

  &__section--hero {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 48px;
    align-items: start;

    @media (max-width: #{$oi-bp-mobile}) {
      grid-template-columns: 1fr;
    }
  }

  &__hero-text {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__hero-logo {
    display: flex;
    align-items: flex-start;

    @media (max-width: #{$oi-bp-mobile}) {
      display: none;
    }

    img {
      height: 280px;
      width: auto;
    }
  }

  &__meta-row {
    font-family: $oi-font-sans;
    font-size: 1rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--oisogs-mute);
  }

  &__kicker {
    font-weight: 500;
  }

  &__hero-title {
    font-family: $oi-font-display;
    font-weight: 800;
    font-size: 6.4rem;
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: var(--oisogs-ink);
    margin: 0;
    max-width: 820px;

    @media (max-width: #{$oi-bp-mobile}) {
      font-size: 3.2rem;
    }
  }

  &__hero-desc {
    font-family: $oi-font-sans;
    font-size: 1.6rem;
    line-height: 1.65;
    color: var(--oisogs-ink-soft);
    margin: 0;
    max-width: 720px;

    @media (max-width: #{$oi-bp-mobile}) {
      font-size: 1.4rem;
    }
  }

  // ─── Feature grid ─────────────────────────────────────────────────────────

  &__feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 0;

    @media (max-width: #{$oi-bp-mobile}) {
      grid-template-columns: 1fr;
    }
  }

  &__feature-cell {
    padding: 40px 36px;
    border-right: 1px solid var(--oisogs-rule);
    border-bottom: 1px solid var(--oisogs-rule);
    display: flex;
    flex-direction: column;
    gap: 10px;

    &.--no-right {
      border-right: none;
    }

    @media (max-width: #{$oi-bp-mobile}) {
      padding: 28px 20px;
      border-right: none;

      &.--no-right {
        border-bottom: none;
      }
    }
  }

  &__feature-kicker {
    font-family: $oi-font-sans;
    font-size: 0.9rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--oisogs-mute);
  }

  &__feature-title {
    font-family: $oi-font-display;
    font-weight: 700;
    font-size: 2.8rem;
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--oisogs-ink);

    @media (max-width: #{$oi-bp-mobile}) {
      font-size: 2.2rem;
    }
  }

  &__feature-desc {
    font-family: $oi-font-sans;
    font-size: 1.3rem;
    line-height: 1.55;
    color: var(--oisogs-ink-soft);
    margin: 4px 0 0;
  }

  // ─── Stack ────────────────────────────────────────────────────────────────

  &__stack {
    display: flex;
    align-items: baseline;
    gap: 32px;
    flex-wrap: wrap;

    @media (max-width: #{$oi-bp-mobile}) {
      flex-direction: column;
      gap: 16px;
    }
  }

  &__stack-label {
    font-family: $oi-font-sans;
    font-size: 1rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--oisogs-mute);
    font-weight: 500;
    flex-shrink: 0;
  }

  &__stack-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__stack-tag {
    font-family: $oi-font-sans;
    font-size: 1.2rem;
    color: var(--oisogs-ink-soft);
    border: 1px solid var(--oisogs-rule);
    padding: 5px 14px;
    letter-spacing: 0.03em;
    transition: border-color 0.15s;

    &:hover {
      border-color: var(--oisogs-rule-strong);
    }
  }

  // ─── Section générique ────────────────────────────────────────────────────

  &__section-kicker {
    font-family: $oi-font-sans;
    font-size: 1rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--oisogs-accent);
    margin-bottom: 8px;
  }

  &__section-title {
    font-family: $oi-font-serif;
    font-weight: 400;
    font-size: 3.2rem;
    letter-spacing: -0.03em;
    color: var(--oisogs-ink);
    margin: 0 0 16px;
    line-height: 1.05;

    @media (max-width: #{$oi-bp-mobile}) {
      font-size: 2.2rem;
    }
  }

  &__section-dek {
    font-family: $oi-font-sans;
    font-size: 1.4rem;
    line-height: 1.65;
    color: var(--oisogs-ink-soft);
    margin: 0;
    max-width: 640px;
  }

  // ─── Footer ───────────────────────────────────────────────────────────────

  &__footer {
    padding: 24px 40px;
    display: flex;
    justify-content: space-between;
    font-family: $oi-font-sans;
    font-size: 1.1rem;
    color: var(--oisogs-mute);
    letter-spacing: 0.05em;

    @media (max-width: #{$oi-bp-mobile}) {
      flex-direction: column;
      gap: 4px;
      padding: 20px;
    }
  }
}
</style>
