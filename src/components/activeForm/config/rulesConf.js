import {patternList} from './rulesPattern'

const required = () => ({ // 是否必填
  key: 'required',
  default: false,
  component: {
    type: 'switch'
  }
})
import { allComponentTypes } from './typeToComponent'

const message = () =>({ // 提示信息
  key: 'message',
  component: {
    type: 'inputArea',
    bind: {
      placeholder: '请输入错误提示信息'
    },
    rules: {
      required: true
    }
  }
})

const trigger = () => ({ //触发类型
  key: 'trigger',
  default: 'blur',
  component: {
    type: 'select',
    childConf: [
      { label:'选择触发器类型', value: 'null', disabled: true},
      { label:'blur', value: 'blur'},
      { label:'change', value: 'change'}
    ],
    rules: {
      required: true
    }
  }
})

const min = () => ({
  key: 'min',
  component: {
    type: 'inputNumber'
  }
})

const max = () => ({
  key: 'max',
  component: {
    type: 'inputNumber'
  }
})

const type = (defVal) => ({
  key: 'type',
  default: defVal,
  component: {
    type: 'select',
    childConf: [
      { label:'选择数据类型', value: 'null', disabled: true},
      { label:'number', value: 'number'},
      { label:'date', value: 'date'},
      { label:'array', value: 'array'}
    ]
  }
})

// 自定义校验
const validator = () =>({
  key: 'validator',
  component: {
    type: 'inputArea',
    labelText: '自定义校验',
    bind: {
      placeholder: '只允许定义函数(勿使用 ES6 语法) function(){}'
    },
    rules: {
      validator: (val) => {
        let err = null
        if(!val) return val
        // 校验时使用空函数
        // const [callback, hideField, showField] = Array.from({lenght: 3}, () => {
        //   return () => {}
        // })
        try {
          const userValidator = eval(val)
          if (typeof userValidator !== 'function') {
            err = '只允许定义函数'
          }
        } catch (e) {
          err = '自定义函数错误'
          console.error(e) // eslint-disable-line
        }
        return err
      }
    }
  }
})

// 增强正则校验
const pattern = () => ({
  key: 'pattern',
  component: {
    type: 'select',
    childConf: patternList
  }
})

let componentsRules = {
  radio: [ // 单选框

  ],
  checkbox: [ // 多选框

  ],
  input: [ // 输入框

  ],
  inputArea: [ // 文本框

  ],
  inputNumber: [ // 计数器
    min(), max(), type('number')
  ],
  select: [ // 选择器

  ],
  cascader: [ // 级联选择器

  ],
  switch: [ // 开关

  ],
  slider: [ // 滑块

  ],
  timePicker: [ // 时间选择器

  ],
  datePicker: [ // 日期选择器

  ],
  dateTimePicker: [ // 日期时间选择器

  ],
  upload: [ // 文件上传

  ],
  rate: [ // 评分

  ],
  colorPicker: [ // 颜色选择器

  ],
  transfer: [ // 穿梭框

  ]
}

const defRulesSet = () => {
  return [
    message(), required(), type(), pattern(), trigger(), validator()
  ]
}

allComponentTypes.forEach(key => {
  let item = componentsRules[key] || []
  item.push(...defRulesSet())
  componentsRules[key] = item
})

export default componentsRules