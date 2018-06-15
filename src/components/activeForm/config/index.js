import {defaultsDeep} from '@/utils'

let componentsConf = [
  {
    type: 'radio',
    name: '单选框',
    bind: { // 使用v-bind的属性
      label: 'a'
    },
    text: '备选项',
    multiConf: [{label: 'b', text:'备选项2'}] // 同一级多行配置
  }, {
    type: 'checkbox',
    name: '多选框',
    bind: {
      label: '多选框'
    },
    multiConf: [{label: '多选框二'}]
  }, {
    type: 'input',
    name: '输入框',
    text: '输入框：',
    bind: {
      placeholder: '请输入内容'
    }
  }, {
    type: 'inputNumber',
    name: '计数器',
    text: '计数器：'
  }, {
    type: 'select',
    name: '选择器',
    text: '选择器：',
    bind: {
      placeholder: '请输入内容'
    },
    childConf: [{
        label:'选项1', value: '双皮奶'
      }, {
        label:'选项2', value: '红烧肉'
      }
    ]
  }, {
    type: 'cascader',
    name: '级联选择器',
    text: '级联选择',
    bind: {
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }
    ]}
  }, {
    type: 'switch',
    name: '开关',
    text: '开关',
    bind: {
      activeColor: '#13ce66',
      inactiveColor: '#ff4949'
    }
  }, {
    type: 'slider',
    name: '滑块',
    text: '滑块'
  }, {
    type: 'timePicker',
    name: '时间选择器',
    text: '时间选择器',
    bind: {
      placeholder: '选择时间',
      pickerOptions: {
        start: '12:30',
        step: '01:00',
        end: '18:30'
      }
    }
  }, {
    type: 'datePicker',
    name: '日期选择器',
    text: '日期选择器',
    bind: {
      placeholder: '选择日期'
    }
  }, {
    type: 'dateTimePicker',
    name: '日期时间选择器',
    text: '日期时间选择器',
    bind: {
      placeholder: '选择时间日期'
    }
  }, {
    type: 'upload',
    nam: '上传',
    disabled: true
  }, {
    type: 'rate',
    name: '评分',
    text: '评分',
    bind: {
      colors: ['#99A9BF', '#F7BA2A', '#FF9900']
    }
  }, {
    type: 'colorPicker',
    name: '颜色选择器',
    text: '颜色选择器'
  }, {
    type: 'transfer',
    name: '穿梭框',
    text: '穿梭框',
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