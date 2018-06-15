<template>
  <component 
    :is="item.component"
    v-model='componentVal'
    :formData='item'
  />
</template>

<script>
import {defaultsDeep} from '@/utils'
import typeToComponent from '../config/typeToComponent.js'
export default {
  name: 'formIndex',
  props:{
    value: '',
    formData: {
      required: true,
      type: Object
    }
  },
  computed: {
    componentVal: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit('input', newVal)
      }
    },
    item () {
      const type = this.formData.type
      const component = typeToComponent[type]
      if (!component) {
        alert(type + '组件错误, 请检查')
      }
      return defaultsDeep(this.formData, component)
    }
  }
}
</script>
