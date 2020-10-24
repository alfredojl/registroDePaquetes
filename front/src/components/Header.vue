<template>
  <div class="" v-if="!($route.path == '/')">
    <div>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="home" :disabled="($route.path == '/home')">Buscar</b-nav-item>
        <b-nav-item to="registrar" :disabled="($route.path == '/registrar')">Registrar</b-nav-item>
        <b-nav-item to="validar" :disabled="($route.path == '/validar')">Validar</b-nav-item>
        <b-nav-item to="capturar" :disabled="($route.path == '/capturar')">Capturar</b-nav-item>
        <b-nav-item to="asignar" :disabled="($route.path == '/asignar')">Asignar</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <span class="text-white text-uppercase mr-3 my-auto" v-text="setCurrentUser()"></span>
        <b-button  size="sm" @click="logOut()" class="p-0">Cerrar sesión</b-button>

      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    setCurrentUser(){
      return localStorage.loggedIn
    },
    logOut() {
      localStorage.clear();
      this.$router.replace('/');
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
