<template>
  <div>
    <div id="map" style="height: 500px; width: 100%;"></div>
    <div v-if="selectedMarker" class="card">
      <h3>{{ selectedMarker.name }}</h3>
      <p>Detalles: {{ selectedMarker.details }}</p>
      <v-btn @click="toggleFavorite(selectedMarker)" :color="isFavorite(selectedMarker) ? 'yellow' : 'grey'">
        <v-icon>{{ isFavorite(selectedMarker) ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default {
  name: "MapLibreComponent",
  data() {
    return {
      markersData: [], // Datos de los marcadores
      selectedMarker: null, // Marcador seleccionado
      favorites: [], // Array de favoritos
    };
  },
  async mounted() {
    // Inicializa el mapa de manera asíncrona
    const apikey = import.meta.env.VITE_MAPLIBRE_API_KEY;
    console.log(apikey);

    // Cargar el mapa de manera asíncrona
    const map = await this.initializeMap(apikey);

    // Realiza una consulta para obtener los datos de los marcadores
    this.fetchMarkersData().then(data => {
      this.markersData = data;

      // Añade los marcadores al mapa
      this.markersData.forEach(marker => {
        this.addMarkerToMap(map, marker);
      });
    });
  },
  methods: {
    async initializeMap(apikey) {
      return new Promise((resolve) => {
        const map = new maplibregl.Map({
          container: 'map',
          style: 'https://api.maptiler.com/maps/basic/style.json?key=' + apikey, // Estilo más ligero
          center: [-0.3785, 39.4699], // Barcelona
          zoom: 15,
        });

        map.on('load', () => {
          resolve(map);
        });
      });
    },
    async fetchMarkersData() {
      // Simulación de consulta a una API
      return [
        { id: 1, coordinates: [2.154007, 41.390205], name: "Marker 1", details: "Detalles sobre Marker 1" },
        { id: 2, coordinates: [2.160, 41.385], name: "Marker 2", details: "Detalles sobre Marker 2" },
        { id: 3, coordinates: [-0.4162871688457954,39.50772062463645], name: "Marker 3", details: "Detalles sobre Marker 3" }
      ];
    },
    addMarkerToMap(map, marker) {
      // Crea un marcador
      const mapMarker = new maplibregl.Marker()
        .setLngLat(marker.coordinates) // Ubicación del marcador
        .addTo(map);

      // Añade el evento al hacer clic en el marcador
      mapMarker.getElement().addEventListener("click", () => {
        this.selectedMarker = marker; // Almacena el marcador seleccionado
      });
    },
    toggleFavorite(marker) {
      const index = this.favorites.indexOf(marker.id);
      if (index === -1) {
        // Si no está en favoritos, añadirlo
        this.favorites.push(marker.id);
      } else {
        // Si está en favoritos, quitarlo
        this.favorites.splice(index, 1);
      }
    },
    isFavorite(marker) {
      return this.favorites.includes(marker.id);
    },
  },
};
</script>

<style>
.card {
  background: white;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 10px; /* Espaciado entre el mapa y la card */
}
</style>
