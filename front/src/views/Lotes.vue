<template>
  <div class="container">
    <b-row class="justify-content-center mt-2">
      <b-col lg="2"
        ><b-button :pressed.sync="add" variant="info"> Añadir lote</b-button>
      </b-col>
      <b-col lg="2"><b-button variant="info"> Entregar lote</b-button> </b-col>
      <b-col lg="2"><b-button variant="info"> Recibir lote</b-button> </b-col>
      <b-col lg="2"><b-button variant="info"> Buscar lote</b-button> </b-col>
    </b-row>
    <div class="row mt-5" v-show="add">
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
    <div class="row mt-2" v-show="add">
      <div class="p-0 d-flex"></div>
    </div>
    <div class="row mt-2" v-show="add">
      <b-button variant="success" class="p-2" @click="agrega">Añadir lote</b-button>
      <div class="col-2"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Paquete" class="">
          <b-form-input
						type="number"
						:state="valida"
            ref="folio"
            @keydown.188="agrega"
						v-model="noPaquete"
					></b-form-input>
          <!-- <b-form-textarea
            id="textarea-small"
            size="sm"
            :state="valida"
            ref="textarea"
            @keydown.tab="agrega"
            class=""
            v-model="noPaquete"
          ></b-form-textarea> -->
        </b-input-group>
      </div>
    </div>

    <pre>{{ noPaquete }}</pre>
      <b-button v-show="add" variant="primary" class="p-2" @click="download">Descargar</b-button>
    <div>
      <b-table ref="tabla" class="mt-3" :items="paquetes" fixed :fields="fields" v-show="add">
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
// import html2pdf from 'vue-html2pdf';
export default {
  computed: {
    valida() {
      if (this.noPaquete.length > 5) {
        this.noPaquete = this.noPaquete.slice(0, 5);

      }
    },
  },
  created() {
    this.$refs.folio.focus();
  },
  data() {
    return {
      noLote: null,
      noPaquete: "",
      add: false,
      fields: [
        "index",
        { key: "lote", label: "Lote" },
        { key: "Paquete", sortable: true },
        "Fecha entrega",
      ],
      paquetes: [],
    };
  },
  methods: {
    agrega() {
      this.noPaquete = this.noPaquete.slice(0, 5);
		console.log(this.noPaquete);
        let fecha = new Date();
        let paquete = {
          lote: this.noLote,
          Paquete: this.noPaquete,
          "Fecha entrega": fecha.toISOString().slice(0, 10),
        };
        this.paquetes.push(paquete);
        this.$refs.folio.focus();
        this.noPaquete = '';
    },
    download() {
    }
  },
};
</script>
