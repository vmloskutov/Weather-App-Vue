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
        indicators
        controls
        label-goto-slide="3"
        background="#161616"
        img-width="1024"
        img-height="300"
        style="text-shadow: 1px 1px 2px #333;"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <b-carousel-slide
          v-for="(item, index) in forecast.slice(1)"
          v-bind:key="item.id"
          img-blank
        >
          <div class="weekday-forecast">
            <div class="weekday-label">
              {{ item[0].time.weekday }}
            </div>
            <div class="weather-row">
              <div class="weather-icon" v-for="i in item" v-bind:key="i.id">
                <div class="weather-day">
                  <div class="output">
                    {{ i.time.time }}
                  </div>
                  <WeatherIcon :lvl="i.weather" :temperature="i.temperature">
                  </WeatherIcon>
                </div>
              </div>
            </div>
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
  created() {
    if (this.$route.fullPath !== "/") {
      let path = this.$route.fullPath;
      let arr = path.split("&");
      arr[0] = arr[0].replace(/\/\?day=/, "");
      arr[1] = arr[1].replace(/lat=/, "");
      arr[2] = arr[2].replace(/lon=/, "");
      this.forecast = [];
      let day = [];
      let tempDate = null;
      let self = this;
      axios
        .get(`https://api.openweathermap.org/data/2.5/forecast`, {
          params: {
            lat: arr[1],
            lon: arr[2],
            APPID: "31d8cd5bb9c6aec41d284a3c7b901c23"
          }
        })
        .then(
          response =>
            (this.weather = response.data.list.forEach(item => {
              moment.locale("ru");
              if (tempDate !== moment(item.dt * 1000).format("l")) {
                self.forecast.push(day);
                day = [];
                tempDate = moment(item.dt * 1000).format("l");
                day.push({
                  place: {
                    lat: arr[1],
                    lon: arr[2]
                  },
                  time: {
                    date: moment(item.dt * 1000).format("l"),
                    time: moment(item.dt * 1000).format("HH:mm"),
                    weekday: capitalize(
                      moment.weekdays(new Date(item.dt * 1000).getDay())
                    )
                  },
                  temperature: item.main.temp,
                  weather: item.weather[0].main
                });
              } else {
                day.push({
                  place: {
                    lat: arr[1],
                    lon: arr[2]
                  },
                  time: {
                    date: moment(item.dt * 1000).format("l"),
                    time: moment(item.dt * 1000).format("HH:mm"),
                    weekday: capitalize(
                      moment.weekdays(new Date(item.dt * 1000).getDay())
                    )
                  },
                  temperature: item.main.temp,
                  weather: item.weather[0].main
                });
              }
            }))
        );
      //  this.value = {city :"gfchv"};
      axios
        .get(`https://geocode-maps.yandex.ru/1.x/`, {
          params: {
            format: "json",
            apikey: "b1998c24-d2dc-4cd0-888c-b100bf713440",
            geocode: arr[2] + "," + arr[1]
          }
        })
        .then(
          response =>
            (this.value = {
              city:
                response.data.response.GeoObjectCollection.featureMember[0]
                  .GeoObject.name
            })
        );
    }
  },
  methods: {
    onSlideStart(slide) {
      this.$router.push({
        path: "/",
        query: {
          day: this.forecast[slide + 1][0].time.date,
          lat: this.forecast[slide + 1][0].place.lat,
          lon: this.forecast[slide + 1][0].place.lon
        }
      });
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
      let day = [];
      let tempDate = null;
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
              if (tempDate !== moment(item.dt * 1000).format("l")) {
                self.forecast.push(day);
                day = [];
                tempDate = moment(item.dt * 1000).format("l");
                day.push({
                  place: {
                    lat: selectedOption.lat,
                    lon: selectedOption.lon
                  },
                  time: {
                    date: moment(item.dt * 1000).format("l"),
                    time: moment(item.dt * 1000).format("HH:mm"),
                    weekday: capitalize(
                      moment.weekdays(new Date(item.dt * 1000).getDay())
                    )
                  },
                  temperature: item.main.temp,
                  weather: item.weather[0].main
                });
              } else {
                day.push({
                  place: {
                    lat: selectedOption.lat,
                    lon: selectedOption.lon
                  },
                  time: {
                    date: moment(item.dt * 1000).format("l"),
                    time: moment(item.dt * 1000).format("HH:mm"),
                    weekday: capitalize(
                      moment.weekdays(new Date(item.dt * 1000).getDay())
                    )
                  },
                  temperature: item.main.temp,
                  weather: item.weather[0].main
                });
              }
            }))
        );
      this.$router.push({
        path: "/",
        query: {
          day: moment(new Date()).format("l"),
          lat: selectedOption.lat,
          lon: selectedOption.lon
        }
      });
    }
  }
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>
