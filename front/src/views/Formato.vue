<template>
  <div class="container">
    <!-- <table>
      <tr>
        <th>Fecha:</th>
        <th><pre></pre></th>
        <th>Verificador:</th>
        <th><pre></pre></th>
        <th>Turno:</th>
        <th><pre></pre></th>
      </tr>
    </table> -->

    <!-- <br /> -->
    <b-row class="mt-4 justify-content-center">
    <b-col cols="auto">
      <table style="width: 30rem">
        <tr>
          <th class="">Nombre del preparador:</th>
          <!-- <th class="renglon">{{ preparador }}</th>
        <th class="l">Verificador</th>
        <th class="checkes"></th>
        <th>Digitalizador</th> -->
        </tr>
        <tr>
          <td class="l renglon">Paquete</td>
          <td class="l">
            {{ noPaquete }} {{ bis ? "BIS" : "" }}
            {{ identificador ? identificador + "/" : "" }}{{ cantidad }}
          </td>
          <!-- <td class="l">Registro de datos</td>
        <td class="l"></td>
        <td class="l"></td> -->
        </tr>
        <tr>
          <td class="l">Folio inicio</td>
          <td class="l">{{ folioInicio }}</td>
          <!-- <td class="l">Numero de hojas continuas</td>
        <td class="l"></td>
        <td class="l"></td> -->
        </tr>
        <tr>
          <td class="l">Folio fin</td>
          <td class="l">{{ folioFin }}</td>
          <!-- <td class="l">Sin grapas</td> -->
          <!-- <td class="l"></td>
        <td class="l"></td> -->
        </tr>
        <tr>
          <td class="l">Fecha expediente</td>
          <td class="l">{{ fechaExpediente }}</td>
          <!-- <td class="l">Sin clips</td>
        <td class="l"></td>
        <td class="l"></td> -->
        </tr>
        <tr>
          <td class="l">Con periódico</td>
          <td class="l"></td>
          <!-- <td class="l">Sin fojas dobladas</td>
        <td class="l"></td>
        <td class="l"></td> -->
        </tr>
        <tr>
          <td class="l">Papel cebolla</td>
          <td class="l"></td>
          <!-- <td class="l">Fojas con cinta</td>
        <td class="l"></td>
        <td class="l"></td> -->
        </tr>
        <tr>
          <td class="l">Tickets</td>
          <td class="l"></td>
          <!-- <td class="l">Con separador</td>
        <td class="l"></td>
        <td class="l"></td> -->
        </tr>
        <tr>
          <td class="l">Observaciones</td>
          <td class="l"></td>
          <!-- <td class="l">Con acetato</td>
        <td class="l"></td>
        <td class="l"></td> -->
        </tr>
        <tr>
          <td class="l">Dañados</td>
          <td class="l"></td>
          <!-- <td class="l">Registro doctos engrapados</td>
        <td class="l"></td>
        <td class="l"></td> -->
        </tr>
        <tr>
          <td class="l">Mutilados</td>
          <td class="l"></td>
          <!-- <td class="l">Registro de observaciones</td>
        <td class="l"></td>
        <td class="l"></td> -->
        </tr>
        <tr>
          <td class="l">Texto borroso</td>
          <td class="l"></td>
          <!-- <td class="l"></td>
        <td class="l"></td>
        <td class="l"></td> -->
        </tr>
        <tr>
          <td class="l">Texto ilegible</td>
          <td class="l"></td>
          <!-- <td class="l"></td>
        <td class="l"></td>
        <td class="l"></td> -->
        </tr>
        <tr>
          <td class="l">Manchados</td>
          <td class="l"></td>
          <!-- <td class="l"></td>
        <td class="l"></td>
        <td class="l"></td> -->
        </tr>
      </table>
    </b-col>
    <!-- <br /> -->
    <b-col cols="auto">
      <div class="mt-2 p-0">
        <b-table
          id="folios"
          class="mt-3 text-center"
          :items="folios"
          :fields="headers"
        >
        </b-table>
      </div>
    </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";
import config from "../config/config";
import QR from "qrcode";

