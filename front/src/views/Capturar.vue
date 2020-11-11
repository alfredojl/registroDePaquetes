<template>
  <div class="container mt-2">
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Paquete" class="mb-2">
          <b-form-input
            type="number"
            autofocus
            v-model="noPaquete"
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
    <div class="row mt-5" v-if="spinner">
      <b-spinner
        variant="dark"
        class="p-lg-5 m-auto"
        label="Spinning"
      ></b-spinner>
    </div>
    <div v-else>
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
            <b-form-select
              v-model="preparador"
              :options="preparadores"
              value-field="name"
              text-field="name"
            >
              <template #first> </template>
            </b-form-select>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col-6 p-0 d-flex">
          <b-input-group prepend="Número de fojas" class="">
            <b-form-input
              type="number"
              v-model="noFojas"
              @keyup.enter="save()"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col-6 p-0 d-flex">
          <b-input-group prepend="Digitalizador" class="">
            <b-form-select
              v-model="digitalizador"
              :options="digitalizadores"
              value-field="name"
              text-field="id"
            ></b-form-select>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col-6 p-0 d-flex">
          <b-input-group prepend="Cosido por" class="">
            <b-form-select
              v-model="cosedor"
              :options="preparadores"
              value-field="name"
              @change="today()"
              text-field="name"
            >
              <template #first> </template>
            </b-form-select>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col-6 p-0 d-flex">
          <b-input-group prepend="Fecha de preparación" class="">
            <b-form-input
              type="date"
              v-model="fechaPreparacion"
              v-on:keyup.enter="save()"
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
              :disabled="!cosedor"
            ></b-form-input>
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
          no-resize
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
      bis: false,
      showBis: null,
      fechaAlta: null,
      fechaExpediente: null,
      fechaPreparacion: null,
      digitalizador: null,
      fechaCosido: null,
      cosedor: null,
      identificador: null,
      numeral: null,
      cantidad: null,
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
  computed: {},
  created() {
    this.noPaquete = localStorage.noPaquete;
    this.bis = localStorage.bis;
    this.getEstados();
    this.getDigitalizadores();
    this.getPreparadores();
    this.search();
  },
  methods: {
    today() {
      this.fechaCosido = new Date();
      this.fechaCosido = this.fechaCosido.toISOString().slice(0, 10);
    },
    todayP() {
      this.fechaPreparacion = new Date();
      this.fechaPreparacion = this.fechaPreparacion.toISOString().slice(0, 10);
    },
    limpiar() {
      this.noFojas = null;
      this.verificador = null;
      this.digitalizador = null;
    },
    getDigitalizadores() {
      axios.get(`${config.api}/digitalizador`).then((res) => {
        this.digitalizadores = res.data.digitalizadores;
      });
    },
    getPreparadores() {
      if (!this.preparador)
        axios
          .get(`${config.api}/preparadores`)
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
            bis: this.bis,
          },
        })
        .then((res) => {
          this.folioInicio = res.data.paquete.folioInicio;
          this.folioFin = res.data.paquete.folioFin;
          this.noFojas = res.data.paquete.noFojas;
          this.fechaAlta = res.data.paquete.fechaAlta;
          this.estado = res.data.paquete.estado;
          this.turno = res.data.paquete.turno;
          this.cosedor = res.data.paquete.cosedor;
          this.identificador = res.data.paquete.identificador;
          this.cantidad = res.data.paquete.cantidad;
          this.showBis = res.data.paquete.bis;
          this.fechaExpediente = res.data.paquete.fechaExpediente
            ? new Date(res.data.paquete.fechaExpediente)
                .toISOString()
                .slice(0, 10)
            : null;
          this.fechaAlta = new Date(res.data.paquete.fechaAlta)
            .toISOString()
            .slice(0, 10);
          this.fechaCosido = res.data.paquete.fechaCosido
            ? new Date(res.data.paquete.fechaCosido).toISOString().slice(0, 10)
            : null;
          this.fechaPreparacion = res.data.paquete.fechaPreparacion
            ? new Date(res.data.paquete.fechaPreparacion)
                .toISOString()
                .slice(0, 10)
            : new Date().toISOString().slice(0, 10);
          this.validador = res.data.paquete.validador;
          this.preparador = res.data.paquete.preparador;
          this.verificador = res.data.paquete.verificador;
          this.noFojas = res.data.paquete.noFojas;
          this.observaciones = res.data.paquete.observaciones;
          this.getPreparadores();
          this.spinner = false;
        })
        .catch((error) => {
          let cad = this.bis == "true" ? "BIS" : "";

          if (error) {
            Swal.fire(
              `No se pudo encontrar el paquete ${this.noPaquete} ${cad}.`,
              "",
              "error"
            );
            this.spinner = false;
            console.log(error);
          }
        });
    },
    save() {
      if (!this.noPaquete || !this.preparador || !this.noFojas || !this.estado)
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
            bis: this.bis || false,
            fechaPreparacion: this.fechaPreparacion,
            fechaCosido: this.fechaCosido,
            cosedor: this.cosedor,
            estado: this.estado,
            digitalizador: this.digitalizador,
            preparador: this.preparador,
            observaciones: this.observaciones,
          };
          this.spinner = true;
          axios
            .put(`${config.api}/captura`, data)
            .then((res) => {
              // Swal.fire(
              //   "¡Hecho!",
              //   "Datos actualizados correctamente.",
              //   "success"
              // );
              Swal.fire({
              title: `¡Hecho!`,
              position: "top-end",
              text: `Información capturada exitosamente.`,
              icon: "success",
              showConfirmButton: false,
              timer: 1200,
            });
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
