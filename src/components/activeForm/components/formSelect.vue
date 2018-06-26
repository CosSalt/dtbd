<template>
  <div class='form-select'>
    <label class='component-label' v-if='showLabel'>{{formData.labelText}}</label>
    <el-select v-model='selectedVal' v-bind='formData.bind' clearable class='component-content'>
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
      value: null,
      formData: {
        required: true,
        type: Object
      },
      showLabel: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      theValue () {
        const {bind:{multiple}} = this.formData
        const value = this.value
        let newVal
        if(multiple) {
          newVal = Array.isArray(value) ? value : []
        } else {
          newVal = value === undefined ? null : value
        }
        return newVal
      },
      selectedVal: {
        get () {
          return this.theValue
        },
        set (newVal) {
          this.$emit('input', newVal)
        }
      },
      childrenOptions () {
        const child = this.formData.childConf || []
        return [...child]
      }
    }
  }
</script>

<style lang="less">
.form-select{
  .component-label {
    display: inline-block;
  }
  .component-content{
    display: inline-block;
  }
}
</style>
