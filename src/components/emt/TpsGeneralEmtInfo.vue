<template>
  <div>
    <v-col cols="12" class="sticky-top">
      <v-row>
        <v-col cols="6" sm="6" class="text-left mt-0">
          <v-btn
            @click="toggleFavorite(selectedMarker)"
            :color="isFavourite ? 'red' : 'white'"
            class="favorite-btn"
          >
            <v-icon :icon="isFavourite ? 'mdi-heart' : 'mdi-heart-outline'"></v-icon>
          </v-btn>
        </v-col>
        <v-col cols="6" sm="6" class="text-right">
          <v-btn density="compact" variant="text" icon @click="fCloseCard">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" v-if="dDatosParada != null">
      <h3>{{ this.dDatosParada.denominacion }}</h3>
    </v-col>
    <v-col cols="12" v-if="this.dHorariosParada != null">
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
import BackServices from '@/services/srv-back'
import BackEmtServices from '@/services/srv-back-emt'

export default {
  emits: ['closeCard'],
  props: {
    selectedMarker: Object
  },
  data() {
    return {
      BackEmtServices,
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
    async fGetParadaById(retryCount = 0, maxRetries = 20) {
      const payload = {
        id: this.selectedMarker.id_parada
      }

      try {
        const response = await this.BackEmtServices.fGetParadaById(payload)

        if (!response.status) {
          // Procesar la respuesta si es exitosa
          console.log(response) // eslint-disable-line no-console

          this.dDatosParada = response
          console.log(this.dDatosParada)

          this.fGetHorariosParada(response)
        } else {
          debugger
          if (retryCount < maxRetries) {
            console.log(`Retrying... (${retryCount + 1}/${maxRetries})`) // eslint-disable-line no-console
            await this.fGetParadaById(retryCount + 1, maxRetries)
          } else {
            console.error('Max retries reached. Could not fetch parada data.') // eslint-disable-line no-console
            // Manejar el error según sea necesario
          }
        }
      } catch (error) {
        debugger
        console.error(error) // eslint-disable-line no-console

        if (retryCount < maxRetries) {
          console.log(`Retrying... (${retryCount + 1}/${maxRetries})`) // eslint-disable-line no-console
          await this.fGetParadaById(retryCount + 1, maxRetries)
        } else {
          console.error('Max retries reached. Could not fetch parada data.') // eslint-disable-line no-console
          // Manejar el error según sea necesario
        }
      }
    },
    async fGetHorariosParada(parada) {
      const payload = {
        url: parada.proximasLlegadas
      }
      const response = await this.BackEmtServices.fGetHorariosParada(payload)
      console.log(response)
      this.dHorariosParada = response
    }
  },
  async mounted() {
    await this.fGetParadaById(0,20)
  },
  watch: {
    selectedMarker: {
      handler: function (val) {
        this.fGetParadaById(0,20)
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