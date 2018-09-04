<template>
  <AnkaList :data='anKaData'
    :selectId='2'
    @click='anKaClick'
  >
  </AnkaList>
</template>
<script>
import AnkaList from './index.vue'
export default {
  name: 'ankaListDemo',
  components: {AnkaList},
  data () {
    return {
      anKaData: [
        {id: 1, title: '审查起诉受理情况'},
        {id: 2, title: '案件办理及审结情况'},
        {id: 3, title: '审查起诉出庭 判决情况'},
        {id: 4, title: '单位犯罪情况'},
        {id: 5, title: '侦查活动监督情况'}
      ],
      selectedItem: null
    }
  },
  computed: {
    theSelectedItem () {
      return this.selectedItem || this.anKaData[0]
    }
  },
  methods: {
    anKaClick (id, item) {
      this.selectedItem = item
    }
  }
}
</script>

