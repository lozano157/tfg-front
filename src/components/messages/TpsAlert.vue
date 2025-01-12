<template>
    <v-card class="mx-auto text-black" max-width="500">
            <v-card-actions >
                <v-list-item class="w-100">
                    <!--<template v-slot:prepend>
                        <v-avatar color="grey-darken-3"
                            image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light">
                        </v-avatar>
                    </template>-->
                    <v-row>
                        <v-col cols="6" class="mt-1">
                            <v-list-item-title>{{post.username != null ? post.username : $t('USUARIOS.Anonimo')}} </v-list-item-title>
                            
                        </v-col>
                        <v-col cols="6" align="right">
                            <v-chip>
                                {{post.time}}
                            </v-chip>
                        </v-col>
                    </v-row>

                </v-list-item>
                
            </v-card-actions>
            <v-divider class="border-opacity-50 mt-0"></v-divider>
            <v-card-text class="fs16 py-2">
                <div>
                    {{ post.text }}
                </div>
            </v-card-text>

            <!--<v-card-actions>
                <div class="ml-auto">
                    <v-btn :color="liked ? 'primary' : 'medium-emphasis'" icon size="small" @click="toggleLike">
                        <v-icon>{{ liked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}</v-icon>
                    </v-btn>
                    <v-btn :color="disliked ? 'primary' : 'medium-emphasis'" icon size="small" @click="toggleDislike">
                        <v-icon>{{ disliked ? 'mdi-thumb-down' : 'mdi-thumb-down-outline' }}</v-icon>
                    </v-btn>
                    <v-btn icon size="small" @click="goToThread">
                        <v-icon>mdi-chat-outline</v-icon>
                    </v-btn>
                </div>
            </v-card-actions>-->

        </v-card>
</template>

<script>
export default {
    props: {
        post: Object
    },
    
}
</script>