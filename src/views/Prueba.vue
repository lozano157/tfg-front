<template>
    <div>
        <v-card class="mx-auto text-black" max-width="500">
            <v-card-actions>
                <v-list-item class="w-100">
                    <template v-slot:prepend>
                        <v-avatar color="grey-darken-3"
                            image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light">
                        </v-avatar>
                    </template>
                    <v-list-item-title>Evan You</v-list-item-title>
                    <v-list-item-subtitle>Admin · 4h</v-list-item-subtitle>

                </v-list-item>
            </v-card-actions>

            <v-card-text class="fs16 py-2">
                <div>
                    "Turns out semicolon-less style is easier and safer in TS because most
                    gotcha edge cases are type invalid as well."
                </div>
            </v-card-text>

            <v-card-actions>
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
            </v-card-actions>

        </v-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            liked: false,
            disliked: false,
        };
    },
    methods: {
        toggleLike() {
            this.liked = !this.liked;
            if (this.liked) {
                this.disliked = false; // Si se marca "like", desmarcamos "dislike"
            }
        },
        toggleDislike() {
            this.disliked = !this.disliked;
            if (this.disliked) {
                this.liked = false; // Si se marca "dislike", desmarcamos "like"
            }
        }
    }
};
</script>

<style scoped>
.fs12 {
    font-size: 16px;
}
</style>
