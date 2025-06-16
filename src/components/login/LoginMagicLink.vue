<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh; ">
    <v-card class="pa-6 elevation-0"  style="border-radius: 16px; ">
        <v-card-title class="text-h4 text-center" style="font-weight: bold; color: #333;">
            BIENVENIDO A TPSVALENCIA
        </v-card-title>
      <v-card-title class="text-h5 text-center" style="font-weight: bold; color: #333;">
        Iniciar sesión / Registrarse
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="email"
            label="Correo electrónico"
            :rules="[rules.required, rules.email]"
            outlined
            clearable
            :disabled="loading"
            style="border-radius: 8px;"
          ></v-text-field>

          <v-alert v-if="error" type="error" class="mt-3" border="start" style="border-left: 4px solid #ff5252;">
            {{ error }}
          </v-alert>

          <v-btn
            class="mt-4"
            :loading="loading"
            :disabled="!valid || loading"
            block
            color="primary"
            style="border-radius: 8px; font-weight: bold;"
            @click="login"
          >
            Iniciar sesión
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { login } from "@/composable/useAuth";

export default {
  data() {
    return {
      email: "",
      loading: false,
      error: null,
      valid: false,
      rules: {
        required: (value) => !!value || "Este campo es obligatorio.",
        email: (value) =>
          /.+@.+\..+/.test(value) || "Introduce un correo electrónico válido.",
      },
    };
  },
  methods: {
    async login() {
      this.error = null; // Reinicia el mensaje de error
      const isValid = this.$refs.form.validate();
      if (!isValid) return;

      try {
        this.loading = true;
        await login(this.email);
        // Redirigir al usuario o mostrar un mensaje de éxito
        //si tiene exito, mostrar un mensaje de éxito 
      } catch (e) {
        this.error = "Error al iniciar sesión. Inténtalo de nuevo.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>

.v-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra suave */
}

.v-btn {
  background-color: #1976d2; /* Azul primario */
  color: white;
}

.v-btn:hover {
  background-color: #1565c0; /* Azul más oscuro al pasar el mouse */
}

.v-alert {
  background-color: #ffe6e6; /* Fondo claro para errores */
  color: #d32f2f; /* Texto rojo */
}
</style>