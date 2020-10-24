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
            maxlength="5"
            :state="valida"
            v-on:keyup.enter="search()"
          ></b-form-input>
          <b-input-group-prepend>
            <b-button variant="secondary" @click="search()">Buscar</b-button>
          </b-input-group-prepend>
        </b-input-group>
      </div>
    </div>
    <div v-show="cantidad">
      <div class="row mt-1">
      <div class="col-3"></div>
      <div class="col-3 p-0 d-flex">
        <b-input-group prepend="Número" class="mb-5">
          <b-form-input
            type="number"
            class="col-2"
            v-model="identificador"
            disabled
          ></b-form-input>
          <b-form-input
            type="text"
            class="col-2"
            value="de"
            disabled
          ></b-form-input>
          <b-form-input
            type="number"
            class="col-2"
            v-model="cantidad"
            disabled
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    </div>
    <div class="row mkeyt-5">
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
        <b-input-group prepend="Estado" class="">
          <b-form-input type="text" v-model="estado" disabled></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Registrado por" class="">
          <b-form-input
            type="text"
            v-model="registrador"
            disabled
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Validado por" class="">
          <b-form-input type="text" v-model="validador" disabled></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Verificador" class="">
          <b-form-input
            type="text"
            v-model="verificador"
            disabled
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Preparador" class="">
          <b-form-input
            type="text"
            disabled
            v-model="preparador"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Digitalizador" class="">
          <b-form-input
            type="text"
            disabled
            v-model="digitalizador"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Número de fojas" class="">
          <b-form-input type="number" v-model="noFojas" disabled></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <b-form-textarea
        id="textarea-small"
        size=""
        class="col-6 d-flex"
        v-model="observaciones"
      ></b-form-textarea>
    </div>
    <div class="">
      <div class="row align-content-between">
        <div class="col-3"></div>
        <div class="">
          <b-button-group size="sm">
            <b-button
              @click="goValidar()"
              class="col-auto mt-3 mb-5"
              variant="outline-success"
              >Validar</b-button
            >
            <b-button
              class="col-auto mt-3 mb-5"
              variant="outline-primary"
              @click="goEditar()"
              >Editar</b-button
            >
            <b-button
              class="col-auto mt-3 mb-5"
              variant="outline-primary"
              @click="goCapturar()"
              >Agregar observaciones</b-button
            >
            <b-button
              class="col-auto mt-3 mb-5"
              variant="outline-primary"
              right
              @click="goAsignar()"
              >Asignar</b-button
            >
            <b-button class="col-auto mt-3 mb-5" variant="warning" @click="goFormato()" right
              >Formato</b-button
            >
          </b-button-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import config from "../config/config";

export default {
  data() {
    return {
      noPaquete: '',
      temp: null,
      paquete: null,
      folioInicio: null,
      folioFin: null,
      fechaExpediente: null,
      noFojas: null,
      fechaAlta: null,
      identificador: null,
      cantidad: null,
      estado: null,
      registrador: null,
      validador: null,
      preparador: null,
      observaciones: null,
      verificador: null,
      digitalizador: null
    };
  },
  created() {},
  computed: {
    valida(){
      if(this.noPaquete.length > 5){
        return false
      }
    }
  },
  methods: {
    goEditar(){
      localStorage.setItem("noPaquete", this.noPaquete);
      this.$router.push('/editar');
    },
    goFormato(){
      localStorage.setItem("noPaquete", this.noPaquete);
      this.$router.push('/formato');
    },
    goCapturar() {
      localStorage.setItem("noPaquete", this.noPaquete);
      this.$router.push("/capturar");
    },
    goAsignar() {
      localStorage.setItem("noPaquete", this.noPaquete);
      this.$router.push("/asignar");
    },
    goValidar() {
      localStorage.setItem("folioInicio", this.folioInicio);
      localStorage.setItem("folioFin", this.folioFin);
      localStorage.setItem("fechaExpediente", this.fechaExpediente);
      this.$router.push("/validar");
    },
    search() {
      if (!this.noPaquete)
        return Swal.fire("Ingresa un número de paquete", "", "info");
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
          this.registrador = res.data.paquete.registrado;
          this.validador = res.data.paquete.validado;
          this.folioFin = res.data.paquete.folioFin;
          this.noFojas = res.data.paquete.noFojas;
          this.fechaAlta = res.data.paquete.fechaAlta;
          this.identificador = res.data.paquete.identificador;
          this.cantidad = res.data.paquete.cantidad;
          this.estado = res.data.paquete.estado;
          this.verificador = res.data.paquete.verificador;
          this.observaciones = res.data.paquete.observaciones;
          this.preparador = res.data.paquete.preparador;
          this.digitalizador = res.data.paquete.digitalizador;
          this.fechaExpediente = res.data.paquete.fechaExpediente
            ? new Date(res.data.paquete.fechaExpediente)
                .toISOString()
                .slice(0, 10)
            : null;
          this.fechaAlta = new Date(res.data.paquete.fechaAlta)
            .toISOString()
            .slice(0, 10);
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
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
