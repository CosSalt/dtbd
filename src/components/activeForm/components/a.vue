<template>
  <div>
    <template v-for='(item, index) in theOptions'>
      <el-radio v-model="radio" v-bind='handleItem(item)' :key='index'> {{handleItem(item, true)}} </el-radio>
    </template>
  </div>
</template>

<script>
export default {
  name:'formRadio',
  props: {
    value: '',
    formData: {
      required: true,
      type: Object
    }
  },
  computed: {
    radio: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit('input', newVal)
      }
    },
    theOptions () {
      const data = this.formData
      const {bind = {}, text} = data
      const children = data.multiConf || []
      const options = [
        {...bind, text},
        ...children
      ]
      return options
    }
  },
  methods: {
    handleItem (item = {}, returnText) {
      const {text,...bind} = item
      if (returnText) {
        return text
      }
      return bind || {}
    }
  }
}
</script>
