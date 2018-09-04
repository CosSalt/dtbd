<template>
  <div class='anka-form-demo'>
    <AnKaForm
      :data='anKaData'
    />
  </div>
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
      // GetAKXX(100000231).then(({data, res}) => {
      GetAKXX(100000231).then(({data}) => {
        // eslint-disable-next-line
        // debugger
        // eslint-disable-next-line
        // console.dir(res)
        this.anKaData = [data]
      }).catch(err => {
        // eslint-disable-next-line
        // debugger
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
@padding-width: 15px;
.anka-form-demo {
  padding: @padding-width;
  height: calc(100% - 2 * @padding-width);
}
</style>

