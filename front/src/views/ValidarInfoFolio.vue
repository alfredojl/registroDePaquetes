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
            @click="getInformacionFolio(paquetes[index])"
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
    <div class="row p-0 mt-4">
      <div class="col-4"></div>
      <div class="col-6"></div>
    </div>
    <div class="row mt-4">
      <div class="col-3"></div>
      <div class="col-6 p-0 d-flex">
          <b-form-input
            type="number"
            autofocus
            placeholder="Paquete"
            v-model="noPaquete"
            lazy
            v-on:keyup.enter="search"
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
      </div>
    </div>
    <!-- <div v-if="spinner" class="text-center mt-3">
      <b-spinner variant="dark" class="p-lg-5" label="Spinning"></b-spinner>
      <b-card>
        <b-skeleton animation="fade" width="85%"></b-skeleton>
        <b-skeleton animation="fade" width="55%"></b-skeleton>
        <b-skeleton animation="fade" width="70%"></b-skeleton>
      </b-card>
    </div> -->
    <b-progress
          :precision="2"
          height="2rem"
          :max="maxBar ? maxBar : '0'"
          show-progress
          class="mt-2"
          animated
          v-show="!paquete.local"
        >
          <b-progress-bar :value="count">
            {{ count }} de {{ maxBar ? maxBar : "0" }}
          </b-progress-bar>
        </b-progress>
    <b-overlay :show="over" blur="1rem" variant="light" rounded="lg">
      <div class="accordion mt-2" role="tablist">
        <!-- <b-card
        no-body
        class="mb-1"
        v-for="(dato, index) in infoPaquete.folios"
        :key="dato.folio"
      > -->
        <b-card
          no-body
          class="mb-1"
          v-for="(dato, index) in folios"
          :key="dato.folio + '-' + index"
        >
          <b-card-header header-tag="header" class="p-1" role="tab">
            <div class="row">
            <b-button-group class="col-12">
            <b-button
              size="sm"
              block
              v-b-toggle="`folio-${dato.folio}-` + index"
              :variant="`${dato.tomo ? 'light' : 'info'}`"
              >Folio {{ dato.folio }} {{ dato.tomo ? 'Tomo ' : ''}}{{ dato.tomo || ''}}</b-button
            >
            <b-button class="p-1 " size="md" variant='dark'
            v-show="!dato.tomo"
            @click="agregaTomo(dato.folio, index)"
            >
              <b-icon-plus-circle>
              </b-icon-plus-circle>
            <!--  <span>tomo</span> -->
            </b-button>
            <b-button
              v-show="!dato.tomo"
              class="p-1"
              size="md"
              @click="deleteTomo(index)"
            >
              <b-icon-dash-circle></b-icon-dash-circle>
            </b-button>
            </b-button-group>
            </div>
          </b-card-header>
          <b-collapse
            :id="`folio-${dato.folio}-` + index"
            accordion="my-accordion"
            role="tabpanel"
          >
            <b-overlay :show="over" blur="1rem" variant="light" rounded="lg">
                  <div class="row mt-3 mb-0">
                  <div class="col-3"></div>
                  <div class="col-auto p-0 d-flex">
                    <b-form-radio-group
                      :name="'radio-options' + (index + 1)"
                      :options="options"
                      class="col-auto m-auto"
                      v-model="folios[index]['estado']"
                    >
                    </b-form-radio-group>
                    <!-- <b-input-group prepend="Tomos" class="">
                    <b-form-input
                      class="col-3"
                      type="number"
                      :name="'tomos' + (index + 1)"
                      v-model="folios[index]['tomos']"
                    ></b-form-input>
                    </b-input-group> -->
                    <b-input-group
                      prepend="Oficio"
                      class="ml-2"
                      v-if="folios[index]['estado'] == 'Oficio'"
                    >
                    <b-form-input
                      v-if="folios[index]['estado'] == 'Oficio'"
                      class="col-3"
                      type="number"
                      :name="'referencias' + (index + 1)"
                      v-model="folios[index]['referencias']"
                    ></b-form-input>
                    </b-input-group>
                  </div>
                </div>
              <b-card-body>
                <div class="container">
                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group size="sm" prepend="Folio" class="mb-4">
                        <b-form-input
                          type="number"
                          disabled
                          class="text-center"
                          v-model="dato['folio']"
                          v-on:keyup.enter="search"
                        ></b-form-input>
                        <b-input-group-prepend>
                          <!-- <b-button
                            variant="secondary"
                            @click="getInformacionFolio(dato['folio'], index)"
                            v-show="!dato['folioBuscadoSICE']"
                            >Buscar</b-button
                          > -->
                        </b-input-group-prepend>
                      </b-input-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group size="sm" prepend="Fojas" class="">
                        <b-form-input
                          type="number"
                          v-model="dato['fojas']"
                        ></b-form-input>
                      </b-input-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group size="sm" prepend="Expediente" class="">
                        <b-form-input
                          v-model="dato['expediente']"
                        ></b-form-input>
                      </b-input-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group size="sm" prepend="Paquete" class="">
                        <b-form-input v-model="dato['noPaquete']"></b-form-input>
                      </b-input-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group size="sm" prepend="Tomo" class="">
                        <b-form-input v-model="dato['tomo']"></b-form-input>
                      </b-input-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group size="sm" prepend="Juzgado" class="">
                        <b-form-select
                          v-model="dato['juzgado']"
                          :options="materias"
                          value-field="name"
                          text-field="name"
                        >
                          <template #first> </template>
                        </b-form-select>
                        <!-- <b-input-group-prepend>
                          <b-button
                            variant="secondary"
                            @click="dato['Juzgado'] = null"
                            >X</b-button
                          >
                        </b-input-group-prepend> -->
                      </b-input-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group size="sm" prepend="Instancia" class="">
                        <b-form-input
                          v-model="dato['instanciaJ']"
                        ></b-form-input>
                      </b-input-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group size="sm" prepend="Sala" class="">
                        <b-form-select
                          v-model="dato['sala']"
                          :options="materias"
                          value-field="name"
                          text-field="name"
                        >
                          <template #first> </template>
                        </b-form-select>
                        <!-- <b-input-group-prepend>
                          <b-button
                            variant="secondary"
                            @click="dato['Sala'] = null"
                            >X</b-button
                          >
                        </b-input-group-prepend> -->
                      </b-input-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group size="sm" prepend="Instancia" class="">
                        <b-form-input
                          v-model="dato['instanciaS']"
                        ></b-form-input>
                      </b-input-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group size="sm" prepend="Toca" class="">
                        <b-form-input v-model="dato['toca']"></b-form-input>
                      </b-input-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group size="sm" prepend="Actor" class="">
                        <b-form-input v-model="dato['actor']"></b-form-input>
                      </b-input-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group size="sm" prepend="Demandado" class="">
                        <b-form-input
                          v-model="dato['demandado']"
                        ></b-form-input>
                      </b-input-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group size="sm" prepend="Juicio" class="">
                        <b-form-input v-model="dato['juicio']"></b-form-input>
                      </b-input-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group size="sm" prepend="Dependencia" class="">
                        <b-form-input
                          v-model="dato['dependencia']"
                        >
                          <template #first> </template>
                        </b-form-input>
                        <!-- <b-input-group-prepend>
                          <b-button
                            variant="secondary"
                            @click="dato['Dependencia'] = null"
                            >X</b-button
                          >
                        </b-input-group-prepend> -->
                      </b-input-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group size="sm" prepend="Observaciones" class="">
                        <b-form-textarea
                          no-resize
                          v-model="dato['observaciones']"
                        ></b-form-textarea>
                      </b-input-group>
                    </div>
                  </div>
                  <!-- <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 p-0 d-flex">
                      <b-input-group
                        size="sm"
                        prepend="Número de imagenes"
                        class=""
                      >
                        <b-form-input
                          v-model="dato['numImagenes']"
                          type="number"
                        ></b-form-input>
                      </b-input-group>
                    </div>
                  </div> -->
                  <!-- </div> -->
                </div>
                    <!-- {{ folios[index]['fojas'] }}
                  <div class="row mt-2" v-if="folios[index]['tomos']" 
                    v-for="ob in range(folios[index].tomos, index)" :key="ob.tomo"
                  >
                  <div class="col-3">
                    <b-input-group
                      :prepend="'Tomo ' + `${ ob.tomo == 0 ? 'original' : ob.tomo }`"
                      class="col-7 p-0"
                      >
                    <b-form-input
                      v-if="folios[index]['tomos']"
                      class="col-auto"
                      v-model="folios[index]['fojas'][ob.tomo]['fojas']"
                      type="text"
                      :name="'fojas' + (ob.tomo + 1)"
                    ></b-form-input>
                    </b-input-group>
                  </div>
                </div> -->
              </b-card-body>
            </b-overlay>
          </b-collapse>
        </b-card>
      </div>
    </b-overlay>
    <div class="row mt-4 mb-5">
      <div class="col-4"></div>
      <div class="col-6 p-0 d-flex">
        <b-button-group size="sm">
          <b-button variant="success" @click="save()">Guardar todo validado</b-button>
          <b-button variant="success" @click="saveWithoutValidar()">Guardar sin validar</b-button>
          <b-button variant="info" @click="goBack()">Regresar</b-button>
        </b-button-group>
      </div>
    </div>
    <!-- <pre>{{ infoPaquete }}</pre> -->
  </div>
