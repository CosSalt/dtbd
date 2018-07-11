<template>
  <div class='active-form-layout'>
    <div class='form-content'>
        <el-form ref="formLayout"
          :model="formModel"
          :inline="true"
          :labelPosition='labelPosition'
        >
          <template v-for='(layoutItem, i) in theLayoutData'>
            <el-row :key='"row" + i'>
              <template v-for='(item, index) in layoutItem'>
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
                        :formData.sync='item'
                        @update:formData='val => updateFormData(layoutItem, index, item.index, val)'
                        :isDraggable='isDraggable'
                        :keyIndex='item.index'
                        :draggable='isDraggable'
                        @drop.self='dropSpecial'
                        @defComponent='defComponentSpecial'
                        @dragstart.native='dragstart(item.index, $event)'
                        @dragover.native='dragover(item.index, $event)'
                      />
                    </div>
                  </el-col>
                </template>
                <template v-else>
                  <el-col
                    :span='item.span'
                    :key='item.id'
                    :draggable='isDraggable'
                    :style='isDraggable ? {cursor: "pointer"} : {}'
                    @dragstart.native='dragstart(item.index, $event)'
                    @dragover.native='dragover(item.index, $event)'
                    @click.self.stop.native='defComponent(item.index, item.type)'
                    @drop.prevent.native='drop'
                    class='active-form-row'
                    :class='confIndex === item.index ? "component-conf" : ""'
                  >
                    <el-form-item :label="item.labelText" size='mini' :labelWidth='labelWidth' :prop='item.id' :rules="formRules[item.id]">
                      <formIndex
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
import componentsConf from '../config'
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
      formItemTypes: componentsConf,
      formModel: {},
      span: 12,
      // formItemSpan: 2,
      showLabel: false,
      labelWidth: '120px',
      labelPosition: 'left'
    }
  },
  computed: {
    theLayoutData () {
      const DefSpan = this.span
      const getId = this.tempId
      let data = this.layout.map((item, index) => {
        return Object.assign({
          id: getId(item.id, index),
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
        let ResMaxIndex = res.length - 1
        if (spanSum > MaxSpan) {
          spanSum -= 24
          ResMaxIndex += 1
        }
        if (!res[ResMaxIndex]) {
          res[ResMaxIndex] = []
        }
        res[ResMaxIndex].push(item)
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
    }
  },
  methods: {
    updateLayout (val) {
      this.$emit('update:layout', val)
    },
    tempId (id, index) {
      return id || getTempId(index, 'layout') // 临时 ID
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
      // e.dataTransfer.setData('index', index) // dataTransfer.setData() 方法设置被拖数据的数据类型和值
    },
    dragover (index, e) {
      // ondragover 事件规定在何处放置被拖动的数据
      // 默认地，无法将数据/元素放置到其他元素中。如果需要设置允许放置，我们必须阻止对元素的默认处理方式
      // 这要通过调用 ondragover 事件的 event.preventDefault() 方法
      if (this.isDraggable) {
        this.$emit('update:dragToIndex', index)
        e.preventDefault()
      }
    },
    drop (e, ...args) {
      // 调用 preventDefault() 来避免浏览器对数据的默认处理（drop 事件的默认行为是以链接形式打开）
      e.preventDefault()
      const fromIndex = this.dragStartIndex
      const toIndex = this.dragToIndex + 1
      if(fromIndex < 0) {
        this.$emit('addDragData', toIndex, ...args)
      } else {
        this.$emit('changePosition', fromIndex, toIndex)
      }
      this.dragStartIndex = -1
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
        console.log('err', err) // eslint-disable-line
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
    clearModel () {
      const emptyModel = {}
      for (let key of Object.keys(this.formModel)) {
        emptyModel[key] = null
      }
      this.formModel = emptyModel
    },
    updateFormData (item, propName, layoutIndex, val = {}) {
      debugger
      item[propName] = val
      const layout = [...this.layout]
      const id = layout[layoutIndex].id
      if (!id) {
        alert("请先设置此 Tabs 的 ID")
        return
      }
      this.updateLayout(newLayout)
      let newLayout = []
      this.theLayoutData.forEach(item => newLayout.push(...item)) // 将用于布局的数据展开
      layout.splice(layoutIndex, 1, newLayout[layoutIndex])
      this.updateLayout(layout)
    }
  },
  created () {
    const receiveData = this.receiveData
    if(receiveData && typeof receiveData === 'object') {
      this.initformModel(receiveData)
    }
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
