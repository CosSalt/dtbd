<template>
  <div class='active-form-index'>
    <div class='index-title'>
      <div class='title-content left-bar'> 表单设计器</div>
    </div>
    <div class='index-container'>
      <activeFormDesign />
    </div>
  </div>
</template>

<script>
import activeFormDesign from './activeFormDesign.vue'
import './style/index.less'
export default {
  name: 'activeForm',
  components: {activeFormDesign}
}
</script>

<style lang="less">
@titleHeight: 50px;
.active-form-index{
  height: 100%;
  .index-title{
    height: @titleHeight;
    overflow: hidden;
    background-color: #347fe8;
    .title-content{
      background-color:#135fd1;
      color: #fff;
      font-size: 24px;
      height: @titleHeight;
      line-height: @titleHeight;
      text-align: center;
    }
  }
  .index-container{
    height: calc(100% - @titleHeight);
  }
}
</style>
