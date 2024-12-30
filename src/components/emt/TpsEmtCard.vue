<template>
  <v-card v-if="selectedMarker" class="card pa-0" style="height: 86vh; position: relative;">
    <div class="card-content">
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="tab-1">
          <TpsGeneralEmtInfo @closeCard="fCloseCard" :selectedMarker="selectedMarker" />
        </v-tabs-window-item>
        <v-tabs-window-item value="tab-2">
          
        </v-tabs-window-item>
      </v-tabs-window>
      <v-col cols="12" class="text-center">
        <v-btn
          @click="toggleFavorite(selectedMarker)"
          :color="isFavorite(selectedMarker) ? 'red' : 'blue'"
          :prepend-icon="isFavorite(selectedMarker) ? 'mdi-star' : 'mdi-star-outline'"
          class="favorite-btn"
        >
          {{ isFavorite(selectedMarker) ? $t('ACCIONES.Eliminar_favorito') : $t('ACCIONES.Anyadir_favorito') }}
        </v-btn>
      </v-col>
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
      </v-tabs>
    </v-card-actions>
  </v-card>
</template>

<script>
import BackServices from "@/services/srv-back";
import TpsGeneralEmtInfo from "@/components/emt/TpsGeneralEmtInfo.vue";

export default {
  emits: ["closeCard", "toggleFavorite"],
  components: { TpsGeneralEmtInfo },
  props: {
    selectedMarker: Object,
  },
  data() {
    return {
      tab: "tab-1",
      favorites: [],
    };
  },

  methods: {
    fCloseCard() {
      this.$emit("closeCard");
    },
    isFavorite(marker) {
      return this.favorites.includes(marker.id_parada);
    },
    toggleFavorite(marker) {
      const index = this.favorites.indexOf(marker.id_parada);
      if (index === -1) {
        this.favorites.push(marker.id_parada);
      } else {
        this.favorites.splice(index, 1);
      }
    },
    
  },
  created() {
  },
};
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
</style>
