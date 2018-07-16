var object = require('lodash/fp/object')
// var object = require('lodash/fp')
// defaultsDeep
const {defaultsDeep} = object
const getTempId = (index, type = '') => { // 获取一个临时的 ID
  type = !type ? '' : type + '_'
  return '$_temp_' + type + 'id_' + index
}

const isNullOrEmpty = (str, trim = true) => {
  let res = str == null
  if (!res &&　typeof str === 'string') {
    if (trim) {
      res = str.trim() === ''
    } else {
      res = str === ''
    }
  }
  return res
}

export {
  defaultsDeep, getTempId, isNullOrEmpty
}
