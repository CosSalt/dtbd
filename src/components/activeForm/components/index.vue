<template>
  <div>
    <label v-if='data.text'>{{data.text}}</label>
    <component :is="data.component" v-bind='data.param' class='component-style'>{{data.afterText}}</component>
  </div>
</template>

<script>
export default {
  name: 'activeComponent',
  props: {
    data: {
      required: true,
      type: Object
    }
  }
}
</script>

