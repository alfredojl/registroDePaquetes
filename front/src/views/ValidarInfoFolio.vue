<template>
  <div class="container">
    <b-modal
      id="packages"
      scrollable
      centered
      ref=""
      title="Paquetes encontrados"
    >
      <div
        v-for="(paquete, index) of paquetes"
        :key="paquete.folioInicio"
      >
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
    <div class="row mt-4">
      <div class="col-4"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group
          :prepend="`Información relacionada al Paquete [${noPaquete}]`"
        >
        </b-input-group>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-4"></div>
      <div class="col-6 p-0 d-flex">
        <b-input-group prepend="Paquete" class="">
          <b-form-input
            type="number"
            autofocus
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
          <b-input-group-prepend>
            <b-button variant="secondary" @click="search()">Buscar</b-button>
          </b-input-group-prepend>
        </b-input-group>
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
    <b-overlay :show="over" blur="1rem" variant="light" rounded="lg">
    <div class="accordion" role="tablist">
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
        :key="dato.folio"
      >
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button
            size="sm"
            block
            v-b-toggle="`folio-${dato.folio}`"
            variant="info"
            >Folio - {{ dato.folio }}</b-button
          >
        </b-card-header>
        <b-collapse
          :id="`folio-${dato.folio}`"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-overlay :show="over" blur="1rem" variant="light" rounded="lg">
            <b-card-body>
              <center v-show="!dato['folioBuscadoSICE']">
                <code>
                  Favor de validar si existe información previa del folio
                  correspondiente</code
                >
              </center>
              <br />
              <div class="container">
                <div class="row">
                  <div class="col-3"></div>
                  <div class="col-6 p-0 d-flex">
                    <b-input-group size="sm" prepend="Folio" class="mb-4">
                      <b-form-input
                        type="number"
                        disabled
                        v-model="dato['folio']"
                        v-on:keyup.enter="search"
                      ></b-form-input>
                      <b-input-group-prepend>
                        <b-button
                          variant="secondary"
                          @click="getInformacionFolio(dato['folio'], index)"
                          v-show="!dato['folioBuscadoSICE']"
                          >Buscar</b-button
                        >
                      </b-input-group-prepend>
                    </b-input-group>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3"></div>
                  <div class="col-6 p-0 d-flex">
                    <b-input-group size="sm" prepend="Expediente" class="">
                      <b-form-input v-model="dato['expediente']"></b-form-input>
                    </b-input-group>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3"></div>
                  <div class="col-6 p-0 d-flex">
                    <b-input-group size="sm" prepend="Paquete" class="">
                      <b-form-input v-model="dato['paqueteF']"></b-form-input>
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
                      <b-input-group-prepend>
                        <b-button
                          variant="secondary"
                          @click="dato['Juzgado'] = null"
                          >X</b-button
                        >
                      </b-input-group-prepend>
                    </b-input-group>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3"></div>
                  <div class="col-6 p-0 d-flex">
                    <b-input-group size="sm" prepend="Instancia" class="">
                      <b-form-input v-model="dato['instanciaJ']"></b-form-input>
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
                      <b-input-group-prepend>
                        <b-button
                          variant="secondary"
                          @click="dato['Sala'] = null"
                          >X</b-button
                        >
                      </b-input-group-prepend>
                    </b-input-group>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3"></div>
                  <div class="col-6 p-0 d-flex">
                    <b-input-group size="sm" prepend="Instancia" class="">
                      <b-form-input v-model="dato['instanciaS']"></b-form-input>
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
                      <b-form-input v-model="dato['demandado']"></b-form-input>
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
                    <b-input-group size="sm" prepend="Observaciones" class="">
                      <b-form-textarea
                        no-resize
                        v-model="dato['observaciones']"
                      ></b-form-textarea>
                    </b-input-group>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3"></div>
                  <div class="col-6 p-0 d-flex">
                    <b-input-group size="sm" prepend="Dependencia" class="">
                      <b-form-select
                        v-model="dato['dependencia']"
                        :options="dependencias"
                        value-field="value"
                        text-field="name"
                      >
                        <template #first> </template>
                      </b-form-select>
                      <b-input-group-prepend>
                        <b-button
                          variant="secondary"
                          @click="dato['Dependencia'] = null"
                          >X</b-button
                        >
                      </b-input-group-prepend>
                    </b-input-group>
                  </div>
                </div>
                <div class="row">
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
                </div>
                <!-- </div> -->
              </div>
            </b-card-body>
          </b-overlay>
        </b-collapse>
      </b-card>
    </div>
    </b-overlay>
    <div class="row mt-4 mb-5" v-show="paquetePreparado">
      <div class="col-5"></div>
      <div class="col-6 p-0 d-flex">
        <b-button-group>
          <b-button variant="success" @click="save()">Guardar</b-button>
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
import { BIconPatchQuestion } from 'bootstrap-vue';

