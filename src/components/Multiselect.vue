<template>
  <div>
    <div>
      <multiselect v-model="value" label="city" track-by="city  + ', ' + country" placeholder="Type to search" open-direction="bottom" :options="options" :multiple="false" :searchable="true" :loading="isLoading" :clear-on-select="true" :close-on-select="true" :options-limit="30" :limit="3" :limit-text="limitText" :max-height="600" :show-no-results="true" :hide-selected="false" @search-change="asyncFind">
        <template slot="option" slot-scope="props"> {{props.option.city}}</template>
      </multiselect>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import axios from "axios";
export default {
    // OR register locally
    components: { Multiselect },
    data () {
      return {
        info: null,
        value: null,
        options: [],
        isLoading: false
      }
    },
    methods: {
      limitText (count) {
        return `and ${count} other places`
      },
      asyncFind (query) {
        let self = this;
        this.options = [];
        this.isLoading = true
        if (query.length > 3) {
          axios
            .get(
              `https://geocode-maps.yandex.ru/1.x/`,
              {
                params: {
                  format: "json",
                  apikey: "b1998c24-d2dc-4cd0-888c-b100bf713440",
                  geocode: query
                }
              }
            )
            .then(response => (this.info = response.data.response.GeoObjectCollection.featureMember.forEach(item => {
              self.options.push({
                country: item.GeoObject.description,
                city: item.GeoObject.name,
                lat: item.GeoObject.Point.pos.split(' ')[0],
                lon: item.GeoObject.Point.pos.split(' ')[1]
              })
            })));

         }
        this.isLoading = false
      }
    }
  }
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
