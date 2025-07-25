<template>
  <v-col cols="12">
    <div class="d-flex justify-end">
      <v-dialog data-cy="dialog-aviso" v-model="dialog" max-width="500" persistent>

        <v-card>
          <v-card-title class="headline">Crear Nuevo Aviso</v-card-title>
          
          <v-card-text>
            <p class="mb-4">Los usuarios de la aplicación podrán verlo.</p>
            
            <v-select
              data-cy="select-agencia-aviso"
              v-model="tipoTransporte"
              label='Agencia de Transporte'
              :items="['EMT', 'Metrovalencia', 'Valenbisi']"
            ></v-select>

            <v-autocomplete
              data-cy="autocomplete-parada-aviso"
              v-model="nuevaAlerta.idParada"
              :items="paradas"
              :item-title="itemTitleKey"
              item-value="idParada"
              label="Selecciona una parada"
              variant="outlined"
              :disabled="!tipoTransporte"
            >
            </v-autocomplete>

            <v-text-field
              data-cy="textarea-mensaje-aviso"
              v-model="nuevaAlerta.mensaje"
              label="Mensaje del aviso"
              variant="outlined"
            ></v-text-field>

          </v-card-text>
          
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Cancelar" variant="text" @click="cerrarDialogo"></v-btn>
            <v-btn data-cy="btn-guardar-aviso" color="secondary" text="Guardar Alerta" variant="flat" @click="fSaveAlert"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-data-table
      data-cy="tabla-avisos"
      :headers="headers"
      :items="alertas"
      item-key="id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Mis Avisos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn data-cy="btn-nuevo-aviso" prepend-icon="mdi-plus" color="secondary" @click="dialog = true">
            Nuevo Aviso
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <!--<v-icon class="me-2" size="small" @click="editItem(item)">
          mdi-pencil
        </v-icon>-->
        <v-icon data-cy="btn-borrar-aviso" size="small" @click="fDeleteAlert(item)">
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
        { title: 'Mensaje', key: 'mensaje', sortable: true, align: 'center' },
        { title: 'Fecha', key: 'fechaCreacion', sortable: true, align: 'center' },
        { title: '', key: 'actions', sortable: false, align: 'end' },
      ],
      // El objeto para la nueva alerta ahora solo necesita la hora
      nuevaAlerta: {
        idParada: null, // Se asignará según la parada seleccionada
        tipoTransporte: null, // Se asignará según el tipo de transporte seleccionado
        mensaje: '', // Valor por defecto
      },
      BackServices,
      alertas: [], 
    };
  },
  watch: {
    tipoTransporte(newVal) {
      console.log("Tipo de Transporte seleccionado:", newVal);
      
      if(newVal === 'EMT') {
        this.nuevaAlerta.tipoTransporte = 1;
        this.fGetParadasEmt();
      } else if(newVal === 'Metrovalencia') {
        this.fGetParadasMetro();
        this.nuevaAlerta.tipoTransporte = 2;
      } else if(newVal === 'Valenbisi') {
        this.fGetParadasValenbisi();
        this.nuevaAlerta.tipoTransporte = 3;
      } else {
        this.nuevaAlerta.tipoTransporte = null; // Reset if no valid option
      }
    },
  },
  methods: {
    async fGetAlerts() {
        try {
            const json = {
            };
            const response = await BackServices.fGetAvisosByUser(json);
            console.log("Response from fGetPosts:", response);
            this.alertas = response;
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    },
    async fSaveAlert() {
      try {
        if (!this.nuevaAlerta.mensaje) {
          alert("Por favor, introduzca un mensaje.");
          return;
        }

        // El payload que se envía al backend ya no incluye los días
        
        
        const response = await BackServices.fSaveAlert(this.nuevaAlerta);
        this.fGetAlerts();

        this.cerrarDialogo();
      } catch (error) {
        console.error("Error saving alert:", error);
      }
    },
    async fDeleteAlert(alerta) {
      try {
        console.log(alerta)

        // El payload que se envía al backend ya no incluye los días
        
        
        const response = await BackServices.fDeleteAlert(alerta.idAlerta);
        
        
        //borrar la alerta con el id que se ha puesto en el payload
        console.log(this.alertas);
        this.fGetAlerts();

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
          console.log("Response from fGetParadasValenbisi:", response);
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
      this.nuevaAlerta.mensaje = null;
    }
  },
  mounted() {
    this.fGetAlerts();
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