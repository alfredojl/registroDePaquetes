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
    <div class="row mt-3">
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
    <div class="row mt-3">
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
    <div class="row mt-3">
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
    <div class="row mt-2">
      <div class="col-3"></div>
      <b-form-checkbox
        class=""
        id="checkbox-1"
        v-model="bis"
        name="checkbox-1"
        value="true"
        unchecked-value="false"
      >
        BIS
      </b-form-checkbox>
      <b-form-checkbox
        class="col-2 ml-5"
        id="checkbox"
        name="checkbox"
        v-model="numeral"
        value="true"
        unchecked-value="false"
      >
        Varios paquetes
      </b-form-checkbox>
      <p class="m-1" v-if="numeral == 'true'">Paquete</p>
          <b-form-input
          v-if="numeral == 'true'"
            type="number"
            class="col-1 p-2"
            placeholder="#"
            size="sm"
            v-model="identificador"
          ></b-form-input>
      <p v-if="numeral == 'true'" class="m-1">de</p>
      <b-form-input
        v-if="numeral == 'true'"
        class="col-1 p-2"
        type="number"
        size="sm"
        placeholder="total"
        v-model="cantidad"
      ></b-form-input>
    </div>
    <div class="row mt-3">
      <div class="col-3"></div>
      <b-button-group>
        <b-button variant="success" @click="save()">Añadir</b-button>
        <b-button
          @click="goValidar()"
          class="col-auto"
          variant="outline-success"
          >Validar</b-button
        >
        <b-button variant="info" @click="limpiar()">Limpiar</b-button>
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
      numeral: null,
      cantidad: null,
      identificador: null,
      paquete: null,
      folioInicio: null,
      folioFin: null,
      fechaExpediente: null,
      noFojas: null,
      fechaAlta: null,
      bis: false,
      estado: null,
    };
  },
  created() {},
  methods: {
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
    save() {
      // if(!this.noPaquete || !this.folioInicio || !this.folioFin || !this.fechaExpediente)
      //   return Swal.fire(`Complete todos los campos.`, ``, "info");
      let fechaAlta = Date.now();
      let data = {
        noPaquete: this.noPaquete,
        folioInicio: this.folioInicio,
        folioFin: this.folioFin,
        fechaExpediente: this.fechaExpediente,
        fechaAlta,
        cantidad: this.cantidad,
        identificador: this.identificador,
        bis: this.bis,
        registrado: localStorage.loggedIn,
      };
      axios
        .post(`${config.api}/paquete`, {
          data,
        })
        .then((res) => {
          console.log(this.noPaquete);
          if (!res.data.exist)
            return Swal.fire({
              title: `¡Hecho!`,
              position: "top-end",
              text: `Paquete ${this.noPaquete} agregado con éxito.`,
              icon: "success",
              timer: 1500,
            });
          Swal.fire(
            `Paquete existente`,
            `El paquete ${this.noPaquete} ya fue creado anteriormente. Intente buscarlo.`,
            "info"
          );
          console.log(res);
          console.log(this.noPaquete);
        })
        .catch((err) => {
          Swal.fire(`Error!`, `No se pudo agregar el paquete.`, "error");
          console.log(err.response);
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