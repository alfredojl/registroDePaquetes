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
    <div class="row mt-5">
      <div class="col-9">
        <h6 class="mt-3">Fecha: {{ fechaToday }}</h6>
        <h6>Verificador: {{ verificador }}</h6>
        <h6>Turno: {{ turno }}</h6>
      </div>
      <div class="col-auto">
        <!-- <div class="mydiv ml-auto"> -->
        <!-- <canvas id="canvas"></canvas> -->
        <img :src="qrvue" alt="" class="mydiv" />
        <!-- </div> -->
      </div>
    </div>

    <br />
    <table class="l" style="width: 90%">
      <tr>
        <th class="renglon">Nombre del preparador:</th>
        <th class="renglon">{{ preparador }}</th>
        <th class="l">Verificador</th>
        <th class="checkes"></th>
        <th class="l">Digitalizador</th>
      </tr>
      <tr>
        <td class="l">Paquete</td>
        <td class="l">{{ noPaquete }} {{ identificador }}/{{ cantidad }}</td>
        <td class="l">Registro de datos</td>
        <td class="l"></td>
        <td class="l"></td>
      </tr>
      <tr>
        <td class="l">Folio inicio</td>
        <td class="l">{{ folioInicio }}</td>
        <td class="l">Numero de hojas continuas</td>
        <td class="l"></td>
        <td class="l"></td>
      </tr>
      <tr>
        <td class="l">Folio fin</td>
        <td class="l">{{ folioFin }}</td>
        <td class="l">Sin grapas</td>
        <td class="l"></td>
        <td class="l"></td>
      </tr>
      <tr>
        <td class="l">Fecha expediente</td>
        <td class="l">{{ fechaExpediente }}</td>
        <td class="l">Sin clips</td>
        <td class="l"></td>
        <td class="l"></td>
      </tr>
      <tr>
        <td class="l">Con periodico</td>
        <td class="l"></td>
        <td class="l">Sin fojas dobladas</td>
        <td class="l"></td>
        <td class="l"></td>
      </tr>
      <tr>
        <td class="l">Papel cebolla</td>
        <td class="l"></td>
        <td class="l">Fojas con cinta</td>
        <td class="l"></td>
        <td class="l"></td>
      </tr>
      <tr>
        <td class="l">Tickets</td>
        <td class="l"></td>
        <td class="l">Con separador</td>
        <td class="l"></td>
        <td class="l"></td>
      </tr>
      <tr>
        <td class="l">Observaciones</td>
        <td class="l"></td>
        <td class="l">Con acetato</td>
        <td class="l"></td>
        <td class="l"></td>
      </tr>
      <tr>
        <td class="l">Dañados</td>
        <td class="l"></td>
        <td class="l">Registro doctos engrapados</td>
        <td class="l"></td>
        <td class="l"></td>
      </tr>
      <tr>
        <td class="l">Mutilados</td>
        <td class="l"></td>
        <td class="l">Registro de observaciones</td>
        <td class="l"></td>
        <td class="l"></td>
      </tr>
      <tr>
        <td class="l">Texto borroso</td>
        <td class="l"></td>
        <td class="l"></td>
        <td class="l"></td>
        <td class="l"></td>
      </tr>
      <tr>
        <td class="l">Texto ilegible</td>
        <td class="l"></td>
        <td class="l"></td>
        <td class="l"></td>
        <td class="l"></td>
      </tr>
      <tr>
        <td class="l">Manchados</td>
        <td class="l"></td>
        <td class="l"></td>
        <td class="l"></td>
        <td class="l"></td>
      </tr>
      <tr>
        <td class="l">Numero estimado de fojas</td>
        <td class="l"></td>
        <td class="l"></td>
        <td class="l"></td>
        <td class="l"></td>
      </tr>
    </table>

    <br />
    <table>
      <td>Recibido</td>
      <td>
        <div class="cuadrado1"></div>
      </td>
      <td>Preparado</td>
      <td class="cuadros"></td>
      <td>Digitalizado</td>
      <td class="cuadros"></td>
      <td>Sellado</td>
      <td class="cuadros"></td>
      <td>Cosido</td>
      <td class="cuadros"></td>
    </table>
    <div class="mb-5"></div>
    <div class="mt-5"></div>
    <div class="row">
      <div class="col-9 mt-5"></div>
      <img :src="qrvue" alt="" class="bottom-qr" />
    </div>
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
      folioFin: null,
      cantidad: null,
      identificador: null,
      turno: null,
      fechaToday: null,
      fechaExpediente: null,
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
      // let data = {
      //     '': this.noPaquete,
      //     "Folio inicio:": this.folioInicio,
      //     'Folio fin: ': this.folioFin,
      //     'Fecha expediente: ': this.fechaExpediente,
      //     'Verificador: ': this.verificador
      // }
      QR.toDataURL(
        `${this.noPaquete} 
Folio inicio: ${this.folioInicio}
Folio fin: ${this.folioFin}
Fecha expediente: ${this.fechaExpediente}
Verificador: ${this.verificador}
Preparador: ${this.preparador}`
      )
        // console.log(data);
        // QR.toDataURL(data)
        .then((url) => {
          this.qrvue = url;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    search() {
      this.noPaquete = localStorage.noPaquete;
      axios
        .get(`${config.api}/paquete`, {
          params: {
            noPaquete: this.noPaquete,
          },
        })
        .then((res) => {
          if (!res.data.paquete)
            return Swal.fire(
              `No se encontró el paquete ${this.noPaquete}.`,
              "",
              "error"
            );
          this.folioInicio = res.data.paquete.folioInicio;
          this.folioFin = res.data.paquete.folioFin;
          this.verificador = res.data.paquete.verificador;
          this.preparador = res.data.paquete.preparador;
          this.cantidad = res.data.paquete.cantidad;
          this.identificador = res.data.paquete.identificador;
          this.turno = res.data.paquete.turno;
          //   this.fechaExpediente = res.data.paquete.fechaExpediente
          //     ? new Date(res.data.paquete.fechaExpediente)
          //         .toISOString()
          //         .slice(0, 10)
          //     : null;
          this.fechaExpediente = new Date(res.data.paquete.fechaExpediente);
          let dia = this.fechaExpediente.getDate() + 1;
          let mes = this.fechaExpediente.getMonth() + 1;
          this.fechaExpediente =
            dia + "/" + mes + "/" + this.fechaExpediente.getFullYear();
          this.qr();
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
.bottom-qr{
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
  width: 15rem;
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
