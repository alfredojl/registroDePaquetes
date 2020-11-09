<template>
  <div class="container">
    <b-row class="mt-3 justify-content-center" v-show="incidencia">
      <b-col lg="2"
        ><b-alert show variant="warning" class="">Incidencias:</b-alert></b-col
      >
      <div class="w-100"></div>
        <b-row>
          <b-col>
        <b-list-group
          class=""
          horizontal
          v-for="faltante of faltantes" :key="faltante"
        >
          <b-list-group-item class="p-1">{{ faltante }}</b-list-group-item>
        </b-list-group>
          </b-col>
        </b-row>
    </b-row>
    <b-row class="justify-content-center" v-show="incidencia == 'true'">
    </b-row>
    <div class="row mt-2">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Paquete" class="">
          <b-form-input
            type="number"
            autofocus
            v-model="noPaquete"
            :state="valida"
            v-on:keyup.enter="search()"
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
    <div v-if="showBis == true">
      <b-row class="">
        <div class="col-3"></div>
        <b-col lg="2" class="p-0">
          <b-input-group prepend="Bis" class=""> </b-input-group>
        </b-col>
      </b-row>
    </div>
    <div v-show="cantidad">
      <div class="row mt-1">
        <div class="col-3"></div>
        <div class="col-3 p-0 d-flex">
          <b-input-group prepend="Número" class="mb-1">
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
        <b-input-group prepend="Cosido por" class="">
          <b-form-input v-model="cosedor" disabled></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Fecha de preparación" class="">
          <b-form-input
            type="date"
            v-model="fechaAsignacion"
            v-on:keyup.enter="save()"
            disabled
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Fecha de cosido" class="">
          <b-form-input
            type="date"
            v-model="fechaCosido"
            v-on:keyup.enter="save()"
            disabled
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
        disabled
        no-resize
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
            <b-button
              class="col-auto mt-3 mb-5"
              variant="warning"
              @click="goFormato()"
              right
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
      incidencia: false,
      noPaquete: "",
      paquete: null,
      folioInicio: null,
      folioFin: null,
      fechaExpediente: null,
      cosedor: null,
      fechaCosido: null,
      fechaAsignacion: null,
      noFojas: null,
      numeral: null,
      fechaAlta: null,
      bis: false,
      showBis: false,
      identificador: null,
      cantidad: null,
      estado: null,
      registrador: null,
      validador: null,
      preparador: null,
      observaciones: null,
      verificador: null,
      digitalizador: null,
      faltantes: [],
    };
  },
  created() {},
  computed: {
    valida() {
      if (this.noPaquete.length > 5) {
        return false;
      }
    },
  },
  methods: {
    goEditar() {
      localStorage.setItem("noPaquete", this.noPaquete);
      this.$router.push("/editar");
    },
    goFormato() {
      localStorage.setItem("noPaquete", this.noPaquete);
      this.$router.push("/formato");
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
      localStorage.setItem("noPaquete", this.noPaquete);
      localStorage.setItem("bis", this.showBis);
      this.$router.push("/validar");
    },
    getFolios() {
      this.faltantes = [];
      if (!localStorage.noPaquete) this.spinner = false;
      let params = {
        // folioInicio: localStorage.folioInicio,
        // folioFin: localStorage.folioFin,
        noPaquete: this.noPaquete,
        bis: this.bis
      };
      axios
        .get(`${config.api}/folios`, {
          params,
        })
        .then((res) => {
          let folios = res.data.folios;
          console.log(folios);
          folios.forEach((el) => {
            if (el.estado == "Faltante") {
              this.faltantes.push(el.folio);
            }
          });
          if(this.faltantes.length > 0)
            this.incidencia = true;
          console.log(this.faltantes);
        })
        .catch((error) => {
          if (error) console.log(error);
        });
    },
    search() {
      this.noPaquete = this.noPaquete.slice(0, 5);
      if (!this.noPaquete)
        return Swal.fire("Ingresa un número de paquete", "", "info");
        let params;
      if(this.identificador)
        params = {
          noPaquete: this.noPaquete,
          bis: this.bis,
        }
      else
        params = {
          noPaquete: this.noPaquete,
          bis: this.bis
        }
      axios
        .get(`${config.api}/paquete`, {
          params
        })
        .then((res) => {
          if (!res.data.paquete){
            this.noPaquete = null;
            return Swal.fire(
              `No se encontró el paquete ${this.noPaquete}.`,
              "",
              "error"
            );
          }
          this.folioInicio = res.data.paquete.folioInicio;
          this.registrador = res.data.paquete.registrado;
          this.cosedor = res.data.paquete.cosedor;
          this.validador = res.data.paquete.validado;
          this.folioFin = res.data.paquete.folioFin;
          this.noFojas = res.data.paquete.noFojas;
          this.fechaAlta = res.data.paquete.fechaAlta;
          this.identificador = res.data.paquete.identificador;
          this.cantidad = res.data.paquete.cantidad;
          this.estado = res.data.paquete.estado;
          this.verificador = res.data.paquete.verificador;
          this.showBis = res.data.paquete.bis;
          this.observaciones = res.data.paquete.observaciones;
          this.preparador = res.data.paquete.preparador;
          this.digitalizador = res.data.paquete.digitalizador;
          this.fechaExpediente = res.data.paquete.fechaExpediente
            ? new Date(res.data.paquete.fechaExpediente)
                .toISOString()
                .slice(0, 10)
            : null;
          this.fechaAsignacion = res.data.paquete.fechaAsignacion
            ? new Date(res.data.paquete.fechaAsignacion)
                .toISOString()
                .slice(0, 10)
            : null;
          this.fechaAlta = new Date(res.data.paquete.fechaAlta)
            .toISOString()
            .slice(0, 10);
          this.fechaCosido = res.data.paquete.fechaCosido ? new Date(res.data.paquete.fechaCosido)
            .toISOString()
            .slice(0, 10) : null;
          this.getFolios();
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
