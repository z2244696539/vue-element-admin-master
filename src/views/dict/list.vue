<template>
  <div class="app-container">
    <el-form class="demo-form-inline" :inline="true">
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          :disabled="disable"
          @click="exportData"
        >下载</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
          :multiple="false"
          :on-success="uploadSuccess"
          class="upload-demo"
          :action="'http://localhost:8202/admin/cmn/dict/importDictData'"
          :on-error="uploadError"
        >
          <el-button size="mini" type="primary">上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="istLoading"
      :header-cell-style="{ 'text-align': 'center' }"
      :data="list"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="getChildren"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="名称" width="240" align="left" />
      <el-table-column
        prop="dictCode"
        align="center"
        label="编码"
        width="220"
      />
      <el-table-column prop="value" label="值" width="220" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
    </el-table>
  </div>
</template>
<script>
import dict from '@/api/common/dict'
export default {
  data() {
    return {
      list: [],
      // 计时器------导表按钮3秒内不能重复点击
      time: 3, // 秒数
      disable: false, // 导表按钮是否禁用
      guide: null, // 导表定时器
      istLoading: true // 列表是否加载中
    }
  },
  created() {
    this.getDictList(1)
  },
  methods: {
    // 上传失败
    uploadError() {
      this.$message({
        type: 'warning',
        message: '上传失败!'
      })
    },
    // 上传成功调用
    uploadSuccess() {
      // 刷新页面
      this.getDictList(1)
      this.$message({
        type: 'success',
        message: '上传成功!'
      })
    },
    // 导出按钮3秒内不能点击，3秒后恢复
    exportButton() {
      this.time = 3
      this.disable = true
      this.guide = setInterval(() => {
        this.time--
        if (this.time === 0) {
          clearInterval(this.guide)
          this.disable = false
        }
      }, 1000)
    },
    // 导出数据
    exportData() {
      this.exportButton()
      window.location.href = 'http://localhost:8202/admin/cmn/dict/exportData'
    },
    // 获取数据字典信息
    getDictList(id) {
      this.istLoading = true
      dict.dictList(id).then((res) => {
        this.list = res.data
        this.istLoading = false
      })
    },
    getChildren(tree, treeNode, resolve) {
      dict.dictList(tree.id).then((res) => {
        resolve(res.data)
      })
    }
  }
}
</script>
