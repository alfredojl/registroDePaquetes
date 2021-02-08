<template>
  <div class="container">
    <div class="col">
      <div class="row justify-content-center mt-5">
        <h3><strong>Ingrese los datos del paquete a registrar</strong></h3>
      </div>
      <div class="row justify-content-center mt-2">
        <b-form-input
          type="number"
          style="width: 20rem"
          placeholder="Paquete"
          autofocus
          :state="validaPaquete"
          v-model="noPaquete"
          v-on:keyup.enter="save()"
        ></b-form-input>
      </div>
      <div class="row justify-content-center mt-3">
        <b-form-input
          type="number"
          style="width: 20rem"
          placeholder="Folio inicio"
          v-model="folioInicio"
          v-on:keyup.enter="save()"
        ></b-form-input>
      </div>
      <div class="row justify-content-center mt-3">
        <b-form-input
          type="number"
          placeholder="Folio fin"
          style="width: 20rem"
          v-model="folioFin"
          :state="valida"
          v-on:keyup.enter="save()"
        ></b-form-input>
      </div>
      <div class="row justify-content-center mt-3">
        <b-form-input
          style="width: 20rem"
          type="date"
          placeholder="Fecha expediente"
          v-model="fechaExpediente"
          v-on:keyup.enter="save()"
        ></b-form-input>
      </div>
      <div class="row justify-content-center mt-2 ml-1">
        <b-form-checkbox
          class="p-0"
          id="checkbox-1"
          v-model="bis"
          name="checkbox-1"
          value="true"
          unchecked-value="false"
          switch
        >
          BIS
        </b-form-checkbox>
        <b-form-checkbox
          class="col-2 ml-5"
          id="checkbox"
          name="checkbox"
          v-model="numeral"
          switch
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
        <span v-if="numeral == 'true'" class="m-1">de</span>
        <b-form-input
          v-if="numeral == 'true'"
          class="col-1 p-2"
          type="number"
          size="sm"
          placeholder="total"
          v-model="cantidad"
        ></b-form-input>
      </div>
      <div class="row justify-content-center mt-3">
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
  </div>
</template>

<script>
import axios from "axios";
import config from "../config/config";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      noPaquete: "",
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
  computed: {
    validaPaquete() {
      if (this.noPaquete.length > 5) return false;
      else if (this.noPaquete.length == 0) return false;
      else return true;
    },
    valida() {
      if (
        this.folioFin < this.folioInicio ||
        this.folioFin - this.folioInicio >= 99 ||
        this.folioFin - this.folioInicio < 0
      )
        return false;
      else if (!this.folioFin) return null;
      else return true;
    },
  },
  methods: {
    goValidar() {
      localStorage.setItem("noPaquete", this.noPaquete);
      localStorage.setItem("bis", this.bis);
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
      if (!this.valida || !this.validaPaquete)
        return Swal.fire(
          "Asegúrese de que los datos estén correctos.",
          "",
          "info"
        );
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
          if (!res.data.ok) return Swal.fire("Info", res.data.message, "info");
          return Swal.fire({
            title: `¡Hecho!`,
            position: "top-end",
            text: `Paquete ${this.noPaquete} agregado con éxito.`,
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          });
          Swal.fire(
            `Paquete existente`,
            `El paquete ${this.noPaquete} ya fue creado anteriormente. Intente buscarlo.`,
            "info"
          );
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