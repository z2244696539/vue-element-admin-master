<template>
  <div class="app-container">
    <!-- 工具条 -->
    <el-form :inline="true" class="demo-form-inline"> <!-- inline 一行显示 -->
      <el-form-item>
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          :disabled="multipleStatus"
          @click="removeRows()"
        >批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="searchObj.hosname"
          size="mini"
          placeholder="医院名称"
          suffix-icon="el-icon-search"
          @keyup.enter.native="getList()"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="searchObj.hoscode"
          size="mini"
          align="right"
          placeholder="医院编号"
          suffix-icon="el-icon-search"
          @keyup.enter.native="getList()"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          align="right"
          icon="el-icon-search"
          @click="getList()"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="istLoading"
      :data="list"
      stripe
      style="width: 100%"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column prop="hosName" label="医院名称" />
      <el-table-column prop="hosCode" label="医院编号" />
      <el-table-column prop="apiUrl" label="api基础路径" width="200" />
      <el-table-column prop="contactsName" label="联系人姓名" />
      <el-table-column prop="contactsPhone" label="联系人手机" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? '可用' : '不可用' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          />
          <el-button
            v-if="scope.row.status === 1"
            type="primary"
            size="mini"
            icon="el-icon-lock"
            @click="lockHospitalSet(scope.row.id,0)"
          />
          <el-button
            v-else
            type="danger"
            size="mini"
            icon="el-icon-unlock"
            @click="lockHospitalSet(scope.row.id,1)"
          />
          <router-link :to="'/hospitalSet/edit/'+scope.row.id">
            <el-button
              style="margin-left:10px"
              type="primary"
              size="mini"
              icon="el-icon-edit"
            />
          </router-link>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="current"
      :page-size="limit"
      :total="total"
      background
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>

<script>
import hospital from '@/api/hospital/hospitalSet'
export default {
  data() {
    return {
      searchObj: {}, // 搜索条件
      current: 1, // 当前页
      limit: 10, // 每页显示条数
      list: [], // 列表数据
      total: 0, // 总条数
      multipleSelection: [], // 批量选择的数据
      multipleStatus: true, // 批量选择状态
      istLoading: true // 列表加载状态
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
    getList(page = 1) {
      this.current = page
      this.istLoading = true
      hospital
        .getHospitalSetList(this.current, this.limit, this.searchObj)
        .then((res) => {
          this.list = res.data.records
          this.total = res.data.total
          this.istLoading = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 删除数据
    removeDataById(id) {
      this.$confirm('确定删除该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用接口删除数据
        hospital
          .removeHospitalSetById(id)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList(this.current)
          })
          .catch((err) => {
            console.log(err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 复选框选中事件
    handleSelectionChange(selection) {
      this.multipleSelection = selection
      if (selection != null && selection.length > 0) {
        this.multipleStatus = false
      } else {
        this.multipleStatus = true
      }
    },
    // 批量删除
    removeRows() {
      this.$confirm('确定删除选中的数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用接口删除数据
        hospital
          .removeHospitalSetByIds(this.multipleSelection.map((item) => item.id))
          .then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList(this.current)
          })
          .catch(
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 启用/禁用
    lockHospitalSet(id, status) {
      hospital
        .lockHospitalSetById(id, status)
        .then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getList(this.current)
        })
    }
  }
}
</script>
