<template>
  <div id="app">
    <Header/>
      <router-view>
      </router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import {BootstrapVue, BIconPlusCircle, BIconDashCircle, BootstrapVueIcons} from 'bootstrap-vue'
import Vuetify from 'vuetify'
import Header from './components/Header'
// import 'vuetify/dist/vuetify.min.css'

Vue.use(BootstrapVue)
Vue.component('BIconPlusCircle', BIconPlusCircle);
Vue.component('BIconDashCircle', BIconDashCircle);
Vue.use(BootstrapVueIcons);

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
export default {
  name: 'app',
  components: {
    Header
  },

}
</script>

<style>
#app {

}
</style>
