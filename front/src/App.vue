<template>
  <div id="app">
    <Header/>
      <router-view>
      </router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Header from './components/Header'


Vue.use(BootstrapVue)

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
