<template>
  <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
    <el-tab-pane label="标签页" name="first">标签页内容</el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    <el-tab-pane label="标签页1" name="first1">标签页内容</el-tab-pane>
    <el-tab-pane label="配置管理1" name="second1">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理1" name="third1">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿1" name="fourth1">定时任务补偿</el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'navigationTabs',
  data () {
    return {
      activeName2: 'third',
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

