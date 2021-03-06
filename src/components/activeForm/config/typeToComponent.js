const components = {
  'radio': { // 单选框
    component: 'formRadio'
  },
  'checkbox': { // 多选框
    component: 'formCheckbox'
  },
  'input': { // 输入框
    // component: 'formCommon',
    baseCompoent: 'el-input' // formCommon 内部会调用 baseCompoent
  },
  'inputArea': { // 文本框
    baseCompoent: 'el-input'
  },
  'inputNumber': { // 计数器
    baseCompoent: 'el-input-number'
  },
  'select': { // 选择器
    component: 'formSelect'
  },
  'cascader': { // 级联选择器
    component: 'formCascader'
  },
  'switch': { // 开关
    baseCompoent: 'el-switch'
  },
  'slider': { // 滑块
    baseCompoent: 'el-slider'
  },
  'timePicker': { // 时间选择器
    baseCompoent: 'el-time-select'
  },
  'datePicker': { // 日期选择器
    baseCompoent: 'el-date-picker'
  },
  'dateTimePicker': { // 日期时间选择器
    baseCompoent: 'el-date-picker',
  },
  'upload': { // 上传
    baseCompoent: 'el-upload'
  },
  'rate': { // 评分
    baseCompoent: 'el-rate'
  },
  'colorPicker': { // 颜色选择器
    baseCompoent: 'el-color-picker'
  },
  'transfer': { // 穿梭框
    baseCompoent: 'el-transfer'
  },
  'attrsConf': {
    component: 'specialAttrsConf'
  },
  'tabs': {
    component: 'navigationTabs'
  }
}
const allTypes = []
for (let [key, item] of Object.entries(components)) {
  allTypes.push(key)
  if (!item.component) {
    item.component = 'formCommon'
  }
}

const anKaType = [
  {val:"01", type: "Input", to: 'input'},
  {val:"02", type: "Date", to: 'datePicker'},
  {val:"03", type: "Time", to: 'timePicker'},
  {val:"04", type: "Number", to: 'inputNumber'},
  {val:"05", type: "Bool", to: ''},
  {val:"06", type: "Image", to: 'upload'},
  {val:"12", type: "File", to: 'upload'},
  {val:"13", type: "Blob", to: ''},
  {val:"31", type: "Code", to: ''},
  {val:"32", type: "Codes", to: ''},
  {val:"33", type: "AYcode", to: ''},
  {val:"34", type: "AYcodes", to: ''},
  {val:"35", type: "DWCode", to: ''},
  {val:"36", type: "DWCodes", to: ''}
]

const anKaTypeToComponent = (type, defaultType = 'input') => {
  const typeItem = anKaType.find(item => item.type === type)
  if (typeItem) {
    type = typeItem['to'] || defaultType
  }
  return components[type] || components['select']
}

export {
  allTypes as allComponentTypes,
  anKaTypeToComponent
}
export default components