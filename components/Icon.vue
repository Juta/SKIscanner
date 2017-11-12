<template>
  <span class="icon" v-html="icons[name] || icons.ski" />
</template>

<script>

const ski = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45.8 45.8">
  <circle class="fill-fg" cx="41.1" cy="5.9" r="4.7"/>
  <path class="fill-fg" d="M34 27c-1 0-1.7 1.2-1.4 2.3.5 1.8-.6 3.6-2.4 4l-16.4 4.2.3-.4 7.7-11L34 16.5c1.7-1.3 2-3.8.7-5.6-1-1.4-2.5-1.8-4-1.5l-17.3 3.4c-1.4.3-2.2 1.6-2 3 .3 1 1.3 2 2.5 2l6-1.3-4.4 3.2-1 1L7.2 33c-1 2-.6 4.4 1.3 5.6l.6.3-7.4 2c-1-.5-1.7 1-1.5 2 .3 1 1 1.3 2 1.3h.5L31.2 37c4-1 6.3-5 5.3-9-.3-1-1.4-1.6-2.4-1.3z"/>
</svg>`



export default {
  props: {
    name: null
  },
  data () {
    return {
      _icons: {
        ski
      }
    }
  }
}
</script>

<style>
.icon {
  display: inline-block;
}
</style>