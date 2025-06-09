<template>
  <div class="about">
    <section class="about-section">
      <h2>Comment ça marche ?</h2>
      <p>
        Oisogs utilise les API publiques de Discogs pour vous offrir une analyse détaillée de votre
        collection de disques. En renseignant simplement votre nom d'utilisateur Discogs, notre
        application accède à votre collection publique et génère des statistiques visuelles sur vos
        artistes, genres et formats préférés, ainsi que l'évolution de votre collection au fil du
        temps.
      </p>
    </section>

    <section class="about-section">
      <h2>Confidentialité</h2>
      <p>
        Oisogs est conçu dans le respect de votre vie privée. L'application s'exécute directement
        dans votre navigateur et ne stocke aucune de vos données personnelles sur nos serveurs. Nous
        n'avons pas accès à vos informations de connexion Discogs, et les données de votre
        collection ne sont utilisées qu'à des fins d'affichage dans votre navigateur.
      </p>
    </section>

    <section class="about-section">
      <h2>À propos du développeur</h2>
      <p>
        Oisogs a été créé par un passionné de musique et de développement web. L'idée est née du
        désir de mieux comprendre et visualiser sa propre collection de disques, tout en offrant aux
        autres collectionneurs des outils simples pour explorer leurs trésors musicaux. Le projet
        est open source.
      </p>
    </section>
  </div>
</template>

<style lang="scss" scoped>
// Les imports sont gérés par Vite dans vite.config.js

.about {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: #fff;
  line-height: 1.6;
  display: flex;
  gap: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0rem;
  }

  h2 {
    font-size: 1.8rem;
    margin: 2.5rem 0 1rem;
    color: #fff;
  }

  .about-section {
    margin-bottom: 3rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    &:last-child {
      margin-bottom: 0;
    }

    p {
      margin: 1rem 0;
      font-size: 1.1rem;
    }
  }

  @media (min-width: 768px) {
    padding: 3rem 2rem;

    .about-section {
      padding: 2rem;
    }
  }
}
</style>
