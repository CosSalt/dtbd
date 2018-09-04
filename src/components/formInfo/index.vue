<template>
  <div class='form-info-container'>
    <template v-if='title'>
      <div class='form-info-title'>
        <span>{{title}}</span>
      </div>
    </template>
    <FormPureLayout
      :layout='layout'
      :receiveData='formData'
      class='form-info-layout'
    >
      <template slot='footer' slot-scope="{ data }">
        <slot name='footer' v-bind='{saveData: () => willSaveModelData(data), resetData}' />
      </template>
    </FormPureLayout>
  </div>
</template>
<script>
// slot='footer' 暴露saveData 与 clearData 方法
// 接受 layout(组件数据)与 formData(表单值数据)
import FormPureLayout from '../activeForm/showForm/showActiveForm.vue'
import {isNullOrEmpty} from '@/utils'
export default {
  name: 'FormInfo',
  components: {FormPureLayout},
  data () {
    return {
      validatePromise: []
    }
  },
  props:{
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    title: String
  },
  computed: {
    layout () {
      return this.data
    },
    hasTitle () {
      return !!this.title
    }
  },
  provide() {
    return {
      handleTopEvent: (...args) => {
        this.handleTheTopEvent(...args)
      }
    }
  },
  methods: {
    updateLayout(val){
      this.$emit('update:data', val)
    },
    handleTheTopEvent (action, ...args) {
      let fn
      const actions = ['original']
      switch (action) {
        case actions[0]:
        default:
          fn = this.updateOriginal
          break
      }
      const isDev = process.env.NODE_ENV === 'production'
      if (isDev){
        if(actions.indexOf(action) < 0 && !!action) {
          alert('not the action: ' + action)
        }
      }
      if (fn) {
        fn(...args)
      }
    },
    updateOriginal (parentItem, propName, newData) {
      if (isNullOrEmpty(parentItem) || isNullOrEmpty(propName)) {
        return
      }
      parentItem[propName] = newData // 数据已发生变化
      this.updateLayout(this.layout)
    },
    handleForm (action, ...args) {
      return this.$eventBus.$emit('validateForm', action, ...args)
    },
    willSaveModelData (data = {}) {
      this.handleForm('validate', this.validateForm)
      let result = false
      return Promise.all(this.validatePromise).then(() => {
        result = true
      }).catch(() => {}).then( () =>{
        return {result, data}
      }).finally(() => { // finally 不接受值,也不返回值,也不会影响return的结果,其表示与状态无关的一些操作
        this.validatePromise = []
      })
    },
    resetData () {
      this.handleForm('resetFields') // 重置数据
    },
    validateForm (res) {
      this.validatePromise.push(res)
    }
  },
}
</script>

<style lang="less">
@title-height: 30px;
@padding-num: 5px;
.form-info-container{
  padding-top: @padding-num;
  height: 100%;
  .form-info-title{
    height: @title-height;
    line-height: @title-height;
    color: #2e619a;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid #dddddd;
    box-sizing: border-box;
    &:before{
      content: '|';
      color: #104d8a;
      padding-right: 9px;
    }
  }
  .form-info-layout{
    padding-top: 20px;
    box-sizing: border-box;
    height: calc(100% - @padding-num - @title-height);
  }
}
</style>
