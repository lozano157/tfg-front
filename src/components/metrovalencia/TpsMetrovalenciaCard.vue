<template>
    <v-card v-if="selectedMarker" class="card pa-0" style="height: 86vh;">
        <div class="card-content">
          <v-col cols="12" class="text-right">

          
          <v-btn variant="text" small icon @click="fCloseCard">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          </v-col>
          <v-col cols="12">
            <h3>ID de parada: {{ selectedMarker.id_parada }}</h3>
          </v-col>
          <v-col cols="12">
            <p>Tipo: {{ selectedMarker.tipo }}</p>
          </v-col>
          <v-col cols="12" class="text-center">
            <v-btn
              @click="toggleFavorite(selectedMarker)"
              :color="isFavorite(selectedMarker) ? 'yellow' : 'grey'"
            >
              <v-icon>{{ isFavorite(selectedMarker) ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
            </v-btn>
          </v-col>
        </div>

        <v-card-actions class="bottom-tabs">
          <v-tabs
            v-model="tab"
            align-tabs="center"
            stacked
            style="width: 100%"
          >
            <v-tab value="tab-1">
              <v-icon icon="mdi-information-outline"></v-icon>
              General
            </v-tab>
            <v-tab value="tab-2">
              <v-icon icon="mdi-clock-time-eight-outline"></v-icon>
              Próximos
            </v-tab>
            <v-tab value="tab-3">
              <v-icon icon="mdi-bus-alert"></v-icon>
              Avisos
            </v-tab>
          </v-tabs>
        </v-card-actions>
      </v-card>
</template>

<script>
export default {
    emits: ['closeCard', 'toggleFavorite'],
    props: {
        selectedMarker: Object
    },
    data() {
        return {
            tab: 'tab-1',
            favorites: [],
        }
    },
    methods:{
        toggleFavorite(marker){
            this.$emit('toggleFavorite', marker)
        },
        isFavorite(marker) {
            return this.favorites.includes(marker.id_parada)
        },
        fCloseCard(){
            this.$emit('closeCard')
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
</style>