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
    type: 'input',
    bind: {
      placeholder: '请输入错误提示信息',
      type: 'textarea'
    }
  },
  required: true
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
    ]
  },
  required: true
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
    type: 'select'
  },
  childConf: [
    { label:'选择数据类型', value: 'null', disabled: true},
    { label:'number', value: 'number'},
    { label:'date', value: 'date'},
    { label:'array', value: 'array'}
  ]
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
    message(), required(), trigger()
  ]
}

allComponentTypes.forEach(key => {
  let item = componentsRules[key] || []
  item.push(...defRulesSet())
  componentsRules[key] = item
})

export default componentsRules