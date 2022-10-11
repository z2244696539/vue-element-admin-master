<template>
  <div class="app-container">
    <el-descriptions title="基本信息" :column="2" border :content-style="CS" :label-style="LS">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile" />
          手机号码
        </template>
        {{ userInfo.phone }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          用户姓名
        </template>
        {{ userInfo.name }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          用户状态
        </template>
        {{ userInfo.param.statusString }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-timer" />
          注册时间
        </template>
        {{ userInfo.createTime }}
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions title="认证信息" :column="2" border :content-style="CS" :label-style="LS">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user-solid" />
          用户姓名
        </template>
        {{ userInfo.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-info" />
          证件类型
        </template>
        {{ userInfo.certificatesType }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-chat-line-square" />
          证件号码
        </template>
        {{ userInfo.certificatesNo }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-picture" />
          证件图片
        </template>
        <img :src="userInfo.certificatesUrl" width="80px">
      </el-descriptions-item>
    </el-descriptions>
    <h4>就诊人信息</h4>
    <el-table
      v-loading="isLoading"
      :data="patientList"
      stripe
      style="width: 100%"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
    >
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="param.certificatesTypeName" label="证件类型" />
      <el-table-column prop="certificatesNo" label="证件编号" />
      <el-table-column label="性别">
        <template slot-scope="scope">
          {{ scope.row.sex == 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="birthdate" label="出生年月" />
      <el-table-column prop="phone" label="手机" />
      <el-table-column label="是否结婚">
        <template slot-scope="scope">
          {{ scope.row.isMarry == 1 ? '时' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="param.fullAddress" label="地址" />
      <el-table-column prop="createTime" label="注册时间" />
    </el-table>

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
import userInfoApi from '@/api/user/userInfo'
export default {
  data() {
    return {
      userInfo: {
        phone: '',
        name: '',
        status: '',
        createTime: '',
        certificatesType: '',
        certificatesNo: '',
        certificatesUrl: '',
        param: {
          statusString: '',
          authStatusString: ''
        }
      },
      patientList: [],
      CS: {
        textAlign: 'center',
        maxWidth: '80px',
        wordBreak: 'break-all'
      },
      LS: {
        textAlign: 'center',
        fontWeight: '600',
        height: '40px',
        maxWidth: '80px',
        wordBreak: 'keep-all'
      },
      isLoading: true
    }
  },
  created() {
    const id = this.$route.params.id
    // 调用方法获取数据
    this.fetchUserInfo(id)
  },
  methods: {
  // 根据id查询医院信息
    fetchUserInfo(id) {
      userInfoApi.showDetailById(id).then(res => {
        this.userInfo = res.data.userInfo
        this.patientList = res.data.patientList
        this.isLoading = false
      })
    },
    // 返回列表页面
    back() {
      this.$router.push('/user/userInfo/list')
    }
  }
}
</script>
<style>
  .el-descriptions {
   margin-bottom: 20px;
}
</style>
