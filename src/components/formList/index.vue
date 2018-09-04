<template>
  <div class='form-info'>
    <div v-for= '(item, i) in info' :key='item.id || i'>
      <template v-if='!item.data'>
        <div class='form-title form-title-click'
          @click.stop='formTitleClick(i, item.id, item)'
          :class='isSelected(i, item.id) ? "title-selected" : ""'
        >
          <span>{{item.title}}</span>
        </div>
      </template>
      <template v-else>
        <div class='form-title'>
          <span>{{item.title}}</span>
        </div>
      </template>
      <ul class='form-list' v-if='item.data'>
        <li v-for='(data, index) in item.data' :key='data.id || index'
          class='li-title'
          :class='isSelected(i, item.id, index, data.id) ? "title-selected" : ""'
          @click.stop='formClick(i, item.id, index, data.id, item)'
          :title='data.title'
        >
          {{data.title}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormList',
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    selectIds: null
  },
  data () {
    return {
      selectedIds: this.selectIds || []
    }
  },
  computed: {
    info () {
      return this.data
    },
    isSelected () {
      const selectedIds = this.selectedIds
      const hasIds = selectedIds == undefined || selectedIds.length < 0
      return (index, parentId = index, i, id = i) => {
        if (hasIds) {
          return index === 0
        }
        return [parentId, id].join('') === selectedIds.join('')
      }
    }
  },
  methods: {
    formClick (index, parentId = index, i, id = i, item) {
      this.selectedIds = [parentId, id]
      // 如果parentId存在, id不存在,则证明只有一层
      this.$emit('click', parentId, id, item) // id不存在则使用index
    },
    formTitleClick(index, parentId, item) {
      const a = void(0)
      this.formClick(index, parentId, a, a, item)
    }
  }
}
</script>

<style lang="less">
@width: 250px;
@li-height: 40px;
@li-left: 30px;
@color: #57759f;
@hover-color: #809bc4;
.form-info{
  padding:0 20px;
  color: #326a9d;
  width: @width;
  // background-color: #e4f0fc;
  border: 1px solid #dce5ef;
  height: 100%;
  box-sizing: border-box;
  .form-title {
    color: @color;
    font-weight: 600;
    height: @li-height;
    line-height: @li-height;
    border-bottom: 1px solid #cad7e8;
  }
  .form-title-click {
    cursor: pointer;
    &:hover{
      font-weight: normal;
      background-color: @hover-color;
      color: #fff;
    }
  }
  .form-list{
    padding: 0;
    margin: 0;
  }
  .title-selected{
      background-color: #ddeefe;
      font-weight: 600;
      &:before{
        color: #3d6494;
      }
    }
  .li-title{
    position: relative;
    height: @li-height;
    line-height: @li-height;
    border-bottom: 1px solid #cad7e8;
    padding-left: @li-left;
    box-sizing: border-box;
    cursor: pointer;
    // overflow: hidden;
    &:hover{
      font-weight: normal;
      background-color: @hover-color;
      color: #fff;
      &:before{
        color: #fff;
      }
    }
    &:before{
      position: absolute;
      content:'●';
      left: @li-left / 3;
      // font-size: 40px;
      color: #a8c4e3;
      // top: -2px;
      // line-height: @li-height / 2 - 3px;
    }
  }
}
</style>



