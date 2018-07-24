<template>
  <div class='form-design-layout'>
    <formLayout
      class='form-design-content'
      :layout.sync='theLayout'
      :isDraggable='true'
      :confIndex='confIndex'
      :dragToIndex.sync='dragToIndex'
      @dragover.stop.native='dragover'
      @drop.self.stop.native='drop'
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
import {defaultsDeep, isNullOrEmpty} from '@/utils'
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
    parentData: null, //数据的父节点
    propName: null // 数据对应的属性
  },
  data () {
    return {
      dragToIndex: -1, // 拖拽到的位置, -1表示在最后
      confIndex: -1,
      name: '', // 配置信息 name(tabs用的)
      type: '', // 配置信息 type 值
      confId: Date.now().toString(), // 配置 ID
      dragPosition: -1
    }
  },
  computed: {
    theLayout: {
      get () {
        return this.layout
      },
      set (newVal) {
        this.updateLayout(newVal)
      }
    },
    allKeys () {
      const data = this.theLayout
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
    confData () {
      return this.theLayout[this.confIndex] || {}
    }
  },
  methods: {
    updateLayout(newLayout = []) {
      const parentData = this.parentData, propName = this.propName
      const notParent = isNullOrEmpty(parentData) && isNullOrEmpty(propName)
      this.$eventBus.$emit('handleTopEvent', null, parentData, propName, newLayout, notParent)
    },
    dragover (e) {
      e.preventDefault()
    },
    drop (e) {
      e.preventDefault()
      this.dragToIndex = -1
      this.addDragData(this.dragToIndex + 1)
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
      this.hideComponentConf()
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
    hideComponentConf () { // 改变位置,增加组件时隐藏配置项,配置项中的数据过时
      this.$eventBus.$emit('beforeComponentConf', {isShow: false})
    },
    addDragData (dragToIndex, {name, type} = {}) {      
      this.type = type
      this.name = name
      const dragPosition = dragToIndex - 1
      this.dragPosition = dragPosition
      const items = this.getDragItems()
      this.updateDragItems('')
      if (!items || items.length <= 0) return
      let newData
      let isDragInTabs = this.isTabs && name
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
        newData = this.handleDragData(items, -1, itemComponents)
        confItem.components = newData
        newData = this.theLayout
      } else {
        newData = this.handleDragData(items, dragToIndex, this.theLayout)
      }
      if (newData) {
        this.hideComponentConf()
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
      this.theLayout.forEach(item => {
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
    },
    updateDragItems (val) {
      this.$eventBus.$emit('handleTopEvent', 'dragItems', val)
    },
    getDragItems () {
      return this.$eventBus.$dragItems
    }
  },
  created () {
    this.$eventBus.$on('updateComponentConf:' + this.confId, this.handleConf)
  },
  beforeDestroy () {
    this.$eventBus.$off('updateComponentConf:' + this.confId, this.handleConf)
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