<template>
  <div class='form-select'>
    <label class='component-label' v-if='showLabel'>{{formData.labelText}}</label>
    <el-select v-model='selectedVal' v-bind='formData.bind' clearable class='component-content' :loading="loading" @focus.self='selectFocus'>
      <el-option
        v-for="(item, index) in optionData"
        v-bind='item || {}' :key='item.value || index'
      />
    </el-select>
  </div>
</template>

<script>
  export default {
    name: 'formSelect',
    props: {
      value: null,
      formData: {
        required: true,
        type: Object
      },
      showLabel: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return  {
        loading: false,
        optionData: []
      }
    },
    computed: {
      theValue () {
        const {bind:{multiple}} = this.formData
        const value = this.value
        let newVal
        if(multiple) {
          newVal = Array.isArray(value) ? value : []
        } else {
          newVal = value === undefined ? null : value
        }
        return newVal
      },
      selectedVal: {
        get () {
          return this.theValue
        },
        set (newVal) {
          this.$emit('input', newVal)
        }
      },
      // childrenOptions () {
      //   const child = this.formData.childConf || []
      //   return [...child]
      // },
      theformBind () {
        return this.formData.bind || {}
      },
      formBind () {
        let {action, ...bind} = this.theformBind // eslint-disable-line
        return bind
      },
      formAction () {
        const {action} = this.theformBind
        return action
      }
    },
    watch: {
      'formData.childConf': {
        handler (data) {
          data = data || []
          this.optionData = [...data]
          this.setLoading()
        },
        immediate: true
      }
    },
    methods:{
      selectFocus () {
        // console.log('start')
        const url = this.formAction
        if (url) {
          this.setLoading(true)
          this.$emit('getAction', [{
            action: url,
            position: 'childConf'
          }, this.formData])
        }
      },
      setLoading (res = false) {
        this.loading = res
      }
    }
  }
</script>

<style lang="less">
.form-select{
  .component-label {
    display: inline-block;
  }
  .component-content{
    display: inline-block;
  }
}
</style>
