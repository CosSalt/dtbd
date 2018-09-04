<template>
  <AnKaForm
    class='anka-form-demo'
    :data='anKaData'
  />
</template>

<script>
import {GetAKXX} from '../../api'
import AnKaForm from './index'
export default {
  name: 'AnKaFormDemo',
  components: {
    AnKaForm
  },
  data () {
    return {
      anKaData: []
    }
  },
  methods: {
    initForm () { // 初始化获取数据
      GetAKXX(100000231).then(({data, res}) => {
        // eslint-disable-next-line
        // debugger
        // eslint-disable-next-line
        console.dir(res)
        this.anKaData = [data]
      }).catch(err => {
        // eslint-disable-next-line
        debugger
        // eslint-disable-next-line
        console.error(err)
      })
    }
  },
  created () {
    this.initForm()
  }
}
</script>

<style lang="less">
.anka-form-demo {
  height: 500px;
}
</style>

