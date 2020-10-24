<template>
  <div class="container">
      <div class="row">
          <div class="col-4"></div>
    <div style="max-width: 25rem" class="mt-5 col-3 justify-content-center">
        <b-form-group id="input-group-2" label="Nombre de usuario:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="name"
            required
            v-on:keyup.enter="crear()"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-3" label="Contraseña:" label-for="input-3">
          <b-form-input
            id="input-3"
            v-model="passwd"
            required
            type="password"
            v-on:keyup.enter="crear()"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-3" label="Repita la contraseña:" label-for="input-3">
          <b-form-input
            id="input-4"
            v-model="passwd2"
            required
            type="password"
            v-on:keyup.enter="crear()"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="success" @click="crear()">Crear</b-button>
        <b-button type="reset" variant="danger" @click="limpiar()">Limpiar</b-button>
    </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import config from '../config/config';
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            name: null,
            passwd: null,
            passwd2: null
        }
    },
    methods: {
        limpiar(){
            this.name = null;
            this.passwd = null;
            this.passwd2 = null;
        },
        crear(){
            if(!this.name || !this.passwd)
                return Swal.fire('Complete los campos', '', 'info');
            if(this.passwd != this.passwd2)
                return Swal.fire('Las contraseñas no coinciden', '', 'error')
            axios.post(`${config.api}/user`, {
                name: this.name,
                passwd: this.passwd
            })
            .then(res => {
                Swal.fire(`Usuario ${this.name} añadido con éxito.`, '', 'success')
            })
            .catch(err => {
                console.log(err);
                Swal.fire(`¡Error!`, `Ocurrió un error al agregar el usuario ${this.name}.`, 'error')
            })
        }
    },
}
</script>