<template>
    <v-form>
        <v-text-field v-model="email">

        </v-text-field>

        <!--<v-text-field v-model="password">

        </v-text-field>-->

        <v-btn @click="login"></v-btn>
    </v-form>
</template>

<script>
import {login} from '@/composable/useAuth';

export default {

    data() {
        return {
            email: '',
            password: '',
            loading: false
        }
    },
    methods: {
        async login() {
            try{
                this.loading = true;
                await login(this.email);
            }catch(e){
                alert(e.message);
            }finally{
                this.loading = false;
            }
        }
    }
}
</script>
