<template>
  <div class='an-ka-info'>
    <div class='anka-title'>
      <span>案卡信息</span>
    </div>
    <div>
      <ul class='anka-list'>
        <li v-for='(item, i) in data' :key='item.id || i'
          class='li-title'
          :class='isSelected(i, item.id) ? "li-selected" : ""'
          @click.stop='anKaClick(i, item.id, item)'
          :title='item.title'
        >
          {{item.title}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnkaList',
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    selectId: null
  },
  data () {
    return {
      selectedId: this.selectId
    }
  },
  computed: {
    isSelected () {
      const selectedId = this.selectedId
      return (index, id = index) => {
        if (selectedId == undefined) {
          return index === 0
        }
        return id === selectedId
      }
    }
  },
  methods: {
    anKaClick (i, id = i, item) {
      this.selectedId = id
      this.$emit('click', id, item) // id不存在则使用index
    }
  }
}
</script>

<style lang="less">
@width: 250px;
@li-height: 40px;
@li-padding-left: 30px;
.an-ka-info{
  width: @width;
  background-color: #e4f0fc;
  border: 1px solid #abc0dd;
  border-top: 3px solid #2e6dd4;
  height: 100%;
  box-sizing: border-box;
  .anka-title {
    border-bottom: 1px solid #abc0dd;
    padding-left: @li-padding-left;
    height: @li-height;
    line-height: @li-height;
  }
  .anka-list{
    padding: 0;
    margin: 0;
    .li-selected{
      background-color: #658dca;
      color: #ffffff;
    }
  }
  .li-title{
    color: #326a9d;
    height: @li-height;
    line-height: @li-height;
    border-bottom: 1px solid #cad7e8;
    padding-left: @li-padding-left;
    box-sizing: border-box;
    cursor: pointer;
    &:hover{
      background-color: #809bc4;
      color: #ffffff;
    }
  }
}
</style>

