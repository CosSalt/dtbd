<template>
  <div class='special-attrs-conf'>
    <el-row>
      <el-col :span="4">
        <div>配置: </div>
      </el-col>
      <el-col :span="spanHandle">
        <div class='spanHandle'>
          <i class="el-icon-circle-plus-outline" @click='addNewRow()'></i>
        </div>
      </el-col>
      <el-col :span="24 - 4 - spanHandle" style='text-align:right;' class='show-attrs-conf'>
        <i :class='{"show-attrs-conf-i": isShowAttrsConf}'
          class='el-icon-arrow-left'
          @click='showAtrrsConf()'
        />
      </el-col>
    </el-row>
    <transition name="attrs-fade">
      <div class='attrs-conf-container' v-show='isShowAttrsConf'>
        <template v-for='(item, index) in predictData'>
          <el-row :key='"row" + index' class='attrs-conf-row'>
            <el-col :span="24" v-for='(rowItem, i) in conf' :key='"column" + i'>
              <formIndex v-model='modelData[index][rowItem.key]' :formData='rowItem.component'/>
            </el-col>
            <el-col :span="spanHandle">
              <div class='spanHandle'>
                <i class="el-icon-circle-plus-outline" @click='addNewRow(index)'></i>
                <i class="el-icon-remove-outline" @click='removeRow(index)'></i>
              </div>
            </el-col>
          </el-row>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
import formIndex from './formIndex'
import {defaultsDeep} from '@/utils'
export default {
  name:'specialAttrsConf',
  component: {formIndex},
  props: {
    value: null,
    formData: {
      required: true,
      type: Object
    },
    componentType: {
      type: String
    },
    keyIndex: null
  },
  data () {
    return {
      spanHandle: 8,
      predictData: [],
      modelData: {},
      isShowAttrsConf: false
    }
  },
  computed: {
    requiredConf () {
      const requiredArr = []
      this.conf.forEach(item => {
        if (item.required === true) {
          requiredArr.push(item.key)
        }
      })
      return requiredArr
    },
    conf () {
      const bind = this.formData.bind || {}
      const confs = bind.conf || {}
      let conf = confs[this.componentType] || []
      const confLen = conf.length
      const spanMax = 24
      const spanDef = Math.floor((spanMax - this.spanHandle) / Math.max(confLen, 1))
      const defComponentConf = {
        type: 'input',
        bind: {
          size: 'mini'
        }
      }
      conf = conf.map(dataItem => {
        let item = {...dataItem}
        item.component = defaultsDeep({labelText: item.key}, defComponentConf, item.component)
        item.span = item.span || spanDef
        return item
      })
      return conf
    },
    confKeys () {
      let data = this.conf
      return data.map(item => {
        return item.key
      })
    }
  },
  watch: {
    modelData:{
      handler () {
        let data = this.modelData
        data.length = this.predictData.length
        data = Array.from(data)
        const requiredConf = this.requiredConf
        data = data.filter(item => {
          let res = true
          for (let key of requiredConf) {
            if (!item[key]) {
              res = false
              break
            }
          }
          return res
        })
        this.$emit('input', data)
      },
      deep: true
    },
    keyIndex: {
      handler () {
        this.showAtrrsConf(true)
        const data = this.value || []
        this.modelData = {}
        this.predictData = data.map(item => {
          return {...item}
        })
        this.initData()
      },
      immediate: true
    }
  },
  methods: {
    showAtrrsConf (isShow= !this.isShowAttrsConf) {
      this.isShowAttrsConf = isShow
    },
    initData () {
      if (this.predictData.length <= 0) {
        this.addNewRow()
      } else {
        this.handleModle()
      }
    },
    handleModle (changeIndex = -1, isAdd = true) {
      const AmendmentNum = isAdd === true ? 1 : -1 // 修改正值
      const modelRes = {}
      const confKeys = this.confKeys
      const predictData = this.predictData
      const oldModelData = this.modelData
      for (let [index, item] of predictData.entries()) {
        modelRes[index] = {}
        const keyIndex = changeIndex + AmendmentNum
        let oldModelIndex = index > keyIndex ? (index - AmendmentNum) : index
        let oldModelItem = !(isAdd === true && index === keyIndex) && oldModelData[oldModelIndex]
        for (let key of confKeys.values()) { // 保存之前的数据
          modelRes[index][key] = (oldModelItem && oldModelItem[key]) || item[key] || null
        }
      }
      this.modelData = modelRes
    },
    addNewRow (index = -1) {
      this.showAtrrsConf(true)
      const newRow = {}
      this.conf.forEach(item => {
        const key = item.key
        newRow[key] = item.default || null
      })
      this.predictData.splice(index + 1 ,0 ,newRow)
      this.handleModle(index)
    },
    removeRow (index) {
      this.predictData.splice(index ,1)
      this.handleModle(index, false)
    }
  }
}
</script>

<style lang="less">
.special-attrs-conf{
  .spanHandle{
    i{
      display: inline-block;
      padding: 3px;
      cursor: pointer;
      border-radius: 5px;
      &:hover{
        background-color: red;
        color: #fff;
      }
    }
  }
  .attrs-conf-container{
    margin-left: 20px;
  }
  .attrs-conf-row {
    border: 2px solid grey;
    box-shadow: 0 0 10px 2px grey;
    padding: 2px;
  }
  .show-attrs-conf{
    i{
      cursor: pointer;
      transition: all 1s;
    }
    .show-attrs-conf-i{
      transform: rotate(-90deg)
    }
  }
  .attrs-fade-enter-active, .attrs-fade-leave-active {
    transition: opacity 1s;
  }
  .attrs-fade-enter, .attrs-fade-leave-to{
    opacity: 0;
  }
}
</style>

