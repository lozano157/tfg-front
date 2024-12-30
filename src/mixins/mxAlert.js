export default {
    methods: {
      mxShowAlert(params) {
        if (params.text) {
          console.log('ENTRAMOS AL IF DE SNACKBAR');
          this.$store.commit('resetAlert'); // Reinicia el snackbar
          this.$nextTick(() => {
            this.$store.commit('setAlert', params); // Establece el nuevo snackbar
          });
        } else {
          console.log('ENTRAMOS AL ELSEEEE');
        }
      }
    }
  }