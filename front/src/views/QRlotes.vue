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
    <div class="row">
      <!-- <img v-for="(images, index) in qrvue" :key="images" :src="images" alt="" class="bottom-qr m-2" /> -->
      <b-card
        class="p-2 bottom-qr m-4 text-center"
        v-for="(images, index) in qrvue"
        :key="images"
        :img-src="images"
      >
        {{ paquetes[index] }}
      </b-card>
    </div>
  </div>
</template>

<script>
import QR from "qrcode";
import axios from "axios";
import config from "../config/config";
import moment from "moment";

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
    qr(noPaquete) {
      QR.toDataURL(
        noPaquete
        // this.datos
      )
        .then((url) => {
          this.qrvue.push(url);

          this.datos = null;
        })
        .catch((err) => {
          console.log(err);
        });
      this.paquetes.push(noPaquete.split(/\n/g)[0]);
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
          paquete += "\nFolio inicio: " + res.data.paquete[0].folioInicio;
          paquete += "\nFolio fin: " + res.data.paquete[0].folioFin;
          paquete +=
            "\nFecha de expediente: " +
            moment(res.data.paquete[0].fechaExpediente).format("L");
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