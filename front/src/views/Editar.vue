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
    search() {
      if (!this.noPaquete)
        return Swal.fire("Ingresa un número de paquete.", "", "info");
      axios
        .get(`${config.api}/paquete`, {
          params: {
            noPaquete: this.noPaquete,
          },
        })
        .then((res) => {
          if (!res.data.paquete)
            return Swal.fire(
              `No se encontró el paquete ${this.noPaquete}.`,
              "",
              "error"
            );
          this.folioInicio = res.data.paquete.folioInicio;
          this.folioFin = res.data.paquete.folioFin;
          this.fechaAlta = res.data.paquete.fechaAlta;
          this.fechaExpediente = res.data.paquete.fechaExpediente
            ? new Date(res.data.paquete.fechaExpediente)
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
          axios.delete(`${config.api}/paquete`, {
            params: {
                noPaquete: this.noPaquete
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
      let oldNoPaquete = localStorage.noPaquete;
      let data = {
        
        
        
        
        
        
      };
      axios
        .put(`${config.api}/paquete`, {
          noPaquete: this.noPaquete,
          oldNoPaquete,
          folioInicio: this.folioInicio,
          folioFin: this.folioFin,
          registrado: localStorage.loggedIn,
          fechaExpediente: this.fechaExpediente,
        })
        .then((res) => {
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