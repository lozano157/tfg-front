<template>
    <v-list>
        <v-list-item key="Perfil" value="Perfil">
            <template v-slot:prepend>
                <v-icon >mdi-account</v-icon>
            </template>
            <v-list-item-title >{{$t('MENU_USUARIO.Perfil')}}</v-list-item-title>
        </v-list-item>
        <v-list-item key="InicioSesion" value="InicioSesion">
            <template v-slot:prepend>
                <v-icon >mdi-login</v-icon>
            </template>
            <v-list-item-title class="ml-0" >{{$t('MENU_USUARIO.Cerrar_sesion')}}</v-list-item-title>
        </v-list-item>
    </v-list>
</template>

<script>
</script>