<template>
  <div class="oi-wcloud">
    <!-- Tier 1 — grands mots -->
    <div class="oi-wcloud__tier oi-wcloud__tier--large">
      <template v-for="(w, i) in tier1" :key="w[0]">
        <span
          class="oi-wcloud__word"
          :class="{ 'oi-wcloud__word--accent': i === 0 }"
          :style="{ fontSize: sizeLarge(w[1]) + 'px', fontStyle: i % 2 === 0 ? 'italic' : 'normal' }"
        >{{ w[0] }}</span>
        <span v-if="i < tier1.length - 1" class="oi-wcloud__sep oi-wcloud__sep--large">·</span>
      </template>
    </div>

    <!-- Tier 2 — mots moyens -->
    <div class="oi-wcloud__tier oi-wcloud__tier--mid">
      <template v-for="(w, i) in tier2" :key="w[0]">
        <span
          class="oi-wcloud__word"
          :style="{ fontSize: sizeMid(w[1]) + 'px', fontStyle: i % 3 === 1 ? 'italic' : 'normal' }"
        >{{ w[0] }}</span>
        <span v-if="i < tier2.length - 1" class="oi-wcloud__sep oi-wcloud__sep--mid">—</span>
      </template>
    </div>

    <!-- Tier 3 — petits mots -->
    <div class="oi-wcloud__tier oi-wcloud__tier--small">
      <template v-for="(w, i) in tier3" :key="w[0]">
        <span class="oi-wcloud__word oi-wcloud__word--small">{{ w[0] }}</span>
        <span v-if="i < tier3.length - 1" class="oi-wcloud__sep oi-wcloud__sep--small">·</span>
      </template>
    </div>

    <div class="oi-wcloud__note">
      {{ t('wordcloud.note', { n: words.length }) }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  words: { type: Array, required: true }, // [[word, count], ...]
})

const maxCount = computed(() => (props.words[0]?.[1] ?? 1))

const tier1 = computed(() => props.words.slice(0, 3))
const tier2 = computed(() => props.words.slice(3, 9))
const tier3 = computed(() => props.words.slice(9))

const sizeLarge = (count) => 52 + (count / maxCount.value) * 28  // 52–80px
const sizeMid   = (count) => 24 + (count / maxCount.value) * 18  // 24–42px
</script>

<style lang="scss" scoped>
.oi-wcloud {
  font-family: $oi-font-serif;
  color: var(--oisogs-ink);
  line-height: 1.05;

  &__tier {
    margin-bottom: 20px;

    &--mid { line-height: 1.2; margin-bottom: 18px; }
    &--small {
      font-family: $oi-font-sans;
      line-height: 1.7;
    }
  }

  &__word {
    display: inline-block;
    margin-right: 8px;
    letter-spacing: -0.02em;
    cursor: default;
    transition: color 0.12s;

    &--accent { color: var(--oisogs-accent); }
    &--small  {
      font-size: 1.3rem !important;
      color: var(--oisogs-ink-soft);
      letter-spacing: 0.02em;
      font-family: $oi-font-sans;
    }
  }

  &__sep {
    display: inline-block;
    margin-right: 4px;
    color: var(--oisogs-rule-strong);
    pointer-events: none;

    &--large { font-size: 4rem; margin-right: 8px; }
    &--mid   { font-size: 2rem; margin-right: 8px; }
    &--small { font-size: 1.2rem; }
  }

  &__note {
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid var(--oisogs-rule);
    font-family: $oi-font-sans;
    font-size: 1.2rem;
    color: var(--oisogs-mute);
    letter-spacing: 0.03em;
  }
}
</style>
