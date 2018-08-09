<template>
  <div>
    <div class='form-show-container'>
      <formPureLayout
        :layout='layout'
        :receiveData='formData'
      >
        <template slot='footer' slot-scope="{ data }">
          <slot name='footer' v-bind='{saveData: () => willSaveModelData(data), resetData}' />
        </template>
      </formPureLayout>
    </div>
  </div>
</template>
<script>
// slot='footer' 暴露saveData 与 clearData 方法
// 接受 layout(组件数据)与 formData(表单值数据)
import {isNullOrEmpty} from '@/utils'
export default {
  name: 'showActiveForm',
  data () {
    return {
      validatePromise: []
    }
  },
  props:{
    layout: {
      type: Array,
      required: true,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => ({})
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
      this.$emit('update:layout', val)
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
</style>