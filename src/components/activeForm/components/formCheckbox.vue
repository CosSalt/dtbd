<template>
  <div>
    <el-checkbox v-model='checkedVal' v-bind='theOptions[0].bind || {}' v-if='theOptions.length <= 1'/>
    <el-checkbox-group v-model='checkedVal' v-else>
      <el-checkbox v-for='(item, index) in theOptions' v-bind='item.bind || {}' :key='index' />
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name:'formCheckbox',
  props: {
    value: '',
    formData: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      checkedVal: this.value
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
  },
  watch: {
    checkedVal (newVal) {
      this.$emit('input', newVal)
    }
  }
}
</script>

