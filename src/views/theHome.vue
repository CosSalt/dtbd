<template>
  <div>
    <router-link :to='{name:"activeForm"}'>to activeForm</router-link>
    <div></div>
    <router-link :to='{name:"test"}'>to test</router-link>
    <div></div>
    <router-link :to='{name:"ankaList"}'>to ankaList</router-link>
    <div></div>
    <router-link :to='{name:"formList"}'>to formList</router-link>
    <div></div>
    <router-link :to='{name:"formInfo"}'>to formInfo</router-link>
    <div></div>
    <router-link :to='{name:"anKaForm"}'>to anKaForm</router-link>
  </div>
</template>
<script>
export default {
  name: 'theHome'
}
</script>

<style lang="less">

</style>


