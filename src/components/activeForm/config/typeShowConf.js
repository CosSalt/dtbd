const ID = 'id'
const Text = 'text'
const Label = 'label'
const Disabled = 'disabled'
const Placeholder = 'placeholder'
const MultiConf = 'multiConf' // 多行
const ChildConf = 'childConf' // 子项
const Multiple = 'multiple' // 多选
const Step = 'step'
const Min = 'min'
const Max = 'max'
// const Type = 'type'
const showConfItems = {
  'radio': [ // 单选框
    Text, Label, MultiConf, Disabled
  ],
  'checkbox': [ // 多选框
    Label, MultiConf, Disabled
  ],
  'input': [ // 输入框
    Text, Placeholder, Disabled
  ],
  'inputNumber': [ // 计数器
    Text, Step, Min, Max, 'precision', Disabled
  ],
  'select': [ // 选择器
    Text, Multiple, ChildConf, Disabled
  ],
  'cascader': [ // 级联选择器
    Text
  ],
  'switch': [ // 开关
    Text, 'activeValue', 'inactiveValue', Disabled // active-value: switch 打开时的值; inactive-value: switch 关闭时的值
  ],
  'slider': [ // 滑块
    Text, Step, Min, Max, 'range', 'showInput', Disabled
  ],
  'timePicker': [ // 时间选择器
    Text, Placeholder, Disabled
  ],
  'datePicker': [ // 日期选择器
    Text, 'format', Placeholder, Disabled
  ],
  'dateTimePicker': [ // 日期时间选择器

  ],
  'upload': [ // 上传
    
  ],
  'rate': [ // 评分
    Text, Max, 'allowHalf', Disabled
  ],
  'colorPicker': [ // 颜色选择器
    Text, Disabled
  ],
  'transfer': [ // 穿梭框
    
  ]
}
for (let [key, item] of Object.entries(showConfItems)) {
  if (item) {
    if (item.findIndex(val => val === ID) < 0){
      item.unshift(ID)
    }
    if(item.findIndex(val => val === Disabled) < 0) {
      item.push(Disabled)
    }
  } else {
    showConfItems[key] = [ID, 'text', Disabled]
  }
}
export default showConfItems