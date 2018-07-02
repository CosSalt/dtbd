<template>
  <div class='active-form-design'>
    <div class='form-components'>
      <div class='form-design-head'> 控件区</div>
      <div>
        <template v-for='(designItem, index) in designs'>
          <div class='form-design-class' :key='designItem.id' v-if='designItem.components && designItem.components.length > 0'>
            <el-row class='form-design-title'>
              <el-col :span='20'>
                <span v-text='designItem.name'></span>
              </el-col>
              <el-col :span='4'>
                <i
                  :class = '{"design-show": designIndex === index}'
                  class='el-icon-arrow-left'
                  @click='designIndex = designIndex === index ? -1 : index'
                />
              </el-col>
            </el-row>
            <div v-if='designItem.id === "tableDesign"' class='form-design-table' v-show='designIndex === index'>
              <template>
                <template v-for='(tblItem, index) in designItem.components'>
                  <formDesignTable 
                    :tblData='tblItem'
                    :draggable='true'
                    @dragstart.native='dragstart(tblItem, index , true)'
                    :key='tblItem.id'
                  />
                </template>
              </template>
            </div>
            <div v-else class='form-design-base' v-show='designIndex === index'>
              <ul :class='designItem.className'>
                <template v-for='item in designItem.components'>
                  <li :key='item.type' class='active-form-row component-row' draggable='true' @dragstart='dragstart(item)'>
                    <formIndex :formData='item' class='component-design-style' />
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class='form-design-container'>
      <activeFormLayout
        @dragover.native='dragover'
        @drop.native='drop'
        class='form-design-content'
        :layout.sync = 'designData'
        :isDraggable='true'
        :dragToIndex.sync='dragToIndex'
        :confIndex='confIndex'
        @changePosition='changePosition'
        @setComponentConf='setComponentConf'
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
      <div class='form-design-head'> 组件配置区 </div>
      <activeFormConf
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
import activeFormConf from './activeFormConf'
export default {
  name: 'activeFormDesign',
  components: {activeFormConf},
  data () {
    return {
      designData: [],
      dragToIndex: -1,
      dragItem: '',
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
    dragstart (componentItem, index, isTableDrag = false) {
      this.isTableDrag = isTableDrag
      this.dragToIndex = -1
      // e.dataTransfer.setData('type', type) // dataTransfer.setData() 方法设置被拖数据的数据类型和值
      this.dragItem = componentItem
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
      const item = this.dragItem
      this.dragItem = ''
      if (!item) return
      const itemArr = []
      const getNewItem = (theItem) => defaultsDeep({}, theItem)
      if (this.isTableDrag) {
        const dragItems = item.data
        if(!Array.isArray(dragItems) || dragItems.length <= 0) return
        let sameIds = []
        for(let tblItem of dragItems.values()) {
          const tblNewItem = getNewItem(tblItem)
          const tblItemId = tblNewItem.id
          if (tblItemId) {
            if(this.designData.findIndex(item => tblItemId === item.id) >= 0){
              sameIds.push(tblItemId)
            }
          }
          itemArr.push(tblNewItem)
        }
        if(sameIds.length > 0) {
          const errMsg = sameIds.map(id => ('已存在相同的ID:"'+ id +'"'))
          alert (errMsg.join('\n'))
          return
        }
      } else {
        itemArr.push(getNewItem(item))
      }
      this.dropHandle (this.dragToIndex, itemArr)
    },
    dropHandle (dragToIndex, newItemArr = []) {
      if (dragToIndex >= 0) {
        this.designData.splice(dragToIndex + 1, 0, ...newItemArr)
      } else {
        this.designData.push(...newItemArr)
      }
    },
    changePosition (from, to) { // 改变表单组件位置
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
      name: '基础控件区',
      className: 'form-components-orgin'
    }
    this.designs.push(baseDesign)
    this.initTblDesign().then(data => {
      if(data) {
        const tableDesign = {
          components: data,
          id: 'tableDesign',
          name: '表格控件区',
          className: 'form-components-orgin'
        }
        this.designs.push(tableDesign)
      }
    })
  }
}
</script>

<style lang="less">
@componentsWidth:250px;
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
    min-height: 100%;
    overflow: auto;
  }
  .form-block {
    display: inline-block;
  }
  .active-form-row{
    margin: 0;
    padding: 5px 0;
  }
  .component-design-style{
    width: 100%;
    .component-label {
      width:49%;
    }
    .component-content{
      width: 50%;
    }
  }
  .component-row{
    &:hover{
      background-color: #409eff;
      color: #fff;
    }
  }
  .form-design-content{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 2px solid grey;
  }
  .form-design-head {
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: rgb(230, 204, 204);
  }
  .form-design-class {
    i{
      cursor: pointer;
      transition: all .5s;
    }
    .design-show{
      transform: rotate(-90deg);
    }
  }
  .form-design-hide {
    display: none;
  }
}
</style>
