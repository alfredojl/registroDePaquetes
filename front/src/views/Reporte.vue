<template>
  <div class="container">
    <b-row class="justify-content-center">
      <b-form-group>
        <b-form-radio class="m-2" button button-variant="outline-info" value="true" v-model="preparados">Preparados</b-form-radio>
        <b-form-radio class="m-2" button button-variant="outline-info" value="false" v-model="preparados">Cosidos</b-form-radio>
      </b-form-group>
    </b-row>
      <b-row class="justify-content-center mt-1">
        <h4 v-if="preparados == 'true'"><strong>Reporte de paquetes preparados</strong></h4>
        <h4 v-if="preparados == 'false'"><strong>Reporte de paquetes cosidos</strong></h4>
      </b-row>
    <b-row class="mt-3 justify-content-center">
      <b-col md="auto">
        <b-row class="m-2">
          <label for="example-datepicker">Por fecha:</label>
          <b-col>
          <b-form-datepicker
            v-model="fechaInicio"
            size="sm"
            :date-disabled-fn="dateDisabled"
            style="width: 10rem"
            placeholder="Fecha inicio"
          ></b-form-datepicker>
          </b-col>
          <b-col>
          <b-form-datepicker
            v-model="fechaFin"
            size="sm"
            :date-disabled-fn="dateDisabled"
            style="width: 10rem"
            placeholder="Fecha fin"
          ></b-form-datepicker>
          </b-col>
        </b-row>
        <div class="row m-2">
        <label for="">Por turno:</label>
          <b-form-select
          autofocus
            v-model="turno"
            :options="turnos"
          >
          <template #first>
        </template>
          </b-form-select>
    </div>
        <div class="row m-2">
          <label>Por verificador:</label>
          <b-form-select
            :disabled="preparados == 'false'"
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
      fechaInicio: null,
      fechaFin: null,
      rendered: null,
      reporte: null,
      preparadores: null,
      preparador: null,
      preparados: 'true',
      verificadores: null,
      verificador: null,
      preparadorH: [
        "Índice",
        { key: "_id", label: "Preparador" },
        { key: "total", label: "Total de fojas" },
      ],
      turnos: ["Matutino", "Vespertino"],
    };
  },
  created() {
    this.getVerificadores();
    this.getPreparadores();
  },
  methods: {
    dateDisabled(ymd, date) {
        const weekday = date.getDay()
        const day = date.getDate()
        return weekday === 0 || weekday === 6
      },
    getVerificadores() {
      axios
        .get(`${config.api}/verificadores`)
        .then((res) => {
          this.verificadores = res.data.verificadores;
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    },
    getPreparadores() {
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
      this.fechaInicio = null;
      this.fechaFin = null;
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
      let ruta;
      if(!this.fechaInicio && !this.preparador && !this.verificador)
        return Swal.fire('Seleccione un campo.', '', 'info');
      if(this.preparados == 'true')
        ruta = `${config.api}/reportePreparado`;
      else
        ruta = `${config.api}/reporteCosido`
        console.log(ruta);

      if (this.fechaInicio) {
        return axios
          .get(`${ruta}`, {
            params: {
              fechaInicio: this.fechaInicio,
              turno: this.turno,
              fechaFin: this.fechaFin
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
          .get(`${ruta}`, {
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
          .get(`${ruta}`, {
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
  }
};
</script>