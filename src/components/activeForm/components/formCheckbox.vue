<template>
  <div>
    <el-checkbox v-model='checkedVal' v-bind='theOptions[0].bind || {}' v-if='theOptions.length <= 1'/>
    <el-checkbox-group v-model='checkedList' v-else>
      <el-checkbox v-for='(item, index) in theOptions' v-bind='item || {}' :key='index' />
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
      checkedVal: this.value || '',
      checkedList: this.value || [],
    }
  },
  computed: {
    theOptions () {
      const data = this.formData
      const {bind = {}} = data
      const children = data.multiConf || []
      const options = [
        {...bind},
        ...children
      ]
      return options
    }
  },
  watch: {
    checkedVal (newVal) {
      this.$emit('input', newVal)
    },
    checkedList (newVal) {
      this.$emit('input', newVal)
    }
  }
}
</script>

