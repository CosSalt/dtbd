<template>
  <div class='active-form-design'>
    <div class='form-design-container'>
      <div class='design-original left-bar div-scroll'>
        <activeFormOriginal 
          @dragStart='dragStart'
          class='left-side-container'
        />
      </div>
      <div class='design-container'>
        <formDesignLayout
          :layout='designData'
        >
          <el-row slot='footer' style='text-align:center;'>
            <el-button type='primary' size='mini' @click='willSaveDesign'
              v-loading.fullscreen="loading"
              element-loading-text="拼命保存中"
              element-loading-spinner="el-icon-loading">
                保存
              </el-button>
            <el-button type='info' size='mini' @click='clearDesign'>清空</el-button>
          </el-row>
        </formDesignLayout>
      </div>
      <div class="design-conf">
        <formComponentConf 
          class='right-side-container div-scroll'
        />
      </div>
    </div>
    <div class='design-other div-scroll'>
      <div class='other-global-conf'>

      </div>
      <div class='other-show-data'>
        <div v-show='isShowDesignData'>
          <input type="textarea" v-model='showDesignData' />
          <button @click='loadDesign'>加载</button>
        </div>
        <div>
          <button @click='showTheDesignData(!isShowDesignData)'>{{showLabel}}数据</button>
        </div>
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
      designData: [], // 设计数据
      loading: false,
      showDesignData: '',
      historyDesignData: '',
      isShowDesignData: false,
      showLabel: '显示'
    }
  },
  methods: {
    dragStart (val) {
      this.updateDragItems(val)
    },
    getSameIndex (id, index, data = this.designData) {
      return data.findIndex((item, i) => item.id === id && i !== index)
    },
    willSaveDesign () { // 保存设计的数据
      this.loading = true
      setTimeout(()=>{
        this.saveData(this.designData)
        this.loading = false
      }, 2000)
    },
    saveData (data = []) { // 存储保存的数据
      const err = this.checkDesignData(data)
      if (err.length > 0) {
        alert(err.join('\n'))
        return
      }
      localStorage.setItem('designComponent', JSON.stringify(data))
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
    // 显示加载JSON数据
    getDesignData () {
      const data = this.designData
      let showData = ''
      if (Array.isArray(data) && data.length > 0  ) {
        showData = JSON.stringify(data)
      }
      this.showDesignData = showData
    },
    loadDesign () {
      const str = this.showDesignData
      let data = []
      let isError = false
      if(!str) {
        alert('数据为空')
        return
      }
      try {
        data = JSON.parse(str)
      } catch (e){
        console.error(e) // eslint-disable-line
        isError = true
      }
      if(!isError && Array.isArray(data)) {
        this.historyDesignData = this.designData
        this.designData = data
      }
    },
    showTheDesignData (res) {
      this.isShowDesignData = res
      if (res === true) {
        this.getDesignData()
      }
      this.showLabel = res ? '隐藏' : '显示'
    },
    // 通过 eventBus 事件机制处理数据,数据通过 eventBus 事件机制传播, 避免 props 传递时多子组件的臃肿
    // 不能响应式触发,只能是通过事件触发机制获取修改数据
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
      this.$eventBus.$dragItems = val
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
    }
  },
  created () {
    this.$eventBus.$on('handleTopEvent', this.handleTopEvent)
  },
  beforeDestroy () {
    this.$eventBus.$off('handleTopEvent', this.handleTopEvent)
  }
}
</script>

<style lang="less">
.active-form-design {
  .other-global-conf{
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
