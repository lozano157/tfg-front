<template>
  <v-col cols="12">
    <div class="d-flex justify-end">
      <v-dialog v-model="dialog" data-cy="dialog-favorito" max-width="500" persistent>

        <v-card>
          <v-card-title class="headline">Aañdir Favorito</v-card-title>
          
          <v-card-text>
            <p class="mb-4">La parada seleccionada será añadida a favoritos si no existe.</p>
            
            <v-select
              v-model="tipoTransporte"
              data-cy="select-agencia"
              label='Agencia de Transporte'
              :items="['EMT', 'Metrovalencia', 'Valenbisi']"
            ></v-select>

            <v-autocomplete
              v-model="nuevoFavorito.idParada"
              data-cy="autocomplete-parada"
              :items="paradas"
              :item-title="itemTitleKey"
              item-value="idParada"
              label="Selecciona una parada"
              variant="outlined"
              :disabled="!tipoTransporte"
            >
            </v-autocomplete>


          </v-card-text>
          
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Cancelar" variant="text" @click="cerrarDialogo"></v-btn>
            <v-btn  data-cy="btn-guardar-favorito" color="secondary" text="Guardar Alerta" variant="flat" @click="fSaveFavorito"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-data-table
      :headers="headers"
      data-cy="tabla-favoritos"
      :items="favoritos"
      item-key="id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Mis Favoritos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn data-cy="btn-nuevo-favorito" prepend-icon="mdi-plus" color="secondary" @click="dialog = true">
            Nuevo Favorito
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <!--<v-icon class="me-2" size="small" @click="editItem(item)">
          mdi-pencil
        </v-icon>-->
        <v-icon data-cy="btn-borrar-favorito" size="small" @click="fDeleteFavourite(item)">
          mdi-delete
        </v-icon>
      </template>

    </v-data-table>
  </v-col>
</template>

<script>
import BackServices from "@/services/srv-back";

export default {
  props: {
    pTransport: {
      type: Number,
      required: true
    },
    pIdStop: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      tipoTransporte: null,
      dialog: false,
      paradas:[],
      paradasEmt: [],
      paradasMetro: [],
      paradasValenbisi: [],
      headers: [
        { title: 'Agencia', key: 'tipoTransporte', sortable: true,  },
        { title: 'Nombre Parada', key: 'nombreParada', sortable: true,  },
        { title: '', key: 'actions', sortable: false, align: 'end' },
      ],
      // El objeto para la nueva alerta ahora solo necesita la hora
      nuevoFavorito: {
        idParada: null, // Se asignará según la parada seleccionada
        tipoTransporte: null, // Se asignará según el tipo de transporte seleccionado
      },
      BackServices,
      favoritos: [], 
    };
  },
  watch: {
    tipoTransporte(newVal) {
      console.log("Tipo de Transporte seleccionado:", newVal);
      
      if(newVal === 'EMT') {
        this.nuevoFavorito.tipoTransporte = 1;
        this.fGetParadasEmt();
      } else if(newVal === 'Metrovalencia') {
        this.fGetParadasMetro();
        this.nuevoFavorito.tipoTransporte = 2;
      } else if(newVal === 'Valenbisi') {
        this.fGetParadasValenbisi();
        this.nuevoFavorito.tipoTransporte = 3;
      } else {
        this.nuevoFavorito.tipoTransporte = null; // Reset if no valid option
      }
    },
  },
  methods: {
    async fGetFavourites() {
        try {
            const json = {
            };
            const response = await BackServices.fGetFavourites(json);
            console.log("Response from fGetPosts:", response);
            this.favoritos = response;
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    },
    async fSaveFavorito() {
      try {

        // El payload que se envía al backend ya no incluye los días
        
        
        const response = await BackServices.fAddFavourite(this.nuevoFavorito);
        this.fGetFavourites();

        this.cerrarDialogo();
      } catch (error) {
        console.error("Error saving alert:", error);
      }
    },
    async fDeleteFavourite(favorito) {
      try {
        console.log(favorito)

        // El payload que se envía al backend ya no incluye los días
        
        const payload = {
          idParada: favorito.idParada,
          tipoTransporte: favorito.idTransporte
        };
        
        const response = await BackServices.fDeleteFavourite(payload);
        
        
        //borrar la alerta con el id que se ha puesto en el payload
        console.log(this.favoritos);
        this.fGetFavourites();

      } catch (error) {
        console.error("Error saving alert:", error);
      }
    },
    async fGetParadasEmt() {
      try {
        if(this.paradasEmt.length == 0) {
          this.paradas = await BackServices.fGetParadasEmt();
          console.log("Response from fGetParadasEmt:", response);
          
          this.paradasEmt = this.paradas;
        }
        else{
          this.paradas = this.paradasEmt;
        }
        console.log("Paradas EMT:", this.paradas);
        
      } catch (error) {
        console.error("Error fetching EMT stops:", error);
      }
    },
    async fGetParadasMetro() {
      try {
        if(this.paradasMetro.length == 0) {
          this.paradas = await BackServices.fGetParadasFgv();
          console.log("Response from fGetParadasMetro:", response);
          
          this.paradasMetro = this.paradas;
        }else{
          this.paradas = this.paradasMetro;
        }
      } catch (error) {
        console.error("Error fetching Metro stops:", error);
      }
    },
    async fGetParadasValenbisi() {
      try {
        if(this.paradasValenbisi.length == 0) {
          this.paradas = await BackServices.fGetParadasValenbisi();
          this.paradasValenbisi = this.paradas;
        }
        else{
          this.paradas = this.paradasValenbisi;
        }
      } catch (error) {
        console.error("Error fetching Valenbisi stops:", error);
      }
    },

    cerrarDialogo() {
      this.dialog = false;
      this.nuevoFavorito.mensaje = null;
    }
  },
  mounted() {
    this.fGetFavourites();
  },
  computed: {
    itemTitleKey() {
      console.log("Tipo de Transporte:", this.tipoTransporte);
      
      if (this.tipoTransporte =='EMT') {
        return 'denominacion';
      } else if (this.tipoTransporte =='Metrovalencia') {
        return 'nombre';
      } else if (this.tipoTransporte =='Valenbisi') {
        return 'direccion';
      }
    }
  }
}
</script>