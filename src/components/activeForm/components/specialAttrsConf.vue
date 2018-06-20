<template>
  <div class='special-attrs-conf'>
    <template v-for='(item, index) in predictData'>
      <el-row :key='"row" + index'>
        <el-col v-for='(rowItem, i) in conf' :span='rowItem.span' :key='"column" + i'>
          <formIndex v-model='modelData[index][rowItem.key]' :formData='rowItem.component' />
        </el-col>
        <el-col :span="sapnHandle">
          <div class='sapnHandle'>
            <i class="el-icon-circle-plus-outline" @click='addNewRow(index)'></i>
            <i class="el-icon-remove-outline" @click='removeRow(index)'></i>
          </div>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
import formIndex from './formIndex'
export default {
  name:'specialAttrsConf',
  component: {formIndex},
  props: {
    value: '',
    conf: {
      type: Array,
      default: () => {
        return [
          {
            key: 'label',
            component: {
              type: 'input'
            },
            required: true,
            default: ''
          }, {
            key: 'value',
            component: {
              type: 'input',
              text: 'value'
            },
            required: true,
            default: '123'
          }
        ]
      }
    },
    confData: {
      type: Array,
      default: () => [{'label': 'test-label', 'value': 'test-value'}]
    }
  },
  data () {
    return {
      sapnHandle: 4,
      predictData: [],
      confKeys: [],
      modelData: {}
    }
  },
  computed: {
    confData111: {
      get () {
        return this.value || [{'label': 'test-label', value: 'test-value'}]
      },
      set (newVal) {
        this.$emit('input', newVal)
      }
    },

  },
  methods: {
    initData () {
      const conf = this.conf
      const confLen = conf.length
      const spanMax = 24
      const spanDef = Math.floor((spanMax - this.sapnHandle) / Math.max(confLen, 1))
      const defComponentConf = {
        type: 'input'
      }
      conf.forEach(item => {
        const key = item.key
        this.confKeys.push(key)
        item.component = Object.assign({text: key}, defComponentConf, item.component)
        item.span = item.span || spanDef
      });
      const predictData = this.predictData
      if (predictData.length <= 0) {
        this.addNewRow()
      } else {
        this.handleModle()
      }
    },
    handleModle (changeIndex = -1, isAdd = true) {
      const AmendmentNum = changeIndex === -1 ? 0 : (isAdd === true ? 1 : -1) // 修改正值
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
  },
  created () {
    const data = this.confData || []
    this.predictData = data.map(item => {
      return {...item}
    })
    this.initData()
  }
}
</script>

<style lang="less">
.special-attrs-conf{
  .sapnHandle{
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
}
</style>

