<template>
<div class='active-form-original'>
  <template v-for='(designItem, index) in designs'>
    <div class='form-original-class' :key='designItem.id' v-if='designItem.components && designItem.components.length > 0'>
      <div class="form-original-container">
        <el-row class='form-original-title'>
          <el-col :span='20'>
            <span v-text='designItem.name'></span>
          </el-col>
          <el-col :span='4'>
            <i
              :class='{"original-show": designIndex === index}'
              class='el-icon-arrow-left'
              @click='designIndex = designIndex === index ? -1 : index'
            />
          </el-col>
        </el-row>
      </div>
      <transition name="block">
        <div v-if='designItem.type === "table"' class='form-original-table' v-show='designIndex === index'>
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
          <div class='form-original-base' v-if='designIndex === index'>
            <ul :class='designItem.className'>
              <template v-for='item in designItem.components'>
                <li :key='item.type' class='active-form-row component-row' draggable='true' 
                  @dragstart='dragStart(item, designItem.type)'
                  :title='item.labelText'
                >
                  <div class='original-label'>
                    <div v-text='item.labelText' class='original-text' />
                    <div class='cloumn-split'/>
                  </div>
                  <commonIndex :formData='item' class='original-style' :showLabel='false'/>
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
import {getNewObj} from '@/utils'
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
      className: 'components-orgin'
    }
    this.designs.push(baseDesign)
    this.initTblDesign().then(data => {
      if(data) {
        const tableDesign = {
          components: data,
          id: 'tableDesign',
          type: 'table',
          name: '表格控件区',
          className: 'components-orgin'
        }
        this.designs.unshift(tableDesign)
      }
    })
    this.$getNewObj = getNewObj
    this.$dragTypeHandle = this.initDragHandle()
  }
}
</script>

<style lang="less">
.active-form-original {
  width: 100%;
  height: 100%;
  .active-form-original-orgin{
    height: 100%;
    overflow-y: auto;
  }
  .form-tble-orgin, .active-form-original-orgin {
    border: 1px solid grey;
  }
  .form-original-class {
    .form-original-container{
      background-color: #105dcd;
      padding: 1px 2px;
    }
    i{
      padding-top: 3px; 
      cursor: pointer;
      transition: all .5s;
    }
    .original-show{
      transform: rotate(-90deg);
    }
    .block-enter-active, .block-leave-active {
      transition: all .5s;
    }
    .block-enter, .block-leave-to{
      opacity: 0;
    }
  }
  .form-original-title {
    // background: #8ea5bd;
    background-color: #3175db;
    color: #fff;
    height: 46px;
    line-height: 46px;
    font-size: 18px;
    border-bottom: 1px solid #4e87dd;
    padding-left: 20px;
  }
  .form-original-hide {
    display: none;
  }
    .form-block {
    display: inline-block;
  }
  .active-form-row{
    margin: 0;
    padding: 5px 0;
  }
  .original-style,.original-label{
    display: inline-block;
  }
  .original-label{
    width: 90px;
    height: 100%;
    font-size: 14px;
    vertical-align: top;
    >div{
      display: inline-block;
    }
    .cloumn-split{
      padding-left: 1px;
      vertical-align: top;
      box-sizing: border-box;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 1px solid #fcfdfe;
      border-right: 1px solid #bed8f0;
      transform: translate(0, 14px);
    }
    .original-text{
      box-sizing: border-box;
      width: 80px;
      padding-left: 20px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .original-style{
    width: calc(100% - 90px - 21px);
    overflow: hidden;
    // .component-label {
    //   width:49%;
    // }
    // .component-content{
    //   width: 50%;
    // }
  }
  .component-row{
    height: 48px;
    line-height: 48px;
    padding: 0;
    overflow: hidden;
    &:hover{
      background-color: #B7D1F2;
      cursor: pointer;
    }
  }
}
</style>