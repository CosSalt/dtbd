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
    baseCompoent: 'el-cascader'
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
  }
}
const allTypes = []
for (let [key, item] of Object.entries(components)) {
  allTypes.push(key)
  if (!item.component) {
    item.component = 'formCommon'
  }
}
export {
  allTypes as allComponentTypes
}
export default components