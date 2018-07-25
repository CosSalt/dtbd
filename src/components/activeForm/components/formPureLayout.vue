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
export default {
  name: 'formPureLayout',
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
    }
  },
  data () {
    return {
      formModel: {},
      span: 12,
      showLabel: false,
      labelWidth: '120px',
      labelPosition: 'left'
    }
  },
  computed: {
    theLayoutData () {
      const DefSpan = this.span
      let data = this.layout.map((item, index) => {
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
    formRules () {
      const rules = {}
      this.layout.forEach(item => {
        let id = item.id
        let itemRules = item.rules
        if (id && Array.isArray(itemRules) && itemRules.length > 0) {
          rules[id] = itemRules
        }
      })
      return rules
    },
    refId () {
      return 'layout_' + this.$componentId
    }
  },
  watch: {
    receiveData (val = {}) {
      this.resetFormModel(val)
    }
  },
  methods: {
    updateLayout (val) {
      this.$emit('update:layout', val)
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
    getAction ([actionParam, reqOrg, index]) { // index 待处理
      const reqId = reqOrg.id
      const {action, position} = actionParam
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
        setTimeout(() => {
          const newLayout = [...this.layout]
          newLayout[index] = Object.assign({}, newLayout[index], {
            [position]: data
          })
          this.updateLayout(newLayout)
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
  .component-conf {
    background-color: grey;
  }
}
</style>