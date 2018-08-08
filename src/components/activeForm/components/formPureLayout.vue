<template>
  <div class='active-form-layout'>
    <div class='form-content'>
        <el-form 
          :ref="refId"
          :model="formModel"
          :inline="true"
          :labelPosition='labelPosition'
        >
          <template v-for='(layoutItem, i) in theLayoutData'>
            <el-row :key='"row" + i'>
              <template v-for='item in layoutItem'>
                <template v-if='item.notFormItem'>
                  <el-col
                    class='active-form-row'
                    :span='item.span'
                    :key='item.id'
                  >
                    <div>
                      <commonIndex
                        class='component-style'
                        v-model='formModel[item.id]'
                        :formData='item'
                        :isDraggable='isDraggable'
                        :keyIndex='item.index'
                        :draggable='isDraggable'
                      />
                    </div>
                  </el-col>
                </template>
                <template v-else>
                  <el-col
                    :span='item.span'
                    :key='item.id'
                    :draggable='isDraggable'
                    class='active-form-row'
                  >
                    <el-form-item :label="item.labelText" size='mini' :labelWidth='labelWidth' :prop='item.id' 
                      :rules="formRules[item.id]"
                    >
                      <commonIndex
                        v-model='formModel[item.id]'
                        :formData='item'
                        class='component-style'
                        :showLabel='showLabel'
                        :keyIndex='item.index'
                        @getAction='getAction'
                      />
                    </el-form-item>
                  </el-col>
                </template>
              </template>
            </el-row>
          </template>
        </el-form>
    </div>
    <slot name='footer' :data='formModel'/>
  </div>
