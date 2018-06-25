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
      value: '',
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
      selectedVal: {
        get () {
          return this.value
        },
        set (newVal) {
          this.$emit('input', newVal)
        }
      },
      childrenOptions () {
        const child = this.formData.childConf || []
        // const hasTip = child[0] && child[0]['disabled'] === true // 时候已经存在提示信息('不能选择')
        // const children = [...child]
        // if (!hasTip) {
        //   child.unshift({
        //     label: '请选择',
        //     value: null,
        //     disabled: true
        //   })
        // }
        // return children
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
