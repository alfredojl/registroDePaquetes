<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Paquete" class="">
          <b-form-input
            type="number"
            autofocus
            v-model="noPaquete"
            v-on:keyup.enter="save()"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Folio inicio" class="">
          <b-form-input
            type="number"
            v-model="folioInicio"
            v-on:keyup.enter="save()"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Folio fin" class="">
          <b-form-input
            type="number"
            v-model="folioFin"
            v-on:keyup.enter="save()"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Fecha de expediente" class="">
          <b-form-input
            type="date"
            v-model="fechaExpediente"
            v-on:keyup.enter="save()"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-3"></div>
      <b-button-group>
        <b-button variant="success" @click="save()">Guardar cambios</b-button>
        <b-button
          @click="goValidar()"
          class="col-auto"
          variant="outline-success"
          >Validar</b-button
        >
        <b-button variant="info" @click="limpiar()">Limpiar</b-button>
        <b-button variant="danger" @click="eliminar()">Eliminar</b-button>
      </b-button-group>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../config/config";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      aux: null,
      noPaquete: null,
      digitalizador: null,
      paquete: null,
      folioInicio: null,
      folioFin: null,
      fechaExpediente: null,
      noFojas: null,
      fechaAlta: null,
      estado: null,
    };
  },
  created() {
    this.noPaquete = localStorage.noPaquete;
    this.search();
  },
  methods: {
    async search() {
      this.aux = JSON.parse(localStorage.getItem('paquete'));
      // this.noPaquete = aux.noPaquete;
      // this.bis = aux.bis;
      // this.folioInicio = aux.folioInicio;
      // this.folioFin = aux.folioFin;
      // console.log(aux);
      // let dia = aux.fechaExpediente.slice(8,10);
      // let mes = aux.fechaExpediente.slice(5,7);
      // this.fechaExpediente = dia + '/' + mes + '/' + aux.fechaExpediente.slice(0, 4)
      if (!aux)
        return Swal.fire("No se ingresó un paquete.", "Por favor, regrese a 'Búsqueda', busque un paquete y presione 'Editar'.", "info")
        .then(res => {
          if(res)
            this.$router.push("/home");
        });
        this.noPaquete = aux.noPaquete;
      await axios
        .get(`${config.api}/paquete`, {
          params: {
            noPaquete: aux.noPaquete,
            bis: aux.bis,
            folioInicio: aux.folioInicio
          },
        })
        .then((res) => {
          if (res.data.paquete.length == 0)
            return Swal.fire(
              `No se encontró el paquete ${this.noPaquete}.`,
              "",
              "error"
            );
          this.folioInicio = res.data.paquete[0].folioInicio;
          this.folioFin = res.data.paquete[0].folioFin;
          this.fechaExpediente = res.data.paquete[0].fechaExpediente
            ? new Date(res.data.paquete[0].fechaExpediente)
                .toISOString()
                .slice(0, 10)
            : null;
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    },
    goValidar() {
      localStorage.setItem("noPaquete", this.noPaquete);
      localStorage.setItem("folioInicio", this.folioInicio);
      localStorage.setItem("folioFin", this.folioFin);
      localStorage.setItem("fechaExpediente", this.fechaExpediente);
      this.$router.push("/validar");
    },
    limpiar() {
      this.noPaquete = null;
      this.folioInicio = null;
      this.folioFin = null;
      this.fechaExpediente = null;
      this.digitalizador = null;
    },
    eliminar() {
      Swal.fire({
        title: `¿Está seguro de que desea eliminar el paquete ${this.noPaquete}?`,
        showDenyButton: true,
        confirmButtonText: `Eliminar`,
        cancelButtonText: "Cancelar",
        icon: "warning"
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(this.noPaquete);
          console.log(this.bis);
          console.log(this.folioInicio);
          console.log(this.folioFin);
          axios.delete(`${config.api}/paquete`, {
            params: {
                noPaquete: this.noPaquete,
                bis: this.bis,
                folioInicio: this.folioInicio,
                folioFin: this.folioInicio
              }
          })
          .then(res => {
            Swal.fire(`¡Hecho!`, `Paquete ${this.noPaquete} eliminado correctamente.`, "success");
          })
          .catch(err => {
            console.log(err);
            Swal.fire(`¡Error!`, "No se pudo completar la acción.", "error");
          })
        }
      });
    },
    save() {
      axios
        .put(`${config.api}/paquete`, {
          paquete: {
            noPaquete: this.noPaquete,
            folioInicio: this.folioInicio,
            folioFin: this.folioFin,
            fechaExpediente: this.fechaExpediente
          },
          aux
        })
        .then((res) => {
          console.log(res.data);
          Swal.fire(
            `¡Hecho!`,
            `Paquete ${this.noPaquete} actualizado correctamente.`,
            "success"
          );
        })
        .catch((err) => {
          console.log(err.response);
          Swal.fire(
            `Error!`,
            `No se pudo actualizar el paquete.`,
            "error"
          );
        });
    },
  },
};
</script>

<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>