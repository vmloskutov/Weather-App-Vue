<template>
  <div class="home">
    <div class="container">
      <HelloWorld msg="Weather App" />
      <div>
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
            <template v-if="props.option.country"  slot="option" slot-scope="props">
              {{ props.option.city + ', ' + props.option.country}}</template
            >
            <template v-else=""  slot="option" slot-scope="props">
              {{ props.option.city}}</template
            >
          </multiselect>
          {{info}}
        </div>
        <div class="weather" v-if="info">
          {{info}}
        </div>
      <WeatherIcon

        :lvl="weather.main"
        :temperature="weather.temp"
      >

      </WeatherIcon>
      <div class="output">
        {{weather.main}}
      </div>
      </div>
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
      weather: {},
      info: null,
      value: null,
      options: [],
      isLoading: false
    };
  },
  methods: {
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
                  })
                  if (flag)
                   {
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
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: {
            lat: selectedOption.lat,
            lon: selectedOption.lon,
            APPID: "31d8cd5bb9c6aec41d284a3c7b901c23"
          }
        })
        .then(
          response =>
            (this.weather = {
              main: response.data.weather[0].main,
              temp: response.data.main.temp
            })
        );
    }
  }
};
</script>
