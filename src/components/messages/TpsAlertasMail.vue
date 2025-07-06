<template>
  <v-col cols="12">
    <div class="d-flex justify-end">
      <v-dialog v-model="dialog" max-width="500" persistent>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn prepend-icon="mdi-clock-alert-outline" v-bind="activatorProps" variant="outlined" color="secondary">
            Añadir Alerta
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="headline">Crear Nueva Alerta Diaria</v-card-title>
          
          <v-card-text>
            <p class="mb-4">Recibirás un correo todos los días con los próximos horarios cerca de la hora que elijas.</p>
            
            <v-text-field
              v-model="nuevaAlerta.hora"
              label="Hora de la alerta"
              type="time"
              variant="outlined"
            ></v-text-field>

          </v-card-text>
          
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Cancelar" variant="text" @click="cerrarDialogo"></v-btn>
            <v-btn color="secondary" text="Guardar Alerta" variant="flat" @click="fSaveAlert"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-card v-for="alerta in alertas" :key="alerta.id" class="ma-2 mb-4 text-black" variant="outlined" max-width="500">
      <v-card-actions>
        <v-list-item class="w-100">
          <v-row align="center">
            <v-col cols="8">
              <v-list-item-title class="font-weight-bold">Alerta diaria a las: {{ alerta.hora }}</v-list-item-title>
              </v-col>
            <v-col cols="4" class="text-right">
              <v-btn icon="mdi-delete-outline" variant="text" color="error" @click="fDeleteAlert(alerta.id)"></v-btn>
            </v-col>
          </v-row>
        </v-list-item>
      </v-card-actions>
    </v-card>
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
      dialog: false,
      // El objeto para la nueva alerta ahora solo necesita la hora
      nuevaAlerta: {
        hora: '08:00', // Valor por defecto
      },
      BackServices,
      alertas: [], 
    };
  },
  methods: {
    async fGetAlerts() {
        try {
            const json = {
                tipoTransporte: this.pTransport,
                idParada: this.pIdStop
            };
            const response = await BackServices.fGetAlertsMail(json);
            console.log("Response from fGetPosts:", response);
            this.alertas = response;
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    },
    async fSaveAlert() {
      try {
        if (!this.nuevaAlerta.hora) {
          alert("Por favor, selecciona una hora.");
          return;
        }

        // El payload que se envía al backend ya no incluye los días
        const payload = {
          tipoTransporte: this.pTransport,
          idParada: this.pIdStop,
          hora: this.nuevaAlerta.hora,
        };
        
        const response = await BackServices.fSaveAlertMail(payload);
        this.fGetAlerts();

        this.cerrarDialogo();
      } catch (error) {
        console.error("Error saving alert:", error);
      }
    },
    async fDeleteAlert(alertaId) {
      try {
        if (!this.nuevaAlerta.hora) {
          alert("Por favor, selecciona una hora.");
          return;
        }

        // El payload que se envía al backend ya no incluye los días
        
        
        const response = await BackServices.fDeleteAlertMail(alertaId);
        
        
        //borrar la alerta con el id que se ha puesto en el payload
        this.alertas = this.alertas.filter(alerta => alerta.id !== alertaId);

        this.cerrarDialogo();
      } catch (error) {
        console.error("Error saving alert:", error);
      }
    },
    cerrarDialogo() {
      this.dialog = false;
      this.nuevaAlerta.hora = '08:00';
    }
  },
  mounted() {
    this.fGetAlerts();
  }
}
</script>