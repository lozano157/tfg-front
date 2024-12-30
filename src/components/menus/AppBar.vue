<template>
    <v-app-bar class="ps-4" flat>
        <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="fActiveNavBar" />

        <!--<v-app-bar-title>LOL</v-app-bar-title>-->

        <template #append>
            <v-btn class="text-none me-2" height="48" icon slim>
                <v-avatar color="surface-light" image="https://cdn.vuetifyjs.com/images/john.png" size="32" />

                <v-menu activator="parent">
                    <MenuNotLogged v-if="!isLogged" />
                    <MenuLogged v-else />
                </v-menu>
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
            return !!localStorage.getItem('sb-sjobgbzfbmlqikjxwjli-auth-token');
        }
    }
}
</script>