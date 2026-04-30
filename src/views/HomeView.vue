<template>
  <div v-if="store.statistics" class="oi-dashboard">
    <Hero />
    <FunFacts />

    <section class="oi-dashboard__section">
      <SectionHead
        :kicker="t('home.s2_kicker')"
        :title="t('home.s2_title')"
        :dek="t('home.s2_dek')"
      />
      <GenresBlock />
    </section>

    <section class="oi-dashboard__section">
      <SectionHead
        :kicker="t('home.s3_kicker')"
        :title="t('home.s3_title')"
        :dek="t('home.s3_dek', { n: store.topStylesForUI.length })"
      />
      <StylesCloud />
    </section>

    <section class="oi-dashboard__section">
      <SectionHead
        :kicker="t('home.s4_kicker')"
        :title="t('home.s4_title')"
      />
      <DecadesBlock />
    </section>

    <section class="oi-dashboard__section">
      <SectionHead
        :kicker="t('home.s5_kicker')"
        :title="t('home.s5_title')"
      />
      <ArtistsBlock />
    </section>

    <!-- Derniers ajouts + Évolution par format -->
    <section class="oi-dashboard__section oi-dashboard__section--split">
      <div>
        <SectionHead :kicker="t('home.s6_kicker')" :title="t('home.s6_title')" />
        <LastAdded :last-added-albums="store.statistics.lastAddedAlbums" />
      </div>
      <div>
        <SectionHead :kicker="t('home.s7_kicker')" :title="t('home.s7_title')" />
        <FormatsBlock />
      </div>
    </section>

    <!-- Chronologie : ajouts par année + évolution par format -->
    <section class="oi-dashboard__section oi-dashboard__section--split">
      <div>
        <SectionHead :kicker="t('home.s8_kicker')" :title="t('home.s8_title')" />
        <YearBarsBlock :data="store.statistics.addedPerYear" />
      </div>
      <div>
        <SectionHead :kicker="t('home.s9_kicker')" :title="t('home.s9_title')" />
        <FormatEvolutionBlock :data="store.statistics.addedPerYearAndFormat" />
      </div>
    </section>

    <!-- Nuage de titres d'albums -->
    <section class="oi-dashboard__section">
      <SectionHead :kicker="t('home.s10_kicker')" :title="t('home.s10_title')" />
      <WordCloudBlock :words="store.statistics.albumWordCloud" />
    </section>

    <footer class="oi-dashboard__footer">
      <span>{{ t('home.footer_tagline') }}</span>
      <span>{{ t('home.footer_sync', { date: syncDate }) }}</span>
    </footer>
  </div>
</template>

<script setup>
import { computed, watch, watchEffect, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDiscogsStore } from '@/stores/store'

const { t } = useI18n()

import Hero from '@/components/blocks/Hero.vue'
import FunFacts from '@/components/blocks/FunFacts.vue'
import GenresBlock from '@/components/blocks/GenresBlock.vue'
import StylesCloud from '@/components/blocks/StylesCloud.vue'
import DecadesBlock from '@/components/blocks/DecadesBlock.vue'
import ArtistsBlock from '@/components/blocks/ArtistsBlock.vue'
import FormatsBlock from '@/components/blocks/FormatsBlock.vue'
import SectionHead from '@/components/shell/SectionHead.vue'

import LastAdded from '@/components/LastAdded.vue'
import YearBarsBlock from '@/components/blocks/YearBarsBlock.vue'
import FormatEvolutionBlock from '@/components/blocks/FormatEvolutionBlock.vue'
import WordCloudBlock from '@/components/blocks/WordCloudBlock.vue'

const store = useDiscogsStore()
const router = useRouter()

watchEffect(() => {
  if (store.userProfile) {
    const name  = store.userProfile.username
    const count = store.userProfile.num_collection
    document.title = `Oisogs — ${name} · ${count} albums`
  } else {
    document.title = 'Oisogs'
  }
})

onUnmounted(() => { document.title = 'Oisogs' })

watch(
  () => store.collection.length,
  (length) => {
    if (length === 0 && !store.isLoading) router.replace('/search')
  },
  { immediate: true },
)

const syncDate = computed(() => {
  const d = new Date()
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`
})
</script>

<style lang="scss" scoped>
.oi-dashboard {
  &__section {
    padding: 56px 40px;
    border-bottom: 1px solid var(--oisogs-rule);

    @media (max-width: #{$oi-bp-mobile}) {
      padding: 24px 20px;
    }

    &--split {
      display: grid;
      grid-template-columns: 1fr;
      gap: 40px;

      @media (min-width: #{$oi-bp-tablet}) {
        grid-template-columns: 1fr 1fr;
        gap: 64px;
      }
    }
  }

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
