<template>
  <el-tabs v-model="activeName" type="card" @drop.native='drop'>
  <!-- <el-tabs v-model="activeName" type="card"> -->
    <!-- <el-tab-pane label="标签页" name="first">标签页内容</el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane> -->
    <template v-for='item in optionData'>
      <el-tab-pane :label="item.label" :name="item.name" :key='item.name'>
        <template v-if='item.components'>
          <activeFormLayout
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
    }
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
  watch: {
    'formData.childConf': {
      handler (data) {
        data = data || []
        this.optionData = [...data]
        console.log('this.optionData', this.optionData)
        this.setLoading()
      },
      immediate: true
    }
  },
  methods: {
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
    changePosition(){

    },
    setComponentConf(){

    },
    addDragData(){
      
    }
  }
}
</script>

