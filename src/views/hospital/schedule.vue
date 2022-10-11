<template>
  <div class="app-container">
    <div style="margin-bottom: 10px;font-size: 10px;">选择：{{ hosName }}  /  {{ depName }}  /  {{ workDate }}</div>
    <el-container style="height: 100%">
      <el-aside width="280px" style="border: 1px silver solid">
        <!-- 部门 -->
        <el-scrollbar style="height:400px">
          <el-tree
            :data="data"
            :props="defaultProps"
            :default-expand-all="true"
            @node-click="handleNodeClick"
          />
        </el-scrollbar>
      </el-aside>
      <el-main style="padding: 0 0 0 20px;">
        <el-row style="width: 100%">
          <!-- 排班日期 分页 -->
          <el-tag
            v-for="(item,index) in bookingScheduleList"
            :key="item.id"
            :type="index == activeIndex ? '' : 'info'"
            style="height: 60px;margin-right: 5px;margin-right:15px;cursor:pointer;"
            @click="selectDate(item.workDate, index)"
          >
            {{ item.workDate }} {{ item.dayOfWeek }}
            <br>
            {{ item.availableNumber }} / {{ item.reservedNumber }}
          </el-tag>

          <!-- 分页 -->
          <el-pagination
            :current-page="page"
            :total="total"
            :page-size="limit"
            class="pagination"
            layout="prev, pager, next"
            @current-change="getPage"
          />
        </el-row>
        <el-row style="margin-top: 20px;">
          <!-- 排班日期对应的排班医生 -->
          <el-table
            v-loading="istLoading"
            :data="scheduleList"
            border
            fit
            highlight-current-row
          >
            <el-table-column
              label="序号"
              width="60"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="职称" width="150">
              <template slot-scope="scope">
                {{ scope.row.title }} | {{ scope.row.doctorName }}
              </template>
            </el-table-column>
            <el-table-column label="号源时间" width="80">
              <template slot-scope="scope">
                {{ scope.row.workTime == 0 ? "上午" : "下午" }}
              </template>
            </el-table-column>
            <el-table-column prop="reservedNumber" label="可预约数" width="80" />
            <el-table-column prop="availableNumber" label="剩余预约数" width="100" />
            <el-table-column prop="amount" label="挂号费(元)" width="90" />
            <el-table-column prop="skill" label="擅长技能" />
          </el-table>
        </el-row>
      </el-main>
    </el-container>
    <el-form :inline="true" class="demo-form-inline" align="center"> <!-- inline 一行显示 -->
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          @click="back()"
        >返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import hospital from '@/api/hospital/hospital'
export default {
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'depName'
      },
      hosCode: null,
      activeIndex: 0,
      depCode: null,
      depName: null,
      workDate: null,
      hosName: null,
      scheduleList: [],
      bookingScheduleList: [],
      baseMap: {},
      page: 1, // 当前页
      limit: 7, // 每页个数
      total: 0, // 总页码
      istLoading: true
    }
  },
  created() {
    this.hosCode = this.$route.params.hosCode
    this.workDate = this.getCurDate()
    this.fetchData()
  },
  methods: {
    // 查询排版详细信息
    getScheduleDetail() {
      this.istLoading = true
      hospital.getScheduleDetail(this.hosCode, this.depCode, this.workDate)
        .then(res => {
          this.scheduleList = res.data
          this.istLoading = false
        }).catch(err => {
          console.log(err)
        })
    },
    fetchData() {
      hospital.getDepartmentListByHosCode(this.hosCode)
        .then(res => {
          this.data = res.data
          if (this.data.length > 0) {
            this.depCode = this.data[0].children[0].depCode
            this.depName = this.data[0].children[0].depName
            this.getPage()
          }
        })
    },
    getPage(page = 1) {
      this.page = page
      this.workDate = null
      this.activeIndex = 0
      this.getScheduleRule()
    },

    getScheduleRule() {
      hospital.getScheduleRule(this.page, this.limit, this.hosCode, this.depCode)
        .then(response => {
          this.hosName = response.data.hosName
          this.bookingScheduleList = response.data.bookingScheduleRuleVoList

          this.total = response.data.total
          this.baseMap = response.data.baseMap
          if (this.workDate === null) {
            this.workDate = this.bookingScheduleList[0].workDate
          }
          //
          this.getScheduleDetail()
        }).catch(err => {
          console.log(err)
        })
    },

    handleNodeClick(data) {
      // 科室大类直接返回
      if (data.children != null) return
      this.depCode = data.depCode
      this.depName = data.depName
      this.getPage(1)
      this.scheduleList = []
    },

    selectDate(workDate, index) {
      this.workDate = workDate
      this.activeIndex = index
      this.getScheduleDetail()
    },

    getCurDate() {
      var datetime = new Date()
      var year = datetime.getFullYear()
      var month = datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1
      var date = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate()
      return year + '-' + month + '-' + date
    },
    back() {
      this.$router.push('/hospital/list')
    }

  }
}
</script>
<style>
  .el-tree-node.is-current > .el-tree-node__content {
    background-color: #409EFF !important;
    color: white;
   }

  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: black;
   }
</style>
