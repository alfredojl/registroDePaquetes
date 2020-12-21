<template>
  <div class="container">
    <div class="row">
        <div class="col-3"></div>
        <b-form-textarea
          id="textarea-small"
          autofocus
          ref="folios"
          placeholder="Ingrese los datos..."
          size="lg"
          class="col-6 d-flex mt-5"
          v-model="datos"
        ></b-form-textarea>
      </div>
      <pre>{{ noPaquete }} {{ bis ? 'BIS' : '' }} {{ identificador ? identificador + '/' : '' }}{{ cantidad }}</pre>

      <div class="row mt-2 justify-content-center">
        <b-col cols="6"><b-button @click="qr" variant="primary">Agregar</b-button></b-col>
      </div>

    <div class="row">
      <!-- <img v-for="(images, index) in qrvue" :key="images" :src="images" alt="" class="bottom-qr m-2" /> -->
      <b-card
      class="p-2 bottom-qr m-4"
      v-for="(images, index) in qrvue" :key="images"
      :img-src="images"
    >
    {{ paquetes[index] }}
        </b-card>

    </div>
  </div>
</template>

<script>
import QR from "qrcode";

export default {
  data() {
    return {
      datos: '',
      noPaquete: null,
      qrvue: [],
      paquetes: []
    };
  },
  methods: {
    qr(noPaquete) {
      QR.toDataURL(
this.datos
      )
        .then((url) => {
          this.qrvue.push(url);
          
          this.datos = null
        })
        .catch((err) => {
          console.log(err);
        });
        this.paquetes.push(this.datos.slice(0, 5));
        this.$refs.folios.$el.focus();
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