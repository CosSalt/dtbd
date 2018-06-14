<template>
  <div class="active-form-conf" v-show='show'>
    <ul>
      <li v-for='item in typeData' :key='item.key' class='form-conf-li'>
        <div v-text='item.name + ": "' class='form-conf-line' />
        <component :is="item.component" v-model.trim='confModel[item.key]' v-bind='item.bind' class='form-conf-component' size="mini">
          <template v-if='item.child'>
            <component v-for='(childItem, index) in item.child.data' :key='"child" + index' v-bind='childItem' 
              :is="item.child.component"
              class='form-conf-component'
              size="mini"
            />
          </template>
        </component>
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
export default {
  name: 'activeFormConf',
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    confData: {
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
      type: null,
      confModel: {}
    }
  },
  computed: {
    typeData () {
      const filterData = this.allData
      // const type = this.confData.type
      // console.log(type)
      return filterData
    }
  },
  watch: {
    index () {
      this.initConfModel()
    }
  },
  methods: {
    initConfModel () {
      const res = {}
      const confData = this.confData
      const typeData = this.typeData
      typeData.forEach(item => {
        const key = item.key
        const type = item.type
        let val = type ? (confData[type] ? confData[type][key] : null) : confData[key]
        val = val && item.parse === true ? JSON.stringify(val) : val // 需要解析的
        console.log(key,val)
        res[key] = val
      })
      this.confModel = res
    },
    initAllData () {
      let data = [
        {
          name: 'ID',
          key: 'id',
          bind: {
            placeholder: '请输入以字母 _ $ 开头的ID'
          },
          test: {
            reg: /^[a-zA-Z_$][a-zA-Z_$\d]*$/,
            err: '只能以字母 _ $ 开头, 后面可包含数字',
            required: true
          }
        },{
          name: '选择值',
          key: 'label',
          type: 'bind',
          bind: {
            placeholder: '必填'
          },
          test: {
            required: true
          }
        },{
          name: '文字',
          key: 'text',
          test: {
            required: true
            // reg: /\S+/,
            // err: '不能为空'
          }},
        // {name: '后文字', key: 'afterText'},
        {name: '宽度', key: 'width'},
        {name: '大小',
          key: 'size',
          component: 'el-select',
          type: 'bind',
          child: {
            component: 'el-option',
            data: [
              {label: '请选择', disabled: true, value:''},
              {label: '大', value: 'medium'},
              {label: '中', value: 'small'},
              {label: '小', value: 'mini'}
            ]
          }
        },
        {
          name: '配置',
          key: 'multiConf',
          parse: true, // 解析
          bind: {
            type: "textarea",
            placeholder: 'JSON格式 例如:[{"label":"x","text":"测试"}]'
          },
          test: {
            validator: (val) => {
              let err = null
              if(!val) return err
              let res
              try {
                res = JSON.parse(val)
              } catch (e) {
                err = '数据格式不满足JSON格式要求'
                return err
              }
              if (!Array.isArray(res)) {
                err = '必须为数组'
              } else if (res.length > 0) {
                for (let item of res) {
                  if (typeof item !== 'object' || item == null) {
                    err = '数组内必须为对象'
                    break
                  }
                }
              }
              return err
            }
          }
        }
      ]
      const defConf = {
        component: 'el-input',
        bind: {}
      }
      data = data.map(item => {
        return defaultsDeep(defConf, item)
      })
      return data
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
        if (!err) {
          err = this.test(theData.test, val)
        }
        if (err) {
          err = theData.name + ': ' + err
          break
        }
        if (val != null) {
          if (type) {
            savedConf[type] = Object.assign({}, savedConf[type], {
              [key]: val
            })
          } else {
            savedConf[key] = theData.parse === true ? JSON.parse(val) : val
          }
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
    }
  },
  created () {
    this.allData = this.initAllData()
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
  .form-conf-component{
    width: calc(100% - @componentsWidth);
  }
  .form-conf-line{
    display: inline-block;
    text-align: right;
    width: @componentsWidth - 10px;
  }
}
</style>
