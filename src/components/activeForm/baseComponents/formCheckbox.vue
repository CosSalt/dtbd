<template>
  <div>
    <el-checkbox v-model='checkedVal' v-bind='theOptions[0].bind || {}' v-if='theOptions.length <= 1'>
      {{theOptions[0].text || theOptions[0].label}}
    </el-checkbox>
    <el-checkbox-group v-model='checkedList' v-else>
      <el-checkbox v-for='(item, index) in theOptions' v-bind='item || {}' :key='index' >{{item.text || item.label}}
      </el-checkbox>
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
  computed: {
    checkedVal: {
      get () {
        return this.value
      },
      set (newVal) {
        this.setModelVal(newVal)
      }
    },
    checkedList: {
      get () {
        return this.value || []
      },
      set (newVal) {
        this.setModelVal(newVal)
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
  },
  methods: {
    setModelVal(val){
      this.$emit('input', val)
    }
  }
}
</script>

