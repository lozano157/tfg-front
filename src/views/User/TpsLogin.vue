<template>
    <UserInfo v-if="Object.keys(user).length" :user="user"/>
    <LoginMagicLink v-else />
</template>

<script>
import UserInfo from '@/components/user/UserInfo.vue'
import LoginMagicLink from '@/components/login/LoginMagicLink.vue'
import {useUser} from '@/composable/useUser'


export default {
    components: {UserInfo, LoginMagicLink},
    setup() {
        const {user} = useUser();
        return {user};
    }
}
</script>
