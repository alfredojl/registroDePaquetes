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
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Paquete" class="">
          <b-form-textarea
            type="textarea"
            ref="folio"
            @keydown.delete="agrega"
            size="sm"
            v-model="noPaquete"
            no-resize
          ></b-form-textarea>
        </b-input-group>
      </div>
    </div>
    <b-row class="mt-3 justify-content-center">
      <b-col lg="2">
        <b-button
          v-show="add == 'add'"
          variant="success"
          class="p-2"
          @click="save"
          >Añadir lote</b-button
        >
      </b-col>
      <b-col lg="2">
        <b-button
          v-show="add == 'add'"
          variant="primary"
          class="p-2"
          @click="download"
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
        <b-input-group
          prepend="Lote"
          v-show="give == 'lote' && add == 'search'"
          class=""
        >
          <b-form-input
            type="number"
            v-model="noLote"
            @keypress.enter="search"
          ></b-form-input>
          <b-input-group-prepend>
            <b-button variant="secondary" @click="search()">Buscar</b-button>
          </b-input-group-prepend>
        </b-input-group>
      </div>
      <b-col class="justify-content-center col-auto">
        <b-input-group
          prepend="Paquete"
          v-show="give == 'paquete' && add == 'search'"
          class=""
        >
          <!-- <b-form-input
            type="number"
            v-model="noPaquete"
            @keypress.enter="
              noLote = null;
              search();
            "
          ></b-form-input> -->
          <!-- <b-input-group prepend="Paquete" class=""> -->
          <b-form-textarea
            type="textarea"
            ref="folio"
            @keydown.delete="busca"
            size="sm"
            v-model="noPaquete"
            no-resize
          ></b-form-textarea>
        <!-- </b-input-group> -->
          <b-input-group-prepend>
            <b-button
              variant="secondary"
              @click="
                noLote = null;
                search();
              "
              >Buscar</b-button
            >
          </b-input-group-prepend>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row class="mt-2 justify-content-center">
      <b-col lg="2">
        <b-button
          v-show="give && add == 'search'"
          variant="primary"
          class="p-2"
          @click="download"
          >Descargar</b-button
        >
      </b-col>
      <b-col lg="2">
        <b-button
          v-show="give && add == 'search'"
          variant="primary"
          class="p-2"
          @click="addDate"
          >Entregar</b-button
        >
      </b-col>
      <b-col lg="2">
        <b-button
          v-show="give && add == 'search'"
          variant="primary"
          class="p-2"
          @click="valida"
          >Devolver</b-button
        >
      </b-col>
    </b-row>
    <div v-if="!spinner">
      <b-row class="justify-content-center">
        <b-col md="auto">
          <b-table
            id="tabla"
            class="mt-3 text-center"
            style="width: 25rem"
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
        </b-col>
      </b-row>
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
  },
  created() {},
  data() {
    return {
      spinner: null,
      noLote: null,
      aValidar: null,
      noPaquete: ``,
      options: [
        { text: "Añadir lote", value: "add" },
        { text: "Buscar lote", value: "search" },
      ],
      op: [
        { text: "Lote", value: "lote" },
        { text: "Paquete", value: "paquete" },
      ],
      lote: false,
      paquete: false,
      add: false,
      give: false,
      fields: [
        "#",
        { key: "noLote", label: "Lote" },
        { key: "noPaquete", label: "Paquete" },
        { key: "fechaEntregado", label: "Fecha entrega" },
        { key: "fechaDevolucion", label: "Fecha devolución" },
      ],
      paquetes: [],
    };
  },
  methods: {
    upDate() {
      axios
        .put(`${config.api}/lote`, {
          noLote: this.paquetes[0]["noLote"],
          fechaDevolucion: this.paquetes[0]["fechaDevolucion"],
          fechaEntregado: this.paquetes[0]["fechaEntregado"],
        })
        .then((res) => {
          this.paquetes = res.data.lote;
          this.spinner = false;
        })
        .catch((err) => {
          Swal.fire("¡Error!", "No se pudo completar la acción.", "error").then(
            (res) => {
              this.spinner = false;
            }
          );
        });
    },
    addDate() {
      this.spinner = true;
      let fecha = new Date();
      this.paquetes.forEach((el) => {
        el.fechaEntregado = fecha.toISOString().slice(0, 10);
      });
      this.upDate();
    },
    addDateD() {
      this.spinner = true;
      let fecha = new Date();
      fecha = fecha.toISOString().slice(0, 10);
      this.paquetes.forEach((el) => {
        el.fechaDevolucion = fecha;
      });
      this.upDate();
    },
    busca(){
      console.log('entrando');
      this.noPaquete = this.noPaquete.split(/\n/g)[0];
      axios.get(`${config.api}/lote`, {
        params: {
          noPaquete: this.noPaquete
        }
      })
      .then( res => {
        this.aValidar = res.data.lote;
        // this.paquetes = this.paquetes.map( (el, index) => {
        let aux;

        this.paquetes.forEach( (el, index) => {
          // if (el.noPaquete == this.aValidar.noPaquete && el.noLote == this.aValidar.noLote)
          if (el.noPaquete == this.aValidar.noPaquete)
            {
              this.paquetes[index]._rawVariant = 'danger';
              aux = {
                noPaquete: this.paquetes[index].noPaquete,
                noLote: this.paquetes[index].noLote,
                fechaEntregado: this.paquetes[index].fechaEntregado,
                fechaDevolucion: this.paquetes[index].fechaDevolucion,
                _rawVariant: 'danger',
                };
            }
        })
        this.paquetes[11] = {
          // noPaquete: this.paquetes[11].noPaquete,
          noPaquete: 1,
          noLote: this.paquetes[11].noLote,
          fechaEntregado: this.paquetes[11].fechaEntregado,
          fechaDevolucion: this.paquetes.fechaDevolucion,
          _rawVariant: 'danger'
        };

        console.log(this.paquetes);

        //   if(el.noPaquete == this.aValidar.noPaquete && el.noLote == this.aValidar.noLote)
            
        // })
        // this.paquetes = this.aValidar.map( el => {
        //   return {
        //     noPaquete: el.noPaquete,
        //     noLote: el.noLote,
        //     fechaEntregado: el.fechaEntregado,
        //     fechaDevolucion: el.fechaDevolucion,
        //     _rowVariant: 'danger'
        //   }
        // })
      })
    },
    valida() {
      this.noPaquete = this.noPaquete.split(/\n/g)[0];
      let paquete = {
        noLote: this.noLote,
        noPaquete: this.noPaquete,
        // fechaEntregado: fecha.toISOString().slice(0, 10),
        fechaEntregado: null,
        fechaDevolucion: null,
      };
      this.paquetes.push(paquete);
      this.$refs.folio.focus();
      this.noPaquete = "";
    },
    agrega() {
      // if(!this.noPaquete){
      //   this.noPaquete = "";
      //   this.$refs.folio.focus();
      //   return
      // }
      this.noPaquete = this.noPaquete.split(/\n/g)[0];
      // let fecha = new Date();
      let paquete = {
        noLote: this.noLote,
        noPaquete: this.noPaquete,
        // fechaEntregado: fecha.toISOString().slice(0, 10),
        fechaEntregado: null,
        fechaDevolucion: null,
      };
      this.paquetes.push(paquete);
      this.$refs.folio.focus();
      this.noPaquete = "";
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
          if(err.response.data.err.code == 11000);{
            console.log(err.response);
            let dup = err.response.data.err.writeErrors[0]['op'].noPaquete;
            Swal.fire("¡Error!", `Paquete ${dup} ya existe en otro lote.`, "error");
            console.log(err.response.data.err.writeErrors);
          }
        });
    },
    search() {
      this.spinner = true;
      this.paquetes = [];
      let params = null;
      if (!this.noLote)
        params = {
          noPaquete: this.noPaquete,
        };
      else
        params = {
          noLote: this.noLote,
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
