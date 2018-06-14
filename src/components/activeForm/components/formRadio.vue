<template>
  <div>
    <template v-for='(item, index) in theOptions'>
      <el-radio v-model="radio" v-bind='item.bind || {}' :key='index'> {{item.text}} </el-radio>
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
  data () {
    return {
      radio: this.value
    }
  },
  watch: {
    radio (newVal) {
      this.$emit('input', newVal)
    }
  },
  computed: {
    theOptions () {
      const data = this.formData
      const {bind, text} = data
      const children = data.multiConf || []
      const options = [
        {bind, text},
        ...children
      ]
      return options
    }
  }
}
</script>
