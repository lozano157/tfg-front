<template>
    <v-app-bar class="ps-4" flat>
        <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="fActiveNavBar" />

        <!--<v-app-bar-title>LOL</v-app-bar-title>-->

        <template #append>
            <v-btn v-if="isLogged" aria-label="Open options" class="text-none me-2" height="48" icon slim>
                <v-avatar color="surface-light"  size="32" >
                    <v-icon icon="mdi-account-circle"></v-icon>
                </v-avatar>

                <v-menu activator="parent">
                    <MenuLogged  />
                </v-menu>
            </v-btn>
            <v-btn v-else variant="outlined"  @click="$router.push('/login')">
                Iniciar sesión | registrarse
            </v-btn>
        </template>
    </v-app-bar>
</template>

<script>

import MenuNotLogged from '@/components/login/MenuNotLogged.vue'
import MenuLogged from '@/components/login/MenuLogged.vue'

export default {
    components: {
        MenuNotLogged,
        MenuLogged
    },
    methods: {
        fActiveNavBar() {
            this.$store.commit('setVisible', true)
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