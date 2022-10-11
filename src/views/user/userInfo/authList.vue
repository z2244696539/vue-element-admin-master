<template>
  <div class="app-container">
    <!-- 工具条 -->
    <el-form :inline="true" class="demo-form-inline"> <!-- inline 一行显示 -->
      <!-- <el-form-item>
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          :disabled="multipleStatus"
          @click="removeRows()"
        >批量删除</el-button>
      </el-form-item> -->
      <el-form-item>
        <el-input
          v-model="searchObj.keyword"
          size="mini"
          placeholder="姓名/手机号"
          suffix-icon="el-icon-search"
          @keyup.enter.native="fetchData()"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="searchObj.createTimeBegin"
          size="mini"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="searchObj.createTimeEnd"
          size="mini"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          align="right"
          icon="el-icon-search"
          @click="fetchData()"
        >查询</el-button>
        <el-button
          size="mini"
          align="right"
          icon="el-icon-delete"
          @click="resetData()"
        >清空</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      style="width: 100%"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
    >
      <!-- @selection-change="handleSelectionChange" -->
      <el-table-column type="selection" width="50" />
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="scope">
          <!-- <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          /> -->
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-lock"
            @click="approval(scope.row.id,2)"
          >通过</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-unlock"
            @click="approval(scope.row.id,-1)"
          > 不通过</el-button>
          <router-link :to="'/user/userInfo/show/'+scope.row.id">
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
      :current-page="page"
      :page-size="limit"
      :total="total"
      background
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
      @size-change="changeSize"
    />
  </div>
</template>
<script>
import userInfoApi from '@/api/user/userInfo'
export default {
  // 定义数据
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: null, // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {
        keyword: '',
        createTimeBegin: '',
        createTimeEnd: '',
        authStatus: 1
      } // 查询表单对象
    }
  },
  // 当页面加载时获取数据
  created() {
    this.fetchData()
  },
  methods: {
    // 调用api层获取数据库中的数据
    fetchData(page = 1) {
      console.log('翻页。。。' + page)
      // 异步获取远程数据（ajax）
      this.page = page
      userInfoApi
        .findList(this.page, this.limit, this.searchObj)
        .then((response) => {
          this.list = response.data.records
          this.total = response.data.total
          // 数据加载并绑定成功
          this.listLoading = false
        })
    },
    // 当页码发生改变的时候
    changeSize(size) {
      console.log(size)
      this.limit = size
      this.fetchData(this.page)
    },
    // 重置查询表单
    resetData() {
      console.log('重置查询表单')
      this.searchObj = { authStatus: 1 }
      this.fetchData()
    },
    // 用户认证审批
    approval(id, authStatus) {
      this.$confirm('确定要操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userInfoApi
          .approval(id, authStatus)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.fetchData(this.page)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  }
}
</script>
