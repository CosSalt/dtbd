<template>
  <div class='active-form-layout'>
    <div class='form-content'>
      <ul>
        <template v-for='(item, index) in layout'>
          <li :key='item.type + index' class='active-form-row'
            :draggable='isDraggable'
            @dragstart='dragstart(index, $event)'
            @dragover='dragover(index, $event)'
            @drop='drop'
            @click='defComponent(index, item.type)'
          >
            <label v-if='item.text'>{{item.text}}</label>
            <component :is="item.component" v-bind='item.param' class='component-style'>{{item.afterText}}</component>
          </li>
        </template>
      </ul>
    </div>
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
      default: () => {
        return {
          columns: 2,
          data: [
            {x: 1, type: '123'},
            {x: 2},
            {x: 3},
            {x: 4}
          ]
        }
      }
    }
  },
  data () {
    return {
      dragStartIndex: -1,
      formItemTypes: componentsConf
    }
  },
  computed: {
    theLayout () {
      const defaultData = {
        columns: 2,
        data: []
      }
      return Object.assign(defaultData, this.layout)
    },
    layoutData () { // 结合 columns, 数据处理
      const columns = this.theLayout.columns
      const data = this.theLayout.data
      const colnumsNum = Math.ceil(data.length / columns)
      const defaultWidth = (100 / columns) + '%'
      const res = Array.from({length: colnumsNum}, () => [])
      data.forEach((item, index) => {
        const resIndex = Math.floor(index / columns)
        const theItem = Object.assign({}, item)
        theItem.style = Object.assign({
          width: defaultWidth
        }, theItem.style)
        res[resIndex].push(theItem)
      })
      return res
    }
  },
  methods: {
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
    background-color: grey;
    min-height: 100%;
    overflow: auto;
  }
  .form-block {
    display: inline-block;
  }
}
</style>
