<template>
<div class='common-component'>
  <label class='component-label' v-if='showLabel'>
    <label v-if='showRequiredStar(formData.rules)' style='color:red;'>*</label>
    {{formData.labelText}}
  </label>
  <component :is="formData.baseCompoent" v-model='commonVal' v-bind='getBind(formData)' class='component-content'/>
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
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    commonVal: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit('input', newVal)
      }
    }
  },
  methods: {
    getBind (formData) {
      return formData.bind || {}
    },
    showRequiredStar (rules = {}) {
      const {required = false} = rules
      return required
    }
  }
}
</script>

<style lang="less">
.common-component{
  .component-label {
    display: inline-block;
  }
  .component-content {
    display: inline-block;
  }
}
</style>

