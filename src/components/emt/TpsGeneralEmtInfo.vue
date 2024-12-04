<template>
    <div >
      <v-col cols="12">
        <v-row>
          <v-col cols="6" sm="6" class="text-left mt-1">
            <b>{{ $t('TIPOS.EMT') }}</b>
          </v-col>
          <v-col cols="6" sm="6" class="text-right">
                    <v-btn density="compact" variant="text"  icon @click="fCloseCard">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-col>
        </v-row>
      </v-col>
    <v-col cols="12" v-if="dDatosParada!=null">
      <h3>{{ this.dDatosParada.denominacion }}</h3>
    </v-col>
    <v-col cols="12" v-if="this.dHorariosParada!=null">
      <v-row>
        <v-col v-for="item in dHorariosParada" :key="item" cols="12">
            <v-row>
              <v-col cols="2" class="mt-1">
                <img :src="item.imagen" alt="Imagen de la linea"  width="30px" height="30px">
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
import BackServices from '@/services/srv-back'
import BackEmtServices from '@/services/srv-back-emt'



export default {
    props: {
        selectedMarker: Object
    },
    data() {
        return {
            BackEmtServices,
            dDatosParada: null,
            dHorariosParada: null
        }
    },
    methods:{
        isFavorite(marker) {
            return this.favorites.includes(marker.id_parada)
        },
        fCloseCard(){
            this.$emit('closeCard')
        },
        async fGetParadaById(){
            const payload = {
                id: this.selectedMarker.id_parada
            }
            const response = await this.BackEmtServices.fGetParadaById(payload)
            
            this.dDatosParada = response
            console.log(this.dDatosParada)

            this.fGetHorariosParada(response)

        },
        async fGetHorariosParada(parada){
            const payload = {
                url: parada.proximasLlegadas
            }
            const response = await this.BackEmtServices.fGetHorariosParada(payload)
            console.log(response)
            this.dHorariosParada = response
        }
    },
    async mounted() {
        await this.fGetParadaById()
    },
    watch: {
        selectedMarker: {
            handler: function (val) {
                this.fGetParadaById()
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