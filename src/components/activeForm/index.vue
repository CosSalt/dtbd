<template>
  <div class='form-index'>
    <div class='form-index-title'>
      <h1 style='text-align:center;margin:0;'>表单设计器</h1>
    </div>
    <div class='form-index-container'>
      <activeFormDesign/>
    </div>
  </div>
</template>

<script>
import activeFormDesign from './activeFormDesign.vue'
export default {
  name: 'activeForm',
  components: {activeFormDesign}
}
</script>

<style lang="less">
@titleHeight: 80px;
.form-index{
  height: 100%;
  .form-index-title{
    height: @titleHeight;
    overflow: hidden;
  }
  .form-index-container{
    height: calc(100% - @titleHeight);
  }
}
</style>
