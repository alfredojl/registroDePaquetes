<template>
  <div class="container">
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
            @click="getFoliosVarios(paquetes[index], index)"
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
    <div class="row mt-5">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Paquete" class="">
          <b-form-input
            type="number"
            autofocus
            lazy
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
    <div class="row mkeyt-5">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Paquete" class="mt-2">
          <!-- <b-form-input
            type="number"
            v-model="folioInicio"
            disabled
          ></b-form-input> -->
          <b-form-input
            type="text"
            :value="
              [
                noPaquete,
                showBis ? 'BIS' : null,
                cantidad ? identificador + '/' + cantidad : '',
              ].join(' ')
            "
            disabled
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div>
      <div class="row" v-if="spinner">
        <b-spinner
          variant="dark"
          class="p-lg-5 m-auto"
          label="Spinning"
        ></b-spinner>
      </div>
      <div class="mt-5"></div>
      <div class="row mb-3" v-for="(dato, index) in folios" :key="dato.folio">
        <div class="col-2"></div>
        <div class="col-4 p-0 d-flex">
          <b-input-group v-bind:prepend="dato.folio.toString()" class="">
          </b-input-group>
          <b-form-radio-group
            :name="'radio-options' + (index + 1)"
            :options="options"
            class="col-auto m-auto"
            v-model="folios[index]['estado']"
          >
          </b-form-radio-group>
          <b-input-group prepend="Tomos" class=""> </b-input-group>
          <b-form-input
            class="col-3"
            type="number"
            :name="'tomos' + (index + 1)"
            v-model="folios[index]['tomos']"
          ></b-form-input>
          <b-input-group
            prepend="Oficio"
            class="ml-2"
            v-if="folios[index]['estado'] == 'Oficio'"
          >
          </b-input-group>
          <b-form-input
            v-if="folios[index]['estado'] == 'Oficio'"
            class="col-3"
            type="number"
            :name="'referencias' + (index + 1)"
            v-model="folios[index]['referencias']"
          ></b-form-input>
        </div>
      </div>
      <div class="row mt-3 mb-5">
        <div class="col-2"></div>
        <b-button-group>
          <b-button variant="success" @click="save()">Guardar</b-button>
          <b-button variant="info" @click="goAsignar()">Asignar</b-button>
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
      spinner: null,
      noPaquete: null,
      folioInicio: null,
      folioFin: null,
      bis: false,
      identificador: null,
      cantidad: null,
      paquetes: [],
      showBis: null,
      folios: [],
      tomos: [],
      referencias: [],
      selected: [],
      options: [
        { text: "Completo", value: "Completo" },
        { text: "Faltante", value: "Faltante" },
        { text: "Oficio", value: "Oficio" },
      ],
    };
  },
  created() {
    this.getFolios();
  },
  methods: {
    goAsignar() {
      localStorage.setItem("noPaquete", this.noPaquete);
      this.$router.push("/asignar");
    },
    search() {
      // let aux = localStorage.getItem('paquete');
      // aux = JSON.parse(aux);
      // this.noPaquete = aux.noPaquete;
      // this.bis = aux.bis;
      // this.folioInicio = aux.folioInicio;
      // this.folioFin = aux.folioFin;
      if (!this.noPaquete)
        return Swal.fire("Ingresa un número de paquete", "", "info");
      let params = {
        noPaquete: this.noPaquete,
        bis: this.bis,
      };
      return axios
        .get(`${config.api}/paquete`, {
          params,
        })
        .then((res) => {
          if (res.data.paquete.length === 0) {
            return Swal.fire(
              `No se encontró el paquete ${this.noPaquete}.`,
              "",
              "error"
            );
          } else if (res.data.paquete.length > 1) {
            this.cantidad = res.data.paquete[0].cantidad;
            this.identificador = res.data.paquete[0].identificador;
            this.paquetes = res.data.paquete;
            this.showBis = res.data.paquete[0].bis;
            return this.$bvModal.show("packages");
          } else {
            this.spinner = true;
            this.cantidad = res.data.paquete[0].cantidad;
            this.identificador = res.data.paquete[0].identificador;
            localStorage.noPaquete = this.noPaquete;
            this.showBis = res.data.paquete[0].bis;
            axios
              .get(`${config.api}/folios`, {
                params: {
                  noPaquete: this.noPaquete,
                  bis: this.bis,
                  folioInicio: res.data.paquete[0].folioInicio,
                  folioFin: res.data.paquete[0].folioFin,
                },
              })
              .then((res) => {
                if (res.data.folios.length == 0) {
                  this.spinner = false;
                  return Swal.fire(
                    `No se pudo encontrar el paquete ${this.noPaquete}.`,
                    "",
                    "error"
                  );
                }
                this.folios = res.data.folios;
                this.folios.forEach((el, index) => {
                  if (el.referencias) {
                    this.referencias[index] = el.referencias;
                    this.selected[index] = "Oficio";
                  } else this.selected[index] = "Completo";
                  this.spinner = false;
                });
              })
              .catch((error) => {
                if (error) console.log(error.response);
              });
            this.spinner = false;
          }
        })
        .catch((err) => {
          console.log(err);
          Swal.fire(
            "¡Error!",
            "Ocurrió un error al intentar realizar la transacción.",
            "error"
          );
        });
    },
    getFoliosVarios(paquete, index) {
      // if (!localStorage.noPaquete) this.spinner = false;
      let params = {
        noPaquete: paquete.noPaquete,
        bis: paquete.bis,
        folioInicio: paquete.folioInicio,
        folioFin: paquete.folioFin,
      };
      axios
        .get(`${config.api}/folios`, {
          params,
        })
        .then((res) => {
          this.folios = res.data.folios;
          this.folios.forEach((el, index) => {
            if (el.referencias) {
              this.referencias[index] = el.referencias;
              this.selected[index] = "Oficio";
            } else this.selected[index] = "Completo";
          });
          this.spinner = false;
          this.$bvModal.hide('packages');

        })
        .catch((error) => {
          if (error) console.log(error);
        });
    },
    getFolios() {
      let aux = localStorage.getItem('paquete');
      aux = JSON.parse(aux);
      this.noPaquete = aux.noPaquete;
      this.bis = aux.bis;
      this.folioInicio = aux.folioInicio;
      this.folioFin = aux.folioFin;
      let params = {
        noPaquete: this.noPaquete,
        bis: this.bis,
      };
      axios
        .get(`${config.api}/paquete`, {
          params,
        })
        .then((res) => {
          this.cantidad = res.data.paquete[0].cantidad;
          this.identificador = res.data.paquete[0].identificador;
            console.log(res.data.paquete);
            this.showBis = res.data.paquete[0].bis;
          if (res.data.paquete.length === 0) {
            return Swal.fire(
              `No se encontró el paquete ${this.noPaquete}.`,
              "",
              "error"
            );
          } else if (res.data.paquete.length > 1) {
            this.paquetes = res.data.paquete;
            return this.$bvModal.show("packages");
          } else {
            this.spinner = true;
            localStorage.noPaquete = this.noPaquete;
            axios
              .get(`${config.api}/folios`, {
                params: {
                  noPaquete: this.noPaquete,
                  bis: this.bis,
                  folioInicio: res.data.paquete[0].folioInicio,
                  folioFin: res.data.paquete[0].folioFin,
                },
              })
              .then((res) => {
                if (res.data.folios.length == 0) {
                  this.spinner = false;
                  return Swal.fire(
                    `No se pudo encontrar el paquete ${this.noPaquete}.`,
                    "",
                    "error"
                  );
                }
                this.folios = res.data.folios;
                this.folios.forEach((el, index) => {
                  if (el.referencias) {
                    this.referencias[index] = el.referencias;
                    this.selected[index] = "Oficio";
                  } else this.selected[index] = "Completo";
                  this.spinner = false;
                });
              })
              .catch((error) => {
                if (error) console.log(error.response);
              });
            this.spinner = false;
          }
        })
        .catch((err) => {
          console.log(err);
          Swal.fire(
            "¡Error!",
            "Ocurrió un error al intentar realizar la transacción.",
            "error"
          );
        });
      // if (!localStorage.noPaquete) this.spinner = false;
      // let params, aux;
      // aux = JSON.parse(localStorage.getItem("paquete"));
      // this.showBis = aux.bis;
      // params = {
      //   noPaquete: aux.noPaquete,
      //   bis: aux.bis,
      //   folioInicio: aux.folioInicio,
      //   folioFin: aux.folioFin,
      // };
      // axios
      //   .get(`${config.api}/folios`, {
      //     params,
      //   })
      //   .then((res) => {
      //     this.folios = res.data.folios;
      //     this.folios.forEach((el, index) => {
      //       if (el.referencias) {
      //         this.referencias[index] = el.referencias;
      //         this.selected[index] = "Oficio";
      //       } else this.selected[index] = "Completo";
      //     });
      //     this.spinner = false;
      //   })
      //   .catch((error) => {
      //     if (error) console.log(error);
      //   });
    },
    save() {
      localStorage.noPaquete = this.noPaquete;

      for (let i = 0; i < this.folios.length; i++)
        this.folios[i]["validado"] = localStorage.loggedIn;
      let data = {
        folios: this.folios,
        validado: localStorage.loggedIn,
        noPaquete: this.noPaquete || localStorage.noPaquete,
        bis: this.bis,
      };
      axios
        .put(`${config.api}/folios`, { data })
        .then((res) => {
          // Swal.fire(`¡Hecho!`, `Folios actualizados correctamente.`, "success");
          Swal.fire({
              title: `¡Hecho!`,
              position: "top-end",
              text: `Folios actualizados correctamente.`,
              icon: "success",
              showConfirmButton: false,
              timer: 1200,
            });
        })
        .catch((err) => {
          Swal.fire(
            `¡Error!`,
            `Ocurrió un error al intentar actualizar los folios.`,
            "error"
          );
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