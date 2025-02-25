<template>
  <div class="about">
    <h1>Fait par les 🦉</h1>
    <!-- How it works Both Discogs and Spotify offer a Web API for Third Party Applications like this
    one. After logging in with your Spotify account, you will be asked to provide a Discogs
    username. Using the Web APIs, we will query the public collection of the given user and try our
    best to match each release from the collection to an album on Spotify. The result will be stored
    for you inside a newly created playlist in your Spotify account. Privacy DiscogsToSpotify is
    written completely in Client-side JavaScript, meaning it will run locally on your own machine.
    We will not store data of any kind about you. The only information we request from your Spotify
    account is where you come from, because not every release on Spotify is available for users in
    every country. About the Dev I'm Krispin, a German Developer and huge fan of Punk, Metal and
    Ska. I have been collecting records on vinyl for about three years now, and I keep track of my
    collection on Discogs. I also like to listen to my music on the go, so I thought it would be
    really cool if you could export your Discogs collection to a streaming service like Spotify.
    That's why I started developing DiscogsToSpotify. -->
  </div>
</template>

<style lang="scss">
@media (min-width: 920px) {
  .about {
    display: flex;
    align-items: center;
  }
}
</style>
