<template>
    <v-text-field v-model="user.email">

    </v-text-field>
    HOLA
    <v-text-field v-model="name">
        
    </v-text-field>
</template>

<script>
import {useSupabase} from '@/composable/useSupabase';

export default {
    props: {
        user: Object
    },
    data() {
        return {
            email: '',
            name: '',
            loading: false
        }
    },
    methods: {
        async getProfile() {
            try{
                this.loading = true;
                const {supabase} = useSupabase();
                const {data,error} = await supabase.from('profile').select('username').eq('id_usuario', this.user.id).single();
                if(error){
                    throw new Error(error.message);
                }
                if(data){
                    this.name = data.username;
                }
            }catch(e){
                alert(e.message);
            }finally{
                this.loading = false;
            }
        }
    },
    mounted() {
        this.getProfile();
    }
}
</script>