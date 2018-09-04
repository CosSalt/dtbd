const BaseUrl = 'http://192.168.2.194:8080'
const axios = require('axios')
axios.defaults.baseURL = BaseUrl

// 解析res
const parseRes = (response = {}) => {
  const {data: res = {}} = response
  const {data} = res
  return {data, res}
}

// get
const GetInfo = (path, params, otherParams = {}) => {
  return axios.get(path, Object.assign({}, {params}, otherParams)).then(response => {
    return parseRes(response)
  })
}

// 获取案卡信息(AKXX: 案卡信息)
const GetAKXX = (akmbbh, otherParams = {}) => {
  const Path = '/getstbmc'
  let {params = {}} = otherParams
  params = Object.assign({}, params, { akmbbh })
  return GetInfo(Path, params, otherParams)
}

export {
  GetAKXX
}