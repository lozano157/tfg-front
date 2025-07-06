<template>
  <v-row style="height: 100%; margin: 0">

    <v-col cols="12" class="mb-0 pb-0 d-flex align-center">
      <p class="text-h5 font-weight-bold mt-1 mb-0">
      PARADAS
      </p>
      <v-btn rounded="xl" class="ml-4" :active="dFilterByFavorites" @click="dFilterByFavorites = !dFilterByFavorites">
        FAVORITAS
      </v-btn>
    </v-col>
    <!-- Columna del mapa -->
    <v-col :cols="selectedMarker && !$vuetify.display.mobile?9: 12" p-0 style="height: 85vh" class="pt-2">
      <div id="map" style="height: 100%; width: 100%"></div>
    </v-col>

    <!-- Bottom sheet para móviles -->
    <v-bottom-sheet v-model="selectedMarker" style="border-radius:5px; margin-top:0px;" v-if="$vuetify.display.mobile">
      <v-card class="mt-0"> 
        <TpsEmtCard v-if="selectedMarker?.tipo=='emt'" :selectedMarker="selectedMarker" @closeCard="fCloseCard"></TpsEmtCard>
        <TpsEmtValenbisi v-else-if="selectedMarker?.tipo=='valenbisi'" :selectedMarker="selectedMarker" @closeCard="fCloseCard"></TpsEmtValenbisi>
        <TpsMetrovalenciaCard v-else-if="selectedMarker?.tipo=='fgv'" :selectedMarker="selectedMarker" @closeCard="fCloseCard"></TpsMetrovalenciaCard>
      </v-card>
    </v-bottom-sheet>

    <!-- Columna lateral para desktop -->
    <v-col v-if="selectedMarker && !$vuetify.display.mobile" :cols="3">
      <TpsEmtCard v-if="selectedMarker.tipo=='emt'" :selectedMarker="selectedMarker" @closeCard="fCloseCard"></TpsEmtCard>
      <TpsEmtValenbisi v-else-if="selectedMarker.tipo=='valenbisi'" :selectedMarker="selectedMarker" @closeCard="fCloseCard"></TpsEmtValenbisi>
      <TpsMetrovalenciaCard v-else-if="selectedMarker.tipo=='fgv'" :selectedMarker="selectedMarker" @closeCard="fCloseCard"></TpsMetrovalenciaCard>
    </v-col>
  </v-row>
</template>

<script>
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import BackServices from '@/services/srv-back'
import TpsEmtCard from '@/components/emt/TpsEmtCard.vue'
import TpsEmtValenbisi from '@/components/valenbisi/TpsValenbisiCard.vue'
import TpsMetrovalenciaCard from '@/components/metrovalencia/TpsMetrovalenciaCard.vue'

export default {
  name: 'MapLibreComponent',
  components: { TpsEmtCard, TpsEmtValenbisi, TpsMetrovalenciaCard },
  data() {
    return {
      map: null, // Variable para almacenar la instancia del mapa
      dFilterByFavorites: false, // Variable para filtrar por favoritos
      BackServices,
      markersData: {
        
      },
      selectedMarker: null,
      favorites: [],
      userLocation: null
    }
  },
  async mounted() {
    
    this.map = await this.initializeMap(import.meta.env.VITE_MAPLIBRE_API_KEY);//crea la instancia del mapa

    this.addMapLayers();//añade las capas al mapa

    this.getUserLocation(); // Obtiene la ubicación del usuario

  },
  watch: {
    dFilterByFavorites(newValue) {
      this.fetchMarkers(); // Vuelve a cargar los marcadores al cambiar el filtro
    }
  },
  methods: {
    async initializeMap(apiKey) {
      return new Promise((resolve) => {
        this.map = new maplibregl.Map({
          container: 'map',
          style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
          center: [-0.3785, 39.4699],
          zoom: 16
        })
        this.map.on('load', () => resolve(this.map))
      })
    },
    addMapLayers() {
      this.map.addSource('markers', {
        type: 'geojson',
        data: this.markersData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })

      this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'markers',
        filter: ['has', 'point_count'],
        paint: { 'circle-color': '#51bbd6', 'circle-radius': 20 }
      })

      this.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'markers',
        filter: ['has', 'point_count'],
        layout: { 'text-field': '{point_count_abbreviated}', 'text-size': 12 }
      })

      this.map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'markers',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match',
            ['get', 'tipo'],
            'emt',
            '#FF5733',
            'valenbisi',
            '#33FF57',
            '#11b4da'
          ],
          'circle-radius': 10
        }
      })

      this.map.on('click', 'clusters', (e) => this.zoomCluster(this.map, e))
      this.map.on('click', 'unclustered-point', (e) => this.selectMarker(e))
      this.map.getSource('markers').setData(this.markersData)
      this.map.on('moveend', () => {
        this.fetchMarkers();
      });
    },
    zoomCluster( e) {
      const clusterId = e.features[0].properties.cluster_id
      this.map.getSource('markers').getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (!err) {
          this.map.easeTo({ center: e.features[0].geometry.coordinates, zoom })
        }
      })
    },
    selectMarker(e) {
      this.selectedMarker = e.features[0].properties
    },
    toggleFavorite(marker) {
      const index = this.favorites.indexOf(marker.id_parada)
      index === -1 ? this.favorites.push(marker.id_parada) : this.favorites.splice(index, 1)
    },
    isFavorite(marker) {
      return this.favorites.includes(marker.id_parada)
    },
    getUserLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords
            this.userLocation = [longitude, latitude]

            // Añadir marcador distintivo para la ubicación del usuario
            new maplibregl.Marker({ color: '#0000FF' }) // Color azul para distinguir la ubicación del usuario
              .setLngLat(this.userLocation)
              .setPopup(new maplibregl.Popup().setText('Usted está aquí'))
              .addTo(this.map)

            this.map.flyTo({ center: this.userLocation, zoom: 16 })
          },
          (error) => {
            console.error('Error al obtener la ubicación:', error)
          }
        )
      } else {
        console.error('Geolocalización no está disponible en este navegador.')
      }
    },
    async fetchMarkers(){
      console.log(this.dFilterByFavorites)
      if (this.dFilterByFavorites) {
        await this.fetchFavouriteMarkers();
      } else {
        await this.fetchAllMarkers();
      }
    },
    async fetchAllMarkers() {
      console.log(this.map)
      console.log(this.map.getBounds())
      const boundsRaw = this.map.getBounds()
      const bounds = {
        sw: boundsRaw.getSouthWest().toArray(), // [lng, lat]
        ne: boundsRaw.getNorthEast().toArray()  // [lng, lat]
      }
      const response = await this.BackServices.fGetMarkers(bounds)
      console.log(response)
      this.markersData = response
      
      this.map.getSource('markers').setData(this.markersData);
    },
    async fetchFavouriteMarkers() {
      console.log(this.map)
      console.log(this.map.getBounds())
      const boundsRaw = this.map.getBounds()
      const bounds = {
        sw: boundsRaw.getSouthWest().toArray(), // [lng, lat]
        ne: boundsRaw.getNorthEast().toArray()  // [lng, lat]
      }
      const response = await this.BackServices.fGetFavouriteMarkers(bounds)
      console.log(response)
      this.markersData = response
      
      this.map.getSource('markers').setData(this.markersData);
    },
    fCloseCard() {
      this.selectedMarker = null
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
