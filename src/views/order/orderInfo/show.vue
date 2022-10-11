<template>
  <div class="app-container">
    <el-descriptions title="订单信息" :column="2" border :content-style="CS" :label-style="LS">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile" />
          订单交易号
        </template>
        {{ orderInfo.outTradeNo }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          医院名称
        </template>
        {{ orderInfo.hosName }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          科室名称
        </template>
        {{ orderInfo.depName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-timer" />
          医生职称
        </template>
        {{ orderInfo.title }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          安排日期
        </template>
        {{ orderInfo.reserveDate }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-timer" />
          预约号序
        </template>
        {{ orderInfo.number }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          医事服务费
        </template>
        {{ orderInfo.amount }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-timer" />
          建议取号时间
        </template>
        {{ orderInfo.fetchTime }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          取号地点
        </template>
        {{ orderInfo.fetchAddress }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-timer" />
          退号时间
        </template>
        {{ orderInfo.quitTime }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          订单状态
        </template>
        {{ orderInfo.param.orderStatusString }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-timer" />
          预约时间
        </template>
        {{ orderInfo.createTime }}
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions title="就诊人信息" :column="2" border :content-style="CS" :label-style="LS">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user-solid" />
          用户姓名
        </template>
        {{ patient.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-info" />
          证件类型
        </template>
        {{ patient.param.certificatesTypeName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-chat-line-square" />
          证件号码
        </template>
        {{ patient.certificatesNo }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user-solid" />
          用户性别
        </template>
        {{ patient.sex === 1 ? '男' : '女' }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-info" />
          出生日期
        </template>
        {{ patient.birthdate }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-chat-line-square" />
          联系电话
        </template>
        {{ patient.phone }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-info" />
          是否结婚
        </template>
        {{ patient.isMarry === 1 ? '是' : '否' }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-chat-line-square" />
          联系地址
        </template>
        {{ patient.param.fullAddress }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-info" />
          联系人姓名
        </template>
        {{ patient.contactsName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-chat-line-square" />
          联系人证件类型
        </template>
        {{ patient.param.contactsCertificatesTypeName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-info" />
          联系人证件号码
        </template>
        {{ patient.contactsCertificatesNo }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-chat-line-square" />
          联系人手机
        </template>
        {{ patient.contactsPhone }}
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
import orderInfoApi from '@/api/hospital/orderInfo'
export default {
  data() {
    return {
      orderInfo: {
        outTradeNo: '',
        hosName: '',
        depName: '',
        title: '',
        reserveDate: '',
        number: '',
        amount: '',
        fetchTime: '',
        fetchAddress: '',
        quitTime: '',
        orderStatus: '',
        createTime: '',
        contactsCertificatesNo: '',
        param: {
          orderStatusString: '',
          fullAddress: ''
        }
      },
      patient: {
        birthdate: '',
        contactsName: '',
        contactsPhone: '',
        fullAddress: '',
        contactsCertificatesNo: '',
        isMarry: '',
        name: '',
        phone: '',
        param: {
          certificatesTypeName: '',
          contactsCertificatesTypeName: ''
        }
      },
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
      listLoading: true
    }
  },
  created() {
    const id = this.$route.params.id
    // 调用方法获取数据
    this.fetchData(id)
  },
  methods: {
  // 根据id查询订单信息
    fetchData(id) {
      orderInfoApi.getById(id).then(res => {
        this.orderInfo = res.data.orderInfo
        this.patient = res.data.patient
      })
    },
    // 返回列表页面
    back() {
      this.$router.push('/order/orderInfo/list')
    }
  }
}
</script>
<style>
  .el-descriptions {
   margin-bottom: 20px;
}
</style>
