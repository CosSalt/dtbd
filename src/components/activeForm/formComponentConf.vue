<template>
  <div class="active-form-conf" v-if='isShow'>
    <ul>
      <li v-for='item in confData' :key='item.key' class='form-conf-li'>
        <formIndex
          class='component-conf-style'
          v-model.trim='confModel[item.key]'
          :formData='item.component'
          :componentType='componentType'
          :keyIndex='index'
        />
      </li>
    </ul>
    <el-row style='text-align:center;'>
      <el-button type="primary" size="mini" @click='saveConf'
        :loading="confSaveLoading"
        element-loading-spinner="el-icon-loading"
      >
        保存
      </el-button>
      <el-button type="warning" size="mini" @click='delConf'
        :loading="confDelLoading"
        element-loading-spinner="el-icon-loading"
      >
        删除
      </el-button>
    </el-row>
  </div>
</template>

<script>

// 不对外暴露任何API,也不接受参数
// 通过下面的方法(eventBus的事件机制)接受数据和返还数据
// this.$eventBus.$on('beforeComponentConf', this.handleConf)
// this.$eventBus.$emit('updateComponentConf:' + this.confId, data, this.confId)

import componentConf from './config/formComponentConf'
import typeShowConf from './config/typeShowConf'
export default {
  name: 'formComponentConf',
  beforeCreate () {
    this.$allData = componentConf
  },
  data () {
    return {
      componentType: null,
      confModel: {},
      confSaveLoading: false,
      confDelLoading: false,
      typeData: {},
      confId: Date.now().toString(),
      allKeys: [],
      index: -1,
      show: false
    }
  },
  computed: {
    confData () {
      const allData = this.$allData
      const TheType = this.typeData.type
      const showConf = typeShowConf[TheType] || []
      let data = []
      showConf.forEach(type => {
        let item = allData.find(item => item.key === type)
        if (item) {
          if (item.key === 'relationIds') {
            const cdata = item.component
            if (cdata) {
              item.component = Object.assign(cdata, {
                childConf: this.relationAllKeys
              })
            }
          }
          data.push(item)
        }
      })
      
      return data
    },
    selfId () {
      return this.typeData.id
    },
    relationAllKeys () {
      const selfId = this.selfId
      const keys = this.allKeys.filter(key => {
        return key !== selfId
      })
      return keys.map(key => {
        return {
          label: key,
          value: key
        }
      })
    },
    isShow() {
      return this.show && this.confData.length > 0
    }
  },
  watch: {
    index () {
      this.changConfModel()
    },
    confId () {
      this.changConfModel()
    },
    typeData (newVal = {}) {
      this.componentType = newVal.type
    }
  },
  methods: {
    changConfModel () {
      this.confModel = {}
      this.initConfModel()
    },
    initConfModel () {
      let res = {}
      const typeData = this.typeData
      const confData = this.confData
      const confModel = this.confModel || {}
      confData.forEach(item => {
        const key = item.key
        const type = item.type
        let val = type && typeData[type] ? typeData[type][key] : undefined
        if (val === undefined) {
          let defaultVal = typeData[key]
          if (defaultVal === undefined) {
            defaultVal = confModel[key] !== undefined ? confModel[key] : (item.default !== undefined ? item.default : null)
          }
          val = defaultVal
        }
        val = val && item.parse === true ? JSON.stringify(val) : val // 需要解析的
        res[key] = val
      })
      this.confModel = res
    },
    clickShow (show = false) {
      this.show = show
    },
    saveConf () {
      const allData = this.$allData
      let err = []
      const savedConf = {}
      for (let [key, val] of Object.entries(this.confModel)) {
        const theData = allData.find(item => item.key === key) || {}
        const type = theData.type
        let errArr = this.test(theData.component, val)
        if (errArr.length > 0) {
          const text = theData.component.labelText
          err.push(...errArr.map(msg => text + msg))
        }
        if (err.length > 0) continue
        if (type) {
          savedConf[type] = Object.assign({}, savedConf[type], {
            [key]: val
          })
        } else {
          savedConf[key] = (theData.parse === true && val) ? JSON.parse(val) : val
        }
      }
      if (err.length > 0) {
        alert(err.join('\n'))
        this.setSaveLoading()
        return
      }
      const bind = savedConf.bind || {}
      let allowCreate = !!bind.allowCreate
      const createObj = {
        allowCreate,
        filterable: allowCreate,
        defaultFirstOption: allowCreate
      }
      savedConf.bind = Object.assign({}, savedConf.bind, createObj)
      this.updateConf(savedConf)
    },
    setSaveLoading(loading = false) {
      this.confSaveLoading = loading
    },
    setDelLoading(loading = false) {
      this.confDelLoading = loading
    },
    test (component, val) { // 校验
      const rules = component.rules
      let err = []
      if (rules) {
        if (rules.required === true) {
          if (!val) {
            err.push('不能为空')
          }
        }
        if (rules.reg) {
          if (!rules.reg.test(val)) {
            err.push(rules.err)
          }
        }
        if(rules.validator) {
          const errMsg = rules.validator(val)
          if (errMsg) err.push(errMsg)
        }
      }
      return err
    },
    confTest (component, valArr = []) {
      let err = []
      if(component.bind && component.bind.conf) {
        const childrenComponent = component.bind.conf[this.componentType]
        if(!Array.isArray(valArr) || valArr.length <= 0 ) return null
        for (let childComponent of childrenComponent) {
          for(let item of valArr) {
            const errArr = this.test(childComponent, item[childComponent.key])
            if(errArr.length > 0) err.push(...errArr)
          }
        }
      }
      return err
    },
    delConf () {
      this.setDelLoading(true)
      this.updateConf()
      this.clickShow()
      this.setDelLoading()
    },
    handleConf ({confData = {}, confId, allKeys = [], confIndex = -1, isShow = true} = {}) {
      this.clickShow(isShow)
      this.allKeys = allKeys
      this.confId = confId
      this.typeData = confData
      this.index = confIndex
      this.clickShow(true)
    },
    updateConf(data) { // data 为空代表删除
      this.$eventBus.$emit('updateComponentConf:' + this.confId, data, this.confId)
    }
  },
  created () {
    this.$eventBus.$on('beforeComponentConf', this.handleConf)
  },
  beforeDestroy () {
    this.$eventBus.$off('beforeComponentConf', this.handleConf)
  }
}
</script>

<style lang="less">
@componentsWidth:70px;
.active-form-conf {
  .form-conf-li{
    width: 100%;
    padding: 2px 0;
  }
  .component-conf-style{
    width: 100%;
    .component-label {
      width:@componentsWidth;
    }
    .component-content{
      width: calc(100% - @componentsWidth);
      > span > i{
        font-weight: 600;
      }
    }
  }
}
</style>