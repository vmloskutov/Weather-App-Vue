import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

var app = new Vue({
  el: "#app",
  data: {
    message: "Привет, Vue!"
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
