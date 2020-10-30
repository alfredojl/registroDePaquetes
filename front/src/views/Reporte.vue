<template>
    <div class="container">
        <b-row>
            <b-col md="auto">
      <b-calendar v-model="value" @context="onContext" locale="es-MX"></b-calendar>
    </b-col>
        </b-row>
    </div>
</template>