export default {
  data() {
    return {
      noPaquete: null,
      preparador: null,
      verificador: null,
      folioInicio: null,
      bis: null,
      folioFin: null,
      headers: [
        { key: "folio", label: "Folio" },
        { key: "tomo", label: "Tomo" },
        { key: "estado", label: "Estado" },
        { key: "fojas", label: "No. de Fojas" },
        // { key: "tomos", label: "Tomos" },
        // { key: "referencias", label: "Referencia" },
      ],
      cantidad: null,
      identificador: null,
      turno: null,
      fechaToday: null,
      fechaExpediente: null,
      folios: [],
      qrvue: null,
    };
  },
  created() {
    let date = new Date();
    let mes = date.getMonth() + 1;
    this.fechaToday = date.getDate() + "/" + mes + "/" + date.getFullYear();
    this.search();
  },
  methods: {
    qr() {
      QR.toDataURL(
        `${this.noPaquete} ${this.bis ? "BIS" : ""} ${
          this.identificador ? this.identificador + "/" + this.cantidad : ""
        }
Folio inicio: ${this.folioInicio}
Folio fin: ${this.folioFin}
Fecha expediente: ${this.fechaExpediente}
Lider de equipo: ${this.verificador ? this.verificador : "Sin asignar"}`
        // Preparador: ${this.preparador ? this.preparador : 'Sin asignar'}`
      )
        .then((url) => {
          this.qrvue = url;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getFolios() {
      if (!localStorage.noPaquete) this.spinner = false;
      let params = {
        folioInicio: this.folioInicio,
        folioFin: this.folioFin,
        noPaquete: this.noPaquete,
        bis: this.bis,
      };
      axios
        .get(`${config.api}/folios`, {
          params,
        })
        .then((res) => {
          this.folios = res.data.folios;
          this.folios.forEach((el, index) => {
            if (el.estado == "Faltante") {
              this.folios[index].tomos = "********";
              this.folios[index].referencias = "********";
            }
            if (el.estado == "Urgente") {
              this.folios[index].tomos = "=========";
              this.folios[index].referencias = "==========";
            }
          });
          this.qr();
          // this.folios.forEach((el, index) => {
          //   if (el.referencias) {
          //     this.referencias[index] = el.referencias;
          //     this.selected[index] = "Oficio";
          //   } else this.selected[index] = "Completo";
          //   this.spinner = false;
          // });
        })
        .catch((error) => {
          if (error) console.log(error);
        });
    },
    search() {
      let aux = JSON.parse(localStorage.getItem("paquete"));
      // console.log(aux);
      this.noPaquete = aux.noPaquete;
      this.bis = aux.bis;
      this.folioInicio = aux.folioInicio;
      this.folioFin = aux.folioFin;
      axios
        .get(`${config.api}/paqueteFormato`, {
          params: {
            noPaquete: this.noPaquete,
            bis: this.bis,
            folioInicio: this.folioInicio,
          },
        })
        .then((res) => {
          if (!res.data.paquete)
            return Swal.fire(
              `No se encontró el paquete ${this.noPaquete}.`,
              "",
              "error"
            );
          // this.verificador = res.data.paquete[0].verificador;
          // this.preparador = res.data.paquete[0].preparador;
          this.cantidad = res.data.paquete[0].cantidad;
          this.bis = res.data.paquete[0].bis;
          this.identificador = res.data.paquete[0].identificador;
          this.turno = res.data.paquete[0].turno;
          //   this.fechaExpediente = res.data.paquete[0].fechaExpediente
          //     ? new Date(res.data.paquete[0].fechaExpediente)
          //         .toISOString()
          //         .slice(0, 10)
          //     : null;
          // this.fechaExpediente = new Date(res.data.paquete[0].fechaExpediente);
          let dia = res.data.paquete[0].fechaExpediente.slice(8, 10);
          let mes = res.data.paquete[0].fechaExpediente.slice(5, 7);
          this.fechaExpediente =
            dia +
            "/" +
            mes +
            "/" +
            res.data.paquete[0].fechaExpediente.slice(0, 4);
          // this.fechaExpediente =
          //   dia + "/" + mes + "/" + this.fechaExpediente.getFullYear();
          this.getFolios();
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

<style>
.bottom-qr {
  width: 200px;
  height: 200px;
  border: 1px solid black;
  margin-top: 15rem;
}
.mydiv {
  width: 150px;
  height: 150px;
  border: 2px solid black;
}
.renglon {
  width: 13rem;
}
.cuadros {
  width: 2rem;
  border: 1px solid black;
}
.checkes {
  width: 3rem;
  height: 10px;
}
table.l,
th.l,
td.l {
  border: 1px solid black;
  border-collapse: collapse;
  /* max-height: 3px; */
  height: 3rem;
}
td,
th {
  padding: 5px;
}
h1 {
  font-size: 16px;
  text-align: center;
}
h2 {
  font-size: 16px;
  text-align: right;
}
h3 {
  font-size: 16px;
  text-align: left;
}
div.cuadro1 {
  margin: auto;
  margin-top: 50px;
  width: 150px;
  height: 150px;
  background-color: burlywood;
}
</style>
