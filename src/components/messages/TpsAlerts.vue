<template>

    <v-col cols="12">
        <div class="d-flex justify-end">
        <v-dialog
            v-model="dialog"
            max-width="500"
            persistent
        >
            <template v-slot:activator="{ props: activatorProps }">
            <v-btn prepend-icon="mdi-plus" v-bind="activatorProps" variant="outlined" color="primary" >
                Añadir aviso
            </v-btn>
            </template>

            <v-card>
            <v-card-title class="headline">Publicar un nuevo aviso</v-card-title>
            
            <v-card-text>
                Escribe tu aviso sobre el estado de la parada o el servicio. Otros usuarios podrán verlo.
                <v-textarea
                v-model="nuevoAvisoTexto"
                label="Mensaje"
                class="mt-4"
                rows="3"
                variant="outlined"
                clearable
                auto-grow
                ></v-textarea>
            </v-card-text>
            
            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                text="Cancelar"
                variant="text"
                @click="cerrarDialogo"
                ></v-btn>

                <v-btn
                color="primary"
                text="Publicar"
                variant="flat"
                @click="fSavePost"
                ></v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
        </div>
    </v-col>
    <v-card v-for="post in posts" :key="post.idAlerta" class="ma-2 mb-4 text-black" variant="outlined" max-width="500">
            <v-card-actions >
                <v-list-item class="w-100">
                    <v-row>
                        <v-col cols="6" class="mt-1">
                            <v-list-item-title>{{ $t('USUARIOS.Anonimo')}} </v-list-item-title>
                            
                        </v-col>
                        <v-col cols="6" align="right">
                            <v-chip>
                                {{formatDate(post.fechaCreacion)}}
                            </v-chip>
                        </v-col>
                    </v-row>

                </v-list-item>
                
            </v-card-actions>
            <v-divider class="border-opacity-50 mt-0"></v-divider>
            <v-card-text class="fs16 py-2">
                <div>
                    {{ post.mensaje }}
                </div>
            </v-card-text>

    </v-card>

</template>

<script>


import BackServices from "@/services/srv-back";

export default {
    props: {
        pTransport:{
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
            nuevoAvisoTexto: '',
            BackServices,
            posts: [],
        }
    },
    methods: {
        formatDate(isoString) {
            // Si el valor no existe, devuelve una cadena vacía para evitar errores.
            if (!isoString) {
                return '';
            }
            
            const date = new Date(isoString);
            
            // Opciones para el formato que quieres: DD/MM/YYYY, HH:mm
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // Formato 24h
            };

            // Intl.DateTimeFormat usa el idioma y la zona horaria del navegador
            // para formatear la fecha de forma automática y correcta para el usuario.
            return new Intl.DateTimeFormat(navigator.language, options).format(date);
        },
        async fGetPosts() {
            try {
                const json = {
                    tipoTransporte: this.pTransport,
                    idParada: this.pIdStop
                };
                const response = await BackServices.fGetAlerts(json);
                console.log("Response from fGetPosts:", response);
                this.posts = response;
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        },
        async fSavePost(){
            try {
                const json = {
                    tipoTransporte: this.pTransport,
                    idParada: this.pIdStop,
                    mensaje: this.nuevoAvisoTexto
                };
                const response = await BackServices.fSaveAlert(json);
                console.log("Response from fSavePost:", response);
                this.posts.unshift(response); // Añadimos el nuevo aviso al principio de la lista
                this.nuevoAvisoTexto = ''; // Limpiamos el campo de texto
                this.cerrarDialogo(); // Cerramos el diálogo
                this.fGetPosts(); // Refrescamos la lista de avisos
            } catch (error) {
                console.error("Error saving post:", error);
            }
        },
        cerrarDialogo() {
            this.dialog = false;
            this.nuevoAvisoTexto = ''; // Limpiamos el texto al cerrar
        }
    },
    mounted() {
        this.fGetPosts();
    },
    computed: {
        // Computed property that checks if there is a token in localStorage
        isLogged() {
            return this.$store.state.isAuthenticated;
        }
    }
    
}
</script>