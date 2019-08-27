<template>
  <div class="weather">
    <div v-if="lvl === 'Drizzle'" class="icon sun-shower">
      <div class="cloud"></div>
      <div class="sun">
        <div class="rays"></div>
      </div>
      <div class="rain"></div>
    </div>

    <div v-if="lvl === 'Thunderstorm'" class="icon thunder-storm">
      <div class="cloud"></div>
      <div class="lightning">
        <div class="bolt"></div>
        <div class="bolt"></div>
      </div>
    </div>

    <div v-if="lvl === 'Clouds'" class="icon cloudy">
      <div class="cloud"></div>
      <div class="cloud"></div>
    </div>

    <div v-if="lvl === 'Snow'" class="icon flurries">
      <div class="cloud"></div>
      <div class="snow">
        <div class="flake"></div>
        <div class="flake"></div>
      </div>
    </div>

    <div v-if="lvl === 'Clear'" class="icon sunny">
      <div class="sun">
        <div class="rays"></div>
      </div>
    </div>

    <div v-if="lvl === 'Rain'" class="icon rainy">
      <div class="cloud"></div>
      <div class="rain"></div>
    </div>

    <div
      v-if="lvl === 'Fog' || lvl === 'Mist' || lvl === 'Smoke'"
      class="icon foggy"
    >
      <div class="cloud"></div>
      <div class="fog"></div>
      <div class="fog"></div>
      <div class="fog"></div>
    </div>
    <div v-if="temperature" class="temperature">
      {{ Math.floor(temperature - 273.15) }}°C
    </div>
  </div>
</template>

<script>
export default {
  name: "weather",
  components: {},
  data() {
    return {};
  },
  created() {
    let arr = document.querySelector("#carousel-1").getElementsByTagName("a");
    arr = [].slice.call(arr);
    arr.forEach(item => {
      item.style.display = "flex";
    });
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
