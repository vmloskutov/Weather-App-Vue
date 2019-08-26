<template>
  <div class="home">
    <div class="container">
      <HelloWorld msg="Weather App" />
      <div>
        <multiselect
          v-model="value"
          label="city"
          track-by="city  + ', ' + country"
          placeholder="Type to search"
          open-direction="bottom"
          :options="options"
          :multiple="false"
          :searchable="true"
          :loading="isLoading"
          :clear-on-select="true"
          :close-on-select="true"
          :options-limit="10"
          :limit="3"
          :limit-text="limitText"
          :max-height="600"
          :show-no-results="true"
          :hide-selected="false"
          @search-change="asyncFind"
          @select="selectedCity"
          @open="clearSelected"
        >
          <template
            v-if="props.option.country"
            slot="option"
            slot-scope="props"
          >
            {{ props.option.city + ", " + props.option.country }}</template
          >
          <template v-else="" slot="option" slot-scope="props">
            {{ props.option.city }}</template
          >
        </multiselect>
        {{ info }}
      </div>
    </div>
    <div>
      <!-- <b-carousel
    class="container"
        id="carousel-1"
        v-model="slide"
        indicators
        :interval="0"
        img-width="1024"
        img-height="600"
        background="#161616"
        style="position: relative; align-items: center;"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <b-carousel-slide img-blank img-alt="Blank image" v-for="item in forecast" v-bind:key="item.id">
          <WeatherIcon :lvl="item.weather" :temperature="item.temperature" style="align-items: center; justify-content: center;">
          </WeatherIcon>
          <div class="output">
            {{ item.weather + " " + item.time }}
          </div>
        </b-carousel-slide>
      </b-carousel> -->
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
          <WeatherIcon :lvl="item.weather" :temperature="item.temperature">
          </WeatherIcon>
          <div class="output">
            {{ item.weather + " " + item.time }}
          </div>
        </b-carousel-slide>
      </b-carousel>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import WeatherIcon from "@/components/WeatherIcon.vue";
import Multiselect from "vue-multiselect";
import axios from "axios";

export default {
  name: "home",
  components: {
    HelloWorld,
    Multiselect,
    WeatherIcon
  },
  data() {
    return {
      forecast: [],
      weather: null,
      info: null,
      value: null,
      options: [],
      isLoading: false,
      slide: 0,
      sliding: null
    };
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },
    limitText(count) {
      return `and ${count} other places`;
    },
    asyncFind(query) {
      let self = this;
      this.options = [];
      this.isLoading = true;
      if (query.length > 2) {
        axios
          .get(`https://geocode-maps.yandex.ru/1.x/`, {
            params: {
              format: "json",
              apikey: "b1998c24-d2dc-4cd0-888c-b100bf713440",
              geocode: query
            }
          })
          .then(
            response =>
              (this.info = response.data.response.GeoObjectCollection.featureMember.forEach(
                item => {
                  let flag = true;
                  self.options.forEach(el => {
                    if (el.city === item.GeoObject.name) {
                      flag = false;
                    }
                  });
                  if (flag) {
                    self.options.push({
                      country: item.GeoObject.description,
                      city: item.GeoObject.name,
                      lat: item.GeoObject.Point.pos.split(" ")[1],
                      lon: item.GeoObject.Point.pos.split(" ")[0]
                    });
                  }
                }
              ))
          );
      }
      this.isLoading = false;
    },
    clearSelected() {
      this.value = null;
    },
    selectedCity(selectedOption) {
      this.forecast = [];
      let self = this;
      axios
        .get(`https://api.openweathermap.org/data/2.5/forecast`, {
          params: {
            lat: selectedOption.lat,
            lon: selectedOption.lon,
            APPID: "31d8cd5bb9c6aec41d284a3c7b901c23"
          }
        })
        .then(
          response =>
            (this.weather = response.data.list.forEach(item => {
              self.forecast.push({
                time: convertTimestamp(item.dt),
                temperature: item.main.temp,
                weather: item.weather[0].main
              });
            }))
        );
    }
  }
};

function convertTimestamp(timestamp) {
  var d = new Date(timestamp * 1000 - 10800000), // Convert the passed timestamp to milliseconds
    hh = d.getHours(),
    h = hh,
    min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
    time;

  // ie: 2013-02-18, 8:35 AM
  time = h + ":" + min;

  return time;
}
</script>
