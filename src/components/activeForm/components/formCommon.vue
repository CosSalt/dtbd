<template>
  <component :is="formData.component" v-model='commonVal' v-bind='formData.bind || {}' class='component-style'>{{formData.text}}</component>  
</template>

<script>
export default {
  name:'formCommon',
  props: {
    value: '',
    formData: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      commonVal: this.value
    }
  },
  watch: {
    commonVal (newVal) {
      this.$emit('input', newVal)
    }
  }
}
</script>

