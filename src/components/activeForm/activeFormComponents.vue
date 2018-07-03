<template>
<div class='form-components'>
  <div class='form-design-head'> 控件区</div>
  <div>
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
        <!-- <div v-if='designItem.id === "tableDesign"' class='form-design-table' v-show='designIndex === index'> -->
        <div v-if='designItem.type === "table"' class='form-design-table'>
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
        <div v-else class='form-design-base' v-show='designIndex === index'>
          <ul :class='designItem.className'>
            <template v-for='item in designItem.components'>
              <li :key='item.type' class='active-form-row component-row' draggable='true' @dragstart='dragStart(item, designItem.type)'>
                <formIndex :formData='item' class='component-design-style' />
              </li>
            </template>
          </ul>
        </div>
      </div>
    </template>
  </div>
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
  .form-components {
    width: 100%;
    height: 100%;
    .form-components-orgin{
      height: 100%;
      overflow-y: auto;
    }
    .form-tble-orgin, .form-components-orgin {
      border: 1px solid grey;
    }
  }
</style>


