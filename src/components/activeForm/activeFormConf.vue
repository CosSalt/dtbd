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
import {defaultsDeep} from '@/utils'
import componentConf from './config/formComponentConf'
import typeShowConf from './config/typeShowConf'
export default {
  name: 'activeFormConf',
  beforeCreate () {
    this.$allData = componentConf
  },
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
    },
    allKeys: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      attrConf: [],
      componentType: null,
      confModel: {},
      confSaveLoading: false,
      confDelLoading: false
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
    }
  },
  watch: {
    index () {
      this.confModel = {}
      this.initConfModel()
    },
    typeData (newVal = {}) {
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
    clickShow (show = false) {
      this.$emit('update:show', show)
    },
    saveConf () {
      // this.setSaveLoading(true)
      const allData = this.$allData
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
        this.setSaveLoading()
        return
      }
      const bind = savedConf.bind || {}
      let allowCreate = bind.allowCreate
      const createObj = {
        allowCreate,
        filterable: allowCreate,
        defaultFirstOption: allowCreate
      }
      savedConf.bind = Object.assign({}, savedConf.bind, createObj)
      this.$emit('saveComponent', this.index, savedConf)
    },
    setSaveLoading(loading = false) {
      this.confSaveLoading = loading
    },
    setDelLoading(loading = false) {
      this.confDelLoading = loading
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
      this.setDelLoading(true)
      this.$emit('delComponent', this.index)
      this.clickShow()
      this.setDelLoading()
    },
    getKey (rowIndex , columnIndex) {
      return "row_" + rowIndex + "_column_" + columnIndex
    }
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
