<template>
  <div class='form-design-layout'>
    <formLayout
      @dragover.native='dragover'
      @drop.native='drop'
      class='form-design-content'
      :layout.sync = 'theLayout'
      :isDraggable='true'
      :dragToIndex.sync='dragToIndex'
      :confIndex='confIndex'
      @changePosition='changePosition'
      @setComponentConf='setComponentConf'
      @addDragData='addDragData'
    >
      <template slot='footer' slot-scope="{ data }">
        <slot name='footer' :data='data' />
      </template>
    </formLayout>
  </div>
</template>

<script>
export default {
  name: 'formDesignLayout',
  props: {
    layout: {
      required: true,
      type: Array,
      default () {
        return []
      }
    },
    dragItems: null
  },
  data () {
    return {
      dragToIndex: -1,
      confIndex: -1
    }
  },
  computed: {
    theLayout: {
      get () {
        return [...this.layout] // 避免直接修改传入的数据, 破坏数据的单向流动原则, 避免产生副作用
      },
      set (newVal) {
        this.updateLayout(newVal)
      }
    }
  },
  methods: {
    updateLayout(newLayout = []) {
      this.$emit('update:layout', newLayout)
    },
    updateDragItems (newVal) {
      this.$emit('update:dragItems', newVal)
    },
    dragover (e) {
      // ondragover 事件规定在何处放置被拖动的数据
      // 默认地，无法将数据/元素放置到其他元素中。如果需要设置允许放置，我们必须阻止对元素的默认处理方式
      // 这要通过调用 ondragover 事件的 event.preventDefault() 方法
      e.preventDefault()
    },
    drop (e) {
      // 调用 preventDefault() 来避免浏览器对数据的默认处理（drop 事件的默认行为是以链接形式打开）
      e.preventDefault()
      const dragToIndex = this.dragToIndex + 1
      this.addDragData(dragToIndex)
    },
    changePosition (from, to) { // 改变表单组件位置
      this.updateDragItems('') // 处理拖动了控件而又未拖拽进布局区的情况
      if (from < 0 || from === to) return
      const data = [...this.theLayout]
      const changeItem = data[from]
      if (from > to) { // 从后往前拖拽
        // 先删后增
        data.splice(from, 1)
        data.splice(to, 0, changeItem)
      } else { // 从前往后拖拽
        // 先增后删
        data.splice(to, 0, changeItem)
        data.splice(from, 1)
      }
      // const a = from > to ? 1 : 0
      // data.splice(to, 0, changeItem)
      // data.splice(from + a, 1)
      this.updateLayout(data)
    },
    setComponentConf (data = {}) { // 修改表单组件配置
      const {index} = data
      this.confIndex = index
      this.showConf = true
      this.$eventBus.$emit('setComponentConf', data)
    },
    addDragData (dragToIndex, {name, type, tagsDragToIndex = -1} = {}) {
      const items = this.dragItems
      this.updateDragItems('')
      if (!items) return
      let newDesignData
      if (type === 'tabs') {
        if(!name) return
        const origal = this.theLayout[dragToIndex - 1]
        const childConf = (origal && origal['childConf']) || []
        origal['childConf'] = childConf
        const confItem = childConf.find(item => name === item.name)
        if (confItem) {
          const itemComponents = confItem.components || []
          confItem.components = itemComponents
          newDesignData = this.handleDragData(items, tagsDragToIndex, itemComponents)
        }
      } else {
        newDesignData = this.handleDragData(items, dragToIndex, this.theLayout)
      }
      if (newDesignData) {
        this.updateLayout(newDesignData)
      }
    },
    handleDragData (items, dragToIndex, origal = []) {
      origal = [...origal]
      let sameIdMsgs = []
      items.forEach(item => {
        const id = item.id
        if (id) {
          let sameIndex = origal.findIndex(dataItem => id === dataItem.id) + 1
          if (sameIndex > 0) {
            sameIdMsgs.push('已存在相同的ID:"'+ id +'",在第 ' + sameIndex +' 项')
          }
        }
      })
      if(sameIdMsgs.length > 0) {
        alert (sameIdMsgs.join('\n'))
        return
      } else {
        if (dragToIndex > 0) {
          origal.splice(dragToIndex, 0, ...items)
        } else {
          origal.push(...items)
        }
      }
      return origal
    }
  }
}
</script>

<style lang="less">
.form-design-layout{
  width: 100%;
  height: 100%;
}
</style>


