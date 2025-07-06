<template>
    <div>
        <TpsAlert
            :post="{ time: 'Hace 5 minutos', text: 'ESTO ES UNA PRUEBA PARA VER LOS MENSAJES QUE SE PUEDNE PONER EN EL TIEMPO SIN SABER COMO ACTUAR ESTAMOS EN UNA SOCIEDAD ABORIGEN'}"
        />


    </div>

     <v-container>
    <v-autocomplete
        v-search="selectedStreet"
        :items="streets"
        label="Busca una calle"
        outlined
        dense
        :loading="loading"
        item-value="text" 
        item-title="text"
        return-object
        @update:search="onSearchInput"
        @update:model-value="prueba"
    ></v-autocomplete>
    Selected street: {{ selectedStreet }}
  </v-container>
  <MenuNotLogged />

  <v-btn @click="fCallRenfe()">Renfe</v-btn>

</template>

<script>

import MenuNotLogged from "@/components/login/MenuNotLogged.vue";
import TpsAlert from "@/components/messages/TpsAlerts.vue";

export default {
    components: {
        MenuNotLogged,
        TpsAlert
    },
    data() {
        return {
            liked: false,
            disliked: false,
            selectedStreet: null, // Calle seleccionada
            streets: [],          // Lista de calles
            loading: false,       // Estado de carga
        };
    },
    methods: {
        async fCallRenfe(){
            const url = `https://thingproxy.freeboard.io/fetch/https://www.renfe.com/content/renfe/es/es/grupo-renfe/comunicacion/renfe-al-dia/avisos/jcr:content/root/responsivegrid/rfincidentreports_co.noticeresults.json`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            
        },
        prueba(prueba){
            console.log(prueba)
            this.selectedStreet = prueba.text
            
        },
        toggleLike() {
            this.liked = !this.liked;
            if (this.liked) {
                this.disliked = false; // Si se marca "like", desmarcamos "dislike"
            }
        },
        toggleDislike() {
            this.disliked = !this.disliked;
            if (this.disliked) {
                this.liked = false; // Si se marca "dislike", desmarcamos "like"
            }
        },
        onSearchInput(searchText) {
            clearTimeout(this.searchTimeout); // Limpiar cualquier timeout previo
            this.searchTimeout = setTimeout(() => {
                this.fetchStreets(searchText); // Ejecutar la búsqueda tras el retraso
            }, 1000); // 1000 ms = 1 segundo
        },
        async fetchStreets(term) {
            console.log("fetchStreets", term);
            if(!term) {
                this.streets = [];
                return;
            }
            if (this.streets.find(street => street.text === term)) {
                    return;
            }

            this.loading = true;
            try {
                const encodedSearch = encodeURIComponent(term);
                const url = `https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/llistat-dels-carrers/records?where=nomoficial%20like%20%22${encodedSearch}%22%20or%20traducnooficial%20like%20%22${encodedSearch}%22&limit=20`;

                const response = await fetch(url);
                const data = await response.json();

                this.streets = (data.results || []).map(street => ({
                text: street.codtipovia == "AV"?street.codtipovia +'.'+ street.traducnooficial: street.codtipovia + street.traducnooficial, // Lo que se muestra en el autocomplete
                text2: street.nomoficial, // Lo que se muestra en el autocomplete
                value: street,          // Guardamos el objeto completo para selectedStreet
                }));
                console.log("fetchStreets", this.streets);
                
                //si term está en this.streets entonces this.selectedStreet = term
                if (this.streets.find(street => street.text2 === term)) {
                    this.selectedStreet = term;
                }
            } catch (error) {
                console.error("Error al obtener las calles:", error);
                this.streets = [];
            } finally {
                this.loading = false;
            }
        },

        
    }
};
</script>

<style scoped>
.fs12 {
    font-size: 16px;
}
</style>
