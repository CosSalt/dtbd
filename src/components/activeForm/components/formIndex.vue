<template>
  <component 
    :is="item.component"
    v-model='componentVal'
    :formData='item'
    :componentType='componentType'
    :keyIndex='keyIndex'
    :showLabel='showLabel'
    @getAction= 'getAction'
  />
</template>

<script>
import {defaultsDeep} from '@/utils'
import typeToComponent from '../config/typeToComponent.js'
import componentsConf from '../config'
export default {
  name: 'formIndex',
  props:{
    value: '',
    formData: {
      required: true,
      type: Object
    },
    componentType: {
      type: String
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    keyIndex: null
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
      const componentConf = componentsConf.find(item => type === item.type)
      if (!component) {
        alert(type + '组件错误, 请检查')
      }
      return defaultsDeep(defaultsDeep(component, componentConf), this.formData)
    }
  },
  methods: {
    getAction (...args) {
      this.$emit('getAction',...args)
    }
  }
}
</script>
