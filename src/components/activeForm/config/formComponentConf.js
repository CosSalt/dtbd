import {defaultsDeep} from '@/utils'
const conf = [
  {
    key: 'id',
    component: {
      text: 'ID: ',
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
    key: 'text',
    component: {
      text: 'text: ',
      bind: {
        placeholder: '文字'
      }
    }
  }, {
    key: 'label',
    type: 'bind', // type 是用来表示层级的,如type: 'bind'表示最后保存数据时,要保存在对象的bind属性上
    component: {
      text: 'label: ',
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
      text: '大小: ',
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
    parse: true, // 解析
    component: {
      text: '配置',
      bind: {
        type: "textarea",
        placeholder: 'JSON格式 例如:[{"label":"x","text":"测试"}]'
      }
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