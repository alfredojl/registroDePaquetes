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
    <div class="row justify-content-center mt-5 mb-2">
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
    <div class="m-0">
      <b-row class="justify-content-center m-2">
        <b-button v-show="qrvue.length > 0" variant="success" @click="download">Descargar</b-button>
      </b-row>
      <b-row class="justify-content-center">
        <b-card
        class="p-2 bottom-qr m-4 text-center"
        v-for="(images, index) in qrvue"
        :key="images"
        :img-src="images"
      >
        <span>{{ paquetes[index] }}</span>
      </b-card>
      </b-row>
      <!-- <b-row class="justify-content-center">
      <table id="tabla">
        <tbody>
          <tr v-for="(images, index) of qrvue" :key="images">
          <td class="text-wrap">
            <b-img
              :src="images"
              width="50mm"
              fluid
              class="m-0"
              small
            ></b-img>
        {{ paquetes[index] }}
          </td>
          </tr>
        </tbody>
      </table>
      </b-row> -->
      <!-- <img
        class="p-2 bottom-qr m-4 text-center"
        v-for="(images) in qrvue"
        style="width: 38mm; height: 25mm"
        :key="images"
        :img-src="images"
      > -->
    </div>
  </div>
</template>

<script>
import QR from "qrcode";
import axios from "axios";
import config from "../config/config";
import moment from "moment";
import jspdf from "jspdf";
import autotable from "jspdf-autotable";
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      datos: "",
      noPaquete: "",
      bis: null,
      qrvue: [],
      paquetes: [],
    };
  },
  computed: {
    valida() {
      if (this.noPaquete.length > 5) {
        return false;
      }
    },
  },
  methods: {
    download() {
      let doc = new jspdf({
        orientation: 'landscape',
        unit: 'mm',
        format: [38, 25]
      });
      doc.setFontSize(6)
      this.qrvue.forEach((el, index) => {
        let img = new Image();
        img.src = el;
        doc.addImage(img, 0, 0, 25, 25)
        doc.text(this.paquetes[index], 25, 6)
        doc.addPage({
          orientation: 'landscape',
          unit: 'mm',
          format: [38, 25]
        });
      })
      // for (let index = 0; index < 5; index++) {
      // }
      // autotable(doc, {
      //   // head: [["#", "Lote", "Paquete", "Fecha entregado"]],
      //   html: '#tabla',
      //   columns: [
      //       {title: '', key: 'imges'}
      //     ],
      //     // margin: {top: 10, bottom: 10, right: 10, left: 10},
      //     styles: {fontSize: 8, valing: 'center', halign: 'center', cellPadding: 0.5},
      //     margin: {left: 50},
      //     // tableWidth: 95,
      //     columnWidth: 'wrap',
      //     // showHead: 'everyPage',
      //     theme: 'plain',
      //   // headStyles:
      // });
      doc.deletePage(doc.internal.getNumberOfPages());
      doc.save(`lote${this.noLote}.pdf`);
    },
    qr(noPaquete) {
      QR.toDataURL(
        noPaquete,
        {
          errorCorrectionLevel: 'M'
        }
        // this.datos
      )
        .then((url) => {
          this.qrvue.push(url);

          this.datos = null;
        })
        .catch((err) => {
          console.log(err);
        });
      this.paquetes.push(noPaquete.split('\n').slice(0,4).join('\n'));
      // this.paquetes.push(this.datos.slice(0, 5));
      // this.$refs.folios.$el.focus();
    },
    async search() {
      // this.limpiar();
      let paquete = "";
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
          // this.nopq = res.data.paquete[0].noPaquete;
          // this.folioInicio = res.data.paquete[0].folioInicio;
          // this.registrador = res.data.paquete[0].registrado;
          // this.cosedor = res.data.paquete[0].cosedor;
          // this.validador = res.data.paquete[0].validado;
          // this.folioFin = res.data.paquete[0].folioFin;
          // this.noFojas = res.data.paquete[0].noFojas;
          // this.fechaAlta = res.data.paquete[0].fechaAlta;
          // this.identificador = res.data.paquete[0].identificador;
          // this.cantidad = res.data.paquete[0].cantidad;
          // this.estado = res.data.paquete[0].estado;
          // this.verificador = res.data.paquete[0].verificador;
          // this.showBis = res.data.paquete[0].bis;
          // this.observaciones = res.data.paquete[0].observaciones;
          // this.preparador = res.data.paquete[0].preparador;
          // this.digitalizador = res.data.paquete[0].digitalizador;
          // this.fechaPreparacion = res.data.paquete[0].fechaPreparacion
          //   ? moment(res.data.paquete[0].fechaPreparacion).format('DD/MM/YYYY')
          //   : null;
          // this.fechaExpediente = res.data.paquete[0].fechaExpediente
          //   ? moment(res.data.paquete[0].fechaExpediente).format('DD/MM/YYYY')
          //   : null;
          // this.fechaAsignacion = res.data.paquete[0].fechaAsignacion
          //   ? moment(res.data.paquete[0].fechaAsignacion).format('DD/MM/YYYY')
          //   : null;
          // this.fechaAlta = moment(res.data.paquete[0].fechaAlta).format('DD/MM/YYYY')
          // this.fechaCosido = res.data.paquete[0].fechaCosido
          //   ? moment(res.data.paquete[0].fechaCosido).format('DD/MM/YYYY')
          //   : null;
          // this.getFolios();

          paquete = res.data.paquete[0].noPaquete;
          paquete += res.data.paquete[0].bis ? " BIS" : "";
          paquete += res.data.paquete[0].cantidad
            ? " " +
              res.data.paquete[0].identificador +
              "/" +
              res.data.paquete[0].cantidad
            : "";
          paquete += "\nFI: " + res.data.paquete[0].folioInicio;
          paquete += "\nFF: " + res.data.paquete[0].folioFin;
          paquete +=
            "\n" +
            moment(res.data.paquete[0].fechaExpediente.slice(0, 19)).format("L");
          paquete += '\n::END::'
            this.qr(paquete);
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    },
  },
};
</script>

<style scoped>
.bottom-qr {
  width: 200px;
  height: 200px;
  border: 1px solid black;
}
</style>