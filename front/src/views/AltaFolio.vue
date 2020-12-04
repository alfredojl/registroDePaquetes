<template>
  <div class="container">
    <b-button v-for="folio in folios" :key="folio.folio">
    </b-button>
      <b-row class="mt-3">
        <b-col lg="3"></b-col>
          <b-col lg="6">
            <b-input-group prepend="Folio"
              size="sm"
            >
              <b-form-input
                type="number"
                autofocus
                v-model="folios"
                :state="valida"
              >
              </b-form-input>
            </b-input-group>
            <b-input-group size="sm" prepend="Expediente">
              <b-form-input
                type="text"
                v-model="expedientes"
                :state="validaExpediente"
              >
              </b-form-input>
            </b-input-group>
            <b-input-group size="sm" prepend="Paquete">
              <b-form-input
                type="number"
                v-model="paquete"
              >
              </b-form-input>
            </b-input-group>
            <b-input-group size="sm" prepend="Tomo">
              <b-form-input
                type="number"
                v-model="tomos"
              >
              </b-form-input>
            </b-input-group>
            <b-input-group size="sm" prepend="Juzgado">
                <b-form-select
                  options="listaJuzgados"
                  v-model="juzgados"
                >
                </b-form-select>
            </b-input-group>
            <b-input-group size="sm" prepend="Instancia">
              <b-form-input
                type="number"
                v-model="instanciasJuzgado"
              >
              </b-form-input>
            </b-input-group>
            <b-input-group size="sm" prepend="Sala">
              <b-form-select
                options="listaSalas"
                v-model="salas"
              >
              </b-form-select>
            </b-input-group>
            <b-input-group size="sm" prepend="Instancia">
              <b-form-input
                type="number"
                v-model="instanciasSala"
              >
              </b-form-input>
            </b-input-group>
            <b-input-group size="sm" prepend="Toca">
              <b-form-input
                type="number"
                v-model="tocas"
              >
              </b-form-input>
            </b-input-group>
            <b-input-group size="sm" prepend="Actor">
              <b-form-input
                type="number"
                v-model="actores"
              >
              </b-form-input>
            </b-input-group>
            <b-input-group size="sm" prepend="Demandado">
              <b-form-input
                type="number"
                v-model="demandados"
              >
              </b-form-input>
            </b-input-group>
            <b-input-group size="sm" prepend="Juicio">
              <b-form-input
                type="number"
                v-model="juicios"
              >
              </b-form-input>
            </b-input-group>
            <b-input-group size="sm" prepend="Dependencia">
              <b-form-input
                type="number"
                v-model="dependencias"
              >
              </b-form-input>
            </b-input-group>
            <b-input-group size="sm" prepend="Número de imágenes">
              <b-form-input
                type="number"
                v-model="noImgs"
              >
              </b-form-input>
            </b-input-group>
            <b-input-group size="sm" prepend="Observaciones">
              <b-form-textarea
                no-resize
                v-model="observaciones"
              >
              </b-form-textarea>
            </b-input-group>
            <b-form-checkbox
              size="sm"
              class="mt-2"
              v-model="validados"
              value="true"
              unchecked-value="false"
            >Validado</b-form-checkbox>
          </b-col>
      </b-row>
      <b-row class="mb-5"></b-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      folio: [123, 123, 123, 123, 123],
      validados: [],
      observaciones: [],
      noImgs: [],
      listaJuicios: [],
      juicios: [],
      listaDependencias: [],
      dependencias: [],
      demandados: [],
    }
  },
}
</script>