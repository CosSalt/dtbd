<template>
  <div class='active-form-design'>
    <div class='form-components'>
      <div class='form-design-title'> 控件区 </div>
      <ul class='form-components-orgin'>
        <template v-for='item in formItemTypes'>
          <li :key='item.type' class='active-form-row component-row' draggable='true' @dragstart='dragstart(item.type, $event)'>
            <component :is="item.component" v-bind='item.bind' :formData='item' class='component-design-style' size='mini' />
          </li>
        </template>
      </ul>
    </div>
    <div class='form-design-container'>
      <activeFormLayout
        @dragover.native='dragover'
        @drop.native='drop'
        class='form-design-content'
        :layout = 'designData'
        :isDraggable='true'
        :dragIndex.sync='dragIndex'
        @changePosition='changePosition'
        @setComponentConf='setComponentConf'
      />
    </div>
    <div class="form-design-conf">
      <div class='form-design-title'> 组件配置区 </div>
      <activeFormConf
        :show.sync='showConf'
        :index='confIndex'
        :confData='designData[confIndex] || {}'
        @delComponent='delComponent'
        @saveComponent='saveComponent'
      />
    </div>
  </div>
</template>
<script>
import componentsConf from './config'
import activeFormLayout from './activeFormLayout'
import activeFormConf from './activeFormConf.vue'
import {defaultsDeep} from '@/utils'
export default {
  name: 'activeFormDesign',
  components: {activeFormLayout, activeFormConf},
  props: {
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
      formItemTypes: componentsConf,
      designData: [],
      dragIndex: -1,
      dragType: '',
      confIndex: -1, // 配置信息的组件下标
      showConf: false
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
    dragstart (type) {
      this.dragIndex = -1
      // e.dataTransfer.setData('type', type) // dataTransfer.setData() 方法设置被拖数据的数据类型和值
      this.dragType = type
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
      const type = this.dragType
      if (!type) return
      const item = this.formItemTypes.find(item => item.type === type)
      if (!item) return
      if (this.dragIndex >= 0) {
        this.designData.splice(this.dragIndex + 1, 0, item)
      } else {
        this.designData.push(item)
      }
      this.dragType = ''
    },
    changePosition (from, to) { // 改变表单组件位置
      const data = this.designData
      const changeItem = data[from]
      data.splice(from, 1)
      data.splice(to, 0, changeItem)
    },
    setComponentConf (index) { // 修改表单组件配置
      // const data = this.designData
      this.confIndex = index
      this.showConf = true
    },
    delComponent (index) { // 删除某个组件
      this.designData.splice(index, 1)
    },
    saveComponent (index, confData) { // 保存配置数据
      const id = confData.id
      const theIndex = this.designData.findIndex((item, i) => item.id === id && i !== index)
      if (theIndex >= 0) {
        alert('已存在相同的 ID,请重新设置ID')
        return
      }
      const newData = defaultsDeep(this.designData[index], confData)
      this.designData.splice(index, 1, newData)
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
    cursor: pointer;
  }
  .component-design-style{
    max-width: 100%;
    vertical-align: center;
    .component-label {
      width:49%;
      vertical-align: center;
    }
    .component-content{
      width: 50%;
      vertical-align: center;
    }
  }
  .component-row{
    &:hover{
      background-color: #409eff;
      color: #fff;
    }
  }
  .form-design-content{
    width:100%;
    height: 100%;
    background-color: yellow;
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
