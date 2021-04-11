<template>
  <div class="container">
    <div class="row justify-content-center mt-2 mb-2">
      <b-input-group style="width: 15rem" class="mt-2">
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
    <b-row class="justify-content-center mt-5">
      <span style="max-width: 15rem">
        <!-- <label for="">No. paquete:</label> -->
        <b-form-input
          placeholder="Número de paquete"
          type="number"
          class="mb-2"
          v-model="paquete.noPaquete"
        >
        </b-form-input>
        <!-- <label for="">Folio inicio:</label> -->
        <b-form-input
          placeholder="Folio inicio"
          type="number"
          class="mb-2"
          v-model="paquete.folioInicio"
        >
        </b-form-input>
        <!-- <label for="">Folio fin:</label> -->
        <b-form-input
          placeholder="Folio fin"
          type="number"
          class="mb-2"
          v-model="paquete.folioFin">
        </b-form-input>
        <!-- <label for="">Parte</label> -->
          <b-row class="m-0 mb-2" align-v="center">
          <b-form-input
            type="number"
            placeholder="#"
            style="max-width: 44%"
            class=""
            v-model="paquete.identificador">
          </b-form-input><span class="m-1">de</span>
          <b-form-input
          type="number"
          placeholder="total"
          style="max-width: 44%"
          class=""
          v-model="paquete.cantidad">
          </b-form-input>
          </b-row>
        <!-- <label for="">Fecha de expediente:</label> -->
        <b-form-input
          placeholder="Fecha expediente"
          class="mb-2"
          type="date"
          v-model="paquete.fechaExpediente"
        >
        </b-form-input>
        <b-form-checkbox
            class=""
            id="checkbox-1"
            v-model="paquete.bis"
            name="checkbox-1"
            value="true"
            unchecked-value="false"
            switch
          >
            BIS
          </b-form-checkbox>
      </span>
    </b-row>
    <b-row class="justify-content-center">
      <b-button-group>
        <b-button variant="success" @click="save()">Guardar</b-button>
        <b-button variant="danger" @click="eliminar()">Eliminar</b-button>
        <!-- <b-button variant="outline-info" @click="limpiar()">Limpiar</b-button> -->
      </b-button-group>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";
import config from "../config/config";
import Swal from "sweetalert2";
import moment from "moment";

export default {
  data() {
    return {
      aux: null,
      noPaquete: "",
      pq: '',
      paquetes: [],
      cantidad: null,
      identificador: null,
      bis: false,
      digitalizador: null,
      paquete: {},
      folioInicio: null,
      folioFin: null,
      fechaExpediente: null,
      noFojas: null,
      fechaAlta: null,
      estado: null,
    };
  },
  created() {
    // this.noPaquete = localStorage.noPaquete;
    // this.search();
  },
  computed: {
    valida() {
      if (this.noPaquete.length > 5) {
        return false;
      }
    },
  },
  methods: {
    fill(paquete){
      this.paquete = paquete;
      this.paquete.fechaExpediente = paquete.fechaExpediente
            ? moment(paquete.fechaExpediente.slice(0, 19)).format(
                "YYYY-MM-DD"
              )
            : null;
      this.$bvModal.hide("packages");
    },
    async search() {
      // this.limpiar();
      if (!this.noPaquete)
        return Swal.fire("Ingresa un número de paquete", "", "info");
      let params = {
        noPaquete: this.noPaquete,
        bis: this.bis,
      };
      await axios
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
              // this.limpiar();
            });
          }
          if (res.data.paquete.length > 1) {
            this.paquetes = res.data.paquete;
            this.$bvModal.show("packages");
          }
          this.showBis = res.data.paquete[0].bis;
          this.paquete = res.data.paquete[0];
          this.paquete.fechaExpediente = res.data.paquete[0].fechaExpediente
                ? moment(res.data.paquete[0].fechaExpediente.slice(0, 19)).format(
                    "YYYY-MM-DD"
                  )
                : null;
          // this.getFolios();
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
    async eliminar() {
      Swal.fire({
        title: `¿Está seguro de que desea eliminar el paquete ${this.paquete.noPaquete}${this.paquete.bis ? ' BIS' : ''}`
        + `${this.paquete.cantidad ? ' ' + this.paquete.identificador + '/' + this.paquete.cantidad : ''}`,
        showDenyButton: true,
        confirmButtonText: `Eliminar`,
        cancelButtonText: "Cancelar",
        icon: "warning",
      }).then(async(result) => {
        if (result.isConfirmed) {
          console.log(this.paquete);
          let data = this.paquete;
          await axios
            ({
              url: `${config.api}/edit`,
              method: 'delete',
              data })
            .then((res) => {
              console.log(res.data);
              Swal.fire(
                `¡Hecho!`,
                `Paquete ${res.data.paquete.noPaquete}${res.data.paquete.bis ? ' BIS' : ''}${res.data.paquete.cantidad ? ' ' + res.data.paquete.identificador + '/' + res.data.paquete.cantidad : ''} eliminado correctamente.`,
                "success"
              );
            })
            .catch((err) => {
              console.log(err);
              return Swal.fire(`¡Error!`, "No se pudo completar la acción.", "error");
            });
        }
      });
    },
    async save() {
      await axios
        .put(`${config.api}/edit`, {
          data: this.paquete
        })
        .then((res) => {
          return Swal.fire(
            `¡Hecho!`,
            `Paquete ${res.data.paquete.noPaquete}${res.data.paquete.bis ? ' BIS' : ''}${res.data.paquete.cantidad ? ' ' + res.data.paquete.identificador + '/' + res.data.paquete.cantidad : ''} actualizado correctamente.`,
            "success"
          );
        })
        .catch((err) => {
          console.log(err.response);
          return Swal.fire(`¡Error!`, `No se pudo actualizar el paquete.`, "error");
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