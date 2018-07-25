var object = require('lodash/fp/object')
// defaultsDeep:
// 有效的为两个参数,传入一个参数时,返回一个函数
// 类似于$.extend 后面的参数值会覆盖前面的参数的值
const {defaultsDeep} = object
// 此方式获取的 defaultsDeep 与下面获取到的 defaultsDeep 表现并不一致
// const _ = require('lodash')
// defaultsDeep = _.defaultsDeep // 类似 defaultsDeep = require('lodash/defaultsDeep')

const getTempId = (index, type = '') => { // 获取一个临时的 ID
  type = !type ? '' : type + '_'
  return '$_temp_' + type + 'id_' + index
}

const isNullOrEmpty = (str, trim = true) => {
  let res = str == null
  if (!res && typeof str === 'string') {
    if (trim) {
      str = str.trim() === ''
    }
    res = str === ''
  }
  return res
}

export {
  defaultsDeep, getTempId, isNullOrEmpty
}
