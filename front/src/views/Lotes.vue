<template>
  <div class="container">
    <b-row class="justify-content-center mt-2">
      <b-col cols="auto">
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
    <div class="row mt-5 justify-content-center" v-show="add == 'add'">
      <!-- <div class="col-2"></div> -->
      <div class="p-0 d-flex">
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
    <div class="row mt-2 justify-content-center" v-show="add == 'add'">
      <div class="p-0 d-flex">
        <b-input-group prepend="Paquete" class="">
          <b-form-textarea
            type="textarea"
            ref="folio"
            @keydown.enter="agrega"
            size="sm"
            v-model="noPaquete"
            no-resize
          ></b-form-textarea>
        </b-input-group>
      </div>
    </div>
    <b-row class="mt-3 justify-content-center">
      <b-col cols="auto">
        <b-button
          v-show="add == 'add'"
          variant="success"
          class="p-2"
          @click="addDate"
          >Agregar fecha de entrega</b-button
        >
      </b-col>
      <b-col cols="auto">
        <b-button
          v-show="add == 'add'"
          variant="primary"
          class="p-2"
          @click="download"
          >Descargar</b-button
        >
      </b-col>
      <b-col cols="auto">
        <b-button
          v-show="add == 'add'"
          variant="success"
          class="p-2"
          @click="save"
          >Guardar</b-button
        >
      </b-col>
    </b-row>

    <div class="row justify-content-center" v-show="add == 'search'">
      <b-form-radio-group
        :options="op"
        buttons
        button-variant="secondary"
        v-model="give"
      ></b-form-radio-group>
    </div>
    <b-row class="mt-3 justify-content-center">
      <b-col cols="auto">
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
      </b-col>
    </b-row>
    <b-row class="justify-content-center">
      <b-col class="col-auto">
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
            @keypress="busca"
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
      <b-col cols="auto">
        <b-button
          v-show="give && add == 'search'"
          variant="primary"
          class="p-2"
          @click="download"
          >Descargar</b-button
        >
      </b-col>
      <b-col cols="auto">
        <b-button
          v-show="give && add == 'search'"
          variant="primary"
          class="p-2"
          @click="addDate"
          >Entregar</b-button
        >
      </b-col>
      <b-col cols="auto">
        <b-button v-show="give && add == 'search'" variant="primary" class="p-2"
        @click="addDateD"
          >Devolver</b-button
        >
      </b-col>
      <b-col cols="auto">
        <b-button
          v-show="give && add == 'search'"
          variant="success"
          class="p-2"
          @click="[aValidar = true, validaInit()]"
        >Validar</b-button
        >
      </b-col>
      <b-col cols="auto">
        <b-button
          v-show="give && add == 'search'"
          variant="success"
          class="p-2"
          @click="save"
        >Guardar</b-button
        >
      </b-col>
    </b-row>
    <b-row v-show="aValidar" class="justify-content-center">
      <b-col cols="auto">
        <b-form-textarea
            type="textarea"
            ref="folio"
            size="sm"
            class="m-2"
            v-model="noPaquete"
            no-resize
            @keypress.enter="valida"
          ></b-form-textarea>
      </b-col>
    </b-row>
    <div v-if="!spinner">
      <b-row class="justify-content-center">
          <table id="tabla" v-show="paquetes.length > 0">
            <thead>
              <th>#</th>
              <th>Lote</th>
              <th>Paquete</th>
              <th>Fecha entregado</th>
              <th>Fecha devolución</th>
              <th v-show="aValidar">Validar</th>
            </thead>
            <tbody
              class="text-center"
              v-for="(item, index) in paquetes"
              :key="index"
            >
              <tr>
                <td>{{ index + 1 }}</td>
                <td>{{ item.noLote }}</td>
                <td>
                  {{ item.noPaquete }}{{ item.bis ? " BIS" : null
                  }}{{
                    item.cantidad
                      ? " " + item.identificador + "/" + item.cantidad
                      : null
                  }}
                </td>
                <td>{{ item.fechaEntregado }}</td>
                <td>{{ item.fechaDevolucion }}</td>
                <td v-show="aValidar"><b-icon v-show="!item.status" icon="exclamation-circle-fill" variant="danger"></b-icon>
                  <b-icon v-show="item.status" icon="check-circle-fill" variant="success"></b-icon></td>
                <!-- <td><b-icon v-show="!status[index]" icon="exclamation-circle-fill" variant="danger"></b-icon>
                  <b-icon v-show="status[index]" icon="check-circle-fill" variant="success"></b-icon></td> -->
                <td><b-button
                  variant="outline-secondary"
                  size="sm"
                  pill
                  v-show="add != 'search'"
                  @click="elimina(index)"
                ><b-icon icon="dash"></b-icon></b-button></td>
              </tr>
            </tbody>
          </table>
          <!-- <b-table
            id="tabla"
            class="mt-3 text-center"
            style="width: 25rem"
            :items="paquetes"
            :fields="fields"
            responsive
            bordered
            v-show="paquetes.length > 0 ? true : false"
            small
            hover
          >
            <template #cell(#)="data">
              {{ data.index + 1 }}
            </template>
            <template #cell(Paquete)="data">
              <b>{{ data }}</b>
              {{ data.item.noPaquete }} {{ data.item.bis ? 'BIS' : ''}} {{ data.item.cantidad ? data.item.identificador + '/' + data.item.cantidad : ''}}
            </template>
            <template #cell(Fecha entrega)="data">
              {{ data }}
            </template>
          </b-table> -->
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
import moment from "moment";
import { IconsPlugin } from "bootstrap-vue";

