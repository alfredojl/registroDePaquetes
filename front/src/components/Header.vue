<template>
  <div class="" v-if="!($route.path == '/')">
    <div>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="home" :disabled="($route.path == '/home')"><span :class="$route.path == '/home' ? 'bg-light badge p-2 rounded-pill text-dark' : 'text-white'">Buscar</span></b-nav-item>
        <b-nav-item to="registrar" :disabled="($route.path == '/registrar')"><span :class="$route.path == '/registrar' ? 'bg-light badge p-2 rounded-pill text-dark' : 'text-white'">Registrar</span></b-nav-item>
        <b-nav-item to="editar" :disabled="($route.path == '/editar')"><span :class="$route.path == '/editar' ? 'bg-light badge p-2 rounded-pill text-dark' : 'text-white'">Editar</span></b-nav-item>
        <b-nav-item to="insertar" :disabled="($route.path == '/insertar')"><span :class="$route.path == '/insertar' ? 'bg-light badge p-2 rounded-pill text-dark' : 'text-white'">Insertar</span></b-nav-item>
        <b-nav-item to="validar" :disabled="($route.path == '/validar')"><span :class="$route.path == '/validar' ? 'bg-light badge p-2 rounded-pill text-dark' : 'text-white'">Validar</span></b-nav-item>
        <!-- <b-nav-item to="capturar" :disabled="($route.path == '/capturar')"><span :class="$route.path == '/capturar' ? 'bg-light badge p-2 rounded-pill text-dark' : 'text-white'">Capturar</span></b-nav-item> -->
        <!-- <b-nav-item to="asignar" :disabled="($route.path == '/asignar')"><span :class="$route.path == '/asignar' ? 'bg-light badge p-2 rounded-pill text-dark' : 'text-white'">Asignar</span></b-nav-item> -->
        <b-nav-item to="lotes" :disabled="($route.path == '/lotes')"><span :class="$route.path == '/lotes' ? 'bg-light badge p-2 rounded-pill text-dark' : 'text-white'">Lotes</span></b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <span class="text-white text-uppercase mr-3 my-auto" v-text="setCurrentUser()"></span>
        <b-button  size="sm" @click="logOut()">Cerrar sesión</b-button>

      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  },
  name: 'HelloWorld',
  props: {
    msg: String
  },
  created() {
    if(localStorage.loggedIn == 'Antonio' || localStorage.loggedIn == 'Alfredo')
      this.show = true;
    else
      this.show = false;
  },
  methods: {
    setCurrentUser(){
      return localStorage.loggedIn
    },
    logOut() {
      localStorage.clear();
      this.$router.replace('/');
    },
    roleExist() {
      if(!localStorage.role)
        return false
      return true
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
