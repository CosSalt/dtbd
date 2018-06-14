<template>
  <div class='form-index'>
    <h1 style='text-align:center;'>表单设计器</h1>
    <activeFormDesign/>
  </div>
</template>

<script>
import activeFormDesign from './activeFormDesign.vue'
export default {
  name: 'activeForm',
  components: {activeFormDesign}
}
</script>

<style>
.form-index{
  height: 100%;
}
</style>
