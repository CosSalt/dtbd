<template>
  <div class='active-form-layout'>
    <div class='form-content'>
        <template v-for='(layoutItem, i) in theLayoutData'>
          <el-row :key='"row" + i'>
            <template v-for='(item, index) in layoutItem'>
              <el-col
                :span='item.span'
                :key='item.type + index'
                :draggable='isDraggable'
                @dragstart.native='dragstart(item.index, $event)'
                @dragover.native='dragover(item.index, $event)'
                @drop.native='drop'
                @click.native='defComponent(item.index, item.type)'
                class='active-form-row'
                :class = 'confIndex === item.index ? "component-conf" : ""'
              >
                <formIndex v-model='formModel[item.id]' :formData='item' class='component-style' />
              </el-col>
            </template>
          </el-row>
        </template>
    </div>
    <slot name='footer' :data='formModel'/>
  </div>
</template>
<script>
import componentsConf from './config'
export default {
  name: 'activeFormLayout',
  props: {
    isDraggable: {
      type: Boolean,
      default: false
    },
    dragIndex: {
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
    }
  },
  data () {
    return {
      dragStartIndex: -1,
      formItemTypes: componentsConf,
      formModel: {},
      span: 12
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
      this.initformModel(data)
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
    }
  },
  methods: {
    tempId (id, index) {
      return id || ("$_temp_id_" + index) // 临时 ID
    },
    initformModel (data) {
      const formRes = {}
      const formModel = this.formModel || {}
      data.forEach(item => {
        let id = item.id
        formRes[id] = formModel[id] || null
      })
      this.formModel = formRes
      // window.aa = formRes
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
        this.$emit('update:dragIndex', index)
        e.preventDefault()
      }
    },
    drop (e) {
      // 调用 preventDefault() 来避免浏览器对数据的默认处理（drop 事件的默认行为是以链接形式打开）
      e.preventDefault()
      const fromIndex = this.dragStartIndex
      const toIndex = this.dragIndex + 1
      if (fromIndex >= 0 && fromIndex !== toIndex) {
        this.$emit('changePosition', fromIndex, toIndex)
      }
      this.dragStartIndex = -1
    },
    defComponent (index, type) {
      if (!this.isDraggable) {
        return
      }
      this.$emit('setComponentConf', index, type)
    }
  }
}
</script>

<style lang="less">
.active-form-layout {
  width: 100%;
  height: 100%;
  .form-content{
    overflow: auto;
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
