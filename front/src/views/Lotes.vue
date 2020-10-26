<template>
	<div class="container">
		<b-row class="justify-content-center mt-2">
			<b-col lg="2"
				><b-button :pressed.sync="add" variant="info">
					Añadir lote</b-button
				>
			</b-col>
			<b-col lg="2"
				><b-button variant="info">
					Entregar lote</b-button
				>
			</b-col>
			<b-col lg="2"
				><b-button variant="info">
					Recibir lote</b-button
				>
			</b-col>
			<b-col lg="2"
				><b-button variant="info">
					Buscar lote</b-button
				>
			</b-col>
		</b-row>
		<div class="row mt-5" v-show="add">
			<div class="col-3"></div>
			<div class="col-6 p-0 d-flex">
				<b-input-group prepend="Lote" class="">
					<b-form-input
						type="number"
						autofocus
						v-model="noLote"
						:disabled = "noLote"
						lazy
					></b-form-input>
				</b-input-group>
			</div>
		</div>
		<div class="row mt-2" v-show="add">
			<div class="col-3"></div>
			<div class="col-6 p-0 d-flex">
				<b-input-group prepend="Paquete" class="">
					<b-form-input
						type="number"
            			@keyup.enter="agrega(noPaquete)"
						:state="valida"
						responsive="sm"
						autofocus
						v-model="noPaquete"
						lazy
					></b-form-input>
				</b-input-group>
			</div>
		</div>
		
		<pre>{{ noPaquete.slice(0, 5) }}</pre>
		<pre>{{ sortDesc }}</pre>

		<div>
			<b-table
				class="mt-3"
				:items="paquetes"
				:fields = "fields"
				>
				<template #cell(index)="data">
        {{ data.index + 1 }}
      </template>
			</b-table>
		</div>
	</div>
</template>

<script>
export default {
	computed: {
    valida(){
      if(this.noPaquete.length > 5){
		  this.noPaquete = this.noPaquete.slice(0, 5)
        return false
      }
    }
  },
	data() {
		return {
			noLote: null,
			noPaquete: '',
			add: false,
			fields: [
				'index',
				{ key: "lote", label: "Lote"},
				{ key: "Paquete", sortable: true},
				'Fecha entrega'
			],
			paquetes: []
		};
	},
	methods: {
		agrega(noPaquete){
			if(noPaquete)
			{
				let fecha = new Date();
				let temp = noPaquete.slice(0, 5);
				let paquete = { 
					"lote": this.noLote,
					"Paquete": temp,
					"Fecha entrega": fecha.toISOString().slice(0,10)
					}
				this.paquetes.push(paquete)
				this.noPaquete = ''
			}
		}
	},
};
</script>