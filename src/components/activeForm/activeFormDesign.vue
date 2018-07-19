<template>
  <div class='active-form-design'>
    <div class='form-components'>
      <div class='form-side-head'>控件区</div>
      <activeFormOriginal 
        @dragStart='dragStart'
        class='active-side-container'
      />
    </div>
    <div class='form-design-container'>
      <formDesignLayout
        :layout='designData'
        :dragItems='dragItems'
      >
        <el-row slot='footer' style='text-align:center;' slot-scope="{ data }">
          <el-button type='primary' size='mini' @click='saveDesign(data)'
            v-loading.fullscreen="loading"
            element-loading-text="拼命保存中"
            element-loading-spinner="el-icon-loading">
              保存
            </el-button>
          <el-button type='info' size='mini' @click='clearDesign'>清空</el-button>
        </el-row>
      </formDesignLayout>
    </div>
    <div class="form-design-conf">
      <div class='form-side-head'> 组件配置区 </div>
      <formComponentConf 
        class='active-side-container'
      />
    </div>
    <div class="show-design">
      <div v-show='isShowDesignData'>
        <input type="textarea" :value='showDesignData' />
        <button>加载</button>
      </div>
      <div>
        <button @click='showTheDesignData'>显示数据</button>
      </div>
    </div>
  </div>
</template>
<script>
import {isNullOrEmpty} from '@/utils'
import activeFormOriginal from './activeFormOriginal'
import formComponentConf from './formComponentConf'
export default {
  name: 'activeFormDesign',
  components: {formComponentConf, activeFormOriginal},
  data () {
    return {
      designData: [],
      dragToIndex: -1,
      dragItems: '',
      loading: false,
      designIndex: 0,
      isTableDrag: false,
      allKeys: [],
      showDesignData: '',
      historyDesignData: '',
      isShowDesignData: false
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
      if (window.confirm("确定要清空设计数据")) {
        this.updateOriginal(null, null, [], true)
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
    handleTopEvent (action, ...args) {
      let fn
      const actions = ['dragItems', 'original']
      switch (action) {
        case actions[0]:
          fn = this.updateDragItems
          break
        case actions[1]:
        default:
          fn = this.updateOriginal
          break
      }
      const isDev = process.env.NODE_ENV === 'production'
      if (isDev){
        if(actions.indexOf(action) < 0 && !!action) {
          alert('not the action: ' + action)
        }
      }
      if (fn) {
        fn(...args)
      }
    },
    updateDragItems (val) {
      this.dragItems = val
    },
    updateOriginal (parentItem, propName, newData, isOriginal = false) {
      if (isOriginal) {
        this.designData = newData
        return
      } else if (isNullOrEmpty(parentItem) || isNullOrEmpty(propName)) {
        return
      }
      parentItem[propName] = newData // designData数据已发生变化
      // 三种处理方式: 不处理(引用类型,数据本质上已经改变了);浅复制,产生一个新对象;深复制,产生一个新对象
      this.designData = this.designData.slice()
    },
    getDesignData () {
      const data = this.designData
      let showData = ''
      if (Array.isArray(data) && data.length > 0  ) {
        showData = JSON.stringify(data)
      }
      this.showDesignData = showData
    },
    loadDesign (str) {
      let data = []
      let isError = false
      if(!str) {
        alert('数据为空')
        return
      }
      try {
        data = JSON.parse(str)
      } catch (e){
        console.log(e)
        isError = true
      }
      if(!isError && Array.isArray(data)) {
        this.historyDesignData = this.designData
        this.designData = data
      }
    },
    showTheDesignData () {
      this.isShowDesignData=true
      this.getDesignData()
    }
  },
  created () {
    this.$eventBus.$on('handleTopEvent', this.handleTopEvent)
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
  .show-design{
    position: absolute;
    top: 0;
    right: 0;
    height: 100px;
    >div{
      height: 100%;
      display: inline-block;
    }
  }
}
</style>