</template>

<script>
import axios from "axios";
import config from "../config/config";
import Swal from "sweetalert2";
import { BIconPatchQuestion } from "bootstrap-vue";

export default {
  data() {
    return {
      paquetePreparado: null,
      paquete: {},
      over: null,
      spinner: false,
      noPaquete: null,
      folios: null,
      materias: null,
      dependencias: null,
      infoPaquete: [],
      paquetes: [],
      count: null,
      bis: false,
      cantidad: null,
      identificador: null,
      maxBar: null,
      options: [
        { text: "Completo", value: "Completo" },
        { text: "Faltante", value: "Faltante" },
        { text: "Oficio", value: "Oficio" },
      ],
      tomos: [],
      referencias: [],
      selected: [],
    };
  },
  async created() {
    this.getMaterias();
    this.getDependencias();
    this.noPaquete = localStorage.noPaquete;
    await this.search();
  },
  methods: {
    // range(num, index) {
    //   if(this.folios[index].fojas)
    //     return this.folios[index].fojas;
    //   else {
    //     this.folios[index].fojas = [parseInt(num)];
    //     console.log(this.folios[index].fojas);
    //     for(let i = 0; i <= parseInt(num); i++) {
    //       this.folios[index].fojas[i] = {
    //         tomo: i,
    //         fojas: null
    //       };
    //     }
    //     return this.folios[index].fojas
    //   }
    // },
    deleteTomo(index) {
      if(!this.folios[index].tomos)
        return;
      this.folios.splice(this.folios[index].tomos + index, 1);
      this.folios[index].tomos --;
    },
    agregaTomo(folio, index) {
      // console.log(this.folios[index].tomos ? this.folios[index].tomos + 1 : index + 1);
      this.folios.splice((this.folios[index].tomos ? this.folios[index].tomos + 1 + index: index + 1), 0, {
        bis: this.folios[index].bis,
        estado: 'Completo',
        folio,
        tomo: this.folios[index].tomos + 1 || 1,
        expediente: this.folios[index].expediente,
        toca: this.folios[index].toca,
        noPaquete: this.folios[index].noPaquete,
        juzgado: this.folios[index].juzgado,
        instanciaJ: this.folios[index].insJuz,
        sala: this.folios[index].Sala,
        instanciaS: this.folios[index].insSal,
        actor: this.folios[index].actor,
        demandado: this.folios[index].demandado,
        juicio: this.folios[index].juicio,
        dependencia: this.folios[index].dependencia,
        observaciones: this.folios[index].observaciones || null
      })
      this.folios[index].tomos ? this.folios[index].tomos++ : this.folios[index].tomos = 1;
      // console.log(this.folios);
    },
    getMaterias() {
      axios
        .get(`${config.api}/materias`)
        .then((res) => {
          this.materias = res.data.materias;
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    },
    getDependencias() {
      axios
        .get(`${config.api}/dependencias`)
        .then((res) => {
          this.dependencias = res.data.dependencias;
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    },
    async getInformacionFolio(paquete) {
      if(paquete.local){
        this.$bvModal.hide("packages");
        this.modal = false;
        this.over = false;
        return
      }
      this.paquete = paquete;
      this.over = true;
      let errors = [];
      if (this.modal === true) {
        // this.infoPaquete.folios =
        axios
          .get(`${config.api}/folios`, {
            params: {
              noPaquete: paquete.noPaquete,
              bis: paquete.bis,
              folioInicio: paquete.folioInicio,
              folioFin: paquete.folioFin,
            },
          })
          .then((res) => {
            if (res.data.folios.length == 0) {
              this.spinner = false;
              return Swal.fire(
                `No se pudo encontrar el paquete ${this.noPaquete}.`,
                "",
                "error"
              );
            }
            this.folios = res.data.folios;
            this.folios.forEach((el, index) => {
              if (el.referencias) {
                this.referencias[index] = el.referencias;
                this.selected[index] = "Oficio";
              } else this.selected[index] = "Completo";
              // this.spinner = false;
            });
          });
        this.$bvModal.hide("packages");
        this.modal = false;
      }
      // this.infoPaquete.folios[index]["spinner"] = true;
      // var newval = this.infoPaquete.folios[index];
      // this.infoPaquete.folios[index] = newval;
      // this.infoPaquete.folios.push();
      // console.log(this.infoPaquete.paquete.folioInicio);
      this.maxBar = paquete.folioFin - paquete.folioInicio + 1;
      for (
        let i = paquete.folioInicio, j = 0;
        i <= paquete.folioFin;
        i++, j++
      ) {
        await axios
          .get(`http://digitalizacion.pjcdmx.gob.mx/consulta_folio.php`, {
            params: { f: i },
          })
          .then((res) => {
            if (res.data) {
              if (res.data.encontrado == "false") errors.push(i);
              this.folios[j]["expediente"] = res.data.expediente;
              this.folios[j]["toca"] = res.data.toca;
              this.folios[j]["juzgado"] = res.data.juzgado;
              this.folios[j]["instanciaJ"] = res.data.insJuz;
              this.folios[j]["sala"] = res.data.Sala;
              this.folios[j]["instanciaS"] = res.data.insSal;
              this.folios[j]["actor"] = res.data.actor;
              this.folios[j]["demandado"] = res.data.demandado;
              this.folios[j]["juicio"] = res.data.juicio;
              this.folios[j]["dependencia"] = res.data.dependencia;
              this.folios[j]["observaciones"] = res.data.observaciones || null;
              this.folios[j]["validado"] = false,
              this.count++;
            }
            // this.infoPaquete.folios[j]["spinner"] = false;
          })
          .catch((error) => {
            if (error) {
              errors.push(i);
            }
          });
      }
      if (errors.length > 0) {
        this.spinner = false;
        return Swal.fire({
          title: ``,
          position: "top-end",
          text: `No se obtuvo información de ${errors.length} datos:
              ${errors.join(", ")}.`,
          icon: "error",
          showConfirmButton: true,
        }).then((res) => (this.over = false));
      } else
        Swal.fire({
          title: ``,
          position: "top-end",
          text: `Paquete ${this.noPaquete} encontrado.`,
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
      this.over = false;
      // axios
      //   .get(`http://digitalizacion.pjcdmx.gob.mx/consulta_folio.php`, {
      //     params: { f: folio },
      //   })
      //   // .get(`https://jsonplaceholder.typicode.com/todos/1`)
      //   .then((res) => {
      //     console.log(res.data);
      //     if (res.data) {
      //       this.infoPaquete.folios[index]["expediente"] = res.data.expediente;
      //       this.infoPaquete.folios[index]["juzgado"] = res.data.juzgado;
      //       this.infoPaquete.folios[index]["instanciaJ"] = res.data.insJuz;
      //       this.infoPaquete.folios[index]["sala"] = res.data.Sala;
      //       this.infoPaquete.folios[index]["instanciaS"] = res.data.insSal;
      //       this.infoPaquete.folios[index]["actor"] = res.data.actor;
      //       this.infoPaquete.folios[index]["demandado"] = res.data.demandado;
      //       this.infoPaquete.folios[index]["juicio"] = res.data.juicio;
      //       this.infoPaquete.folios[index]["dependencia"] =
      //         res.data.dependencia;
      //     }
      //     this.infoPaquete.folios[index]["spinner"] = false;
      //     this.infoPaquete.folios[index]["folioBuscadoSICE"] = true;
      //     var newval = this.infoPaquete.folios[index];
      //     this.infoPaquete.folios[index] = newval;
      //     this.infoPaquete.folios.push();
      //     this.over = false;
      //   })
      //   .catch((error) => {
      //     if (error) {
      //       console.log(error);
      //     }
      //     this.over = false;
      //   });
    },
    async search() {
      this.over = true;
      this.count = 0;
      if (!this.noPaquete)
        return Swal.fire({
          title: ``,
          position: "top-end",
          text: `Ingrese un paquete`,
          icon: "info",
          showConfirmButton: false,
          timer: 1000,
        });
      this.spinner = true;
      // if (!this.noPaquete)
      //   this.$router.push("/");
      // else{
      if(!this.noPaquete)
        return Swal.fire(
          '',
          'Primero ingrese un paquete.',
          'info'
        ).then(res => this.over = false);
      await axios
        .get(`${config.api}/paquete`, {
          params: {
            noPaquete: this.noPaquete,
            bis: this.bis,
          },
        })
        .then((res) => {
          if (res.data.paquete.length == 0) {
            return Swal.fire(`No se encontró el paquete ${this.noPaquete}.`, "", "error").then((result) => {
              this.spinner = false;
              this.folios = [];
            });
          } else if (res.data.paquete.length > 1) {
            this.paquetes = res.data.paquete;
            this.modal = true;
            return this.$bvModal.show("packages");
          } else {
            this.paquete = res.data.paquete[0]
            axios
              .get(`${config.api}/folios`, {
                params: {
                  noPaquete: this.paquete.noPaquete,
                  bis: this.paquete.bis,
                  folioInicio: this.paquete.folioInicio,
                  folioFin: this.paquete.folioFin,
                },
              })
              .then((res) => {
                if (res.data.folios.length == 0) {
                  return Swal.fire(
                    `No se pudo encontrar el paquete ${this.noPaquete}.`,
                    "",
                    "error"
                  )
                  .then(res => this.over = false);
                }
                this.folios = res.data.folios;
                this.folios.forEach((el, index) => {
                  if (el.referencias) {
                    this.referencias[index] = el.referencias;
                    this.selected[index] = "Oficio";
                  } else this.selected[index] = "Completo";
                  // this.spinner = false;
                });
              });
            this.infoPaquete.paquete = res.data.paquete;
          }
          this.getInformacionFolio(this.paquete);
          this.over = false;
        })
        .catch((error) => {
          if (error) console.log(error);

          this.spinner = false;
        });

      // }

      // AQUÍ //

      // this.spinner = true;
      // if (!this.noPaquete)
      //   return Swal.fire("Ingresa un número de paquete", "", "info");
      // let params = {
      //   noPaquete: this.noPaquete,
      //   bis: this.bis,
      // };
      // return axios
      //   .get(`${config.api}/paquete`, {
      //     params,
      //   })
      //   .then((res) => {
      //     if (res.data.paquete.length === 0) {

      //       return Swal.fire(
      //         `No se encontró el paquete ${this.noPaquete}.`,
      //         "",
      //         "error"
      //       );
      //     } else if (res.data.paquete.length > 1) {
      //       this.cantidad = res.data.paquete[0].cantidad;
      //       this.identificador = res.data.paquete[0].identificador;
      //       this.paquetes = res.data.paquete;
      //       return this.$bvModal.show("packages");
      //     } else {
      //       this.cantidad = res.data.paquete[0].cantidad;
      //       this.identificador = res.data.paquete[0].identificador;
      //       localStorage.noPaquete = this.noPaquete;
      //       axios
      //         .get(`${config.api}/foliosPaquete`, {
      //           params: {
      //             noPaquete: this.noPaquete,
      //             bis: this.bis,
      //             folioInicio: res.data.paquete[0].folioInicio,
      //             folioFin: res.data.paquete[0].folioFin,
      //           },
      //         })
      //         .then((res) => {
      //           // if (res.data.folios.length == 0) {
      //           //   this.paquetePreparado = false;
      //           //   this.spinner = false;
      //           //   return Swal.fire(
      //           //     `No se pudo encontrar el paquete ${this.noPaquete}.`,
      //           //     "",
      //           //     "error"
      //           //   );
      //           // }
      //           this.paquetePreparado = true;
      //           this.infoPaquete = res.data.infoPaquete;
      //           this.spinner = false;
      //           // this.folios = res.data.folios;
      //           // this.folios.forEach((el, index) => {
      //           //   if (el.referencias) {
      //           //     this.referencias[index] = el.referencias;
      //           //     this.selected[index] = "Oficio";
      //           //   } else this.selected[index] = "Completo";
      //           //   this.spinner = false;
      //           // });
      //         })
      //         .catch((error) => {
      //           if (error) console.log(error.response);
      //         });
      //       this.spinner = false;
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     Swal.fire(
      //       "¡Error!",
      //       "Ocurrió un error al intentar realizar la transacción.",
      //       "error"
      //     );
      //     this.spinner = false;
      //   });
    },
    saveWithoutValidar() {
      Swal.fire({
        title: "¿Está seguro de guardar la información?",
        text: "No se ha asignado como «Validado», por lo que no se subirá a SICE.",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        buttonsStyling: true,
      }).then((result) => {
        // <--
        this.paquete.local = true;
        if (result.value) {
          this.folios.forEach(el => {
            el.validado = false;
          })
          // <-- if confirmed
          // this.infoPaquete.paquete["infoCapturadaSICE"] = true;
          let data = {
            folios: this.folios,
          };
          axios
            .put(`${config.api}/foliosSICE`, { data })
            .then((res) => {
              axios.put(`${config.api}/paquete`, { data: this.paquete })
              .then(res => {
                Swal.fire(
                  `¡Hecho!`,
                  `Folios actualizados correctamente.`,
                  "success"
                ).then((res) => {
                  // this.$router.replace("/asignar");
                });
              })
            })
            .catch((err) => {
              Swal.fire(
                `¡Error!`,
                `Ocurrió un error al intentar actualizar los folios.`,
                "error"
              );
              console.log(err);
            });
        }
      });
    },
    save() {
      Swal.fire({
        title: "¿Está seguro de guardar la información?",
        text: "La información se subirá a SICE como la guarde.",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        buttonsStyling: true,
      }).then((result) => {
        // <--
        if (result.value) {
          // <-- if confirmed
          // this.infoPaquete.paquete["infoCapturadaSICE"] = true;
          this.paquete.local = true;
          this.folios.forEach(el => {
            el.validado = true;
          })
          let data = {
            folios: this.folios,
          };
          axios
            .put(`${config.api}/foliosSICE`, { data })
            .then((res) => {
              axios.put(`${config.api}/paquete`, { data: this.paquete })
              .then(res => {
                Swal.fire(
                  `¡Hecho!`,
                  `Folios actualizados correctamente.`,
                  "success"
                ).then((res) => {
                  // this.$router.replace("/asignar");
                });
              })
            })
            .catch((err) => {
              Swal.fire(
                `¡Error!`,
                `Ocurrió un error al intentar actualizar los folios.`,
                "error"
              );
              console.log(err);
            });
        }
      });
    },
    goBack() {
      localStorage.removeItem("noPaquete");
      this.$router.push("/");
    },
  },
};
</script>