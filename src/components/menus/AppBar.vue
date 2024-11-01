<template>
    <v-app-bar class="ps-4" flat>
        <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" />

        <v-app-bar-title>LOL</v-app-bar-title>

        <template #append>
            <v-btn class="text-none me-2" height="48" icon slim>
                <v-avatar color="surface-light" image="https://cdn.vuetifyjs.com/images/john.png" size="32" />

                <v-menu activator="parent">
                </v-menu>
            </v-btn>
        </template>
    </v-app-bar>
</template>