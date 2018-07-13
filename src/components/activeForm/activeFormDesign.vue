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
      <formDesignLayout
        :layout='designData'
        @updateLayout='updateLayout'
        :dragItems='dragItems'
        @updateDragItems='updateDragItems'
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
      </formDesignLayout>
    </div>
    <div class="form-design-conf">
      <div class='form-side-head'> 组件配置区 </div>
      <activeFormConf 
        @a='(aa)=>{console.log(aa)}'
        @b='(aa)=>{console.log(aa)}'
        class='active-side-container'
      />
    </div>
  </div>
</template>
<script>
// import {defaultsDeep} from '@/utils'
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
      loading: false,
      designIndex: 0,
      designs: [],
      isTableDrag: false,
      allKeys: []
    }
  },
  methods: {
    dragStart (dragItems) {
      this.dragToIndex = -1
      // e.dataTransfer.setData('type', type) // dataTransfer.setData() 方法设置被拖数据的数据类型和值
      this.dragItems = dragItems
    },
    getSameIndex (id, index, data = this.designData) {
      return data.findIndex((item, i) => item.id === id && i !== index)
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
    clearDesign () { // 清空数据
      if(window.confirm("确定要清空设计数据")){
        this.designData = []
      }
    },
    getErrMsg (componentConfName, index, errMsg = '') {
      componentConfName = componentConfName ? '('+ componentConfName +')' : ''
      return '第' + index + '个配置' + componentConfName + errMsg
    },
    checkDesignData (data = [], theIndex, theMsg, errMsg) {
      const err = []
      const getErrMsg = this.getErrMsg
      const theIndexStr = theIndex ? theIndex + '_' : ''
      if (data.length <= 0) {
        let confErrMsg = "设计配置项为空,不能保存"
        if (theIndex != undefined && theIndex !== '') {
          confErrMsg = getErrMsg(theMsg, theIndex, errMsg) 
        }
        err.push(confErrMsg)
      } else {
        for(let [index, item] of data.entries()){
          const nextIndex = index + 1
          const nextIndexStr = theIndexStr + nextIndex
          const {labelText, id, type} = item
          if (!id) {
            err.push(getErrMsg(labelText, nextIndexStr, ': ID 值为空'))
          } else {
            const sameIndex = this.getSameIndex(id, index, data)
            if(sameIndex > index) err.push('"' + getErrMsg(labelText, nextIndexStr) + '"与"' + getErrMsg(data[sameIndex].labelText, theIndexStr + sameIndex) + '"具有相同的ID值,请修改')
          }
          if (type === 'tabs') {
            const {childConf = []} = item
            childConf.forEach(childItem => {
              let label = childItem.label
              label = label ? '_' + label : ''
              const childData = childItem.components || []
              const childErr = this.checkDesignData(childData, nextIndexStr, ' Tabs配置项' + label, ': 为空')
              if(childErr.length > 0) {
                err.push(...childErr)
              }
            })
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
    },
    updateLayout (val) {
      this.designData = val
    },
    updateDragItems (val) {
      this.dragItems = val
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
