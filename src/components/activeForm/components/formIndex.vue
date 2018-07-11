<template>
  <component 
    :is="item.component"
    v-model='componentVal'
    :formData='item'
    @update:formData='updateFormData'
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
  data () {
    return {
      hasAlert: false
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
      const componentConf = componentsConf.find(item => type === item.type)
      if (!component) {
        const msg = type + '组件错误, 请检查'
        if (this.hasAlert) {
          alert(msg)
        } else {
          console.error(msg) // eslint-disable-line
        }
      }
      return defaultsDeep(defaultsDeep(component, componentConf), this.formData)
    }
  },
  methods: {
    getAction (...args) {
      this.$emit('getAction',...args)
    },
    updateFormData (val = {}) {
      this.$emit('update:formData', val)
    }
  }
}
</script>
