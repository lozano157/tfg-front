<template>
  <v-layout style="height: 100vh; overflow: hidden; display: flex; flex-direction: column;">
    <template v-if="!isLoginRoute">
      <NavBar />
      <AppBar />
    </template>

    <template v-if="isLoginRoute">
      <AppBarLoginVue />
    </template>

    <v-main style="flex-grow: 1; display: flex; flex-direction: column;">
      <router-view class="pa-4" style="flex-grow: 1; height: 100%;" />
    </v-main>
  </v-layout>
</template>

<script>
import { RouterView } from 'vue-router'
import NavBar from '@/components/menus/NavBar.vue'
import AppBar from '@/components/menus/AppBar.vue'
import { getSession } from '@/composable/useAuth.js'
import AppBarLoginVue from './components/menus/AppBarLogin.vue'

export default {
  components: {
    AppBarLoginVue,
    NavBar,
    AppBar,
    RouterView,
  },
  data() {
    return {
      isLoginRoute: false,
    };
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler(newPath) {
        this.isLoginRoute = newPath.includes('/login');
      },
    },
  },
  mounted() {
    getSession();
  },
};
</script>

<style scoped>
html, body {
  height: 100vh; /* Cambia a vh para forzar altura en toda la pantalla */
  margin: 0;
}

#app {
  height: 100vh; /* Asegura que ocupe toda la ventana */
}

.v-layout {
  height: 100vh; /* Fuerza altura completa para el layout */
  display: flex;
  flex-direction: column;
}

.v-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>