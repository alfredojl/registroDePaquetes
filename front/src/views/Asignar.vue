<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Paquete" class="mb-5">
          <b-form-input
            type="number"
            v-model="noPaquete"
            v-on:keyup.enter="search"
          ></b-form-input>
          <b-form-checkbox
          class="m-1"
          v-model="bis"
          value="true"
          unchecked-value="false"
          >
            BIS
          </b-form-checkbox>
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
    <div class="row mt-2">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Folio inicio" class="">
          <b-form-input
            type="number"
            v-model="folioInicio"
            disabled
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
            disabled
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
            disabled
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Fecha de registro" class="">
          <b-form-input type="date" v-model="fechaAlta" disabled></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Turno" class="">
          <b-form-select
          autofocus
            v-model="turno"
            :options="turnos"
          >
          <template #first>
        </template>
          </b-form-select>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Verificador" class="">
          <!-- <b-form-input type="number" v-model="verificadores"></b-form-input> -->
          <b-form-select
            v-model="verificador"
            :options="verificadores"
            value-field="name"
            text-field="name"
            :disabled="!turno"
          >
          <template #first>
        </template>
          </b-form-select>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Preparador" class="">
          <!-- <b-form-input type="number" v-model="verificadores"></b-form-input> -->
          <b-form-select
            v-model="preparador"
            :options="preparadores"
            value-field="name"
            text-field="name"
            :disabled="!verificador"
          >
          <template #first>
        </template>
          </b-form-select>
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
    <div class="">
      <div class="row align-content-between mb-5">
        <div class="col-3"></div>
        <div class="beetween">
          <b-button-group size="sm">
            <b-button @click="save()" class="col-auto mt-2" variant="success"
              >Asignar</b-button
            >
            <b-button variant="info" class="col-auto mt-2" @click="limpiar()">Limpiar</b-button>
            <b-button class="col-auto mt-2" variant="outline-secondary" @click="goFormato()" right
              >Formato</b-button
            >
          </b-button-group>
        </div>
      </div>
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
      spinner: null,
      noPaquete: null,
      folioInicio: null,
      folioFin: null,
      noFojas: null,
      fechaAlta: null,
      bis: false,
      estado: null,
      estados: null,
      fechaExpediente: null,
      fechaAsignacion: null,
      turno: null,
      verificador: null,
      verificadores: null,
      preparador: null,
      preparadores: null,
      turnos: ["Matutino", "Vespertino"],
    };
  },
  created() {
    this.getEstados();
    this.noPaquete = localStorage.noPaquete;
    this.fechaAsignacion = new Date();
    // this.fechaAsignacion = this.fechaAsignacion.toISOString().slice(0, 10);
    this.getVerificadores();
    this.getPreparadores();
    this.bis = localStorage.bis;
    this.search();
  },
  methods: {
    goFormato(){
      localStorage.setItem("noPaquete", this.noPaquete);
      localStorage.setItem("bis", this.bis);
      this.$router.push('/formato');
    },
    limpiar(){
      this.preparador = null;
      this.estado = null;
      this.digitalizador = null;
      this.verificador = null;
      this.turno = null;
    },
    getVerificadores(value) {
      axios
        .get(`${config.api}/verificadores`, {
          params: {
            turno: value,
          },
        })
        .then((res) => {
          this.verificadores = res.data.verificadores;
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    },
    getPreparadores(value) {
      axios
        .get(`${config.api}/preparadores`)
        .then((res) => {
          this.preparadores = res.data.preparadores;
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
      axios
        .get(`${config.api}/verificadores`)
        .then((res) => {
          let veri = res.data.verificadores;
          veri.forEach(el => {
            this.preparadores.push(el)
          })
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
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
        return Swal.fire("Ingrese un número de paquete.", "", "info");
      axios
        .get(`${config.api}/paquete`, {
          params: {
            noPaquete: this.noPaquete,
            bis: this.bis
          },
        })
        .then((res) => {

        if (!res.data.paquete)
          {
            return Swal.fire(
              `No se encontró el paquete ${this.noPaquete}.`,
              "",
              "error"
            )
            .then(result => {
              this.spinner = false;
            })
          }
          this.folioInicio = res.data.paquete.folioInicio;
          this.folioFin = res.data.paquete.folioFin;
          this.noFojas = res.data.paquete.noFojas;
          this.fechaAlta = res.data.paquete.fechaAlta;
          this.estado = res.data.paquete.estado;
          this.turno = res.data.paquete.turno;
          this.verificador = res.data.paquete.verificador;
          this.preparador = res.data.paquete.preparador;
          this.fechaExpediente = res.data.paquete.fechaExpediente
            ? new Date(res.data.paquete.fechaExpediente)
                .toISOString()
                .slice(0, 10)
            : null;
          // this.fechaAsignacion = res.data.paquete.fechaAsignacion
          //   ? new Date(res.data.paquete.fechaAsignacion)
          //       .toISOString()
          //       .slice(0, 10)
          //   : null;
          this.fechaAlta = new Date(res.data.paquete.fechaAlta)
            .toISOString()
            .slice(0, 10);
            this.spinner = false;
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    },
    save() {
      if (
        !this.noPaquete
      )
        return Swal.fire("Seleccione un paquete.", "", "info");
      else
        if(!this.preparador)
          return Swal.fire("Seleccione un preparador.", "", "info");
        Swal.fire({
        title: `¿Asignar a ${this.preparador}?`,
        showCancelButton: true,
        confirmButtonText: `Asignar`,
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          axios.put(`${config.api}/paquete`, {
            verificador: this.verificador,
            preparador: this.preparador,
            bis: this.bis,
            fechaAsignacion: this.fechaAsignacion,
            turno: this.turno,
            noPaquete: this.noPaquete
          })
          .then(res => {
            // Swal.fire(`Asignado.`, "", "success");
            Swal.fire({
              title: `¡Hecho!`,
              position: "top-end",
              text: `Paquete asignado.`,
              icon: "success",
              showConfirmButton: false,
              timer: 1000,
            });
          })
          .catch(err => {
            console.log(err);
          })
        }
      });
      if(this.estado == 'Preparado')
        return Swal.fire("Seleccione un digitalizador.", "", "info");
    },
  },
};
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
