<template>
  <div>
    <div class='form-demo-container'>
      <formLayout
        :layout='layout'
        :isDraggable='false'
        :receiveData='formData'
        ref='form'
      >
        <el-row slot='footer' style='text-align:center;' slot-scope="{ data }">
          <el-button type='primary' size='mini' @click.native='willSaveModelData(data)'
            v-loading.fullscreen="loading"
            element-loading-text="拼命保存中"
            element-loading-spinner="el-icon-loading">
              保存
            </el-button>
          <el-button type='info' size='mini' @click.native='clearFormData'>清空</el-button>
        </el-row>
      </formLayout>
    </div>
  </div>
</template>
<script>
export default {
  name: 'test',
  data () {
    return {
      layout: [],
      formData: {},
      loading: false,
      validatePromise: []
    }
  },
  methods: {
    handleForm (action, ...args) {
      return this.$eventBus.$emit('validateForm', action, ...args)
    },
    willSaveModelData (data = {}) {
      this.handleForm('validate', this.validateForm)
      Promise.all(this.validatePromise).then(() => {
        this.savingModelData(data)
      }).catch(() => {}).finally(() => {
        this.validatePromise = []
      })
    },
    savingModelData (data) {
      localStorage.setItem('formData', JSON.stringify(data))
      alert('保存成功')
    },
    initForm () {
      this.layout = JSON.parse(localStorage.getItem('designComponent') || '[]')
      this.formData = JSON.parse(localStorage.getItem('formData') || '{}')
    },
    clearFormData () {
      this.handleForm('resetFields') // 清空(重置)数据
    },
    validateForm (res) {
      this.validatePromise.push(res)
    }
  },
  created () {
    this.initForm()
  }
}
</script>

<style lang="less">
.form-demo-container {
  width: 50%;
  border: 1px solid grey;
}
</style>


