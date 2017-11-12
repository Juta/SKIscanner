<template>
  <div>
    <div class="place-marker" :style="markerStyle">
    </div>
  </div>
</template>

<script>
import { latPct, lngPct } from './util'

export default {
  props: {
    id: null,
    orientation: null,
    dest: null
  },
  computed: {
    markerStyle () {
      return {
        left: latPct(this.place.lat),
        top: lngPct(this.place.lng),
        transform: 'rotate(' + this.orientation + 'deg)'
      }
    },
    place () {
      return this.places.find(p => p.Id === this.id) || {}
    },
    places () {
      return this.$parent.places || []
    }
  },
}
</script>

<style>
  .place-marker {
    position: absolute;
    margin: -1em;
    width: 2em;
    height: 2em;
    font-size: .75em;
    background: url(https://cdn.glitch.com/74ccbca4-c773-4c58-936b-bea9a092914a%2Fplane.svg?1510416555424);
    background-size: 100% 100%;
    transition: left 1s 1s, top 1s 1s, transform 1s;
  }
  .place-marker-you {
    position: absolute;
    top: 100%;
    font-size: 12px;
    color: black;
    left: 0;
    right: 0;
    text-align: center;
  }
</style>
