<template>
<div class='active-form-components'>
  <template v-for='(designItem, index) in designs'>
    <div class='form-design-class' :key='designItem.id' v-if='designItem.components && designItem.components.length > 0'>
      <el-row class='form-design-title'>
        <el-col :span='20'>
          <span v-text='designItem.name'></span>
        </el-col>
        <el-col :span='4'>
          <i
            :class = '{"design-show": designIndex === index}'
            class='el-icon-arrow-left'
            @click='designIndex = designIndex === index ? -1 : index'
          />
        </el-col>
      </el-row>
      <transition name="block">
        <div v-if='designItem.id === "tableDesign"' class='form-design-table' v-show='designIndex === index'>
          <template>
            <template v-for='tblItem in designItem.components'>
              <formDesignTable 
                :tblData='tblItem'
                :draggable='true'
                @dragstart.native='dragStart(tblItem, designItem.type)'
                :key='tblItem.id'
              />
            </template>
          </template>
        </div>
        <template v-else >
          <div class='form-design-base' v-if='designIndex === index'>
            <ul :class='designItem.className'>
              <template v-for='item in designItem.components'>
                <li :key='item.type' class='active-form-row component-row' draggable='true' @dragstart='dragStart(item, designItem.type)'>
                  <formIndex :formData='item' class='component-design-style' />
                </li>
              </template>
            </ul>
          </div>
        </template>
      </transition>
    </div>
  </template>
</div>
</template>

<script>
import {defaultsDeep} from '@/utils'
// import componentsConf from './config'
export default {
  name: 'activeFormComponents',
  props: {
    designs: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      designIndex: 0
    }
  },
  methods: {
    dragStart (componentItem, type) {
      // e.dataTransfer.setData('type', type) // dataTransfer.setData() 方法设置被拖数据的数据类型和值
      const handleFn = this.$dragTypeHandle[type]
      if (!handleFn) {
        console.error('无法处理 type 为"'+ type + '"的类型') // eslint-disable-line
      } else {
        const dragComponentArr = handleFn(componentItem)
        this.$emit('dragStart', dragComponentArr)
      }
    },
    getNewItem (oldItem) {
      return defaultsDeep({}, oldItem)
    },
    dragHandle () {
      return {
        'table': (dragItem) => {
          const dragComponents = dragItem.data
          const dragComponentsArr = []
          for(let tblItem of dragComponents.values()) {
            dragComponentsArr.push(this.getNewItem(tblItem))
          }
          return dragComponentsArr
        },
        'base': (dragComponent) => {
          return [dragComponent]
        }
      }
    }
  },
  created () {
    this.$dragTypeHandle = this.dragHandle()
  }
}
</script>

<style lang="less">
.active-form-components {
  width: 100%;
  height: 100%;
  .active-form-components-orgin{
    height: 100%;
    overflow-y: auto;
  }
  .form-tble-orgin, .active-form-components-orgin {
    border: 1px solid grey;
  }
  .form-design-class {
    i{
      cursor: pointer;
      transition: all .5s;
    }
    .design-show{
      transform: rotate(-90deg);
    }
    .block-enter-active, .block-leave-active {
      transition: all .5s;
    }
    .block-enter, .block-leave-to{
      opacity: 0;
    }
  }
  .form-design-hide {
    display: none;
  }
    .form-block {
    display: inline-block;
  }
  .active-form-row{
    margin: 0;
    padding: 5px 0;
  }
  .component-design-style{
    width: 100%;
    .component-label {
      width:49%;
    }
    .component-content{
      width: 50%;
    }
  }
  .component-row{
    &:hover{
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>


