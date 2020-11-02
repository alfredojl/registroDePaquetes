<template>
  <div class="container">
    <b-row class="mt-3 justify-content-center">
      <b-col md="auto">
        <b-row class="m-2">
          <label for="example-datepicker">Por fecha:</label>
          <b-form-datepicker
            id="example-datepicker"
            v-model="value"
            placeholder="Seleccione una fecha"
          ></b-form-datepicker>
        </b-row>
        <div class="row m-2">
          <label>Por verificador:</label>
          <b-form-select
            v-model="verificador"
            :options="verificadores"
            value-field="name"
            text-field="name"
          >
            <template #first> </template>
          </b-form-select>
        </div>
        <b-row class="m-2">
          <label for="">Por preparador:</label>
          <b-form-select
            v-model="preparador"
            :options="preparadores"
            value-field="name"
            text-field="name"
          >
            <template #first> </template>
          </b-form-select>
        </b-row>
        <b-button @click="makeReporte" variant="primary" block>Generar reporte</b-button>
        <b-button @click="limpiar" variant="primary" block>Limpiar</b-button>
        <b-button @click="descargar" variant="primary" block>Descargar en formato excel</b-button>
      </b-col>
    <b-row
      class="mt-2 justify-content-center"
      style="max-width: 30em;"
    >
      <b-col lg="auto">
        <b-table
          class="mt-2 text-center"
          responsive
          :items="reporte"
          :fields="preparadorH"
        >
          <template #cell(Índice)="data">
            {{ data.index + 1 }}
          </template>
        </b-table>
      </b-col>
    </b-row>
    </b-row>
    <pre>{{ reporte }}</pre>
  </div>
</template>

<script>
import axios from "axios";
import config from "../config/config";
import xlsx from 'xlsx';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      value: null,
      rendered: null,
      reporte: null,
      preparadores: null,
      preparador: null,
      verificadores: null,
      verificador: null,
      preparadorH: [
        "Índice",
        { key: "_id", label: "Preparador" },
        { key: "total", label: "Total de fojas" },
      ],
    };
  },
  created() {
    this.getVerificadores();
    this.getPreparadores();
  },
  methods: {
    getVerificadores(value) {
      axios
        .get(`${config.api}/verificadores`, {
          params: {
            turno: value,
          },
        })
        .then((res) => {
          this.verificadores = res.data.verificadores;
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    },
    getPreparadores(value) {
      axios
        .get(`${config.api}/preparadores`)
        .then((res) => {
          this.preparadores = res.data.preparadores;
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
      axios
        .get(`${config.api}/verificadores`)
        .then((res) => {
          let veri = res.data.verificadores;
          veri.forEach((el) => {
            this.preparadores.push(el);
          });
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    },
    limpiar(){
      this.value = null;
      this.verificador = null;
      this.preparador = null;
      this.reporte = null;
    },
    descargar(){
      if(!this.reporte)
        return Swal.fire('Primero genere un reporte', '', 'info');
      let doc, libro;
      let fecha = new Date();
      fecha = fecha.toLocaleDateString().slice(0,10);
      console.log(fecha);
      let aux = this.reporte.map(el => {
        return { Nombre: el._id, Total: el.total };
      });
      doc = xlsx.utils.json_to_sheet(aux);
      libro = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(libro, doc, "doc.xlsx");
      xlsx.writeFile(libro, `reporte${fecha}.xlsx`);
    },
    makeReporte() {
      if(!this.value && !this.preparador && !this.verificador)
        return Swal.fire('Seleccione un campo.', '', 'info');
      if (this.value) {
        return axios
          .get(`${config.api}/reporte`, {
            params: {
              fechaAsignacion: this.value,
            },
          })
          .then((res) => {
            this.reporte = res.data.reporte;
          })
          .catch((err) => {
            this.reporte = err.response;
          });
      }
      if (this.verificador) {
        return axios
          .get(`${config.api}/reporte`, {
            params: {
              verificador: this.verificador,
            },
          })
          .then((res) => {
            this.reporte = res.data.reporte;
          })
          .catch((err) => {
            this.reporte = err.response;
          });
      }
      if (this.preparador) {
        return axios
          .get(`${config.api}/reporte`, {
            params: {
              preparador: this.preparador,
            },
          })
          .then((res) => {
            this.reporte = res.data.reporte;
          })
          .catch((err) => {
            this.reporte = err.response;
          });
      }
    },
  },
};
</script>