<template>
  <div class='form-design-table'>
    <div class='design-table-cell'>
      <div class='design-table-title' v-if='!showDetail' @click='showDetail=!showDetail' title='点击显示/隐藏详情'>
        {{theData.name}}
      </div>
      <div class='table-container' v-else  @click='showDetail=!showDetail' :title='theData.name'>
        <table>
          <thead>
            <tr>
              <template v-for='headKey in $head'>
                <th :key='headKey'> {{headKey}}</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for='(tblTr, index) in theData.data' :key='index'>
              <template v-for ='headKey in $head'>
                <td :key='headKey'> {{tblTr[headKey]}}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'formDesignTable',
  beforeCreate () {
    this.$head = [
      'id', 'labelText'
    ]
  },
  props: {
    tblData: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      showDetail: false
    }
  },
  computed: {
    theData () {
      const data = this.tblData
      return data
    }
  },
}
</script>
<style lang="less">
.form-design-table {
  box-sizing: border-box;
  padding:1px 10px;
  margin: 10px 0;
  width: 100%;
  .design-table-cell {
    user-select: none;
  }
  .design-table-title{
    text-align: center;
    cursor: pointer;
    background-color: #e6e6e6;
  }
  .table-container {
    cursor: pointer;
    font-size: 14px;
    table {
      border: 1px solid #96BCE4;
      box-shadow: 1px 1px 1px 0px #96BCE4;
      width: 100%;
      box-shadow: 2px;
      thead{
        background-color: #EFEFEF;
        th{
          font-weight: 500;
          font-size: 15px;
        }
      }
      tbody{
        background-color: #fff;
      }
      th,td{
        color: 666666;
        text-align: center;
      }
    }
  }
}
</style>
