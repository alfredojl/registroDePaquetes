<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Paquete" class="mb-5">
          <b-form-input
            type="number"
            autofocus
            v-model="noPaquete"
            v-on:keyup.enter="search()"
          ></b-form-input>
          <b-input-group-prepend>
            <b-button variant="secondary" @click="search()">Buscar</b-button>
          </b-input-group-prepend>
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
    this.noPaquete = localStorage.noPaquete || null;
    this.getFolios();
  },
  methods: {
    goAsignar() {
      localStorage.setItem("noPaquete", this.noPaquete);
      this.$router.push("/asignar");
    },
    search() {
      this.spinner = true;
      localStorage.noPaquete = this.noPaquete;
      if (!this.noPaquete)
        return Swal.fire("Ingresa un número de paquete", "", "info");
      axios
        .get(`${config.api}/folios`, {
          params: {
            noPaquete: this.noPaquete,
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
          if (error) console.log(error);
          this.spinner = false;
        });
    },
    getFolios() {
      if (!localStorage.noPaquete) this.spinner = false;
      let params = {
        folioInicio: localStorage.folioInicio,
        folioFin: localStorage.folioFin,
      };
      axios
        .get(`${config.api}/folios`, {
          params,
        })
        .then((res) => {
          console.log(res.data.folios);
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
          if (error) console.log(error);
        });
    },
    save() {
      localStorage.noPaquete = this.noPaquete;
      for (let i = 0; i < this.folios.length; i++)
        this.folios[i]["validado"] = localStorage.loggedIn;
      let data = {
        folios: this.folios,
        // validado: localStorage.loggedIn,
        noPaquete: this.noPaquete || localStorage.noPaquete,
      };
      axios
        .put(`${config.api}/folios`, { data })
        .then((res) => {
          Swal.fire(`¡Hecho!`, `Folios actualizados correctamente.`, "success");
        })
        .catch((err) => {
          Swal.fire(
            `¡Error!`,
            `Ocurrió un error al intentar actualizar los folios.`,
            "error"
          );
          console.log(err);
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