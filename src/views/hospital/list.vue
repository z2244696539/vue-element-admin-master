<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select
          v-model="searchObj.provinceCode"
          placeholder="请选择省"
          @change="provinceChanged()"
        >
          <el-option
            v-for="item in provinceList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select
          v-model="searchObj.cityCode"
          placeholder="请选择市"
          @change="cityChanged()"
        >
          <el-option
            v-for="item in cityList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select
          v-model="searchObj.districtCode"
          placeholder="请选择区"
          @change="$forceUpdate()"
        >
          <el-option
            v-for="item in districtCodeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-input v-model="searchObj.hosName" placeholder="医院名称" />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- banner列表 -->
    <el-table
      v-loading="istLoading"
      :data="list"
      border
      fit
      highlight-current-row
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
    >

      <el-table-column
        label="序号"
        width="60"
      >
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="医院logo">
        <template slot-scope="scope">
          <img :src="'data:image/jpeg;base64,'+scope.row.logoData" width="80">
        </template>
      </el-table-column>

      <el-table-column prop="hosName" label="医院名称" />
      <el-table-column prop="param.hosTypeName" label="等级" width="90" />
      <el-table-column prop="param.fullAddress" label="详情地址" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === 0 ? '未上线' : '已上线' }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />

      <el-table-column label="操作" width="230" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 1"
            type="primary"
            size="mini"
            @click="updateStatus(scope.row.id,0)"
          >下线</el-button>
          <el-button
            v-if="scope.row.status === 0"
            type="warning"
            size="mini"
            @click="updateStatus(scope.row.id,1)"
          >上线</el-button>
          <router-link :to="'/hospital/show/'+scope.row.id">
            <el-button
              style="margin-left:10px"
              type="primary"
              size="mini"
            >查看</el-button>
          </router-link>
          <router-link :to="'/hospital/schedule/'+scope.row.hosCode">
            <el-button
              style="margin-left:10px"
              type="primary"
              size="mini"
            >排班</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchData"
      @size-change="changeSize"
    />
  </div>
</template>

<script>
import hospital from '@/api/hospital/hospital'
export default {
  data() {
    return {
      istLoading: true, // 数据是否正在加载
      list: null, // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单对象
      provinceList: [], // 省列表
      cityList: [], // 市列表
      districtCodeList: [] // 区列表
    }
  },
  created() {
    // 调用获取医院数据方法
    this.fetchData()
    // 调用获取所有省数据方法
    this.findAllProvince()
  },
  methods: {
    // 获取医院数据
    fetchData(page = 1) {
      this.page = page
      this.istLoading = true
      hospital.getHospital(this.page, this.limit, this.searchObj)
        .then(res => {
          this.list = res.data.records
          this.total = res.data.total
          this.istLoading = false
        })
    },
    // 获取所有省份列表
    findAllProvince() {
      hospital.findByDictCode('Province')
        .then(res => {
          this.provinceList = res.data
        })
    },
    // 点击省份获取所有市列表
    provinceChanged() {
      // 初始化
      this.cityList = []
      this.districtCodeList = []
      this.searchObj.cityCode = null
      this.searchObj.districtCode = null
      hospital.findChildId(this.searchObj.provinceCode)
        .then(res => {
          this.cityList = res.data
        })
    },
    changeSize(size) {
      this.limit = size
      this.fetchData()
    },
    cityChanged() {
      // 初始化
      this.districtCodeList = []
      this.searchObj.districtCode = null
      hospital.findChildId(this.searchObj.cityCode)
        .then(res => {
          this.districtCodeList = res.data
        })
    },
    // 更新状态
    updateStatus(id, status) {
      hospital.updateStatus(id, status)
        .then(res => {
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.fetchData(this.page)
        })
    },
    // 重置查询表单
    resetData() {
      this.searchObj = {}
      this.fetchData()
    }

  }
}
</script>
