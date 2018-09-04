const getSimpleComponent = (id, labelText, type) => ({  id, labelText, type})
const getInput = (id, name) => getSimpleComponent(id, name, 'input')
const getSelect = (id, name) => getSimpleComponent(id, name, 'select')
const itemMap = (item) =>  {
  const [id, name, type = 'select'] = item
  return getSimpleComponent(id, name, type)
}

const jbxxArr = [ // 0: id, 1:名称, 2: 类型(默认select)
  ['bmsah', '部门受案号', 'input'], ['tysah', '统一受案号', 'input'], ['slrq', '受理日期'], ['ysgsaj', '一审公诉案件', 'input'],
  ['ajmc', '案件名称', 'input'], ['bqsyjswh', '(不)起诉意见书文号', 'input'], ['zcjg', '侦查机关'],['ysdw', '移送单位'],
  ['ysay', '移诉案由'], ['ysqtay', '移诉其它案由'], ['ysyj', '移送意见'],  ['zcjgsfjysyrzrf', '侦查机关是否建议适用认罪认罚'],
  ['sfgzaj', '是否关注案件'], ['sfdbaj', '是否督办案件'], ['sfzxhdaj', '是否专项活动案件'], ['zxhdmc', '专项活动名称', 'input'],
  ['sfswaj', '是否涉外案件'], ['sftyslajqshgbgx', '是否他院审查起诉后改变管辖'], ['sfdwfz', '是否单位犯罪'], ['sfstfz', '是否涉台犯罪'],
  ['sfzdzrsgsszwfzaj', '是否重大责任事故所涉职务犯罪案件'], ['zwfzajsalw', '职务犯罪案件涉案领域'], ['zwfzajsaqtly', '职务犯罪案件涉案其他领域'],
  ['tqjrlb', '提前介入类别'], ['jrzcrq', '介入侦查日期'], ['tqjrfs', '提前介入方式'], ['gtfzxz', '共同犯罪性质'],
  ['gtfzrs', '共同犯罪人数', 'input'], ['sfsjeslfz', '是否涉及饿死你犯罪'], ['ztfzxyrxmhch', '在逃犯罪嫌疑人姓名或绰号', 'input'],
  ['ztxxrry', '在逃嫌疑人人数', 'input'], ['ajzy', '案情摘要', 'inputArea'], ['fz', '附注', 'inputArea'],
  ['ysrjdh', '移送人即电话', 'input'], ['cbbm', '承办不了吧', 'input'], ['cbjcg', '承办检察官', 'input'],
] 
const jbxx = jbxxArr.map(item => itemMap(item))

// 基本信息_犯罪
const jbxxArr_fz = [
  ['bmsah', '部门受案号', 'input'], ['xyrbh', '嫌疑人编号', 'input'], ['sfwdw', '是否为单位'], ['xmdwmc', '姓名/单位名称', 'input'],
  ['xmdwmc', '姓名/单位名称', 'input'],
]
const jbxx_fz = jbxxArr_fz.map(item => {
  const [id, name, type = 'select'] = item
  return getSimpleComponent(id, name, type)
})
// 涉案情况_犯罪
const saqkArr_fz = [
  ['bcysqsslrq', '补充移送起诉受理日期']
]
const ssqk_fz = saqkArr_fz.map(item => {
  const [id, name, type = 'select'] = item
  return getSimpleComponent(id, name, type)
})
// 强制措施情况
const qzcsqkArr_fz = [
  ['bmsah', '部门受案号', 'input'], ['xyrbh', '嫌疑人编号', 'input'], ['qzcsbh', '强制措施编号', 'input'],
  ['qzcsjdrq', '强制措施决定日期', 'datePicker'], ['qzcs', '强制措施'],
]
const qzcsqk_fz = qzcsqkArr_fz.map(item => {
  const [id, name, type = 'select'] = item
  return getSimpleComponent(id, name, type)
})

