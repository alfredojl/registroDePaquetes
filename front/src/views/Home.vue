<template>

  <div class="container">
    <b-col>
      <b-row class="justify-content-center">
        <b-form-checkbox v-model="searchAsFolio" switch size="lg"
          ><strong>Buscar folio</strong></b-form-checkbox
        >
      </b-row>
      <div class="container" v-if="!searchAsFolio">
        <b-row class="mt-3 justify-content-center" v-show="incidencia">
          <b-alert show variant="danger" class="p-1 text-center"
            >Faltantes:
            <span
              ><strong>{{ faltantes.join(", ") }}</strong>
            </span>
          </b-alert>
        </b-row>
        <div class="row justify-content-center mt-2 mb-2">
          <b-input-group style="width: 20rem">
            <b-form-input
              type="number"
              autofocus
              placeholder="Paquete"
              v-model="noPaquete"
              :state="valida"
              @keyup.enter="search()"
            ></b-form-input>
            <b-form-checkbox
              class="m-1"
              v-model="bis"
              value="true"
              unchecked-value="false"
            >
              BIS
            </b-form-checkbox>
            <b-button variant="secondary" @click="search()">Buscar</b-button>
          </b-input-group>
        </div>
        <b-modal
          id="packages"
          scrollable
          centered
          ref=""
          title="Paquetes encontrados"
        >
          <div v-for="(paquete, index) of paquetes" :key="paquete.folioInicio">
            <b-list-group>
              <b-list-group-item
                button
                variant="light"
                @click="fill(paquetes[index])"
                >Paquete: {{ paquete.noPaquete }}<br />Folio inicio:
                {{ paquete.folioInicio }}<br />Folio fin: {{ paquete.folioFin
                }}<br />Fecha expediente:
                {{
                  paquete.fechaExpediente
                    ? paquete.fechaExpediente.slice(0, 10)
                    : null
                }}</b-list-group-item
              >
            </b-list-group>
          </div>
        </b-modal>
        <b-row class="justify-content-center">
          <b-col class="text-right">
            <strong>Paquete: </strong>
          </b-col>
          <b-col class="text-left">
            {{
              [
                nopq,
                showBis ? "BIS" : null,
                cantidad ? identificador + "/" + cantidad : "",
              ].join(" ")
            }}
          </b-col>
        </b-row>
        <b-row class="justify-content-center">
          <b-col class="text-right">
            <strong>Folio inicio: </strong>
          </b-col>
          <b-col class="text-left">
            {{ folioInicio }}
          </b-col>
        </b-row>
        <b-row class="justify-content-center">
          <b-col class="text-right">
            <strong>Folio fin: </strong>
          </b-col>
          <b-col class="text-left">
            {{ folioFin }}
          </b-col>
        </b-row>
        <div class="row justify-content-center">
          <b-col class="text-right">
            <strong>Fecha de expediente: </strong>
          </b-col>
          <b-col class="text-left">
            {{ fechaExpediente }}
          </b-col>
        </div>
        <div class="row justify-content-center">
          <b-col class="text-right">
            <strong>Fecha de registro: </strong>
          </b-col>
          <b-col class="text-left">
            {{ fechaAlta }}
          </b-col>
        </div>
        <div class="row justify-content-center">
          <b-col class="text-right">
            <strong>Estado: </strong>
          </b-col>
          <b-col class="text-left">
            {{ estado }}
          </b-col>
        </div>
        <div class="row justify-content-center">
          <b-col class="text-right">
            <strong>Registrado por: </strong>
          </b-col>
          <b-col class="text-left">
            {{ registrador }}
          </b-col>
        </div>
        <div class="row">
          <b-col class="text-right">
            <strong>Validado por: </strong>
          </b-col>
          <b-col class="text-left">
            {{ validador }}
          </b-col>
        </div>
        <div class="row">
          <b-col class="text-right">
            <strong>Verificador: </strong>
          </b-col>
          <b-col class="text-left">
            {{ verificador }}
          </b-col>
        </div>
        <div class="row">
          <b-col class="text-right">
            <strong>Cosido por: </strong>
          </b-col>
          <b-col class="text-left">
            {{ cosedor }}
          </b-col>
        </div>
        <div class="row">
          <b-col class="text-right">
            <strong>Fecha de asignación: </strong>
          </b-col>
          <b-col class="text-left">
            {{ fechaAsignacion }}
          </b-col>
        </div>
        <div class="row">
          <b-col class="text-right">
            <strong>Fecha de preparación:</strong>
          </b-col>
          <b-col class="text-left">
            {{ fechaPreparacion }}
          </b-col>
        </div>
        <div class="row">
          <b-col class="text-right">
            <strong>Fecha de cosido:</strong>
          </b-col>
          <b-col class="text-left">
            {{ fechaCosido }}
          </b-col>
        </div>
        <div class="row">
          <b-col class="text-right">
            <strong>Digitalizador:</strong>
          </b-col>
          <b-col class="text-left">
            {{ digitalizador }}
          </b-col>
        </div>
        <div class="row">
          <b-col class="text-right">
            <strong>Número de fojas:</strong>
          </b-col>
          <b-col class="text-left">
            {{ noFojas }}
          </b-col>
        </div>
        <div class="row">
          <b-col class="text-right">
            <strong>Observaciones:</strong>
          </b-col>
          <b-col class="text-left">
            <div style="max-width: 75%">
              {{ observaciones }}
            </div>
          </b-col>
        </div>
        <div class="">
          <div class="row justify-content-center">
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
      <div class="container text-center" v-else>
        <div class="row justify-content-center mt-2">
          <b-input-group style="width: 20rem">
              <b-form-input
                type="number"
                autofocus
                v-model="folio"
                v-on:keyup.enter="searchFolio()"
              ></b-form-input>
                <b-button variant="secondary" @click="searchFolio()"
                  >Buscar</b-button
                >
                </b-input-group>
        </div>
        <b-spinner
          v-show="folioSpinner"
          style="width: 3rem; height: 3rem"
          class="m-5"
          variant="secondary"
        ></b-spinner>
        <div class="row justify-content-center">
          <p
            v-show="folioWarning"
            class="mt-3 p-2 text-danger font-monospace"
            variant="danger"
          >
            Revisar la información del folio
          </p>
        </div>
        <div class="row justify-content-center">
          <b-table
            class="mt-3 text-left"
            :items="folioSearched"
            :fields="fields"
            style="max-width: 3rem"
            v-show="!folioSpinner"
            hover
            striped
          >
          </b-table>
        </div>
      </div>
    </b-col>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import config from "../config/config";
