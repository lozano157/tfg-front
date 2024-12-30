<template>
  <v-dialog v-model="d_MxShowAlert" persistent max-width="600">
    <v-card :class="d_MxTypeAlert + 'Alert'">
      <template v-slot:title>
        <v-btn variant="text" icon="mdi-close" size="small" @click="f_Close" class="ml-auto">
        </v-btn>
      </template>

      <v-card-text class="pb-4 pt-2">
        <v-row wrap justify="center">
          <v-col v-if="d_MxIconAlert" cols="auto" class="pa-1">
            <v-icon large class="icon"> {{ d_MxIconAlert }}
            </v-icon>
          </v-col>
          <v-col cols="12" class="text-center my-1">
            <p class="alertText mb-0" v-html="d_MxTextAlert"></p>
            <p class="alertAuxText my-2">{{ d_MxTextAlertAux }}</p>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions v-if="d_MxTypeAlert !== 'info'" class="justify-center pb-3">
        <v-btn class="alertBtn" depressed @click="f_Action">{{ d_MxBtnText }}</v-btn>
        <v-btn class="alertBtnText mr-2" depressed @click="f_Close">{{ d_MxBtnTextCancel }}</v-btn>
        
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      d_MxShowAlert: false,
      d_MxTypeAlert: '',
      d_MxTextAlert: '',
      d_MxTextAlertAux: '',
      d_MxIconAlert: '',
      d_MxBtnText: '',
      d_MxBtnTextCancel: '',

    }
  },

  methods: {
    f_Close() {
      if (this.f_NegAction) {
        this.f_NegAction()
      }
      this.d_MxShowAlert = false
    },
    f_Action() {
      this.f_ActionAlert()
      this.d_MxShowAlert = false
    }

  },
  computed: {
    c_AlertData() {
      return this.$store.getters.getAlert
    }
  },
  watch: {
    c_AlertData() {
      this.d_MxShowAlert = this.c_AlertData.show != null ? this.c_AlertData.show : true
      this.d_MxTypeAlert = this.c_AlertData.type != null ? this.c_AlertData.type : ''
      this.d_MxTextAlert = this.c_AlertData.text != null ? this.c_AlertData.text : ''
      this.d_MxTextAlertAux = this.c_AlertData.textAux != null ? this.c_AlertData.textAux : ''
      this.d_MxIconAlert = this.c_AlertData.icon != null ? this.c_AlertData.icon : ''
      this.d_MxBtnText = this.c_AlertData.btnText != null ? this.c_AlertData.btnText : this.$t('alert.deleteAccept')
      this.d_MxBtnTextCancel = this.c_AlertData.btnTextCancel != null ? this.c_AlertData.btnTextCancel : this.$t('alert.decline')
      this.f_ActionAlert = this.c_AlertData.action ? this.c_AlertData.action : ''
      this.f_NegAction = this.c_AlertData.negAction ? this.c_AlertData.negAction : ''

    }
  }
}
</script>

<style scoped>
.datErrorAlert {
  background-color: #f8d7da !important;
  color: #721c24 !important;
}

.datSuccessAlert {
  background-color: #d4edda !important;
  color: #155724 !important;
}
</style>