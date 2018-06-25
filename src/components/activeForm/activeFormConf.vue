<template>
  <div class="active-form-conf" v-if='show'>
    <ul>
      <li v-for='item in confData' :key='item.key' class='form-conf-li'>
        <formIndex
          class='component-conf-style'
          v-model.trim='confModel[item.key]'
          :formData='item.component'
          :componentType='componentType'
          :keyIndex='index'
        />
        <!-- :key='getKey(index, i)' -->
      </li>
    </ul>
    <div>
      <el-button type="primary" size="mini" @click='saveConf'>保存</el-button>
      <el-button type="warning" size="mini" @click='delConf'>删除</el-button>
    </div>
  </div>
</template>

<script>
import {defaultsDeep} from '@/utils'
import componentConf from './config/formComponentConf'
import typeShowConf from './config/typeShowConf'
export default {
  name: 'activeFormConf',
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    typeData: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allData: [],
      attrConf: [],
      componentType: null,
      confModel: {}
    }
  },
  computed: {
    confData () {
      const allData = this.allData || []
      const TheType = this.typeData.type
      const showConf = typeShowConf[TheType]
      let data = []
      showConf.forEach(type => {
        let item = allData.find(item => item.key === type)
        if (item) {
          data.push(item)
        }
      })
      return data
    }
  },
  watch: {
    index () {
      this.confModel = {}
      this.initConfModel()
    },
    typeData (newVal) {
      this.componentType = newVal.type
    }
  },
  methods: {
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
    defDeep (...args){
      return defaultsDeep(...args)
    },
    initAllData () {
      return componentConf
    },
    clickShow (show = false) {
      this.$emit('update:show', show)
    },
    saveConf () {
      const allData = this.allData
      let err = null
      const savedConf = {}
      for (let [key, val] of Object.entries(this.confModel)) {
        const theData = allData.find(item => item.key === key) || {}
        const type = theData.type
        err = this.test(theData.test, val)
        if (err) {
          err = theData.component.labelText + err
          break
        }
        if (type) {
          savedConf[type] = Object.assign({}, savedConf[type], {
            [key]: val
          })
        } else {
          savedConf[key] = (theData.parse === true && val) ? JSON.parse(val) : val
        }
      }
      if (err) {
        alert(err)
        return
      }
      this.$emit('saveComponent', this.index, savedConf)
    },
    test (test, val) {
      let err = null
      if (test) {
        if (test.required === true) {
          if (!val) {
            err = '不能为空'
          }
        }
        if (!err && test.reg) {
          if (!test.reg.test(val)) {
            err = test.err
          }
        }
        if(!err && test.validator) {
          err = test.validator(val)
        }
      }
      return err
    },
    delConf () {
      this.$emit('delComponent', this.index)
      this.clickShow()
    },
    getKey (rowIndex , columnIndex) {
      return "row_" + rowIndex + "_column_" + columnIndex
    }
  },
  created () {
    this.allData = this.initAllData()
    window.abc = this.attrConf
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
    }
  }
}
</style>
