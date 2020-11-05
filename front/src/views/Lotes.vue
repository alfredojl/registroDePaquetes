<template>
  <div class="container">
    <b-row class="justify-content-center mt-2">
      <b-col lg="auto">
        <b-form-radio-group
          :options="options"
          buttons
          class="m-3"
          button-variant="primary"
          v-model="add"
        >
        </b-form-radio-group>
      </b-col>
      <!-- <b-col lg="2"><b-button variant="info"> Recibir lote</b-button> </b-col>
      <b-col lg="2"><b-button variant="info"> Buscar lote</b-button> </b-col> -->
    </b-row>
    <div class="row mt-5" v-show="add == 'add'">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Lote" class="">
          <b-form-input
            type="number"
            v-model="noLote"
            :disabled="!!noLote"
            lazy
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row mt-2" v-show="add == 'add'">
      <div class="p-0 d-flex"></div>
    </div>
    <div class="row mt-2" v-show="add == 'add'">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Paquete" class="">
          <b-form-input
            type="number"
            :state="valida"
            ref="folio"
            @keydown.188="agrega"
            v-model="noPaquete"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <b-row class="mt-3 justify-content-center">
      <b-col lg="2">
      <b-button v-show="add == 'add'" variant="success" class="p-2" @click="save"
        >Añadir lote</b-button
      >
      </b-col>
      <b-col lg="2">
    <b-button v-show="add == 'add'" variant="primary" class="p-2" @click="download"
      >Descargar</b-button
    >
      </b-col>
    </b-row>

    <div class="row justify-content-center" v-show="add == 'search'">
      <b-col lg="auto">
        <b-form-radio-group
        :options="op"
        buttons
        button-variant="secondary"
        v-model="give"
        ></b-form-radio-group>
      </b-col>
    </div>
      <b-row class="mt-3 justify-content-center">
      <div class="col-auto p-0 d-flex">
        <b-input-group prepend="Lote" v-show="give == 'lote'" class="">
          <b-form-input type="number" v-model="noLote" @keypress.enter="search"></b-form-input>
          <b-input-group-prepend>
            <b-button variant="secondary" @click="search()">Buscar</b-button>
          </b-input-group-prepend>
        </b-input-group>
      </div>
      <b-col class="justify-content-center col-auto">
        <b-input-group prepend="Paquete" v-show="give == 'paquete'" class="">
          <b-form-input type="number" v-model="noPaquete" @keypress.enter="noLote = null; search()"></b-form-input>
          <b-input-group-prepend>
            <b-button variant="secondary" @click="noLote = null; search()">Buscar</b-button>
          </b-input-group-prepend>
        </b-input-group>

      </b-col>

      </b-row>
      <b-row class="mt-2 justify-content-center">
        <b-col lg="2">
    <b-button v-show="give" variant="primary" class="p-2" @click="download"
      >Descargar</b-button
    >
      </b-col>
        <b-col lg="2">
    <b-button v-show="give" variant="primary" class="p-2" @click="addDate"
      >Entregar</b-button
    >
      </b-col>
        <b-col lg="2">
    <b-button v-show="give" variant="primary" class="p-2" @click=""
      >Devolver</b-button
    >
      </b-col>
      </b-row>
      <pre>{{ noPaquete }}</pre>

      <div v-if="!spinner">
      <b-table
        id="tabla"
        class="mt-3 text-center"
        :items="paquetes"
        :fields="fields"
        responsive
        bordered
        v-show="paquetes ? true : false"
        small
        hover
      >
        <template #cell(#)="data">
          {{ data.index + 1 }}
        </template>
      </b-table>
    </div>
    <div class="text-center mt-5" v-else>
      <b-spinner variant="secondary"></b-spinner>
    </div>

  </div>
</template>

<script>
// import html2pdf from 'vue-html2pdf';
import axios from "axios";
import config from "../config/config";
import jspdf from "jspdf";
import autotable from "jspdf-autotable";
import Swal from "sweetalert2";

export default {
  computed: {
    valida() {
      // if (this.noPaquete.length > 5) {
      //   this.noPaquete = this.noPaquete.slice(0, 5);
      // }
    },
  },
  created() {
  },
  data() {
    return {
      spinner: null,
      noLote: null,
      noPaquete: {},
      options: [
        {text: "Añadir lote", value: "add"},
        {text: "Buscar lote", value: "search"}
      ],
      op: [
        {text: "Lote", value: "lote"},
        {text: "Paquete", value: "paquete"}
      ],
      lote: false,
      paquete: false,
      add: false,
      give: false,
      fields: [
        "#",
        { key: "noLote", label: "Lote" },
        { key: "noPaquete", label: "Paquete", sortable: true },
        { key: "fechaEntregado", label: "Fecha entrega" },
        { key: "fechaDevolucion", label: "Fecha devolución" }
      ],
      paquetes: [],
    };
  },
  methods: {
    addDate(){
      this.paquetes.forEach( el => {
        let fecha = new Date()
        el.fechaEntregado = fecha.toISOString().slice(0, 10);
      })
    },
    agrega() {
      // if(!this.noPaquete){
      //   this.noPaquete = "";
      //   this.$refs.folio.focus();
      //   return
      // }
      // this.noPaquete = this.noPaquete.split(/\n/g);
      console.log(this.noPaquete.split(/\n/g));
      // let fecha = new Date();
      let paquete = {
        noLote: this.noLote,
        noPaquete: this.noPaquete,
        fechaEntegado: null,
        fechaDevolucion: null
      };
      this.paquetes.push(paquete);
      this.$refs.folio.focus();
      // this.noPaquete = "";
    },
    download() {
      let doc = new jspdf();
      autotable(doc, {
        head: [["#", "Lote", "Paquete", "Fecha entrega", "Fecha devolución"]],
        html: "#tabla",
        margin: { horizontal: 10 },
        styles: { overflow: "linebreak" },
        bodyStyles: { valign: "top" },
        theme: "grid",
      });
      doc.save(`lote${this.noLote}.pdf`);
    },
    save() {
      axios
        .post(`${config.api}/lote`, {
          lote: this.paquetes,
        })
        .then((res) => {
          Swal.fire("¡Hecho!", "", "success");
        })
        .catch((err) => {
          Swal.fire("¡Error!", "", "error");
          console.log(err.response);
        });
    },
    search() {
      this.spinner = true;
      this.paquetes = [];
      let params = null;
      if (!this.noLote)
        params = {
          noPaquete: this.noPaquete
        };
      else
        params = {
          noLote: this.noLote
        };
      axios
        .get(`${config.api}/lote`, {
          params,
        })
        .then((res) => {
          this.paquetes = res.data.lote;
          this.spinner = false;
        })
        .catch((err) => {
          console.log(err);
          this.spinner = false;
        });
    },
  },
};
</script>
