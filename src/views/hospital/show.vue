<template>
  <div class="app-container">
    <el-descriptions title="基本信息" :column="2" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-first-aid-kit" />
          医院名称
        </template>
        {{ hospital.hosName }} | {{ hospital.param.hosTypeName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-opportunity" />
          医院logo
        </template>
        <img :src="'data:image/jpeg;base64,'+hospital.logoData" width="50">
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          医院编号
        </template>
        {{ hospital.hosCode }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-map-location" />
          医院地址
        </template>
        {{ hospital.param.fullAddress }}
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions :column="1" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-promotion" />
          坐车路线
        </template>
        {{ hospital.route }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-info" />
          医院详情
        </template>
        {{ hospital.intro }}
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions title="预约规则信息" :column="2" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-time" />
          预约周期
        </template>
        {{ bookingRule.cycle }}天
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-time" />
          放号时间
        </template>
        {{ bookingRule.releaseTime }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-time" />
          停约时间
        </template>
        {{ bookingRule.stopTime }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-time" />
          退号时间
        </template>
        前一工作日{{ bookingRule.quitTime }}前
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions :column="1" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-chat-line-square" />
          预约规则
        </template>
        <ol>
          <li
            v-for="item in bookingRule.ruleList"
            :key="item.id"
          >
            {{ item }}
          </li>
        </ol>
      </el-descriptions-item>
    </el-descriptions>

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
      hospital: {
        hosName: '',
        hosCode: '',
        logoData: '',
        param: {
          hosTypeName: '',
          fullAddress: ''
        },
        route: '',
        intro: ''
      },
      bookingRule: {
        cycle: '',
        releaseTime: '',
        stopTime: '',
        quitTime: ''
      }
    }
  },
  created() {
    const id = this.$route.params.id
    // 调用方法获取数据
    this.fetchHospital(id)
  },
  methods: {
  // 根据id查询医院信息
    fetchHospital(id) {
      hospital.getHospitalDetail(id).then(res => {
        this.hospital = res.data.hospital
        this.bookingRule = res.data.bookingRule
      })
    },
    // 返回列表页面
    back() {
      this.$router.push('/hospital/list')
    }
  }
}
</script>
<style>
  .el-descriptions {
   margin-bottom: 20px;
}
</style>

