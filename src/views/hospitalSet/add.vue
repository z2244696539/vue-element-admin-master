<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="医院名称">
        <el-input v-model="hospitalSet.hosName" />
      </el-form-item>
      <el-form-item label="医院编号">
        <el-input v-model="hospitalSet.hosCode" />
      </el-form-item>
      <el-form-item label="api基础路径">
        <el-input v-model="hospitalSet.apiUrl" />
      </el-form-item>
      <el-form-item label="联系人姓名">
        <el-input v-model="hospitalSet.contactsName" />
      </el-form-item>
      <el-form-item label="联系人手机">
        <el-input v-model="hospitalSet.contactsPhone" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import hospital from '@/api/hospital/hospitalSet'
export default {
  data() {
    return {
      hospitalSet: {}
    }
  },
  created() {
    // 获取路由参数
    if (this.$route.params.id && this.$route.params.id) {
      const id = this.$route.params.id
      this.getHospitalSetById(id)
    }
  },
  methods: {
    // 根据id查询
    getHospitalSetById(id) {
      hospital
        .getHospitalSetById(id)
        .then(res => {
          this.hospitalSet = res.data
        })
    },
    save() {
      hospital
        .saveHospitalSet(this.hospitalSet)
        .then(res => {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          // 跳转到列表页面,使用路由跳转
          this.$router.push('/hospitalSet/list')
        })
    },
    update() {
      hospital
        .updateHospitalSet(this.hospitalSet)
        .then(res => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          // 跳转到列表页面,使用路由跳转
          this.$router.push('/hospitalSet/list')
        })
    },
    // 保存或更新
    saveOrUpdate() {
      // 判断添加还是修改
      if (this.hospitalSet.id) {
        this.update()
      } else {
        this.save()
      }
    }
  }
}
</script>