export default {
  data() {
    return {
      paquetePreparado: true,
      over: null,
      spinner: false,
      noPaquete: null,
      folios: null,
      materias: null,
      dependencias: null,
      infoPaquete: [],
      paquetes: [],
      bis: false,
      cantidad: null,
      identificador: null,
    };
  },
  async created() {
    this.getMaterias();
    this.getDependencias();
    this.noPaquete = localStorage.noPaquete;
    await this.search();
  },
  methods: {
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
      console.log(paquete);
      this.over = true;
      let errors = [];
      if(this.modal === true){
        // this.infoPaquete.folios = 
        console.log('modal');
        axios.get(`${config.api}/folios`, {
          params: {
            noPaquete: paquete.noPaquete,
            bis: paquete.bis,
            folioInicio: paquete.folioInicio,
            folioFin: paquete.folioFin
          }
        })
        .then(res => {
          if (res.data.folios.length == 0) {
            this.spinner = false;
            return Swal.fire(
              `No se pudo encontrar el paquete ${this.noPaquete}.`,
              "",
              "error"
            );
          }
          this.folios = res.data.folios;
          // this.folios.forEach((el, index) => {
          //   if (el.referencias) {
          //     this.referencias[index] = el.referencias;
          //     this.selected[index] = "Oficio";
          //   } else this.selected[index] = "Completo";
          //   this.spinner = false;
          // });
        })
        this.$bvModal.hide("packages");
        this.modal = false;
      }
      // this.infoPaquete.folios[index]["spinner"] = true;
      // var newval = this.infoPaquete.folios[index];
      // this.infoPaquete.folios[index] = newval;
      // this.infoPaquete.folios.push();
      // console.log(this.infoPaquete.paquete.folioInicio);
      for(let i = paquete.folioInicio, j = 0; i <= paquete.folioFin; i++, j++)
      {
        await axios.get(`http://digitalizacion.pjcdmx.gob.mx/consulta_folio.php`, {
          params: { f: i }
        })
        .then((res) => {
          if(res.data) {
            this.folios[j]["expediente"] = res.data.expediente;
            this.folios[j]["juzgado"] = res.data.juzgado;
            this.folios[j]["instanciaJ"] = res.data.insJuz;
            this.folios[j]["sala"] = res.data.Sala;
            this.folios[j]["instanciaS"] = res.data.insSal;
            this.folios[j]["actor"] = res.data.actor;
            this.folios[j]["demandado"] = res.data.demandado;
            this.folios[j]["juicio"] = res.data.juicio;
            this.folios[j]["dependencia"] =
            res.data.dependencia;
          }
          // this.infoPaquete.folios[j]["spinner"] = false;
        }).catch((error) => {
          if (error) {
              errors.push(i);
          }
        });
      }
      if(errors.length > 0){
        this.spinner = false;
        return Swal.fire({
              title: ``,
              position: "top-end",
              text: `No se obtuvo información de ${errors.length} datos:
              ${errors.join(', ')}.`,
              icon: "error",
              showConfirmButton: true,
            })
            .then(res => this.over = false);
      }
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
      if(!this.noPaquete)
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
      await axios
        .get(`${config.api}/paquete`, {
          params: {
            noPaquete: this.noPaquete,
            bis: this.bis,
          },
        })
        .then((res) => {
          console.log(res.data);
          if (!res.data.ok) {
            this.paquetePreparado = false;
            return Swal.fire(`${res.data.msg}`, "", "error").then((result) => {
              this.spinner = false;
              this.infoPaquete = null;
            });
          }
          else if (res.data.paquete.length > 1){
            this.paquetes = res.data.paquete;
            this.modal = true;
            return this.$bvModal.show("packages");
          }
          else {
            this.paquetePreparado = true;
            axios.get(`${config.api}/folios`, {
          params: {
            noPaquete: res.data.paquete[0].noPaquete,
            bis: res.data.paquete[0].bis,
            folioInicio: res.data.paquete[0].folioInicio,
            folioFin: res.data.paquete[0].folioFin
          }
        })
        .then(res => {
          if (res.data.folios.length == 0) {
            this.spinner = false;
            return Swal.fire(
              `No se pudo encontrar el paquete ${this.noPaquete}.`,
              "",
              "error"
            );
          }
          this.folios = res.data.folios;
          // this.folios.forEach((el, index) => {
          //   if (el.referencias) {
          //     this.referencias[index] = el.referencias;
          //     this.selected[index] = "Oficio";
          //   } else this.selected[index] = "Completo";
          //   this.spinner = false;
          // });
        })
            this.infoPaquete.paquete = res.data.paquete;
          }
          this.getInformacionFolio(res.data.paquete[0]);
        })
        .catch((error) => {
          if (error) console.log(error);

          this.spinner = false;
          this.over = false;
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
    save() {
      Swal.fire({
        title: "Información referente a sistema SICE",
        text: "¿Está seguro que se capturó la información correctamente?",
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
          let data = {
            folios: this.infoPaquete.folios,
            infoCapturadaSICE: "SI",
          };
          axios
            .put(`${config.api}/foliosSICE`, { data })
            .then((res) => {
              Swal.fire(
                `¡Hecho!`,
                `Folios actualizados correctamente. Favor de indicar como 'Digitalizado' el paquete.`,
                "success"
              ).then((res) => {
                this.$router.replace("/asignar");
              });
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