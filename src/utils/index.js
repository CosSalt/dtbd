var object = require('lodash/fp/object')
// var object = require('lodash/fp')
// defaultsDeep
const {defaultsDeep} = object
const getTempId = (index, type = '') => { // 获取一个临时的 ID
  type = !type ? '' : type + '_'
  return '$_temp_' + type + 'id_' + index
}
export {
  defaultsDeep, getTempId
}
