<template>
  <div class="home">
    <div class="container">
      <HelloWorld msg="Weather App" />
      <div>
        <multiselect
          v-model="value"
          label="city"
          track-by="city"
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
      <b-carousel
        class="container"
        id="carousel-1"
        v-model="slide"
        :interval="0"
        controls
        background="#161616"
        img-width="1024"
        img-height="300"
        style="text-shadow: 1px 1px 2px #333;"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <b-carousel-slide
          v-for="item in forecast"
          v-bind:key="item.id"
          img-blank
        >
          <div class="output">
            {{ item.time.weekday + " " + item.time.time }}
          </div>
          <WeatherIcon :lvl="item.weather" :temperature="item.temperature">
          </WeatherIcon>
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
var moment = require("moment");

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
  computed: {
    getWeekDay(item) {
      switch (item.time.weekday) {
        case 1:
          item.time.weekday = "Понедельник";
          break;
        case 2:
          item.time.weekday = "Вторник";
          break;
        case 3:
          item.time.weekday = "Среда";
          break;
        case 4:
          item.time.weekday = "Четверг";
          break;
        case 5:
          item.time.weekday = "Пятница";
          break;
        case 6:
          item.time.weekday = "Суббота";
          break;
        case 7:
          item.time.weekday = "Воскресенье";
          break;
      }
    }
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
              moment.locale("ru");
              self.forecast.push({
                time: {
                  time: moment(item.dt * 1000).format("HH:mm"),
                  weekday: capitalize(
                    moment.weekdays(new Date(item.dt * 1000).getDay())
                  )
                },

                temperature: item.main.temp,
                weather: item.weather[0].main
              });
            }))
        );
    }
  }
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>
