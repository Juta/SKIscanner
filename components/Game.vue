<template>
  <div class="game-marker" :style="markerStyle" @click="$emit('take')">
  </div>
</template>

<script>
import { latPct, lngPct } from './util'
  
export default {
  props: {
    game: null
  },
  computed: {
    markerStyle () {
      return {
        backgroundImage: 'url("https://cdn.glitch.com/74ccbca4-c773-4c58-936b-bea9a092914a%2Fsports-trophy-cup-svgrepo-com.svg?1510431270537")',
        left: latPct(this.place.lat),
        top: lngPct(this.place.lng),
        height: this.game.size + 'em',
        width: this.game.size + 'em'
      }
    },
    place () {
      return this.places.find(p => p.Id === this.game.placeId)
    },
    places () {
      return this.$parent.places || []
    }
  }
} 
</script>

<style>
.game-marker {
  position: absolute;
  z-index: 4;
  object-fit: contain;
  background: none;
  background-repeat: no-repeat;
  background-size: 100%;
  border: 0;
  outline: none;
  transform: translate(-50%, -50%);
  transition: width .5s, height .5s;
}
</style>
