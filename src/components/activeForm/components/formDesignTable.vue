<template>
  <div class='form-design-table'>
    <div class='design-table-cell'>
      <div class='design-table-title' @click='showDetail=!showDetail' title='点击显示/隐藏详情'>
        {{theData.name}}
      </div>
      <div class='design-table-container' v-show='showDetail'>
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
  width: 100%;
  .design-table-cell {
    user-select: none;
    border: 1px solid #e6e6e6;
    margin: 15px 4px 0 20px;
    box-shadow: 0 0 2px 2px #e6e6e6;
  }
  .design-table-title{
    text-align: center;
    cursor: pointer;
    background-color: #e6e6e6;
  }
  .design-table-container {
    table {
      width: 100%;
      th,td{
        text-align: center;
      }
    }
  }
}
</style>