moment.locale('es-mx');

export default {
  computed: {},
  created() {},
  data() {
    return {
      spinner: null,
      noLote: null,
      aValidar: false,
      noPaquete: ``,
      list: [],
      status: [],
      currentPaqs: [],
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
      paquetes: [],
    };
  },
  computed: {
    // valida(){
    //   this.noPaquete = this.noPaquete.split(/\n/g)[0];
    // }
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
      let fecha = moment().format("DD/MM/YYYY");
      this.paquetes.forEach((el) => {
        el.fechaEntregado = fecha;
      });
      this.spinner = false;
    },
    addDateD() {
      this.spinner = true;
      let fecha = moment().format("DD/MM/YYYY");
      this.paquetes.forEach((el) => {
        el.fechaDevolucion = fecha;
      });
      this.spinner = false;
    },
    endQR() {
      if (this.noPaquete.includes("equipo")) {
        return true;
      }
      return false;
    },
    async busca() {
      // let bis = false;
      // if (this.endQR()) this.noPaquete = this.noPaquete.split(/\n/g)[0];
      // if(this.noPaquete[1] == 'BIS')
      //   bis = true;
      // await axios
      //   .get(`${config.api}/lote`, {
      //     params: {
      //       noPaquete: this.noPaquete,
      //       bis
      //     },
      //   })
      //   .then((res) => {
      //     this.paquetes.forEach((el, index) => {
      //       // if (el.noPaquete == this.aValidar.noPaquete && el.noLote == this.aValidar.noLote)
      //       if (el.noPaquete == this.aValidar.noPaquete) {
      //         this.paquetes[index]._rawVariant = "danger";
      //         aux = {
      //           noPaquete: this.paquetes[index].noPaquete,
      //           noLote: this.paquetes[index].noLote,
      //           fechaEntregado: this.paquetes[index].fechaEntregado,
      //           fechaDevolucion: this.paquetes[index].fechaDevolucion,
      //           _rawVariant: "danger",
      //         };
      //       }
      //     });
      //     });
    },
    validaInit() {
      this.paquetes.forEach(el => {
        this.list.push(el.noPaquete)
      });
    },
    valida() {
      if(this.endQR()) {
        let sob;
        if(this.noPaquete[0] == '\n')
          this.noPaquete = this.noPaquete.slice(1, this.noPaquete.length);
        this.noPaquete = this.noPaquete.split('\n').shift();
        sob = true;
        this.paquetes.forEach(el => {
          if(el.noPaquete.toString() == this.noPaquete.split(' ')[0]){
            el.status = true
            sob = false;
          }
        })
        if(sob)
          Swal.fire('¡Caramba!', `Paquete ${this.noPaquete} no pertenece al lote ${this.noLote}.`, 'warning')
        this.noPaquete = null;
        this.$refs.folio.focus();
      }
    },
    elimina(index) {
      this.paquetes.splice(index, 1);
    },
    agrega() {
      let paquete = {};
      if (this.endQR()) {
        if (this.noPaquete[0] == "\n")
          this.noPaquete = this.noPaquete.slice(1, this.noPaquete.length);
        this.noPaquete = this.noPaquete.split("\n").shift();
        if (this.currentPaqs.includes(this.noPaquete)) {
          this.noPaquete = "";
          return;
        }
        this.currentPaqs.push(this.noPaquete);
        this.noPaquete = this.noPaquete.split(" ");
        if (this.noPaquete[1].toUpperCase() == "BIS") {
          paquete.bis = true;
        }
        if (this.noPaquete[2].length != 0) {
          paquete.identificador = this.noPaquete[2].split("/")[0];
          paquete.cantidad = this.noPaquete[2].split("/")[1];
        }
        (paquete.noLote = this.noLote),
          (paquete.noPaquete = this.noPaquete[0]),
          (paquete.fechaEntregado = null),
          (paquete.fechaDevolucion = null);
        this.paquetes.push(paquete);
        this.$refs.folio.focus();
        this.noPaquete = null;
      }
    },
    download() {
      let doc = new jspdf('p', 'mm', 'a4');
      // autotable(doc, { html: '#tabla' })
      doc.setFontSize(8)
      // doc.text('Título sobre la empresa, quizá (?).', 5,15)
      doc.text(`${moment().format('LLLL')}`, 150, 10)
      doc.text('____________________________', 10, 280)
      doc.text('Nombre y firma de entrega.', 15,285)
      doc.text('____________________________', 150, 280)
      doc.text('Nombre y firma de recepción.', 155,285)
      // doc.text('Título sobre la empresa, quizá (?).', 5,15)
      // doc.text('Título sobre la empresa, quizá (?).', 5,15)
      autotable(doc, {
        // head: [["#", "Lote", "Paquete", "Fecha entregado"]],
        html: '#tabla',
        columns: [
          { title: "#", dataKey: '#' },
          { title: "Lote", dataKey: 'noLote' },
          { title: "Paquete", dataKey: 'noPaquete' },
          { title: "Fecha de entrega", dataKey: 'fechaEntregado' },
          { title: "Fecha de devolución", dataKey: 'fechaDevolucion' },
          ],
          // margin: {top: 10, bottom: 10, right: 10, left: 10},
          styles: {fontSize: 8, valing: 'center', halign: 'center', cellPadding: 0.5},
          margin: {left: 50},
          tableWidth: 95,
          columnWidth: 'wrap',
          showHead: 'everyPage',
          theme: 'striped',
        // headStyles:
      });
      // doc.autotable({
      //   head: [["#", "Lote", "Paquete", "Fecha entrega", "Fecha devolución"]],
      //   html: "#tabla",
      //   margin: { horizontal: 30 },
      //   styles: { overflow: "linebreak", cellwidth: "auto" },
      //   body: [{styles: { align: "center" }}],
      //   theme: "grid",
      // });
      doc.save(`lote${this.noLote}.pdf`);
    },
    async save() {
      await axios
        .post(`${config.api}/lote`, {
          lote: this.paquetes,
        })
        .then((res) => {
          return Swal.fire(
            "¡Hecho!",
            "Lote guardado con éxito.",
            "success"
          ).then((res) => {
            this.paquete = [];
          });
        })
        .catch((err) => {
          if (err.response)
            console.log(err.response);
          Swal.fire('¡Error!', 'Algo salió mal.', 'error');
        });
    },
    async search() {
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
      await axios
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
