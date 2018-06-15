<template>
  <!-- <el-select v-model="value2" placeholder="请选择">
    <el-option
      v-for="item in options2"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled">
    </el-option>
  </el-select> -->
  <div>
    <label v-if='formData.text' class='component-label'>{{formData.text}}</label>
    <el-select v-model='selectedVal' v-bind='formData.bind' class='component-content'>
      <el-option
        v-for="(item, index) in childrenOptions"
        v-bind='item || {}' :key='index'
      />
    </el-select>
  </div>
</template>

<script>
  export default {
    name: 'formSelect',
    props: {
      value: '',
      formData: {
        required: true,
        type: Object
      }
    },
    data() {
      return {
        selectedVal: this.value,
        selectChildData: [],
      }
    },
    computed: {
      childrenOptions () {
        const children = this.selectData
        return children
      }
    },
    watch: {
      selectedVal (newVal) {
        this.$emit('input', newVal)
      }
    },
    created () {
      const child = this.formData.childConf || []
      this.selectData = [...child]
      this.selectData.unshift({
        label: '请选择',
        value: null,
        disabled: true
      })
    }
  }
</script>