<template>
  <b-carousel
    class="container"
    id="carousel-1"
    v-model="slide"
    :interval="0"
    controls
    indicators
    background="#161616"
    img-width="1024"
    img-height="480"
    style="text-shadow: 1px 1px 2px #333;"
    @sliding-start="onSlideStart"
    @sliding-end="onSlideEnd"
  >
    <b-carousel-slide
      v-for="item in forecast"
      v-bind:key="item.id"
      img-blank
    >
      <WeatherIcon :lvl="item.weather" :temperature="item.temperature" v-on:load>
      </WeatherIcon>
      <div class="output">
          {{ item.weather + " " + item.time }}
      </div>
    </b-carousel-slide>
  </b-carousel>
</template>

<script>
export default {
  name: "carousel",
  components: {
    WeatherIcon
  },
  data() {
    return {};
  },
  props: {
    temperature: {
      required: true
    },
    lvl: {
      required: true
    }
  }
};
</script>
