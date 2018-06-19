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
      checkList: []
    }
  },
  computed: {
    checkedVal: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit('input', newVal)
      }
    },
    checkedList: {
      get () {
        return this.value || []
      },
      set (newVal) {
        this.$emit('input', newVal)
      }
    },
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
  }
}
</script>

