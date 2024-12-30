<template>
    <div>
        <v-card class="mx-auto text-black" max-width="500">
            <v-card-actions>
                <v-list-item class="w-100">
                    <template v-slot:prepend>
                        <v-avatar color="grey-darken-3"
                            image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light">
                        </v-avatar>
                    </template>
                    <v-list-item-title>Evan You</v-list-item-title>
                    <v-list-item-subtitle>Admin · 4h</v-list-item-subtitle>

                </v-list-item>
            </v-card-actions>

            <v-card-text class="fs16 py-2">
                <div>
                    "Turns out semicolon-less style is easier and safer in TS because most
                    gotcha edge cases are type invalid as well."
                </div>
            </v-card-text>

            <v-card-actions>
                <div class="ml-auto">
                    <v-btn :color="liked ? 'primary' : 'medium-emphasis'" icon size="small" @click="toggleLike">
                        <v-icon>{{ liked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}</v-icon>
                    </v-btn>
                    <v-btn :color="disliked ? 'primary' : 'medium-emphasis'" icon size="small" @click="toggleDislike">
                        <v-icon>{{ disliked ? 'mdi-thumb-down' : 'mdi-thumb-down-outline' }}</v-icon>
                    </v-btn>
                    <v-btn icon size="small" @click="goToThread">
                        <v-icon>mdi-chat-outline</v-icon>
                    </v-btn>
                </div>
            </v-card-actions>

        </v-card>
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
</template>

<script>

import MenuNotLogged from "@/components/login/MenuNotLogged.vue";

export default {
    components: {
        MenuNotLogged,
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
        prueba(prueba){
            console.log(prueba)
            this.selectedStreet = prueba.text
            debugger
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
                debugger
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
