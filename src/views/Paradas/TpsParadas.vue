<template>
  <v-row style="height: 100%; margin: 0;">
    <!-- Columna del mapa -->
    <v-col :cols="selectedMarker ? 9:12" p-0 style="height:90vh;">
      <div id="map" style="height: 100%; width: 100%;"></div>
    </v-col>

    <!-- Columna de la tarjeta -->
    <v-col :cols="selectedMarker ? 3:0" >
      <v-card v-if="selectedMarker" class="card pa-0" style="height: 86vh;">
        <div class="card-content">
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
              <v-icon icon="mdi-bus-multiple"></v-icon>
              Lineas
            </v-tab>
            <v-tab value="tab-3">
              <v-icon icon="mdi-bus-alert"></v-icon>
              Avisos
            </v-tab>
          </v-tabs>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import BackServices from "@/services/srv-back";

export default {
  name: "MapLibreComponent",
  data() {
    return {
      BackServices,
      markersData: {
        type: "FeatureCollection",
        features: [
          { type: "Feature", geometry: { type: "Point", coordinates: [-0.35718930875529287, 39.48549520152587] }, properties: { tipo: "emt", id_parada: 965 } },
          { type: "Feature", geometry: { type: "Point", coordinates: [-0.3604238515616531, 39.46165728299867] }, properties: { tipo: "emt", id_parada: 1664 } },
          { type: "Feature", geometry: { type: "Point", coordinates: [-0.33868628941726814, 39.42987965327529] }, properties: { tipo: "emt", id_parada: 2208 } },
          { type: "Feature", geometry: { type: "Point", coordinates: [-0.37962375529688247, 39.4737794996143] }, properties: { tipo: "emt", id_parada: 2214 } },
          { type: "Feature", geometry: { type: "Point", coordinates: [-0.40613648554970433, 39.47850636088407] }, properties: { tipo: "valenbisi", id_parada: 244 } }
        ]
      },
      selectedMarker: null,
      favorites: [],
      userLocation: null,
    };
  },
  async mounted() {
    await this.fetchMarkers();
    const map = await this.initializeMap(import.meta.env.VITE_MAPLIBRE_API_KEY);
    this.addMapLayers(map);
    this.getUserLocation(map); // Obtiene la ubicación del usuario
  },
  methods: {
    async initializeMap(apiKey) {
      return new Promise((resolve) => {
        const map = new maplibregl.Map({
          container: 'map',
          style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
          center: [-0.3785, 39.4699],
          zoom: 12,
        });
        map.on('load', () => resolve(map));
      });
    },
    addMapLayers(map) {
      map.addSource("markers", {
        type: "geojson",
        data: this.markersData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "markers",
        filter: ["has", "point_count"],
        paint: { "circle-color": "#51bbd6", "circle-radius": 20 },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "markers",
        filter: ["has", "point_count"],
        layout: { "text-field": "{point_count_abbreviated}", "text-size": 12 },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "markers",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": [
            "match",
            ["get", "tipo"],
            "emt", "#FF5733",
            "valenbisi", "#33FF57",
            "#11b4da",
          ],
          "circle-radius": 10,
        },
      });

      map.on("click", "clusters", (e) => this.zoomCluster(map, e));
      map.on("click", "unclustered-point", (e) => this.selectMarker(e));
      map.getSource("markers").setData(this.markersData);
    },
    zoomCluster(map, e) {
      const clusterId = e.features[0].properties.cluster_id;
      map.getSource("markers").getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (!err) {
          map.easeTo({ center: e.features[0].geometry.coordinates, zoom });
        }
      });
    },
    selectMarker(e) {
      this.selectedMarker = e.features[0].properties;
    },
    toggleFavorite(marker) {
      const index = this.favorites.indexOf(marker.id_parada);
      index === -1 ? this.favorites.push(marker.id_parada) : this.favorites.splice(index, 1);
    },
    isFavorite(marker) {
      return this.favorites.includes(marker.id_parada);
    },
    getUserLocation(map) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords;
            this.userLocation = [longitude, latitude];

            // Añadir marcador distintivo para la ubicación del usuario
            new maplibregl.Marker({ color: "#0000FF" }) // Color azul para distinguir la ubicación del usuario
              .setLngLat(this.userLocation)
              .setPopup(new maplibregl.Popup().setText("Usted está aquí"))
              .addTo(map);

            map.flyTo({ center: this.userLocation, zoom: 14 });
          },
          (error) => {
            console.error("Error al obtener la ubicación:", error);
          }
        );
      } else {
        console.error("Geolocalización no está disponible en este navegador.");
      }
    },
    async fetchMarkers() {
      const response = await this.BackServices.fGetMarkers();
      console.log(response);
      this.markersData = response;
    }
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
