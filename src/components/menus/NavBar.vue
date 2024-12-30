<template>
    <v-navigation-drawer
        v-model="drawer"
        v-if="$vuetify.display.smAndDown"
        temporary
    >
        <v-list density="compact" nav>
            <v-list-item v-for="item in items" :key="item.title" :value="item" color="primary"
                @click="$router.push(item.link)">
                <template v-slot:prepend>
                    <v-icon :icon="item.prependIcon"></v-icon>
                </template>

                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>


        <template #append>
            <v-list-item class="ma-2" link nav prepend-icon="mdi-cog-outline" title="Settings" />
        </template>
    </v-navigation-drawer>


    <v-navigation-drawer
        v-else-if="$vuetify.display.mdAndUp"
        expand-on-hover
        rail
    >
        <v-list density="compact" nav>
            <v-list-item v-for="item in items" :key="item.title" :value="item" color="primary"
                @click="$router.push(item.link)">
                <template v-slot:prepend>
                    <v-icon :icon="item.prependIcon"></v-icon>
                </template>

                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>


        <template #append>
            <v-list-item class="ma-2" link nav prepend-icon="mdi-cog-outline" title="Settings" />
        </template>
    </v-navigation-drawer>



</template>
<script>
export default {

    data() {
        return {
            drawer: false,
            items: [
                {
                    title: this.$t('MENU.Paradas'),
                    prependIcon: 'mdi-view-dashboard-outline',
                    link: '/paradas'
                },
                {
                    title: this.$t('MENU.Alertas'),
                    prependIcon: 'mdi-alert-circle-outline',
                    link: '/alertas'
                },
                {
                    title: this.$t('MENU.Favoritos'),
                    prependIcon: 'mdi-map-marker-star',
                    link: '/favoritos'
                },
                {
                    title: this.$t('MENU.Pruebas'),
                    prependIcon: 'mdi-pipe',
                    link: '/pruebas'
                },
                {
                    title: this.$t('MENU.LOGIN'),
                    prependIcon: 'mdi-pipe',
                    link: '/login'
                }
            ],
        }
    },
    watch: {
        '$store.state.isVisible': {
            handler: function (value) {
                this.drawer = null
                this.drawer = value
            },
            deep: true
        }
    }
}
</script>