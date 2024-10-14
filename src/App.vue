<template>
  <v-layout>
    <v-navigation-drawer >
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :value="item"
          color="primary"
          @click="$router.push(item.link)"
        >
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

    <v-app-bar class="ps-4" flat>
      <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" />

      <v-app-bar-title>Application</v-app-bar-title>

      <template #append>
        <v-btn class="text-none me-2" height="48" icon slim>
          <v-avatar
            color="surface-light"
            image="https://cdn.vuetifyjs.com/images/john.png"
            size="32"
          />

          <v-menu activator="parent">
            <!--<v-list density="compact" nav>
              <v-list-item append-icon="mdi-cog-outline" link title="Settings" />

              <v-list-item append-icon="mdi-logout" link :title="$t('Logout')" />
            </v-list>-->
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <div class="pa-4">
        <router-view width="100%" class="pa-4" />
      </div>
    </v-main>
  </v-layout>
</template>
<script>
import { RouterView } from 'vue-router'
export default {
  components: {
    RouterView,
  },
  data() {
    return {
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
        }
      ],
      itemsAcciones: [
        {
          title: this.$t('MENU.Logout'),
          prependIcon: 'mdi-logout',
          link: '/acciones'
        }
      ],
    }
  }
}
</script>
