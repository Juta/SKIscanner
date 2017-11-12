<template>
  <div style="position: absolute;top:0;left:0; right:0;bottom:0;">
    <!-- Connections -->
    <svg height="20em" width="20em">
      <line :x1="x1" :y1="y1" :x2="x2" :y2="y2" :style="lineStyle" />
    </svg>
    <button class="flight-marker" :style="markerStyle" @click="$emit('take')">
      <span class="flight-marker-text">
        {{ destPlace.Id }}
      </span>
    </button>
  </div>
</template>

<script>
import { latPct, lngPct } from './util'
  
export default {
  props: {
    flight: null,
    game: null,
    origin: null,
    dest: null
  },
  computed: {
    markerStyle () {
      return this.game ? {
        left: latPct(this.destPlace.lat),
        top: lngPct(this.destPlace.lng),
        height: this.game.size + 'em',
        width: this.game.size + 'em' 
      } : {
        backgroundImage: 'url("https://cdn.glitch.com/74ccbca4-c773-4c58-936b-bea9a092914a%2Fcabin-svgrepo-com%20(2).svg?1510419381393")',
        left: latPct(this.destPlace.lat),
        top: lngPct(this.destPlace.lng),
      }
    },
    lineStyle () {
      var hue = Math.floor(Math.min(this.flight.price, 300) / 300 * 120) // go from green to red
      var saturation = Math.abs(this.flight.price / 3 - 50)   // fade to white as it approaches 50
      return {
        stroke: 'hsl(' + hue + ',100%,50%)',
        strokeWidth: 3
      }
    },
    x1 () {
      return latPct(this.originPlace.lat)
    },
    y1 () {
      return lngPct(this.originPlace.lng)
    },
    x2 () {
      return latPct(this.destPlace.lat)
    },
    y2 () {
      return lngPct(this.destPlace.lng)
    },
    originPlace () {
      return this.places.find(p => p.Id === this.origin) || {}
    },
    destPlace () {
      return this.places.find(p => p.Id === this.dest) || {}
    },
    places () {
      return this.$parent.places || []
    }
  },
}
</script>

<style>
  .flight-marker {
    position: absolute;
    object-fit: contain;
    background: none;
    background-repeat: no-repeat;
    background-size: 100%;
    border: 0;
    outline: none;
    height: 1.5em;
    width: 1.5em;
    font-size: inherit;
    transform: translate(-50%, -50%);
    transition: width .5s, height .5s;
    pointer-events: all;
  }
  .flight-marker-text {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    text-align: center;
    color: black;
    font-size: 11px;
    pointer-events: all;
  }
  .flight-marker svg {
    pointer-events: none;
  }
</style>
