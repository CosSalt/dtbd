<template>
  <div class='form-design-layout'>
    <formLayout
      @dragover.native='dragover'
      @drop.self.native='drop'
      class='form-design-content'
      :layout.sync='theLayout'
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
import {defaultsDeep} from '@/utils'
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
    dragItems: null,
  },
  data () {
    return {
      dragToIndex: -1,
      confIndex: -1,
      childrenIndex: -1, // tabs 下选的组件下标
      name: '', // 配置信息 name(tabs用的)
      type: '', // 配置信息 type 值
      confId: Date.now().toString(), // 配置 ID
      dragPosition: -1
    }
  },
  computed: {
    theLayout: {
      get () {
        return this.layout.map(item => defaultsDeep({}, item)) // 避免直接修改传入的数据, 破坏数据的单向流动原则, 避免产生副作用
      },
      set (newVal) {
        this.updateLayout(newVal)
      }
    },
    allKeys () {
      const data = this.componentData
      const keysArr = data.filter(item => {
        return !!item.id
      })
      return keysArr.map(item => {
        return item.id
      })
    },
    isTabs () {
      return this.type === 'tabs' && this.confIndex >= 0 && this.dragPosition === this.confIndex // 要选择后才能拖进(处理)tabs里面
    },
    isInTabs () {
      return this.isTabs && this.childrenIndex >= 0
    }, 
    componentConfIndex () {
      return this.isInTabs ? this.childrenIndex : this.confIndex
    },
    componentData () { 
      const name = this.name
      let res
      if (this.isInTabs) {
        const tabsConf = this.theLayout[this.confIndex].childConf
        const tabConf = tabsConf.find(item => item.name === name) || {}
        res = tabConf.components || []
      } else {
        res = this.theLayout
      }
      return res
    },
    confData () {
      return this.componentData[this.componentConfIndex] || {}
    }
  },
  methods: {
    updateLayout(newLayout = []) {
      // this.$eventBus.$emit('updateComponent', newLayout)
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
      this.$eventBus.$emit('beforeComponentConf', {
        confData: this.confData,
        confId: this.confId,
        confIndex: index,
        allKeys: this.allKeys
      })
    },
    addDragData (dragToIndex, {name, type, tagsDragToIndex = -1} = {}) {
      this.type = type
      this.name = name
      this.childrenIndex = tagsDragToIndex
      const dragPosition = dragToIndex - 1
      this.dragPosition = dragPosition
      const items = this.dragItems
      this.updateDragItems('')
      if (!items) return
      let newData
      let isDragInTabs = this.isTabs && name
      if(isDragInTabs) debugger
      let confItem
      let origal
      if (isDragInTabs) {
        origal = this.theLayout[dragPosition]
        const childConf = (origal && origal['childConf']) || []
        confItem = childConf.find(item => name === item.name)
        isDragInTabs = !!confItem
      }
      if (isDragInTabs) {
        const itemComponents = confItem.components || []
        newData = this.handleDragData(items, tagsDragToIndex, itemComponents)
        confItem.components = newData
        newData = this.theLayout
      } else {
        newData = this.handleDragData(items, dragToIndex, this.theLayout)
      }
      if (newData) {
        this.updateLayout(newData)
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
    },
    handleConf (data, id) { // data 为空表示删除
      if (id === this.confId) {
        const index = this.confIndex
        if(!data) {
          this.delComponent(index)
        } else {
          this.saveComponent(index, data)
        }
      }
    },
    getSameIndex (id, index) {
      return this.theLayout.findIndex((item, i) => item.id === id && i !== index)
    },
    saveComponent (index, confData = {}) { // 保存配置数据
      const id = confData.id
      const theIndex = this.getSameIndex(id, index)
      if (theIndex >= 0) {
        alert('已存在相同的 ID:"'+ id +'",请重新设置ID')
        return
      }
      let newData = defaultsDeep(this.theLayout[index], confData)
      const isArray = Array.isArray
      const assignObj = {}
      for (let [key, val] of Object.entries(newData)) {
        if (isArray(val)) {
          assignObj[key] = confData[key]
        }
      }
      newData = Object.assign(newData, assignObj)
      const allData = [...this.theLayout] 
      const [oldData] = allData.splice(index, 1, newData)
      this.updateLayout(allData)
      this.afterSaveConf(oldData.id, newData.id)
    },
    afterSaveConf (oldId, newId) { // ID修改后进行替换
      if(!oldId || !newId) return
      this.componentData.forEach(item => {
        const relationIds = item.relationIds
        if (relationIds && relationIds.length > 0) {
          const index = relationIds.findIndex(key => key === oldId)
          if (index >=0) {
            relationIds[index] = newId
          }
        }
      })
    },
    delComponent (index) { // 删除某个组件
      this.confIndex = -1
      const allData = [...this.theLayout]
      const [delData] = allData.splice(index, 1)
      this.updateLayout(allData)
      this.afterDelConf(delData.id)
    },
    afterDelConf (id) { // 某个组件被删除后
      if(!id) return
      this.theLayout.forEach(item => {
        const relationIds = item.relationIds
        if (relationIds && relationIds.length > 0) {
          const index = relationIds.findIndex(key => key === id)
          if (index >=0) {
            relationIds.splice(index, 1)
          }
        }
      })
    }
  },
  created () {
    this.$eventBus.$on('updateComponentConf:' + this.confId, this.handleConf)
  }
}
</script>

<style lang="less">
.form-design-layout{
  width: 100%;
  height: 100%;
    .form-design-content{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
    border: 2px solid grey;
    padding: 0 10px;
  }
}
</style>


