<template>
  <v-card v-if="selectedMarker" class="card pa-0 pb-4" :class="{ 'mt-0 ': $vuetify.display.mobile }" style="height: 80vh; position: relative;">
    <div class="card-content">
      
    <v-col cols="12" class="sticky-top">
      <v-row>
        <v-col cols="6" sm="6" class="text-left mt-0">
          <v-btn
            v-if="isLogged"
            @click="changeFavourite"
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
        
        <v-col cols="12" v-if="dDatosParada != null">
          <h3>{{ this.dDatosParada.denominacion }}</h3>
        </v-col>
        <v-col cols="12" v-if="dDatosParada != null" class="pt-1">
          <h4>{{ $t('INFO_CARD.Lineas') }}: {{ this.dDatosParada.lineas }}</h4>
        </v-col>
      </v-row>
    </v-col>
    
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="tab-1">
          <TpsGeneralEmtInfo @closeCard="fCloseCard" :selectedMarker="selectedMarker" />
        </v-tabs-window-item>
        <v-tabs-window-item value="tab-2">
          <TpsAlerts :pTransport="1" :pIdStop="selectedMarker.id_parada" />
          
        </v-tabs-window-item>
        <v-tabs-window-item value="tab-3">
          <TpsAlertsMail :pTransport="1" :pIdStop="selectedMarker.id_parada" />
        </v-tabs-window-item>
      </v-tabs-window>
    </div>

    <v-card-actions class="bottom-tabs">
      <v-tabs v-model="tab" align-tabs="center" stacked style="width: 100%">
        <v-tab value="tab-1">
          <v-icon icon="mdi-information-outline"></v-icon>
          {{$t('INFO_CARD.General')}}
        </v-tab>
        <v-tab value="tab-2">
          <v-icon icon="mdi-bus-alert"></v-icon>
          {{$t('INFO_CARD.Avisos')}}
        </v-tab>
        <v-tab value="tab-3">
          <v-icon icon="mdi-timer-alert-outline"></v-icon>
          ALERTAS
        </v-tab>
      </v-tabs>
    </v-card-actions>
  </v-card>
</template>

<script>
import TpsGeneralEmtInfo from "@/components/emt/TpsGeneralEmtInfo.vue";
import TpsAlerts from "@/components/messages/TpsAlerts.vue";
import TpsAlertsMail from "@/components/messages/TpsAlertasMail.vue";

import BackServices from "@/services/srv-back";

import BackEmtServices from '@/services/srv-back-emt'

export default {
  emits: ["closeCard", "toggleFavorite"],
  components: { TpsGeneralEmtInfo, TpsAlerts, TpsAlertsMail},
  props: {
    selectedMarker: Object,
  },
  data() {
    return {
      tab: "tab-1",
      isFavourite: false,
      BackServices,
      BackEmtServices,
      dDatosParada: null,
    };
  },

  methods: {
    isFavorite(marker) {
      return this.favorites.includes(marker.id_parada)
    },
    fCloseCard() {
      this.$emit("closeCard");
    },
    isFavorite(marker) {
      return this.favorites.includes(marker.id_parada);
    },
    changeFavourite(marker) {
      if (this.isFavourite) {
        this.fRemoveFavourite();
      } else {
        this.fAddFavourite();
      }
    },
    async fAddFavourite() {
      const payload = {
        idParada: this.selectedMarker.id_parada,
        tipoTransporte: 1 // EMT
      }

      try {
        const response = await this.BackServices.fAddFavourite(payload)
        console.log(response)

        this.isFavourite = true;
      } catch (error) {
        console.error('Error adding to favorites:', error) // eslint-disable-line no-console
      }
    },
    async fRemoveFavourite() {
      const payload = {
        idParada: this.selectedMarker.id_parada,
        tipoTransporte: 1 // EMT
      }

      try {
        const response = await this.BackServices.fDeleteFavourite(payload)
        console.log(response)
        this.isFavourite = false;
      } catch (error) {
        console.error('Error removing from favorites:', error) // eslint-disable-line no-console
      }
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
    async fGetIsFavorite() {
      const payload = {
        idParada: this.selectedMarker.id_parada,
        tipoTransporte: 1 // EMT

      }

      try {
        const response = await this.BackServices.fGetIsFavourite(payload)
        console.log(response)

        this.isFavourite =  response.isFavourite;
      } catch (error) {
        console.error('Error fetching favorite status:', error) // eslint-disable-line no-console
      }
    }
    
  },
  async mounted() {
    await this.fGetParadaById(0,20)
    await this.fGetIsFavorite()
  },
  computed: {
        // Computed property that checks if there is a token in localStorage
        isLogged() {
            return this.$store.state.isAuthenticated;
        }
    }

};
</script>

<style scoped>
.card {
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
}

.card-content {
  flex: 1;
  overflow-y: auto; /* Altura del tabs para evitar superposición */
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
