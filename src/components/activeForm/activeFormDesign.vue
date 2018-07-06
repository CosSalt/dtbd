<template>
  <div class='active-form-design'>
    <div class='form-components'>
      <div class='form-side-head'>控件区</div>
      <activeFormComponents 
        :designs ='designs'
        @dragStart = 'dragStart'
        class='active-side-container'
      />
    </div>
    <div class='form-design-container'>
      <activeFormLayout
        @dragover.native='dragover'
        @drop.self.native='drop'
        class='form-design-content'
        :layout.sync = 'designData'
        :isDraggable='true'
        :dragToIndex.sync='dragToIndex'
        :confIndex='confIndex'
        @changePosition='changePosition'
        @setComponentConf='setComponentConf'
        @addDragData='addDragData'
      >
        <el-row slot='footer' style='text-align:center;' slot-scope="{ data }">
          <el-button type='primary' size='mini' @click.native='saveDesign(data)'
            v-loading.fullscreen="loading"
            element-loading-text="拼命保存中"
            element-loading-spinner="el-icon-loading">
              保存
            </el-button>
          <el-button type='info' size='mini' @click.native='clearDesign'>清空</el-button>
        </el-row>
      </activeFormLayout>
    </div>
    <div class="form-design-conf">
      <div class='form-side-head'> 组件配置区 </div>
      <activeFormConf
        class='active-side-container'
        :show.sync='showConf'
        :index='confIndex'
        :allKeys='allKeys'
        :typeData='designData[confIndex] || {}'
        @delComponent='delComponent'
        @saveComponent='saveComponent'
      />
    </div>
  </div>
