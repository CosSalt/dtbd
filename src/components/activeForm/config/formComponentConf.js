import {defaultsDeep} from '@/utils'
const conf = [
  {
    key: 'id',
    component: {
      labelText: 'ID: ',
      bind: {
        placeholder: '请输入以字母 _ $ 开头的ID'
      }
    },
    test: {
      reg: /^[a-zA-Z_$][a-zA-Z_$\d]*$/,
      err: '只能以字母 _ $ 开头, 后面可包含数字',
      required: true
    }
  }, {
    key: 'labelText',
    component: {
      labelText: 'LabelText: ',
      bind: {
        placeholder: '提示文字'
      }
    },
    test: {
      required: true
    }
  },{
    key: 'text',
    component: {
      labelText: 'text: ',
      bind: {
        placeholder: '文字'
      }
    }
  }, {
    key: 'label',
    type: 'bind', // type 是用来表示层级的,如type: 'bind'表示最后保存数据时,要保存在对象的bind属性上
    component: {
      labelText: 'label: ',
      bind: {
        placeholder: '必填'
      }
    },
    test: {
      required: true
    }
  }, {
    key: 'size',
    component: {
      type: 'select',
      labelText: '大小: ',
      childConf: [
        {label: '请选择', disabled: true, value:''},
        {label: '大', value: 'medium'},
        {label: '中', value: 'small'},
        {label: '小', value: 'mini'}
      ]
    },
    type: 'bind',
    disabled: true
  }, {
    key: 'multiConf',
    component: {
      type: 'attrsConf',
      labelText: '配置',
      bind: {
        // type: "textarea",
        // placeholder: 'JSON格式 例如:[{"label":"x","text":"测试"}]',
        conf: {
          'radio': [
            {
              key: 'label',
              component: {
                type: 'input'
              },
              required: true,
            }, {
              key: 'text',
              component: {
                type: 'input',
                text: 'text'
              },
              required: true
              // default: '123'
            }
          ],
          'checkbox': [
            {
              key: 'label',
              component: {
                type: 'input'
              },
              required: true
            }, {
              key: 'text',
              component: {
                type: 'input',
                text: 'text'
              },
              required: false
            }
          ]
        }
      }
    },
    test: {
      validator: (val) => {
        let err = null
        if(!val) return val
        if (!Array.isArray(val)) {
          err = '必须为数组'
        } else if (val.length > 0) {
          for (let item of val) {
            if (typeof item !== 'object' || item == null) {
              err = '数组内必须为对象'
              break
            }
          }
        }
        return err
      }
    }
  }, {
    key: 'childConf',
    component: {
      type: 'attrsConf',
      labelText: '配置',
      bind: {
        conf: {
          'select': [
            {
              key: 'label',
              component: {
                type: 'input'
              },
              required: true,
            }, {
              key: 'value',
              component: {
                type: 'input',
                labelText: 'value'
              },
              required: true
            }
          ]
        }
      }
    }
  }, {
    key: 'multiple',
    default: false,
    component: {
      type: 'switch',
      labelText: '多行',
      bind: {
        activeColor: '#13ce66',
        activeIconClass: 'el-icon-check',
        inactiveColor: '#ff4949',
        inactiveIconClass: 'el-icon-close'
      }
    }
  }, {
    key: 'disabled',
    default: false,
    component: {
      type: 'switch',
      labelText: '禁用',
      bind: {
        activeColor: '#13ce66',
        activeIconClass: 'el-icon-check',
        inactiveColor: '#ff4949',
        inactiveIconClass: 'el-icon-close'
      }
    }
  }
]
const defConf = {
  component: {
    type: 'input',
    bind: {
      size: 'mini'
    }
  }
}
// component 的数据用于生成组件
const data = conf.map(item => {
  return defaultsDeep(defConf, item)
})

export default data.filter(item => {
  return item.disabled !== true
})