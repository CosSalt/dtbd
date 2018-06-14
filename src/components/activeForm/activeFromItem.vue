<template>
  <div class = 'active-from-item'>

  </div>
</template>

<script>
import componentsConf from './config'
export default {
  name: 'activeFromItem',
  data () {
    return {
      formItemTypes: componentsConf
    }
  },
  methods: {
  },
  created () {
    this.initFormItmeTypes()
  }
}
</script>

