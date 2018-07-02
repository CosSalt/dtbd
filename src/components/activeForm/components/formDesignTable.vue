<template>
  <div class='form-design-table'>
    <div class='design-table-cell'>
      <div class='design-table-title' title='拖拽区'>
        {{theData.name}}
      </div>
      <div class='design-table-container'>
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
    margin-left: 20px;
    margin-top: 5px;
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