var data = [{
  "id": "slqk",
  "childConf": [{
    "label": "基本信息",
    "name": "jbxx",
    "components": jbxx
  }, {
    "label": "侵犯知识产权情况",
    "name": "qfzscqqk",
    "components": [{
      "id": "fqfzscqzsfhqfzscqxw",
      "labelText": "非侵犯知识产权罪中是否含侵犯知识产权行为",
      "span": 24,
      "bind": {
        "multiple": false,
        "action": null,
        "disabled": false,
        "allowCreate": false,
        "filterable": false,
        "defaultFirstOption": false,
        "placeholder": "请输入内容",
        "size": "mini"
      },
      "relationIds": null,
      "childConf": [{
        "label": "是",
        "value": "yes"
      }, {
        "label": "否",
        "value": "no"
      }],
      "type": "select"
    },{
      "id": "sqfqylx",
      "labelText": "受侵犯企业类型",
      "bind": {
        "multiple": false,
        "action": null,
        "disabled": false,
        "allowCreate": false,
        "filterable": false,
        "defaultFirstOption": false,
        "placeholder": "请输入内容",
        "size": "mini"
      },
      "relationIds": null,
      "childConf": [{
        "label": "行政单位",
        "value": "xzdw"
      }, {
        "label": "事业单位",
        "value": "sydw"
      }],
      "type": "select"
    },{
      "id": "sqfqywzlyd",
      "labelText": "受侵犯企业外资来源地",
      "bind": {
        "multiple": false,
        "action": null,
        "disabled": true,
        "allowCreate": false,
        "filterable": false,
        "defaultFirstOption": false,
        "placeholder": "请输入内容",
        "size": "mini"
      },
      "type": "select"
    },{
      "id": "sqfqyssgbdq",
      "labelText": "受侵犯企业所属国别地区",
      "span": 24,
      "bind": {
        "multiple": false,
        "action": null,
        "disabled": true,
        "allowCreate": false,
        "filterable": false,
        "defaultFirstOption": false,
        "placeholder": "请输入内容",
        "size": "mini"
      },
      "type": "select"
    }]
  }],
  "bind": {
    "allowCreate": false,
    "filterable": false,
    "defaultFirstOption": false,
    "size": "mini"
  },
  "type": "tabs",
  "labelText": "选项卡",
  "span": 24,
  "notFormItem": true
},{
  "id": "fzxyrqk",
  "childConf": [{
    "label": "基本信息",
    "name": "jbxx",
    "components": jbxx_fz
  }, {
    "label": "涉案情况",
    "name": "saqk",
    "components": ssqk_fz
  }, {
    "label": "强制措施情况",
    "name": "qzcsqk",
    "components": qzcsqk_fz
  }],
  "bind": {
    "allowCreate": false,
    "filterable": false,
    "defaultFirstOption": false,
    "size": "mini"
  },
  "type": "tabs",
  "labelText": "选项卡",
  "span": 24,
  "notFormItem": true
}]

export {
  data
}

const thejbxxv1 = [{
  "id": "bmsah",
  "labelText": "部门受案号",
  "bind": {
    "disabled": true,
    "allowCreate": false,
    "filterable": false,
    "defaultFirstOption": false,
    "placeholder": "请输入内容",
    "size": "mini"
  },
  "type": "input"
}, {
  "id": "bqsyjswh",
  "labelText": "(不起诉)意见书文号",
  "bind": {
    "multiple": false,
    "action": null,
    "disabled": false,
    "allowCreate": false,
    "filterable": false,
    "defaultFirstOption": false,
    "placeholder": "请输入内容",
    "size": "mini"
  },
  "relationIds": null,
  "childConf": [{
    "label": "选项1",
    "value": "双皮奶"
  }, {
    "label": "选项2",
    "value": "红烧肉"
  }],
  "type": "select"
}, {
  "id": "zcjg",
  "labelText": "侦查机关",
  "bind": {
    "multiple": false,
    "action": null,
    "disabled": false,
    "allowCreate": false,
    "filterable": false,
    "defaultFirstOption": false,
    "placeholder": "请输入内容",
    "size": "mini"
  },
  "relationIds": null,
  "childConf": [{
    "label": "选项1",
    "value": "双皮奶"
  }, {
    "label": "选项2",
    "value": "红烧肉"
  }],
  "type": "select"
}]