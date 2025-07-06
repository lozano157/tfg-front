<template>
    <v-app-bar class="ps-4" flat>
        <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="fActiveNavBar" />

        <!-- Botón Inicio -->
        <v-btn variant="outlined"  @click="goToHome">
            Inicio
        </v-btn>

        <template #append>
        </template>
    </v-app-bar>
</template>

<script>
export default {
    methods: {
        fActiveNavBar() {
            this.$store.commit('setVisible', true)
        },
        goToHome() {
            this.$router.push('/paradas'); // Redirige a la página de inicio
        }
    },
    computed: {
        // Computed property que comprueba si hay un token en el localStorage
        isLogged() {
            return this.$store.state.isAuthenticated;
        }
    }
}
</script>