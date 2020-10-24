<template>
  <div class="container mt-2">
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Paquete" class="mb-5">
          <b-form-input
            type="number"
            autofocus
            v-model="noPaquete"
            v-on:keyup.enter="search()"
          ></b-form-input>
          <b-input-group-prepend>
            <b-button variant="secondary" @click="search()">Buscar</b-button>
          </b-input-group-prepend>
        </b-input-group>
      </div>
    </div>
    <div class="row mt-5" v-if="spinner">
      <b-spinner
        variant="dark"
        class="p-lg-5 m-auto"
        label="Spinning"
      ></b-spinner>
    </div>
    <div v-else>
      <div class="row">
        <div class="col-3"></div>
        <div class="col-6 p-0 d-flex">
          <b-input-group prepend="Folio inicio" class="">
            <b-form-input
              type="number"
              disabled
              v-model="folioInicio"
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
              disabled
              v-model="folioFin"
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
              disabled
              v-model="fechaExpediente"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col-6 p-0 d-flex">
          <b-input-group prepend="Fecha de registro" class="">
            <b-form-input
              type="date"
              disabled
              v-model="fechaAlta"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col-6 p-0 d-flex">
          <b-input-group prepend="Turno" class="">
            <b-form-select
              v-model="turno"
              :options="turnos"
              disabled
            ></b-form-select>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col-6 p-0 d-flex">
          <b-input-group prepend="Verificador" class="">
            <b-form-input
              type="text"
              disabled
              v-model="verificador"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col-6 p-0 d-flex">
          <b-input-group prepend="Preparador" class="">
            <b-form-input type="text" v-model="preparador"></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col-6 p-0 d-flex">
          <b-input-group prepend="Número de fojas" class="">
            <b-form-input type="number" v-model="noFojas"></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col-6 p-0 d-flex">
          <b-input-group prepend="Estado" class="">
            <b-form-select
              v-model="estado"
              :options="estados"
              value-field="estado"
              text-field="estado"
            ></b-form-select>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <b-form-textarea
          id="textarea-small"
          placeholder="Agregue las observaciones..."
          size=""
          class="col-6 d-flex"
          v-model="observaciones"
        ></b-form-textarea>
      </div>
      <div class="row mt-3 mb-5">
        <div class="col-3"></div>
        <b-button-group>
          <b-button variant="success" @click="save()">Guardar</b-button>
          <b-button variant="info" @click="limpiar()">Limpiar</b-button>
        </b-button-group>
      </div>
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
      folioInicio: null,
      folioFin: null,
      noFojas: null,
      fechaAlta: null,
      fechaExpediente: null,
      noPaquete: null,
      spinner: null,
      estado: null,
      estados: null,
      verificador: null,
      preparador: null,
      preparadores: null,
      turno: null,
      observaciones: null,
      turnos: ["Matutino", "Vespertino"],
    };
  },
  created() {
    this.noPaquete = localStorage.noPaquete;
    this.getEstados();
    this.search();
  },
  methods: {
    limpiar() {
      this.noFojas = null;
      this.estado = null;
      this.folioInicio = null;
      this.folioFin = null;
      this.fechaAlta = null;
      this.fechaExpediente = null;
      this.preparador = null;
      this.verificador = null;
    },
    getPreparadores() {
      if (!this.preparador)
        axios
          .get(`${config.api}/preparadores`, {
            verificador: this.verificador,
          })
          .then((res) => {
            this.preparadores = res.data.preparadores;
          })
          .catch((err) => {
            console.log(err);
          });
    },
    getEstados() {
      axios
        .get(`${config.api}/estado`)
        .then((res) => {
          this.estados = res.data.estados;
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    },
    search() {
      this.spinner = true;
      if (!this.noPaquete)
        return Swal.fire("Ingresa un número de paquete", "", "info");
      axios
        .get(`${config.api}/paquete`, {
          params: {
            noPaquete: this.noPaquete,
          },
        })
        .then((res) => {
          this.folioInicio = res.data.paquete.folioInicio;
          this.folioFin = res.data.paquete.folioFin;
          this.noFojas = res.data.paquete.noFojas;
          this.fechaAlta = res.data.paquete.fechaAlta;
          this.estado = res.data.paquete.estado;
          this.turno = res.data.paquete.turno;
          this.fechaExpediente = res.data.paquete.fechaExpediente
            ? new Date(res.data.paquete.fechaExpediente)
                .toISOString()
                .slice(0, 10)
            : null;
          this.fechaAlta = new Date(res.data.paquete.fechaAlta)
            .toISOString()
            .slice(0, 10);
          this.validador = res.data.paquete.validador;
          this.preparador = res.data.paquete.preparador;
          this.verificador = res.data.paquete.verificador;
          this.noFojas = res.data.paquete.noFojas;
          this.observaciones = res.data.paquete.observaciones;
          this.getPreparadores();
          this.spinner = false;
        })
        .catch((error) => {
          if (error) {
            Swal.fire(
              `No se pudo encontrar el paquete ${this.noPaquete}.`,
              "",
              "error"
            );
            this.spinner = false;
            console.log(error);
          }
        });
    },
    save() {
      if (
        !this.noPaquete ||
        !this.turno ||
        !this.verificador ||
        !this.preparador ||
        !this.noFojas ||
        !this.estado
      )
        return Swal.fire("Complete los campos.", "", "info");
      Swal.fire({
        title: `¿Desea guardar los cambios?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Guardar`,
        denyButtonText: `Descartar`,
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          let data = {
            noPaquete: this.noPaquete,
            noFojas: this.noFojas,
            estado: this.estado,
            preparador: this.preparador,
            observaciones: this.observaciones,
          };
          this.spinner = true;
          axios
            .put(`${config.api}/paquete`, data)
            .then((res) => {
              Swal.fire(
                "¡Hecho!",
                "Datos actualizados correctamente.",
                "success"
              );
              this.spinner = false;
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
  },
};
</script>

</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.beetween {
  display: flex;
  justify-content: space-between !important;
}
</style>
