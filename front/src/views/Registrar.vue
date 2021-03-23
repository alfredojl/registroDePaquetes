<template>
  <div class="container">
    <b-row class="justify-content-center">
      <b-col cols="auto">
        <div class="row justify-content-center mt-5">
          <h3><strong>Ingrese los datos del paquete a registrar</strong></h3>
        </div>
        <!-- <b-row class="mt-2" style="border: 1px solid"> -->
        <b-form class="mt-2">
          <b-row>
            <b-form-input
              autofocus
              :type="beforenoPaquete.length == 0 ? 'number' : 'password'"
              placeholder="Número de paquete"
              :state="validaPaquetes"
              lazy
              class="mb-2"
              @copy.prevent
              ref="noPaquete"
              :disabled="!!beforenoPaquete"
              style="width: 90%"
              v-model="beforenoPaquete"
              v-on:keyup.enter="$refs.before.focus()"
            >
            </b-form-input>
            <b-icon
              icon="x"
              class="m-1 h4"
              @click="[(beforenoPaquete = ''), (noPaquete = '')]"
            ></b-icon>
          </b-row>
          <b-row>
            <b-form-input
              class="mb-2"
              style="width: 90%"
              type="number"
              ref="before"
              placeholder="Repita el número de paquete..."
              :state="validaPaquetes"
              @paste.prevent
              v-model="noPaquete"
              v-on:keyup.enter="$refs.beforefolioInicio.focus()"
            ></b-form-input>
          </b-row>
          <b-row>
            <b-form-input
              class="mb-2"
              :type="beforefolioInicio.length == 0 ? 'number' : 'password'"
              placeholder="Folio inicio"
              style="width: 90%"
              ref="beforefolioInicio"
              @copy.prevent
              v-model="beforefolioInicio"
              lazy
              :disabled="!!beforefolioInicio"
              v-on:keyup.enter="$refs.folioInicio.focus()"
            ></b-form-input>
            <b-icon
              icon="x"
              class="m-1 h4"
              @click="[(beforefolioInicio = ''), (folioInicio = '')]"
            ></b-icon>
          </b-row>
          <b-row>
            <b-form-input
              ref="folioInicio"
              type="number"
              style="width: 90%"
              class="mb-2"
              @paste.prevent
              placeholder="Repita el folio inicio..."
              v-model="folioInicio"
              :state="validaFolio"
              v-on:keyup.enter="$refs.beforefolioFin.focus()"
            ></b-form-input>
          </b-row>
          <b-row>
            <b-form-input
              :type="beforefolioFin.length == 0 ? 'number' : 'password'"
              ref="beforefolioFin"
              placeholder="Folio fin"
              style="width: 90%"
              @copy.prevent
              class="mb-2"
              v-model="beforefolioFin"
              lazy
              v-on:keyup.enter="$refs.folioFin.focus()"
            ></b-form-input>
            <b-icon icon="x" class="m- h4" @click="[beforefolioFin = '', folioFin = '']"></b-icon>
          </b-row>
          <b-row>
            <b-form-input
              ref="folioFin"
              type="number"
              placeholder="Repita folio fin"
              style="width: 90%"
              @paste.prevent
              class=""
              v-model="folioFin"
              :state="valida"
              v-on:keyup.enter="$refs.fechaExpediente.focus()"
            ></b-form-input>
            <b-form-invalid-feedback :state="valida">
        Verifica los folios, por favor.
      </b-form-invalid-feedback>
          </b-row>
          <b-row class="mt-2" style="width: 20rem">
          <b-form-input
            type="date"
            ref="fechaExpediente"
            
            v-model="fechaExpediente"
            v-on:keyup.enter="save()"
          ></b-form-input>
          </b-row>
        </b-form>
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
            ></b-form-input>de
            <b-form-input
              style="max-width: 3rem"
              type="number"
              size="sm"
              placeholder="cantidad"
              v-model="cantidad"
            ></b-form-input>
          </b-row>
          <b-row>
          </b-row>
        <b-row class="justify-content-center">
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
        </b-row>
      </b-col>
    </b-row>
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
      beforenoPaquete: "",
      digitalizador: null,
      numeral: null,
      cantidad: null,
      identificador: null,
      paquete: null,
      folioInicio: "",
      beforefolioInicio: "",
      folioFin: "",
      beforefolioFin: "",
      fechaExpediente: null,
      noFojas: null,
      fechaAlta: null,
      bis: false,
      estado: null,
    };
  },
  computed: {
    validaPaquete() {
      if (this.noPaquete.length == 0) return null;
      if (this.noPaquete.length > 5) return false;
      else if (this.noPaquete.length == 0) return false;
      else return true;
    },
    validaFolio() {
      if (!this.folioInicio) return null;
      if (this.beforefolioInicio != this.folioInicio) return false;
      else return true;
    },
    validaPaquetes() {
      // if (this.noPaquete.length > 5) return false;
      // else if (this.noPaquete.length == 0) return false;
      // else return true;
      if (this.beforenoPaquete.length == 0) return null;
      if (this.beforenoPaquete != this.noPaquete) return false;
      else return true;
    },
    valida() {
      if (this.folioFin.length == 0) return null;
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
      this.noPaquete = "";
      this.beforenoPaquete = "";
      this.bis = false;
      this.folioInicio = "";
      this.beforefolioInicio = "";
      this.folioFin = "";
      this.beforefolioFin = "";
      this.numeral = false;
      this.fechaExpediente = null;
      this.identificador = null;
      this.cantidad = null;
      this.$refs.noPaquete.focus();
    },
    async save() {
      if (!this.valida || !this.validaPaquete)
        return Swal.fire(
          "Asegúrese de que los datos estén correctos.",
          "",
          "info"
        );
        if(!this.fechaExpediente){
          Swal.fire({
            title: 'Paquete sin fecha',
            text: '¿Está seguro de guardar el paquete sin fecha? Normalmente es la misma que un paquete anterior o consecuente.',
            icon: 'warning',
            confirmButtonText: 'Guardar',
            showCancelButton: true,
            cancelButtonText: 'Ingresar fecha',
            cancelButtonColor: '#FF9100'
          })
          .then(async(res) => {
            if(res.value) {
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
              await axios
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
                    timer: 3000,
                  }).then((res) => {
                    this.limpiar();
                  });
                })
                .catch((err) => {
                  Swal.fire(`Error!`, `No se pudo agregar el paquete.`, "error");
                  console.log(err.response);
                });
            }
          })
        }
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
              await axios
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
                    timer: 3000,
                  }).then((res) => {
                    this.limpiar();
                  });
                })
                .catch((err) => {
                  Swal.fire(`Error!`, `No se pudo agregar el paquete.`, "error");
                  console.log(err.response);
                });
      // if(!this.noPaquete || !this.folioInicio || !this.folioFin || !this.fechaExpediente)
      //   return Swal.fire(`Complete todos los campos.`, ``, "info");
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