<template>
  <el-tabs v-model="activeName" type="card" @drop.native='drop' @click.native='defComonent'
    class='navigaton-tabs'
  >
  <!-- <el-tabs v-model="activeName" type="card"> -->
    <!-- <el-tab-pane label="标签页" name="first">标签页内容</el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane> -->
    <template v-for='item in optionData'>
      <el-tab-pane :label="item.label" :name="item.name" :key='item.name'>
        <template v-if='item.components'>
          <!-- <formLayout
            @dragover.native='dragover'
            @drop.self.native='drop'
            class='form-design-content'
            :layout.sync = 'item.components'
            :isDraggable='isDraggable'
            :dragToIndex.sync='dragToIndex'
            :confIndex='confIndex'
            @changePosition='changePosition'
            @setComponentConf='setComponentConf'
            @addDragData='addDragData'
          /> -->
            <!-- <formDesignLayout
              class='tabs-form-design-layout'
              :layout.sync='item.components'
              :dragItems.sync='theDragItems'
            /> -->
            <!-- <formDesignLayout
              class='tabs-form-design-layout'
              :layout.sync='item.components'
              :dragItems='theDragItems'
              @update:layout='val => item.components = val'
            /> -->
            <!-- <formDesignLayout
              class='tabs-form-design-layout'
              :layout='item.components'
              :dragItems='theDragItems'
            /> -->
            <formDesignLayout
              class='tabs-form-design-layout'
              :layout.sync='item.components'
              :dragItems='theDragItems'
              @update:layout='val => updateLayout(item, "components", val)'
            />
        </template>
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
export default {
  name: 'navigationTabs',
  props: {
    value: null,
    formData: {
      required: true,
      type: Object
    },
    isDraggable: {
      type: Boolean,
      default: false
    },
    keyIndex: {
      type: Number,
      default: -1
    },
    dragItems: null
  },
  data () {
    return {
      activeName: 'third',
      optionData: [],
      loading: false,
      type: 'tabs',
      dragToIndex: -1,
      confIndex: -1,
    }
  },
  computed: {
    theDragItems: {
      get () {
        return this.dragItems
      },
      set (newVal) {
        this.$emit('update:dragItems', newVal)
      }
    }
  },
  watch: {
    'formData.childConf': {
      handler (data) {
        data = data || []
        this.optionData = [...data]
        this.setModelName()
        this.setLoading()
      },
      immediate: true
    }
  },
  methods: {
    updateLayout (item = {}, propName, newVal = []) {
      item[propName] = newVal
      this.$emit('update:formData', this.formData)
    },
    setModelName () {
      const name = this.activeName
      const index = this.optionData.findIndex(item => name === item.name)
      if(index < 0) {
        const defItem = this.optionData[0]
        const defVal = defItem ? defItem.name : ''
        this.activeName = defVal
      }
    },
    setLoading (res = false) {
      this.loading = res
    },
    drop (e) {
      if (this.isDraggable) {
        const drop = this.$listeners.drop
        if (drop) {
          drop({
            e, 
            type: this.type,
            name: this.activeName,
            tabsDragToIndex: this.dragToIndex
          })
        }
      }
    },
    defComonent(){
      if(!this.isDraggable) return
      const defComponent = this.$listeners.defComponent
      if (defComponent) {
        defComponent({
          type: this.type,
          name: this.activeName,
          index: this.keyIndex
        })
      }
    },
    changePosition(){

    },
    setComponentConf(){

    },
    addDragData(){
      
    }
  }
}
</script>

<style lang="less">
.navigaton-tabs{
  .tabs-form-design-layout {
    .component-conf {
      background-color: #b0c8e0;
    }
  }
}
</style>

