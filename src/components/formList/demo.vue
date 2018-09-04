<template>
  <FormList :data='formData'
    :selectId='2'
    @click='formListClick'
  >
  </FormList>
</template>
<script>
import FormList from './index.vue'
export default {
  name: 'formListDemo',
  components: {FormList},
  data () {
    return {
      formData: [{
        title: '受理情况',
        id: 'slqk',
        data: [
          {id: 1, title: '审查起诉受理情况'},
          {id: 2, title: '案件办理及审结情况'},
          {id: 3, title: '审查起诉出庭 判决情况'}
        ]
      }, {
        title: '嫌疑人审结及变更情况',
        id: 'xyrscjbgqk',
        data: [
          {id: 4, title: '单位犯罪情况'},
          {id: 5, title: '侦查活动监督情况'}
        ]
      }],
      selectedPath: null
    }
  },
  computed: {
    theSelectedItem () {
      return this.selectedItem || this.formData[0]
    }
  },
  methods: {
    formListClick (parentId, id, item) {
      this.selectedItem = item
    }
  }
}
</script>