import moment from "moment"

// moment.locale('es-mx')

export default {
  data() {
    return {
      incidencia: false,
      noPaquete: "",
      nopq: null,
      folio: null,
      folioSearched: [],
      folioSpinner: false,
      folioWarning: false,
      paquete: null,
      folioInicio: null,
      folioFin: null,
      fechaExpediente: null,
      cosedor: null,
      fechaCosido: null,
      fechaAsignacion: null,
      fechaPreparacion: null,
      noFojas: null,
      numeral: null,
      fechaAlta: null,
      bis: false,
      showBis: false,
      identificador: null,
      searchAsFolio: false,
      cantidad: null,
      estado: null,
      registrador: null,
      validador: null,
      preparador: null,
      observaciones: null,
      verificador: null,
      digitalizador: null,
      faltantes: [],
      currentPage: 1,
      paquetes: [],
      fields: [
        { key: "folio", label: "Folio", tdClass: "text-end" },
        {
          key: "noPaquete",
          label: "Paquete",
          tdClass: "text-center text-primary",
        },
        {
          key: "estado",
          label: "Estado",
          tdClass: (value, key, item, type) => {
            if (value == "Faltante") return "bg-warning";
          },
        },
        { key: "tomo", label: "Tomo", tdClass: "text-center" },
      ],
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
      localStorage.setItem(
        "paquete",
        JSON.stringify({
          noPaquete: this.noPaquete,
          bis: this.bis,
          folioInicio: this.folioInicio,
          folioFin: this.folioFin,
        })
      );
      this.$router.push("/editar");
    },
    goFormato() {
      localStorage.setItem(
        "paquete",
        JSON.stringify({
          noPaquete: this.noPaquete,
          bis: this.bis,
          folioInicio: this.folioInicio,
          folioFin: this.folioFin,
          identificador: this.identificador,
          cantidad: this.cantidad,
        })
      );
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
      // localStorage.setItem("noPaquete", this.noPaquete);
      // localStorage.setItem("bis", this.showBis);
      localStorage.setItem(
        "paquete",
        JSON.stringify({
          noPaquete: this.noPaquete,
          bis: this.bis,
          folioInicio: this.folioInicio,
          folioFin: this.folioFin,
          identificador: this.identificador,
          cantidad: this.cantidad,
        })
      );
      this.$router.push("/validar");
    },
    fill(paquete) {
      this.folioInicio = paquete.folioInicio;
      this.registrador = paquete.registrado;
      this.cosedor = paquete.cosedor;
      this.validador = paquete.validado;
      this.folioFin = paquete.folioFin;
      this.noFojas = paquete.noFojas;
      this.identificador = paquete.identificador;
      this.cantidad = paquete.cantidad;
      this.estado = paquete.estado;
      this.verificador = paquete.verificador;
      this.showBis = paquete.bis;
      this.observaciones = paquete.observaciones;
      this.preparador = paquete.preparador;
      this.digitalizador = paquete.digitalizador;
      this.fechaPreparacion = paquete.fechaPreparacion
        ? moment(paquete.fechaPreparacion.slice(0, 19)).format('DD/MM/YYYY')
        : null;
      this.fechaExpediente = paquete.fechaExpediente
        ? moment(paquete.fechaExpediente.slice(0, 19)).toISOString()
        : null;
        console.log(this.fechaExpediente);
      this.fechaAsignacion = paquete.fechaAsignacion
        ? moment(paquete.fechaAsignacion.slice(0, 19)).format('DD/MM/YYYY')
        : null;
      this.fechaAlta = paquete.fechaAlta
        ? moment(paquete.fechaAlta.slice(0, 19)).format('DD/MM/YYYY')
        : null;
      this.fechaCosido = paquete.fechaCosido
        ? moment(paquete.fechaCosido.slice(0, 19)).format('DD/MM/YYYY')
        : null;
      this.$bvModal.hide("packages");
    },
    getFolios() {
      this.faltantes = [];
      if (!localStorage.noPaquete) this.spinner = false;
      let params = {
        noPaquete: this.noPaquete,
        bis: this.bis,
        folioInicio: this.folioInicio,
        folioFin: this.folioFin,
      };
      axios
        .get(`${config.api}/folios`, {
          params,
        })
        .then((res) => {
          let folios = res.data.folios;
          folios.forEach((el) => {
            if (el.estado == "Faltante") {
              this.faltantes.push(el.folio);
            }
          });
          if (this.faltantes.length > 0) this.incidencia = true;
          else this.incidencia = false;
        })
        .catch((error) => {
          if (error) console.log(error);
        });
    },
    search() {
      this.limpiar();
      if (!this.noPaquete)
        return Swal.fire("Ingresa un número de paquete", "", "info");
      let params = {
        noPaquete: this.noPaquete,
        bis: this.bis,
      };
      axios
        .get(`${config.api}/paquete`, {
          params,
        })
        .then((res) => {
          if (res.data.paquete.length < 1) {
            return Swal.fire(
              `No se encontró el paquete ${this.noPaquete}.`,
              "",
              "error"
            ).then((res) => {
              this.limpiar();
            });
          }
          if (res.data.paquete.length > 1) {
            this.paquetes = res.data.paquete;
            this.$bvModal.show("packages");
          }
          this.nopq = res.data.paquete[0].noPaquete;
          this.folioInicio = res.data.paquete[0].folioInicio;
          this.registrador = res.data.paquete[0].registrado;
          this.cosedor = res.data.paquete[0].cosedor;
          this.validador = res.data.paquete[0].validado;
          this.folioFin = res.data.paquete[0].folioFin;
          this.noFojas = res.data.paquete[0].noFojas;
          this.fechaAlta = res.data.paquete[0].fechaAlta;
          this.identificador = res.data.paquete[0].identificador;
          this.cantidad = res.data.paquete[0].cantidad;
          this.estado = res.data.paquete[0].estado;
          this.verificador = res.data.paquete[0].verificador;
          this.showBis = res.data.paquete[0].bis;
          this.observaciones = res.data.paquete[0].observaciones;
          this.preparador = res.data.paquete[0].preparador;
          this.digitalizador = res.data.paquete[0].digitalizador;
          this.fechaPreparacion = res.data.paquete[0].fechaPreparacion
            ? moment(res.data.paquete[0].fechaPreparacion.slice(0, 19)).format('DD/MM/YYYY')
            : null;
          this.fechaExpediente = res.data.paquete[0].fechaExpediente
            ? moment(res.data.paquete[0].fechaExpediente.slice(0, 19)).format('DD/MM/YYYY')
            : null;
          this.fechaAsignacion = res.data.paquete[0].fechaAsignacion
            ? moment(res.data.paquete[0].fechaAsignacion.slice(0, 19)).format('DD/MM/YYYY')
            : null;
          this.fechaAlta = moment(res.data.paquete[0].fechaAlta.slice(0, 19)).format('DD/MM/YYYY')
          this.fechaCosido = res.data.paquete[0].fechaCosido
            ? moment(res.data.paquete[0].fechaCosido.slice(0, 19)).format('DD/MM/YYYY')
            : null;
          this.getFolios();
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    },
    searchFolio() {
      this.folioSpinner = true;
      this.folioWarning = false;
      if (!this.folio)
        return Swal.fire(`Primero ingresa un folio.`, "", "info");
      axios
        .get(`${config.api}/folio`, {
          params: {
            folio: this.folio,
          },
        })
        .then((res) => {
          if (res.data.folio.length < 1) {
            return Swal.fire({
              title: "¡Ups!",
              text: `No se encontró el folio ${
                this.folio ? this.folio + "." : "msolicitado."
              }`,
              icon: "error",
              showConfirmButton: true,
            }).then((res) => {
              this.folioSearched = null;
            });
          }
          if (res.data.folio.length > 1) {
            this.folioWarning = true;
          }
          this.folioSearched = res.data.folio;
        })
        .catch((err) => {
          console.log(err);
        });
      this.folioSpinner = false;
    },
    limpiar() {
      this.nopq = null;
      this.folioInicio = null;
      this.registrador = null;
      this.cosedor = null;
      this.validador = null;
      this.folioFin = null;
      this.noFojas = null;
      this.fechaAlta = null;
      this.identificador = null;
      this.cantidad = null;
      this.estado = null;
      this.verificador = null;
      this.showBis = null;
      this.observaciones = null;
      this.preparador = null;
      this.digitalizador = null;
      this.fechaPreparacion = null;
      this.fechaExpediente = null;
      this.fechaAsignacion = null;
      this.fechaAlta = null;
      this.fechaCosido = null;
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