</template>
<script>
import {getNewObj} from '@/utils'
import {patternCheck} from '../config/rulesPattern'
export default {
  name: 'formPureLayout',
  inject: {
    handleTopEvent: {
      default: (callback) => {
        if(callback) callback()
      }
    }
  },
  props: {
    isDraggable: {
      type: Boolean,
      default: false
    },
    layout: {
      type: Array,
      required: true
    },
    receiveData: {
      type: Object,
      default: () => ({})
    },
  },
  data () {
    return {
      formModel: {},
      span: 12,
      showLabel: false,
      labelWidth: '120px',
      labelPosition: 'left',
      formRules: {}, // 校验
      hideFieldIds: [], // 需要隐藏的字段 ID
    }
  },
  computed: {
    theLayoutData () {
      const DefSpan = this.span
      const hideFieldIds = this.hideFieldIds
      let data = this.layout
      if(hideFieldIds.length > 0) {
        data = data.filter(item => {
          return hideFieldIds.indexOf(item.id) < 0
        })
      }

      data = data.map((item, index) => {
        return Object.assign({
          span: item.span || DefSpan,
          index
        }, item)
      })
      this.handleformModel(data)
      // 处理布局
      const MaxSpan = 24
      let spanSum = 24
      const res = []
      data.forEach(item => {
        const span = item.span
        spanSum += span
        let len = res.length
        if (spanSum <= MaxSpan) {
          res[len - 1].push(item)
        } else {
          spanSum = span
          res[len] = [item]
        }
      })
      return res
    },
    refId () {
      return 'layout_' + this.$componentId
    }
  },
  watch: {
    receiveData (val = {}) {
      this.resetFormModel(val)
    },
    layout: {
      handler () {
        this.formRules = this.initFormRules()
      },
      immediate: true
    }
  },
  methods: {
    updateLayout (val, parent, propName) { // 值, 父节点, 属性
      this.handleTopEvent('original', val, parent, propName)
    },
    initFormRules () {
      const rules = {}
      const handleValidator = this.handleFormSelfValidator
      this.layout.forEach(item => {
        let id = item.id
        let itemRules = item.rules
        const needConversion = ['validator', 'pattern'] // 将部分类型由字符串转化为函数或其他类型
        if (id && Array.isArray(itemRules) && itemRules.length > 0) {
          let items = itemRules.map(item => {
            let newItem = getNewObj(item)
            needConversion.forEach(key => {
              if (newItem[key]) {
                if (key === needConversion[1]) { // pattern 部分
                  const checkItem = patternCheck.find(item => item.value === newItem[key])
                  if(checkItem) {
                    newItem[key] = checkItem['reg']
                  } else {
                    newItem[key] = undefined
                  } 
                } else {
                  try {
                    newItem[key] = handleValidator(newItem[key])
                  } catch (e) {
                    // eslint-disable-next-line
                    console.error(e)
                  }
                }
              }
            })
            return newItem
          })
          rules[id] = items
        }
      })
      return rules
    },
    // 根据ID隐藏显示字段
    showField (ids = []) {
      if(!Array.isArray(ids) || ids.length <= 0) return
      const hideIds = this.hideFieldIds
      ids.forEach(key => {
        let index = hideIds.indexOf(key)
        if (index >=0) {
          this.hideFieldIds.splice(index, 1) // 删除已隐藏的ID
        }
      })
    },
    hideField (ids = []) {
      if(!Array.isArray(ids) || ids.length <= 0) return
      const hideIds = this.hideFieldIds
      ids = ids.filter(key => { // 获取不重复的需要隐藏的ID
        return hideIds.indexOf(key) < 0
      })
      this.hideFieldIds.push(...ids)
    },
    handleFormSelfValidator (str) {
      const hideField = this.hideField
      const showField = this.showField
      const fn = eval(str)
      if(typeof fn !== 'function') throw('必须为函数')
      return (...args) => {
        // value, callback, hideField, showField
        fn(args[1], args[2], hideField, showField, args)
      }
    },
    //init receiveData
    initformModel(data = {}) {
      const formRes = {}
      for (let [key, val] of Object.entries(data)) {
        formRes[key] = val
      }
      this.formModel = formRes
    },
    resetFormModel(data = {}) {
      if(data === this.formModel) return
      const res = {}
      for (let key of Object.keys(this.formModel)) {
        res[key] = data[key]
      }
      this.formModel = Object.assign(res, data)
    },
    handleformModel (data) {
      const formRes = {}
      const formModel = this.formModel || {}
      data.forEach(item => {
        let id = item.id
        formRes[id] = formModel[id] || undefined
      })
      this.formModel = formRes
    },
    getAction ([actionParam, reqOrg], callback) {
      const reqId = reqOrg.id
      const {action, position, index} = actionParam
      let relationIds = reqOrg.relationIds || []
      relationIds = [...relationIds]
      relationIds.push(reqId)
      const theModel = this.formModel || {}
      const param = {}
      relationIds.forEach(key => {
        param[key] = theModel[key]
      })
      this.$http.post(action, param).then(data => {
        data = data || []
        return data
      }).catch(err => {
        console.log('error', err) // eslint-disable-line
        const data = []
        return data
      }).then(data => {
        if(callback) callback()
        setTimeout(() => {
          // data = [{label: "选项1 action test", value: "双皮奶"}, {label: "选项2 action test", value: "红烧肉"}] // 测试用
          this.updateLayout(this.layout[index], position, data)
        }, 2000)
      })
    },
    validateForm (action, ...args) {
      let fn
      switch (action) {
        case 'validate':
          fn = this.validate
          break
        case 'resetFields':
          fn = this.resetForm
          break
      }
      if(fn) fn(this.refId, ...args)
    },
    validate (refName, callBack) { // 校验
      const checkRes = this.$refs[refName].validate()
      if (callBack && typeof callBack === 'function') {
        callBack(checkRes)
      }
    },
    resetForm(refName) { // 重置
      this.$refs[refName].resetFields();
    }
  },
  beforeCreate() {
    this.$componentId = Date.now().toString() // 组件 ID,用于唯一标识某个组件,用于校验组件
  },
  created () {
    const receiveData = this.receiveData
    if(receiveData && typeof receiveData === 'object') {
      this.initformModel(receiveData)
    }
    this.$eventBus.$on('validateForm', this.validateForm) // 监听触发表单事件方法
  }
}
</script>

<style lang="less">
.active-form-layout {
  width: 100%;
  height: 100%;
  .form-content{
    .active-form-row {
      padding: 0;
    }
  }
  .form-block {
    display: inline-block;
  }
  .component-style {
    .component-label {
      width:150px;
    }
    .component-content{
      width: 200px;
    }
  }
}
</style>