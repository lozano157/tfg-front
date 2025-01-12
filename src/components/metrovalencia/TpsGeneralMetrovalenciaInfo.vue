<template>
  <div>
    <!-- Cabecera fija -->
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

    <!-- Nombre de la parada -->
    <v-col cols="12" v-if="dDatosParada != null" class="pb-1">
      <h3>{{ this.dDatosParada.nombre }}</h3>
    </v-col>
    <v-col cols="12" v-if="dDatosParada != null" class="pt-1">
      <h4>{{ $t('INFO_CARD.Lineas') }}: {{ this.dDatosParada.lineas }}</h4>
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
import BackServices from '@/services/srv-back'

export default {
  emits: ['closeCard'],
  props: {
    selectedMarker: Object
  },
  data() {
    return {
      BackServices,
      BackMetrovalenciaServices,
      dDatosParada: null,
      dHorariosParada: null,
      isFavourite: false,
    }
  },
  methods: {
    async toggleFavorite(marker) {
      console.log(marker)
      const tokenData = localStorage.getItem('sb-sjobgbzfbmlqikjxwjli-auth-token'); 
      let parsedData = null;
      if (tokenData) {
        parsedData = JSON.parse(tokenData); // Convierte la cadena en objeto
      } else {
        console.error('No se encontró el token en localStorage'); // eslint-disable-line no-console
        alert('Debes iniciar sesión para añadir paradas a favoritos') // eslint-disable-line no-console
        return
      }

      const payload = {
        idParada: marker.id_parada,
        idUsuario: tokenData ? parsedData.user.id : null,
        idTransporte: 2
      }

      if(this.isFavourite) {
        const response = await this.BackServices.fDeleteFavourite(payload)
        if(response.status == "success") {
          this.isFavourite = false
        }
      } else {
        const response = await this.BackServices.fAddFavourite(payload)
        if(response.status == "success") {
          this.isFavourite = true
        }
        
      }

    },
    fCloseCard() {
      this.$emit('closeCard')
    },
    async fGetParadaById(retryCount = 0, maxRetries = 20) {
      const tokenData = localStorage.getItem('sb-sjobgbzfbmlqikjxwjli-auth-token'); 
      let parsedData = null;
      if (tokenData) {
        parsedData = JSON.parse(tokenData); // Convierte la cadena en objeto
      } else {
        console.error('No se encontró el token en localStorage'); // eslint-disable-line no-console
      }

      
      const payload = {
        id: this.selectedMarker.id_parada,
        idUsuario: tokenData ? parsedData.user.id : null
      }

      try {
        const response = await this.BackMetrovalenciaServices.fGetParadaById(payload)
        console.log(response) // eslint-disable-line no-console
        if (!response.status ) {
          // Procesar la respuesta si es exitosa
          console.log(response) // eslint-disable-line no-console
          this.isFavourite = tokenData ? response.favourite : false

          this.dDatosParada = response
          console.log(this.dDatosParada)

          this.fGetHorariosParada(response)
        } else {
          if (retryCount < maxRetries) {
            console.log(`Retrying... (${retryCount + 1}/${maxRetries})`) // eslint-disable-line no-console
            await this.fGetParadaById(retryCount + 1, maxRetries)
          } else {
            console.error('Max retries reached. Could not fetch parada data.') // eslint-disable-line no-console
            // Manejar el error según sea necesario
          }
        }
      } catch (error) {
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
      const response = await this.BackMetrovalenciaServices.fGetHorariosParada(payload)
      console.log(response)
      this.dHorariosParada = response
    }
  },
  async mounted() {
    await this.fGetParadaById(0, 20)
  },
  watch: {
    selectedMarker: {
      handler: function (val) {
        this.fGetParadaById(0, 20)
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