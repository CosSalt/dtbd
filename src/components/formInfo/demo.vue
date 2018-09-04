<template>
  <div>
    <FormInfo
      :layout.sync='layout'
      :formData='formData'
      class='form-info-demo-container'
      :title="'基本情况'"
    >
      <el-row slot='footer' style='text-align:center;' slot-scope="{ saveData, resetData }">
        <el-button type='primary' size='mini' @click='theSaveData(saveData)'
          v-loading.fullscreen="loading"
          element-loading-text="拼命保存中"
          element-loading-spinner="el-icon-loading">
            保存
        </el-button>
        <el-button type='info' size='mini' @click='theclearData'>清除</el-button>
        <el-button type='info' size='mini' @click='theResetData(resetData)'>重置</el-button>
      </el-row>
    </FormInfo>
  </div>
</template>
<script>
import FormInfo from './index'
import {GetAKXX} from '../../api'
import {data} from './demoData.js'
export default {
  name: 'formInfoDemo',
  components: {FormInfo},
  data () {
    return {
      layout: [],
      formData: {},
      loading: false
    }
  },
  methods: {
    initForm () { // 初始化获取数据
      GetAKXX(100000231).then(({data, res}) => {
        // eslint-disable-next-line
        // debugger
        // eslint-disable-next-line
        console.dir(res)
      }).catch(err => {
        // eslint-disable-next-line
        debugger
        // eslint-disable-next-line
        console.error(err)
      })
      this.$nextTick(()=>{
        // this.layout = JSON.parse(localStorage.getItem('designComponent') || '[]')
        this.layout = data
        this.formData = JSON.parse(localStorage.getItem('formData') || '{}')
      })
    },
    theResetData (fn) { // 重置数据
      fn && fn()
    },
    theclearData () { // 清除数据
      this.formData = {}
    },
    theSaveData (fn) { // 保存数据
      if (fn) {
        fn().then(({result = false, data}) => {
          if(result) {
            this.formData = data
            localStorage.setItem('formData', JSON.stringify(data))
            alert('保存成功')
          } else {
            alert('保存失败')
          }
        })
      }
    },
  },
  created () {
    this.initForm()
  }
}
</script>

<style lang="less">
.form-info-demo-container {
  width: 80%;
  border: 1px solid grey;
  transform: translate(10%);
  box-sizing: border-box;
  padding: 20px;
  margin-top: 10px;
}
</style>