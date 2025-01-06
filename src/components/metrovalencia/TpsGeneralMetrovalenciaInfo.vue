<template>
  <div>
    <!-- Cabecera fija -->
    <v-col cols="12" class="sticky-top">
      <v-row>
        <v-col cols="6" sm="6" class="text-left mt-1">
          <b>{{ $t('TIPOS.METROVALENCIA') }}</b>
        </v-col>
        <v-col cols="6" sm="6" class="text-right">
          <v-btn density="compact" variant="text" icon @click="fCloseCard">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>

    <!-- Nombre de la parada -->
    <v-col cols="12" v-if="dDatosParada != null" class="pb-1">
      <h3>{{ this.dDatosParada.nombre }}</h3>
    </v-col>
    <v-col cols="12" v-if="dDatosParada != null" class="pt-1">
      <h4>{{$t('INFO_CARD.Lineas')}}: {{ this.dDatosParada.lineas }}</h4>
    </v-col>

    <!-- Contenido con scroll -->
    <v-col cols="12" v-if="this.dHorariosParada != null" class="scrollable-content">
      <v-row>
        <v-col v-for="item in dHorariosParada" :key="item" cols="12">
          <v-row>
            <v-col cols="2" class="mt-1">
              <img :src="item.imagen" alt="Imagen de la linea" width="30px" height="30px" />
            </v-col>
            <v-col cols="10" class="mt-2">
              <p>{{ item.texto }}</p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>



<script>
import BackMetrovalenciaServices from '@/services/srv-back-metrovalencia'

export default {
  emits: ['closeCard'],
  props: {
    selectedMarker: Object
  },
  data() {
    return {
      BackMetrovalenciaServices,
      dDatosParada: null,
      dHorariosParada: null
    }
  },
  methods: {
    isFavorite(marker) {
      return this.favorites.includes(marker.id_parada)
    },
    fCloseCard() {
      this.$emit('closeCard')
    },
    async fGetParadaById() {
      const payload = {
        id: this.selectedMarker.id_parada
      }
      const response = await this.BackMetrovalenciaServices.fGetParadaById(payload)

      this.dDatosParada = response
      console.log(this.dDatosParada)

      this.fGetHorariosParada(response)
    },
    async fGetHorariosParada(parada) {
      const payload = {
        url: parada.proximasLlegadas
      }
      const response = await this.BackMetrovalenciaServices.fGetHorariosParada(payload)
      console.log(response)
      this.dHorariosParada = response
    }
  },
  async mounted() {
    await this.fGetParadaById()
  },
  watch: {
    selectedMarker: {
      handler: function (val) {
        this.fGetParadaById()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.card {
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.card-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 56px; /* Altura del tabs para evitar superposición */
}

.favorite-btn {
  position: absolute;
  bottom: 8vh; /* Ajusta según sea necesario */
  left: 50%;
  transform: translateX(-50%);
}

.bottom-tabs {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  margin: 0;
  padding: 0;
  z-index: 1;
}

.sticky-top {
  position: sticky;
  top: 0;
  background-color: white; /* Asegura que no se vea el fondo al hacer scroll */
  z-index: 1; /* Mantiene la cabecera encima del contenido */
}

.scrollable-content {
  max-height: 55vh; /* Ajusta la altura máxima según lo que necesites */
  overflow-y: auto;
}
</style>