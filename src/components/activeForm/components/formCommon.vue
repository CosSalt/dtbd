<template>
<div>
  <label v-if='formData.text' class='component-label'>{{formData.text}}</label>
  <component :is="formData.baseCompoent" v-model='commonVal' v-bind='formData.bind || {}' class='component-content'/>
</div> 
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

