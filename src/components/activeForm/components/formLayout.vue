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
                    :class = 'confIndex === item.index ? "component-conf" : ""'
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
                        @drop='dropSpecial'
                        @defComponent='defComponentSpecial'
                        @dragstart.self.stop.native='dragstart(item.index, $event)'
                        @dragover.stop.native='dragover(item.index, $event)'
                      />
                    </div>
                  </el-col>
                </template>
                <template v-else>
                  <el-col
                    :span='item.span'
                    :key='item.id'
                    :draggable='isDraggable'
                    @dragstart.self.stop.native='dragstart(item.index, $event)'
                    @dragover.stop.native='dragover(item.index, $event)'
                    @click.stop.native='defComponent(item.index, item.type)'
                    @drop.stop.native='drop'
                    class='active-form-row'
                    :class='confIndex === item.index ? "component-conf" : ""'
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
import { getTempId } from '@/utils'
export default {
  name: 'formLayout',
  props: {
    isDraggable: {
      type: Boolean,
      default: false
    },
    dragToIndex: {
      type: Number,
      default: -1
    },
    layout: {
      type: Array,
      required: true
    },
    confIndex: {
      type: Number,
      default: -1
    },
    receiveData: {
      type: Object
    }
  },
  data () {
    return {
      dragStartIndex: -1,
      formModel: {},
      span: 12,
      // formItemSpan: 2,
      showLabel: false,
      labelWidth: '120px',
      labelPosition: 'left',
      componentId: Date.now().toString(), // 组件 ID,用于唯一标识某个组件,用于校验组件
    }
  },
  computed: {
    theLayoutData () {
      const DefSpan = this.span
      const getId = this.tempId
      let data = this.layout.map((item, index) => {
        return Object.assign({
          id: item.id || getId(index),
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
        if(id && Array.isArray(itemRules) && itemRules.length > 0) {
          rules[id] = itemRules
        }
      })
      return rules
    },
    refId () {
      return 'layout_' + this.componentId
    }
  },
  methods: {
    updateLayout (val) {
      this.$emit('update:layout', val)
    },
    tempId (index) {
      return getTempId(index, 'layout') // 临时 ID
    },
    //init receiveData
    initformModel(data = {}) {
      const formRes = {}
      for(let [key, val] of Object.entries(data)) {
        formRes[key] = val
      }
      this.formModel = formRes
    },
    handleformModel (data) {
      const formRes = {}
      const formModel = this.formModel || {}
      data.forEach(item => {
        let id = item.id
        formRes[id] = formModel[id] || null
      })
      this.formModel = formRes
    },
    dragstart (index) {
      this.dragStartIndex = index
    },
    dragover (index, e) {
      if (this.isDraggable) {
        this.$emit('update:dragToIndex', index)
        e.preventDefault()
      }
    },
    drop (e, ...args) {
      e.preventDefault()
      const fromIndex = this.dragStartIndex
      const toIndex = this.dragToIndex + 1
      if(fromIndex < 0) {
        this.$emit('addDragData', toIndex, ...args)
      } else {
        this.$emit('changePosition', fromIndex, toIndex)
      }
      this.handlePositionChangeModel(fromIndex, toIndex)
      this.dragStartIndex = -1
    },
    handlePositionChangeModel(fromIndex, toIndex) { // 处理交换位置或者新增组件时, 使用临时ID导致的数据格式不正确报错
      const data = this.layout
      const len = data.length
      let startIndex = fromIndex
      let endIndex = toIndex
      if (fromIndex > 0) { // 交换位置(可能需要考虑从前往后移动还是从后往前移动)
        if(fromIndex > toIndex) { // 从后往前拖拽
          startIndex = toIndex
          endIndex = fromIndex + 1
        } else if(fromIndex === toIndex) { // 处理无效移动
          return
        }
      } else { // 新增
        if(toIndex <= 0 || toIndex >= len ) return // 加在最后的忽略
        startIndex = toIndex // 从拖拽到的位置至末尾
        endIndex = len
      }
      this.emptyModel(data, startIndex, endIndex)
    },
    emptyModel (data = [], startIndex, endIndex) {
      const getId = this.tempId
      for (let i=startIndex; i < endIndex; i++) {
        if(!data[i]) debugger
        if(!data[i].id) { // 不存在 ID
          let tempId = getId(i)
          this.formModel[tempId] = null
        }
      }
    },
    dropSpecial ({e, ...args} = {}) {
      this.drop(e, args)
    },
    defComponent (index, type, param = {}) {
      if (!this.isDraggable) return
      this.$emit('setComponentConf', {index, type, ...param})
    },
    defComponentSpecial({index, type, name}) {
      this.defComponent(index, type, {name})
    },
    getAction ([actionParam, reqOrg]) {
      // const index = this.confIndex
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
          const confIndex = this.confIndex
          newLayout[confIndex] = Object.assign({}, newLayout[confIndex], {
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