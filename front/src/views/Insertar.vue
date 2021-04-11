<template>
  <div class="container">
    <p class="mono text-center mt-3">Insertar paquetes manualmente</p>
    <div class="row justify-content-center mt-5 mb-2" align-v="center">
      <b-form>
        <b-row>
          <b-form-input
            autofocus
            type="number"
            placeholder="Número de paquete"
            class="mb-2"
            @copy.prevent
            v-model="noPaquete"
            @keyup.enter="$refs.folioInicio.focus()"
          >
          </b-form-input>
        </b-row>
        <b-row>
          <b-form-input
            type="number"
            placeholder="Folio inicio"
            class="mb-2"
            @copy.prevent
            ref="folioInicio"
            v-model="folioInicio"
            @keyup.enter="$refs.folioFin.focus()"
          >
          </b-form-input>
        </b-row>
        <b-row>
          <b-form-input
            placeholder="Folio fin"
            class="mb-2"
            type="number"
            @copy.prevent
            ref="folioFin"
            v-model="folioFin"
            @keyup.enter="$refs.fecha.focus()"
          >
          </b-form-input>
        </b-row>
        <b-row class="mt-2" style="width: 20rem">
          <b-form-input
            type="date"
            ref="fecha"
            v-model="fechaExpediente"
            @keyup.enter="save()"
          ></b-form-input>
        </b-row>
        <!-- </b-form> -->
        <b-row class="justify-content-between mt-2 align-content-center">
          <b-form-checkbox
            class=""
            id="checkbox-1"
            v-model="bis"
            name="checkbox-1"
            value="true"
            unchecked-value="false"
            switch
          >
            BIS
          </b-form-checkbox>
          <p>Paquetes</p>
          <b-form-input
            type="number"
            placeholder="#"
            style="max-width: 3rem"
            class="ml-1"
            size="sm"
            v-model="identificador"
          ></b-form-input
          >/
          <b-form-input
            style="max-width: 3rem"
            type="number"
            size="sm"
            placeholder="cantidad"
            v-model="cantidad"
            @click="save()"
          ></b-form-input>
        </b-row>
      </b-form>
  </div>
    </div>
</template>
<script>
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config/config';

export default {
  data() {
    return {
      noPaquete: "",
      bis: false,
      folioInicio: null,
      folioFin: null,
      fechaExpediente: null,
      cantidad: null,
      identificador: null,
    };
  },
  computed: {
    valida() {
      if (this.noPaquete.length > 5) {
        return false;
      }
    },
  },
  methods: {
      async save(){
        // if(!this.noPaquete || !this.folioInicio || !this.folioFin)
        //     return Swal.fire('', '¡Verifica los datos!', 'info');
        Swal.fire({
            title: '¿Seguro de que los datos están correctos?',
            text: 'Los datos se guardarán como los ha ingresado, incluyendo los folios.',
            icon: 'question',
            denyButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            showDenyButton: true
        })
        .then( async(res) => {
            let data = {
                noPaquete: this.noPaquete,
                folioInicio: this.folioInicio,
                folioFin: this.folioFin,
                fechaExpediente: this.fechaExpediente,
                cantidad: this.cantidad,
                identificador: this.identificador,
                bis: this.bis,
                fechaAlta: new Date(),
                registrado: localStorage.loggedIn
            }
            await axios.post(`${config.api}/insert`, { data })
            .then(res => {
                if(!res.data.ok)
                    return Swal.fire({
                        title: '',
                        text: `${res.data.message}`,
                        icon: 'info'
                    })
                Swal.fire({
                    title: "¡Hecho!",
                    text: `El paquete ${res.data.paquete.noPaquete} ha sido creado exitosamente.`,
                    icon: 'success',
                    timer: 1000,
                    showConfirmButton: false
                });
            })
            .catch(err => {
                console.log(err);
                Swal.fire({
                    title: '¡Error!',
                    text: 'Algo ha salido mal. Consulte a sistemas.',
                    icon: 'error'
                });
            })
        })
      }
  },
};
</script>
<style scoped>
.mono {
  font-family: "Times New Roman", Times, serif;
  font-size: 2rem;
}
</style>
