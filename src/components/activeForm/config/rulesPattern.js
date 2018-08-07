
let pattern = [
  {label: '身份证', value: 'valuecard', reg: /^\d{15}(\d[2][0-9xX])?$/
    // reg: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/
  },
  {label: '手机号', value: 'phone', reg: /^1[34578]\d{9}$/},
  {label: '固定电话', value: 'tel', reg: /^0\d{2,3}-\d{7,8}$/},
  {label: '手机或座机', value: 'telorphone', reg: /^(1[34578]\d{9})$|^((0\d{2,3}-\d{7,8}))$/},
  {label: 'ip地址', value: 'ip', reg: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/},
  {label: '邮政编码', value: 'areavalue', reg: /^[1-9]\d{5}$/},
  {label: '密码', value: 'password', reg: /^[a-zA-Z]\w{5,17}$/}, // 以字母开头，长度在6~18之间，只能包含字母、数字和下划线
  {label: '强密码', value: 'hardPassword', reg: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/}, // 必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-10之间
  {label: 'QQ号', value: 'qq', reg: /^[1-9][0-9]{4,}$/, message: 'QQ填写不正确'}
]
// RegexList = {
//   'valuecard': /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
//   'phone': /^1[34578]\d{9}$/,
//   'tel': /^0\d{2,3}-\d{7,8}$/,
//   'telorphone': /^(1[34578]\d{9})$|^((0\d{2,3}-\d{7,8}))$/,
//   'ip': /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
//   'areavalue': /^[1-9]\d{5}$/,
//   'password': /^[a-zA-Z]\w{5,17}$/, // 以字母开头，长度在6~18之间，只能包含字母、数字和下划线
//   'hardPassword': /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/, // 必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-10之间
// }

// pattern = pattern.map(item => {
//   if(!item.message) item.message = item.label + '错误'
//   return item
// })
const patternList = [], patternCheck = [], patternMessage = []
pattern.forEach(item => {
  const {label, value, reg, message = label + '错误'} = item
  patternList.push({label, value})
  patternCheck.push({value, reg, message})
  patternMessage.push({value, message})
})

export {
  patternList,
  patternCheck,
  patternMessage
}