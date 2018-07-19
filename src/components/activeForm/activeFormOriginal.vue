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
        <div v-if='designItem.type === "table"' class='form-design-table' v-show='designIndex === index'>
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
        <template v-else>
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
// 对外接口:dragStart(传出触发dragstart的事件后获取到的数据))
import {defaultsDeep} from '@/utils'
import componentsConf from './config'
export default {
  name: 'activeFormOriginal',
  data () {
    return {
      designIndex: 0,
      designs: []
    }
  },
  methods: {
    dragStart (componentItem, type) {
      const handleFn = this.$dragTypeHandle[type]
      if (!handleFn) {
        console.error('无法处理 type 为"'+ type + '"的类型') // eslint-disable-line
      } else {
        const dragComponentArr = handleFn(componentItem)
        this.$emit('dragStart', dragComponentArr) // 对外暴露方法
      }
    },
    initGetNewObj () { // 获取一个深度复制后的对象方法, 返回一个函数
      return defaultsDeep({})
    },
    initTblDesign (){ // 获取tbl格式的数据,这里是模拟的
      const demo = [
        {
          name: '测试',
          id: 'test',
          data: [
            {type:'input', id: 'a', labelText:'1'},
            {type:'select', id: 'b', labelText:'2'},
            {type:'inputArea', id: 'c', labelText:'3'},
            {type:'input', id: 'd', labelText:'4'}
          ]
        }, {
          name: '测试ddd',
          id: 'testddd',
          data: [
            {type:'input', id: 'ad', labelText:'1d'},
            {type:'select', id: 'bd', labelText:'2d'},
            {type:'inputArea', id: 'cd', labelText:'3d'},
            {type:'input', id: 'dd', labelText:'4d'}
          ]
        }
      ]
      const TblDesignData = demo
      return Promise.resolve(TblDesignData)
    },
    initDragHandle () {
      return {
        'table': (dragItem) => {
          const dragComponents = dragItem.data
          const dragComponentsArr = []
          const getNewObj = this.$getNewObj
          for(let tblItem of dragComponents.values()) {
            dragComponentsArr.push(getNewObj(tblItem))
          }
          return dragComponentsArr
        },
        'base': (dragComponent) => {
          return [this.$getNewObj(dragComponent)]
        }
      }
    }
  },
  created () {
    const baseDesign = {
      components: componentsConf,
      id: 'baseDesign',
      type: 'base',
      name: '基础控件区',
      className: 'form-components-orgin'
    }
    this.designs.push(baseDesign)
    this.initTblDesign().then(data => {
      if(data) {
        const tableDesign = {
          components: data,
          id: 'tableDesign',
          type: 'table',
          name: '表格控件区',
          className: 'form-components-orgin'
        }
        this.designs.unshift(tableDesign)
      }
    })
    this.$getNewObj = this.initGetNewObj()
    this.$dragTypeHandle = this.initDragHandle()
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