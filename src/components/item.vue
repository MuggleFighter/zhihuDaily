<template>
  <a href="#" class="daily-item">
    <div class="daily-img" v-if="data.images">
      <img :src="imgPath + data.images[0]" alt="">
    </div>
    <div class="daily-title"
         :class="{noImg: !data.images}">{{data.title}}
    </div>
  </a>
</template>

<script>
  import $ from '../assets/util'

  export default {
    name: 'item',
    props: {
      data: {
        type: Object
      }
    },
    data() {
      return {
        imgPath: $.imgPath
      }
    }
  }
</script>

<style scoped>

</style>
