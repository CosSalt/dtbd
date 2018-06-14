import {defaultsDeep} from '@/utils'

let componentsConf = [
  {
    type: 'radio',
    name: '单选框',
    component: 'formRadio',
    bind: { // 使用v-bind的属性
      label: 'a'
    },
    text: '备选项',
    multiConf: [{bind:{label: 'b'}, text:'备选项2'}] // 同一级多行配置
  }, {
    type: 'checkbox',
    name: '多选框',
    component: 'formCheckbox',
    bind: {
      label: '多选框'
    },
    multiConf: [{bind:{label: '多选框二'}}]
  }, {
    type: 'input',
    name: '输入框',
    component: 'formCommon',
    baseCompoent: 'el-input', // formCommon 内部会调用 baseCompoent
    text: '输入框：',
    bind: {
      placeholder: '请输入内容'
    }
  }, {
    type: 'inputNumber',
    name: '计数器',
    component: 'formCommon',
    baseCompoent: 'el-input-number',
    text: '计数器：'
  }, {
    type: 'select',
    name: '选择器',
    component: 'formCommon',
    baseCompoent: 'el-select',
    bind: {
      placeholder: '请输入内容'
    },
    disabled: true
  }, {
    type: 'cascader',
    name: '级联选择器',
    component: 'el-cascader',
    disabled: true
  }, {
    type: 'switch',
    name: '开关',
    component: 'formCommon',
    baseCompoent: 'el-switch',
    disabled: true
  }, {
    type: 'slider',
    name: '滑块',
    component: 'el-slider',
    disabled: true
  }, {
    type: 'timePicker',
    name: '时间选择器',
    component: 'el-time-select',
    disabled: true
  }, {
    type: 'datePicker',
    name: '日期选择器',
    component: 'el-date-picker',
    disabled: true
  }, {
    type: 'dateTimePicker',
    name: '日期时间选择器',
    component: 'el-date-picker',
    bind: {
      type: 'datetime'
    },
    disabled: true
  }, {
    type: 'upload',
    nam: '上传',
    component: 'el-upload',
    disabled: true
  }, {
    type: 'rate',
    name: '评分',
    component: 'el-rate',
    disabled: true
  }, {
    type: 'colorPicker',
    name: '颜色选择器',
    component: 'el-color-picker',
    disabled: true
  }, {
    type: 'transfer',
    name: '穿梭框',
    component: 'el-transfer',
    disabled: true
  }
]
// 默认的属性
const defProps = {
  // data: {},
  multi: false, // 多行,如radio,checkbox
  bind: {
    size: 'mini'
  }
}

componentsConf = componentsConf.map(item => {
  return defaultsDeep(defProps, item)
})

export default componentsConf.filter(item => item.disabled !== true)
