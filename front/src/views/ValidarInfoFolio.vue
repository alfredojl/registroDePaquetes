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
    <div class="row justify-content-center mt-4">
      <b-input-group style="width: 20rem">
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
      </b-input-group>
    </div>
    <b-overlay :show="over" blur="1rem" variant="transparent" rounded="lg">
      <template #overlay style="border: 3px solid black">
    <b-progress
      :precision="2"
      :max="maxBar ? maxBar : '0'"
      style="width: 25rem; heigh: 50rem !important"
      class="mt-2"
    >
      <b-progress-bar :value="count">
        {{ count }} de {{ maxBar ? maxBar : "0" }}
      </b-progress-bar>
    </b-progress>
      </template>
      <b-col>
        <b-row class="justify-content-center">
          <div class="accordion mt-4" role="tablist">
            <b-card
              style="width: 35rem"
              no-body
              class="justify-content-center"
              v-for="(dato, index) in folios"
              :key="dato.folio + '-' + index"
            >
              <b-card-header header-tag="header" class="p-1" role="tab">
                <div class="row justify-content-center">
                  <b-button-group class="col-auto">
                    <b-button
                      size="sm"
                      v-b-toggle="`folio-${dato.folio}-` + index"
                      :variant="`${dato.tomo ? 'outline-secondary' : 'info'}`"
                      >Folio {{ dato.folio }} {{ dato.tomo ? "Tomo " : ""
                      }}{{ dato.tomo || "" }}</b-button
                    >
                    <b-button
                      class="p-1"
                      size="md"
                      variant="link"
                      v-show="!dato.tomo"
                      @click="agregaTomo(dato.folio, index)"
                    >
                      <b-icon-plus-circle> </b-icon-plus-circle>
                      <!--  <span>tomo</span> -->
                    </b-button>
                    <b-button
                      v-show="!dato.tomo"
                      variant="link"
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
                variant="danger"
                role="tabpanel"
              >
                <b-card-body>
                  <div class="container" style="max-width: 35rem">
                    <b-row
                      class="justify-content-center mb-4"
                      v-show="folios[index].rep"
                    >
                      <b-alert show variant="danger"
                        >Este folio ya se encuentra en SICE.</b-alert
                      >
                    </b-row>
                    <b-row class="justify-content-center mb-4">
                      <b-col class="text-right">
                        <strong>Folio: </strong>
                      </b-col>
                      <b-col class="text-left">
                        {{ dato["folio"] }}
                        {{ dato["tomo"] ? "Tomo " + dato["tomo"] : "" }}
                      </b-col>
                    </b-row>
                    <div class="row justify-content-center mt-3 mb-3">
                      <b-form-radio-group
                        :name="'radio-options' + (index + 1)"
                        :options="options"
                        class="col-auto m-auto"
                        v-model="folios[index]['estado']"
                      >
                      </b-form-radio-group>
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
                    <div class="row justify-content-center">
                      <b-col class="text-right">
                        <strong>Fojas: </strong>
                      </b-col>
                      <b-col>
                        <b-form-input
                          size="sm"
                          type="number"
                          v-model="dato['fojas']"
                        ></b-form-input>
                      </b-col>
                    </div>
                    <div class="row justify-content-center">
                      <b-col class="text-right">
                        <strong>Expediente: </strong>
                      </b-col>
                      <b-col>
                        <b-form-input
                          v-model="dato['expediente']"
                          size="sm"
                        ></b-form-input>
                      </b-col>
                    </div>
                    <div class="row justify-content-center">
                      <b-col class="text-right">
                        <strong>Paquete: </strong>
                      </b-col>
                      <b-col>
                        <b-form-input
                          v-model="dato['noPaquete']"
                          size="sm"
                        ></b-form-input>
                      </b-col>
                    </div>
                    <div class="row justify-content-center">
                      <b-col class="text-right">
                        <strong>Tomo: </strong>
                      </b-col>
                      <b-col>
                        <b-form-input
                          v-model="dato['tomo']"
                          size="sm"
                        ></b-form-input>
                      </b-col>
                    </div>
                    <div class="row justify-content-center">
                      <b-col class="text-right text-sm">
                        <strong>Juzgado: </strong>
                      </b-col>
                      <b-col>
                        <b-form-select
                          v-model="dato['juzgado']"
                          :options="materias"
                          value-field="name"
                          text-field="name"
                          size="sm"
                        >
                        </b-form-select>
                      </b-col>
                    </div>
                    <div class="row justify-content-center">
                      <b-col class="text-right">
                        <strong>Instancia: </strong>
                      </b-col>
                      <b-col>
                        <b-form-input
                          v-model="dato['instanciaJ']"
                          size="sm"
                        ></b-form-input>
                      </b-col>
                    </div>
                    <div class="row justify-content-center">
                      <b-col class="text-right">
                        <strong>Sala: </strong>
                      </b-col>
                      <b-col>
                        <b-form-select
                          v-model="dato['sala']"
                          :options="materias"
                          value-field="name"
                          size="sm"
                          text-field="name"
                        >
                          <template #first> </template>
                        </b-form-select>
                      </b-col>
                    </div>
                    <div class="row justify-content-center">
                      <b-col class="text-right">
                        <strong>Instancia: </strong>
                      </b-col>
                      <b-col>
                        <b-form-input
                          v-model="dato['instanciaS']"
                          size="sm"
                        ></b-form-input>
                      </b-col>
                    </div>
                    <div class="row justify-content-center">
                      <b-col class="text-right">
                        <strong>Toca: </strong>
                      </b-col>
                      <b-col>
                        <b-form-input
                          v-model="dato['toca']"
                          size="sm"
                        ></b-form-input>
                      </b-col>
                    </div>
                    <div class="row justify-content-center">
                      <b-col class="text-right">
                        <strong>Actor: </strong>
                      </b-col>
                      <b-col>
                        <b-form-input
                          v-model="dato['actor']"
                          size="sm"
                        ></b-form-input>
                      </b-col>
                    </div>
                    <div class="row justify-content-center">
                      <b-col class="text-right">
                        <strong>Demandado: </strong>
                      </b-col>
                      <b-col>
                        <b-form-input
                          v-model="dato['demandado']"
                          size="sm"
                        ></b-form-input>
                      </b-col>
                    </div>
                    <div class="row justify-content-center">
                      <b-col class="text-right">
                        <strong>Juicio: </strong>
                      </b-col>
                      <b-col>
                        <b-form-input
                          v-model="dato['juicio']"
                          size="sm"
                        ></b-form-input>
                      </b-col>
                    </div>
                    <div class="row justify-content-center">
                      <b-col class="text-right">
                        <strong>Dependencia: </strong>
                      </b-col>
                      <b-col>
                        <b-form-input size="sm" v-model="dato['dependencia']">
                        </b-form-input>
                      </b-col>
                    </div>
                    <div class="row justify-content-center">
                      <b-col class="text-right">
                        <strong>Observaciones: </strong>
                      </b-col>
                      <b-col>
                        <b-form-textarea
                          no-resize
                          v-model="dato['observaciones']"
                        ></b-form-textarea>
                      </b-col>
                    </div>
                  </div>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-row>
      </b-col>
    </b-overlay>
    <div class="row mt-4 mb-5 justify-content-center">
      <b-button-group size="sm" v-show="!over">
        <b-button variant="success" @click="save()"
          >Guardar todo validado</b-button
        >
        <b-button variant="success" @click="saveWithoutValidar()"
          >Guardar sin validar</b-button
        >
        <b-button variant="info" @click="goBack()">Regresar</b-button>
      </b-button-group>
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
      rep: [],
      paquetePreparado: null,
      paquete: {},
      over: null,
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
    deleteTomo(index) {
      if (!this.folios[index].tomos) return;
      this.folios.splice(this.folios[index].tomos + index, 1);
      this.folios[index].tomos--;
    },
    agregaTomo(folio, index) {
      // console.log(this.folios[index].tomos ? this.folios[index].tomos + 1 : index + 1);
      this.folios.splice(
        this.folios[index].tomos
          ? this.folios[index].tomos + 1 + index
          : index + 1,
        0,
        {
          bis: this.folios[index].bis,
          estado: "Completo",
          folio,
          tomo: this.folios[index].tomos + 1 || 1,
          expediente: this.folios[index].expediente,
          toca: this.folios[index].toca,
          noPaquete: this.folios[index].noPaquete,
          juzgado: this.folios[index].juzgado,
          instanciaJ: this.folios[index].instanciaJ,
          sala: this.folios[index].sala,
          instanciaS: this.folios[index].instanciaS,
          actor: this.folios[index].actor,
          demandado: this.folios[index].demandado,
          juicio: this.folios[index].juicio,
          dependencia: this.folios[index].dependencia,
          observaciones: this.folios[index].observaciones || null,
        }
      );
      this.folios[index].tomos
        ? this.folios[index].tomos++
        : (this.folios[index].tomos = 1);
      // console.log(this.folios);
    },
    async getMaterias() {
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
    async getDependencias() {
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
      if (paquete.local) {
        this.$bvModal.hide("packages");
        this.modal = false;
        this.over = false;
        return;
      }
      this.paquete = paquete;
      this.over = true;
      let errors = [];
      if (this.modal === true) {
      await axios.get(`${config.api}/busquedaSICE`, {
        params: {
          folioInicio: paquete.folioInicio,
          folioFin: paquete.folioFin
        }
      }).then(res => {
        if(res.data.folios.length > 0)
        res.data.folios.forEach(el => {
          this.rep.push(el.Folio);
        })
      })
        // this.infoPaquete.folios =
        await axios
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
            });
          });
        this.$bvModal.hide("packages");
        this.modal = false;
      }
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
              else{
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
                (this.folios[j]["validado"] = false), this.count++;
              }
            }
          })
          .catch((error) => {
            if (error) {
              errors.push(i);
            }
          });
      }
      if (errors.length > 0) {
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
        })
        .then(this.over = false);
      await axios
        .get(`${config.api}/paquete`, {
          params: {
            noPaquete: this.noPaquete,
            bis: this.bis,
          },
        })
        .then(async(res) => {
          if (res.data.paquete.length == 0) {
            return Swal.fire(
              `No se encontró el paquete ${this.noPaquete}.`,
              "",
              "error"
            ).then((result) => {
              this.folios = [];
            });
          } else if (res.data.paquete.length > 1) {
            this.paquetes = res.data.paquete;
            this.modal = true;
            return this.$bvModal.show("packages");
          } else {
            this.paquete = res.data.paquete[0];
            await axios
              .get(`${config.api}/folios`, {
                params: {
                  noPaquete: this.paquete.noPaquete,
                  bis: this.paquete.bis,
                  folioInicio: this.paquete.folioInicio,
                  folioFin: this.paquete.folioFin,
                },
              })
              .then(async(res) => {
                if (res.data.folios.length == 0) {
                  return Swal.fire(
                    `No se pudo encontrar el paquete ${this.noPaquete}.`,
                    "",
                    "error"
                  ).then((res) => (this.over = false));
                }
                await axios.get(`${config.api}/busquedaSICE`, {
                  params: {
                    folioInicio: this.paquete.folioInicio,
                    folioFin: this.paquete.folioFin
                  }
                }).then(res => {
                  if(res.data.folios.length > 0)
                  res.data.folios.forEach(el => {
                    this.rep.push(el.Folio);
                  })
                })
                this.folios = res.data.folios;
                this.folios.forEach((el, index) => {
                  if(this.rep.includes(el.folio))
                    this.folios[index].rep = true;
                  if (el.referencias) {
                    this.referencias[index] = el.referencias;
                    this.selected[index] = "Oficio";
                  } else this.selected[index] = "Completo";
                });
              });
            this.infoPaquete.paquete = res.data.paquete;
          }
          await this.getInformacionFolio(this.paquete);
        })
        .catch((error) => {
          if (error) console.log(error);
        });
    },
    async saveWithoutValidar() {
      Swal.fire({
        title: "¿Está seguro de guardar la información?",
        text:
          "No se ha asignado como «Validado», por lo que no se subirá a SICE.",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        buttonsStyling: true,
      }).then((result) => {
        // <--
        this.paquete.local = true;
        this.paquete.validado = localStorage.loggedIn;
        if (result.value) {
          this.folios.forEach((el) => {
            el.validado = false;
          });
          // <-- if confirmed
          // this.infoPaquete.paquete["infoCapturadaSICE"] = true;
          let data = {
            folios: this.folios,
          };
          axios
            .put(`${config.api}/foliosSICE`, { data })
            .then((res) => {
              axios
                .put(`${config.api}/paquete`, { data: this.paquete })
                .then((res) => {
                  Swal.fire(
                    `¡Hecho!`,
                    `Folios actualizados correctamente.`,
                    "success"
                  ).then((res) => {
                    // this.$router.replace("/asignar");
                  });
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
    async save() {
      Swal.fire({
        title: "¿Está seguro de guardar la información?",
        text: "La información se subirá a SICE como la guarde.",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        buttonsStyling: true,
      }).then(async(result) => {
        // <--
        if (result.value) {
          // <-- if confirmed
          // this.infoPaquete.paquete["infoCapturadaSICE"] = true;
          this.paquete.validado = localStorage.loggedIn;
          this.paquete.local = true;
          this.folios.forEach((el) => {
            if(this.rep.includes(el.folio))
              el.validado = false;
            el.validado = true;
          });
          let data = {
            folios: this.folios,
          };
          console.log(data);
          await axios
            .put(`${config.api}/foliosSICE`, { data })
            .then(async(res) => {
              await axios
                .put(`${config.api}/paquete`, { data: this.paquete })
                .then((res) => {
                  Swal.fire(
                    `¡Hecho!`,
                    `Folios actualizados correctamente.`,
                    "success"
                  ).then((res) => {
                    // this.$router.replace("/asignar");
                  });
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