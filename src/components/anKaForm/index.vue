<template>
  <div class='anka-form'>
    <AnKaList
      class='anka-form-anka-list line-row'
      v-if='hasAnKaListData'
      :data='anKaListData'
      @click='anKaClick'
    />
    <div class='anka-form-container line-row'>
      <div class='anka-form-container-title'>
        审查起诉受理情况
      </div>
      <div class='anka-form-content'>
        <FormList
          class='anka-form-form-list line-row'
          v-if='hasFormListData' 
          :data='theFormListData'
          @click='formListClick'
        />
        <FormInfo
          class='anka-form-form-info line-row'
          v-if='hasFormInfoData'
          :data.sync='formData'
          :title='formTitle'
        />
      </div>
    </div>
  </div>
</template>

<script>
import AnKaList from '../anKaList'
import FormList from '../formList'
import FormInfo from '../formInfo'
export default {
  name: 'anKaForm', // 案卡表单
  components: {
    AnKaList, FormList, FormInfo
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      anKaListSelectedId: '',
      formListSelectedIds: [],
      formInfoSelectedId: ''
    }
  },
  computed: {
    hasAnKaListData () {
      const data = this.anKaListData
      const {title} = data[0] || {}
      return data.length > 1 || !!title
    },
    anKaListData () {
      // akmbbh: 案卡模板编码, akmbmc: 案卡模板名称
      const data = this.data // 根据数据这样解析,有需要再改变
      return data.map(item => {
        let {akmbbh: id, akmbmc: title} = item
        return {id, title}
      })
    },
    anKaListId () {
      let anKaId = this.anKaListSelectedId
      if(anKaId === '' || anKaId == null) {
        const data = this.anKaListData[0] || {}
        const {id = 0} = data
        anKaId = id
      }
      return anKaId
    },
    formListDataParse () {
      const selectedId = this.anKaListId
      return this.data.find(item => item['akmbbh'] === selectedId)
    },
    hasFormListData () {
      return this.formListData.length > 0
    },
    formListAllData () {
      const formInfoData = this.formListDataParse || {}
      const {akTables} = formInfoData
      return akTables || []
    },
    formListData () {
      // stbm: 实体编码; stmc: 实体名称
      return this.formListAllData.map(item => {
        let {stbm: id, stmc: title} = item
        return {id, title}
      })
    },
    theFormListData () { // 测试用
      const data = this.formListData
      return [
        ...data, {
        title: '受理情况',
        id: 'slqk',
        data
      }]
    },
    formListId () {
      // 第一个节点id为父节点id, 第二个节点子节点id
      let listIds = this.formListSelectedIds || []
      if(listIds.length <= 0) {
        const parentData = this.theFormListData[0] || {}
        const {id = 0, data = []} = parentData
        let childId
        if (data.length > 0) {
          ({id: childId} = data[0])
        }
        listIds = [id, childId]
      }
      return listIds
    },
    formInfoDataParse () {
      // const [parentId, childId] = this.formListId
      const [parentId] = this.formListId
      return this.formListAllData.find(item => item['stbm'] === parentId)
    },
    hasFormInfoData () {
      return !!this.formInfoDataParse
    },
    formInfoData () {
      const data = this.formInfoDataParse || {}
      const {children = []} = this.formInfoDataParse || {} // 先用children来代替下层吧(具体的未来再处理)
      let formInfoData, title
      if (children.length > 0) {
        // 先不处理
      } else {
        ({tablefields: formInfoData, stmc: title} = data)
      }
      return {
        data: formInfoData,
        title: title
      }
    },
    formInfoId () {
      let {data} = this.formInfoData
      data = data[0] || {}
      const {id = 0} = data
      return this.formInfoSelectedId || id
    },
    formData: {
      get () {
        return this.formInfoData.data
      },
      set (val) {
        this.formInfoData.data = val
      }
    },
    formTitle () {
      return this.formInfoData.title
    }

  },
  methods: {
    // anKaClick (id, item) {
    anKaClick (id, item) {
      this.anKaListSelectedId = id
    },
    formListClick (parentId, id, item) { // 如果parentId存在, id不存在,则证明只有一层
      // this.selectedItem = item
      this.formListSelectedIds = [parentId, id]
    }
  }
}
</script>

<style lang="less">
@margin-width: 15px;
@anka-list-width: 250px;
@title-height: 40px;
@border-style: 1px solid #c0cfe5;
@border-style-Light: 1px solid #d8e7f2;
@form-list-width: 250px;
.border-box() {
  box-sizing: border-box;
}
.anka-form {
  margin: @margin-width;
  .anka-form-container {
    height: 100%;
    margin-left: @margin-width;
    width: calc(100% - @margin-width - @anka-list-width);
    .border-box();
    .anka-form-container-title{
      background: #d1e4f5;
      height: @title-height;
      line-height: @title-height;
      padding-left: @margin-width;
      color: #000;
      border: @border-style;
      .border-box();
    }
    .anka-form-content {
      height: calc(100% - @title-height);
      .border-box();
    }
  }
  .line-row {
    display: inline-block;
  }
  .anka-form-anka-list {
    width: @anka-list-width;
  }
  .anka-form-form-info, .anka-form-form-list, .anka-form-anka-list {
    vertical-align: top;
    .border-box();
  }
  .anka-form-form-list {
    width: @form-list-width;
    border-left: @border-style;
    border-bottom: @border-style;
    border-right: @border-style-Light;
    // margin-left: @margin-width;
  }
  .anka-form-form-info {
    width: calc(100% - @form-list-width);
    padding-left: @margin-width;
    border-bottom: @border-style;
    border-right: @border-style;
  }
}
</style>