</template>
<script>
import {defaultsDeep} from '@/utils'
import componentsConf from './config'
import activeFormComponents from './activeFormComponents'
import activeFormConf from './activeFormConf'
export default {
  name: 'activeFormDesign',
  components: {activeFormConf, activeFormComponents},
  data () {
    return {
      designData: [],
      dragToIndex: -1,
      dragItems: '',
      confIndex: -1, // 配置信息的组件下标
      showConf: false,
      loading: false,
      designIndex: 0,
      designs: [],
      isTableDrag: false,
    }
  },
  computed: {
    allKeys () {
      const data = this.designData
      const keysArr = data.filter(item => {
        return !!item.id
      })
      return keysArr.map(item => {
        return item.id
      })
    }
  },
  methods: {
    dragStart (dragItems) {
      this.dragToIndex = -1
      // e.dataTransfer.setData('type', type) // dataTransfer.setData() 方法设置被拖数据的数据类型和值
      this.dragItems = dragItems
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
    addDragData (dragToIndex, {name, type, tagsDragToIndex = -1} = {}) {
      const items = this.dragItems
      this.dragItems = ''
      debugger
      if (!items) return
      if (type === 'tabs') {
        if(!name) return
        const origal = this.designData[dragToIndex - 1]
        const childConf = (origal && origal['childConf']) || []
        origal['childConf'] = childConf
        const confItem = childConf.find(item => name === item.name)
        if (confItem) {
          const itemComponents = confItem.components || []
          confItem.components = itemComponents
          this.handleDragData(items, tagsDragToIndex, itemComponents)
        }
      } else {
        this.handleDragData(items, dragToIndex, this.designData)
      }
    },
    handleDragData (items, dragToIndex, origal = []) {
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
    },
    changePosition (from, to) { // 改变表单组件位置
      this.dragItems = '' // 处理拖动了控件而又未拖拽进布局区的情况
      if (from < 0 || from === to) return
      const data = this.designData
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
    },
    setComponentConf (index) { // 修改表单组件配置
      // const data = this.designData
      this.confIndex = index
      this.showConf = true
    },
    delComponent (index) { // 删除某个组件
      this.confIndex = -1
      const [delData] = this.designData.splice(index, 1)
      this.afterDelConf(delData.id)
    },
    getSameIndex (id, index) {
      return this.designData.findIndex((item, i) => item.id === id && i !== index)
    },
    saveComponent (index, confData = {}) { // 保存配置数据
      const id = confData.id
      const theIndex = this.getSameIndex(id, index)
      if (theIndex >= 0) {
        alert('已存在相同的 ID:"'+ id +'",请重新设置ID')
        return
      }
      // const newData = Object.assign(this.designData[index], confData)
      let newData = defaultsDeep(this.designData[index], confData)
      const isArray = Array.isArray
      const assignObj = {}
      for (let [key, val] of Object.entries(newData)) {
        if (isArray(val)) {
          assignObj[key] = confData[key]
        }
      }
      newData = Object.assign(newData, assignObj)
      const [oldData] = this.designData.splice(index, 1, newData)
      this.afterSaveConf(oldData.id, newData.id)
    },
    saveDesign () { // 保存设计的数据
      this.loading = true
      this.beforeSaveDesign()
      setTimeout(()=>{
        this.saveData(this.designData)
        this.loading = false
      }, 2000)
    },
    beforeSaveDesign () { // 删除无效的关联ID
      const allKeys = this.allKeys
      this.designData.forEach(item => {
        const relationIds = item.relationIds
        if (relationIds && relationIds.length > 0) {
          item.relationIds = relationIds.filter(theKey => {
            return allKeys.findIndex(key => key === theKey) >= 0
          })
        }
      })
    },
    afterDelConf (id) { // 某个组件被删除后
      if(!id) return
      this.designData.forEach(item => {
        const relationIds = item.relationIds
        if (relationIds && relationIds.length > 0) {
          const index = relationIds.findIndex(key => key === id)
          if (index >=0) {
            relationIds.splice(index, 1)
          }
        }
      })
    },
    afterSaveConf (oldId, newId) { // ID修改后进行替换
      if(!oldId || !newId) return
      this.designData.forEach(item => {
        const relationIds = item.relationIds
        if (relationIds && relationIds.length > 0) {
          const index = relationIds.findIndex(key => key === oldId)
          if (index >=0) {
            relationIds[index] = newId
          }
        }
      })
    },
    clearDesign () { // 清空数据
      if(window.confirm("确定要清空设计数据")){
        this.designData = []
      }
    },
    checkDesignData (data = []) {
      const err = []
      if (data.length <= 0) {
        err.push("设计配置项为空,不能保存")
      } else {
        const errMsg = (msg, index) => (msg || "第" + (index + 1) + "个配置")
        for(let [index, {labelText, id}] of data.entries()){
          if (!id) {
            err.push(errMsg(labelText, index) + ": ID值为空")
          } else {
            const sameIndex = this.getSameIndex(id, index)
            if(sameIndex > index) err.push('"' + errMsg(labelText, index) + '"与"' + errMsg(data[sameIndex].labelText, sameIndex) + '"具有相同的ID值,请修改')
          }
        }
      }
      return err
    },
    saveData (data = []) {
      const err = this.checkDesignData(data)
      if (err.length > 0) {
        alert(err.join('\n'))
        return
      }
      localStorage.setItem('designComponent', JSON.stringify(data))
    },
    initTblDesign (){
      const demo = [
        {
          name: '测试',
          id: 'test',
          data: [
            {type:'input', id: 'a', labelText:'1'},
            {type:'select', id: 'b', labelText:'2'},
            {type:'inputArea', id: 'c', labelText:'3'},
            {type:'input', id: 'd', labelText:'4'}
          ]
        }, {
          name: '测试ddd',
          id: 'testddd',
          data: [
            {type:'input', id: 'ad', labelText:'1d'},
            {type:'select', id: 'bd', labelText:'2d'},
            {type:'inputArea', id: 'cd', labelText:'3d'},
            {type:'input', id: 'dd', labelText:'4d'}
          ]
        }
      ]
      const TblDesignData = demo
      return Promise.resolve(TblDesignData)
    }
  },
  created () {
    this.$formItemTypes = componentsConf
    const baseDesign = {
      components: componentsConf,
      id: 'baseDesign',
      type: 'base',
      name: '基础控件区',
      className: 'form-components-orgin'
    }
    this.designs.push(baseDesign)
    this.initTblDesign().then(data => {
      if(data) {
        const tableDesign = {
          components: data,
          id: 'tableDesign',
          type: 'table',
          name: '表格控件区',
          className: 'form-components-orgin'
        }
        this.designs.unshift(tableDesign)
      }
    })
  }
}
</script>

<style lang="less">
@componentsWidth:250px;
@formSideHead: 30px;
.active-form-design {
  width: 100%;
  height: 100%;
  position: relative;
  .form-components {
    position: absolute;
    top: 0;
    left: 0;
    width: @componentsWidth;
    height: 100%;
    .form-components-orgin{
      height: 100%;
      overflow-y: auto;
    }
    .form-tble-orgin, .form-components-orgin {
      border: 1px solid grey;
    }
  }
  .form-design-container{
    margin: 0 @componentsWidth;
    height: 100%;
    overflow: auto;
  }
  .form-design-conf{
    position: absolute;
    top: 0;
    right: 0;
    width: @componentsWidth;
    height: 100%;
    overflow: auto;
  }
  .form-design-content{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
    border: 2px solid grey;
  }
  .form-side-head {
    width: 100%;
    height: @formSideHead;
    line-height: @formSideHead;
    text-align: center;
    background-color: #e6cccc;
  }
  .active-side-container {
    height: calc(100% - @formSideHead);
    overflow: auto;
  }
}
</style>
