<template>
  <div class='active-form-design'>
    <div class='form-components'>
      <div class='form-design-title'> 控件区 </div>
      <ul class='form-components-orgin'>
        <template v-for='item in $formItemTypes'>
          <li :key='item.type' class='active-form-row component-row' draggable='true' @dragstart='dragstart(item)'>
            <formIndex :formData='item' class='component-design-style' />
          </li>
        </template>
      </ul>
    </div>
    <div class='form-design-container'>
      <activeFormLayout
        @dragover.native='dragover'
        @drop.native='drop'
        class='form-design-content'
        :layout.sync = 'designData'
        :isDraggable='true'
        :dragIndex.sync='dragIndex'
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
      <div class='form-design-title'> 组件配置区 </div>
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
import activeFormLayout from './activeFormLayout'
import activeFormConf from './activeFormConf.vue'
export default {
  name: 'activeFormDesign',
  components: {activeFormLayout, activeFormConf},
  beforeCreate () {
    this.$formItemTypes = componentsConf
  },
  data () {
    return {
      designData: [],
      dragIndex: -1,
      dragItem: '',
      confIndex: -1, // 配置信息的组件下标
      showConf: false,
      loading: false
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
    dragstart (componentItem) {
      this.dragIndex = -1
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
      const newItem = defaultsDeep({}, item)
      if (this.dragIndex >= 0) {
        this.designData.splice(this.dragIndex + 1, 0, newItem)
      } else {
        this.designData.push(newItem)
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
    saveComponent (index, confData = {}) { // 保存配置数据
      const id = confData.id
      const theIndex = this.designData.findIndex((item, i) => item.id === id && i !== index)
      if (theIndex >= 0) {
        alert('已存在相同的 ID,请重新设置ID')
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
        for(let [index, {text, id}] of data.entries()){
          if (!id) {
            err.push((text || "第" + (index + 1) + "个配置" ) + ": ID值为空")
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
    }
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
  .form-design-title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: rgb(230, 204, 204);
  }
}
</style>
