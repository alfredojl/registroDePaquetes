<template>
  <div class="container d-flex justify-content-center aling-content-center mt-5">
    <b-row class="justify-content-center mt-5">
      <!-- <div class="input-group mb-3 col-lg-4 my-4 mx-auto"> -->
        <b-card class="mb-2 text-center" title="Iniciar sesión" style="max-width: 18rem">
            <b-alert :show="error" variant="danger"">Error. Usuario y/o contraseña inválido(s). Intente nuevamente.</b-alert>
          <div class="input-group my-4 mx-auto">
            <input
              type="email"
              autofocus
              v-on:keyup.enter="$refs.pass.focus()"
              @click="error = false"
              @keypress="error = false"
              v-model="name"
              class="form-control input-login-form shadow-none py-4"
              placeholder="Usuario"
            />
          </div>

          <div class="input-group my-auto mx-auto">
            <input
              type="password"
              ref="pass"
              v-on:keyup.enter="onLogin()"
              @click="error = false"
              @keypress="error = false"
              v-model="passwd"
              class="form-control input-login-form shadow-none py-4"
              placeholder="Contraseña"
            />
          </div>

          <div class="d-flex justify-content-center">
            <button
              v-on:click="onLogin()"
              class="btn btn-success btn-login mt-4"
            >
              Iniciar Sesión
            </button>
          </div>
        </b-card>
      <!-- </div> -->
    </b-row>
  </div>
</template>

<script>
import config from "../config/config";
import axios from "axios";

export default {
  data() {
    return {
      error: false,
      name: "",
      passwd: "",
    };
  },
  created() {
    this.error = false;
  },
  methods: {
    onLogin() {
      /* eslint-disable no-console */

      const data = {
        name: this.name,
        passwd: this.passwd,
      };

      axios
        .post(`${config.api}/login`, data)
        .then((res) => {
          if (res.status == 200) {
            localStorage.setItem("loggedIn", res.data.usuario.name);
            if (res.data.usuario.role)
              localStorage.setItem("role", res.data.usuario.role);
            this.$router.replace("/home");
          }
        })
        .catch((err) => {
          this.error = true;
        });
    },
  },
};
</script>