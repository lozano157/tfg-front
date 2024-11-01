<template>
  <v-layout style="overflow: hidden;">
    <NavBar />
    <AppBar />

    <v-main>
      <div class="pa-4">
        <router-view width="100%" class="pa-4" />
      </div>
    </v-main>

  </v-layout>
</template>
<script>
import { RouterView } from 'vue-router'
import NavBar from '@/components/menus/NavBar.vue'
import AppBar from '@/components/menus/AppBar.vue'
export default {
  components: {
    NavBar,
    AppBar,
    RouterView,
  },
}
</script>
