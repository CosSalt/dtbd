import { allComponentTypes } from './typeToComponent'
const ID = 'id'
const Text = 'text'
const Label = 'label'
const Disabled = 'disabled'
const Placeholder = 'placeholder'
const MultiConf = 'multiConf' // 多行
const ChildConf = 'childConf' // 子项
const Multiple = 'multiple' // 多选
const AllowCreate = 'allowCreate' // 允许新增
const Step = 'step'
const Min = 'min'
const Max = 'max'
const LabelText = 'labelText'
const Action = 'action' // 异步获取数据 Api
const RelationIds = 'relationIds' // 异步获取数据关联ID
const Rules = 'rules' // 校验规则
const Validator = 'validator' // 自定义校验
// const Type = 'type'
const showConfItems = {
  'radio': [ // 单选框
    Text, Label, Disabled, MultiConf
  ],
  'checkbox': [ // 多选框
    Text, Label, Disabled, MultiConf
  ],
  'input': [ // 输入框
    Placeholder, Disabled
  ],
  'inputArea': [ // 文本框
    Placeholder, Disabled
  ],
  'inputNumber': [ // 计数器
    Step, Min, Max, 'precision', Disabled
  ],
  'select': [ // 选择器
    Multiple, Action, RelationIds, Disabled, AllowCreate, ChildConf
  ],
  'cascader': [ // 级联选择器
    
  ],
  'switch': [ // 开关
    'activeValue', 'inactiveValue', Disabled // active-value: switch 打开时的值; inactive-value: switch 关闭时的值
  ],
  'slider': [ // 滑块
    Step, Min, Max, 'range', 'showInput', Disabled
  ],
  'timePicker': [ // 时间选择器
    Placeholder, Disabled
  ],
  'datePicker': [ // 日期选择器
    'format', Placeholder, Disabled
  ],
  'dateTimePicker': [ // 日期时间选择器

  ],
  'upload': [ // 上传
    
  ],
  'rate': [ // 评分
    Max, 'allowHalf', Disabled
  ],
  'colorPicker': [ // 颜色选择器
    Disabled
  ],
  'transfer': [ // 穿梭框
    
  ],
  'tabs': [
    ChildConf
  ]
}

const baseTypes = [Validator]

for (let key of allComponentTypes) {
  let item = showConfItems[key]
  if (item) {
    if (key === 'tabs') continue
    if (item.findIndex(val => val === ID) < 0){
      item.unshift(ID, LabelText)
    } else {
      item.unshift(LabelText)
    }
    if(item.findIndex(val => val === Disabled) < 0) {
      item.push(Disabled)
    }
    if(item.findIndex(val => val === Rules) < 0) {
      item.push(Rules)
    }
  } else {
    showConfItems[key] = [ID, LabelText, Disabled, Rules]
  }
  showConfItems[key].push(...baseTypes)
}

export default showConfItems