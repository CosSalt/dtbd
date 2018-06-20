<template>
  <div>
    <template v-for='(item, index) in predictData'>
      <el-row :key='"row" + index'>
        <el-col v-for='(rowItem, i) in conf' :span='item.span' :key='"column" + i'>
          <formIndex v-model='modelData[index][rowItem.key]' :formData='rowItem.component' />
        </el-col>
        <el-col :span="sapnHandle">
          <div class='test'>
            1
            <i class="l-icon-remove-outline"></i>
            <i class="el-icon-circle-plus-outline"></i>
            <i class="l-icon-remove-outline"></i>
            2
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
              type: 'input',
              text: 'label'
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
      sapnHandle: 2,
      predictData: this.confData || [],
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
      // const data = this.predictData
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
        item.component = Object.assign(defComponentConf, {text: key}, item.component)
        item.span = item.span || spanDef
      });
      const predictData = this.predictData
      if (predictData.length <= 0) {
        this.addNewRow()
      } else {
        this.handleModle()
      }
    },
    handleModle () {
      const modelRes = {}
      const confKeys = this.confKeys
      const predictData = this.predictData
      for (let [index, item] of predictData.entries()) {
        modelRes[index] = {}
        for (let key of confKeys.values()) {
          modelRes[index][key] = item[key] || null
        }
      }
      this.modelData = modelRes
      window.as = modelRes
    },
    addNewRow (index = -1) {
      const newRow = {}
      this.conf.forEach(item => {
        const key = item.key
        newRow[key] = item.default || null
      })
      if (index >= 0) {
        this.predictData.splice(index ,0 ,newRow)
      } else {
        this.predictData.push(newRow)
      }
      this.handleModle()
    }
  },
  created () {
    this.initData()
  }
}
</script>
