<template>
  <el-tabs v-model="activeName" type="card" @drop.stop.native='drop' @click.stop.native='defComonent'
    class='navigaton-tabs'
  >
    <template v-for='(item, index) in optionData'>
      <el-tab-pane :label="item.label" :name="item.name" :key='item.name'>
        <template v-if='item.components'>
            <formDesignLayout
              v-if='isDraggable'
              class='tabs-form-design-layout'
              :layout='item.components'
              :dragItems='dragItems'
              @updateDragItems='updateDragItems'
              @updateLayout='val => updateFormData(index, "components", val)'
            />
            <formLayout
              v-else
              :layout='item.components'
              :isDraggable='isDraggable'
              :receiveData='navigationModel[item.name]'
            >
              <template slot='footer' slot-scope="{ data }" v-if='item.name' >
                {{relevanceModel(navigationModel, item.name, data)}}
              </template>
            </formLayout>
        </template>
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
import {defaultsDeep} from '@/utils'
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
      confIndex: -1
    }
  },
  computed: {
    theFormData () {
      return defaultsDeep({}, this.formData)
    },
    navigationModel: {
      get () {
        return this.value || {}
      },
      set (data) {
        this.$emit('input', data)
      }
    }
  },
  watch: {
    'theFormData.childConf': {
      handler (data) {
        data = data || []
        this.optionData = [...data]
        this.setModelName()
        this.setLoading()
      },
      immediate: true
    }
  },
  methods: { // 与外界关联的主要有两类: 一类是将变更后的 layout 数据传输出去,一类是将要处理的数据信息传出去,放在 formLayout.vue 中处理
    relevanceModel(orginal, propName, data) {
      // 同一对象修改,不触发修改
      if(orginal[propName] === data) return
      orginal[propName] = data
      this.navigationModel = orginal
    },
    updateFormData (index, propName, newVal = []) {
      const newData = defaultsDeep({}, this.theFormData)
      newData.childConf[index][propName] = newVal
      this.executeParentListeners('updateFormData', newData)
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
      this.executeParentListeners('drop',{
        e,
        type: this.type,
        name: this.activeName,
        tabsDragToIndex: this.dragToIndex
      })
    },
    executeParentListeners(eventName, ...args) {
      if(!this.isDraggable) return
      const eventListener = this.$listeners[eventName]
      if (eventListener) {
        eventListener(...args)
      }
    },
    defComonent(){
      this.executeParentListeners('defComponent', {
        type: this.type,
        name: this.activeName,
        index: this.keyIndex
      })
    },
    updateDragItems (val) {
      this.executeParentListeners('updateDragItems', val)
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

