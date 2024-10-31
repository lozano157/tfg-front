<template>
  <div>
    <h1>TpsAlertasEmt</h1>
  </div>
</template>

<script>
export default {
  name: 'TpsAlertasEmt',
  data() {
    return {
      alertas: []
    }
  },


  methods: {
    getAlertas() {
      console.log('getAlertas')
    }
  },
  
  mounted() {
    this.getAlertas()
  },
}
</script>
