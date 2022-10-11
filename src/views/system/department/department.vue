<template>
  <el-main>
    <!-- 条件查询区域 -->
    <el-form
      ref="searchFrom"
      :inline="true"
      size="mini"
    >
      <el-form-item>
        <el-input
          v-model="searchObj.departmentName"
          suffix-icon="el-icon-search"
          placeholder="请输入部门名称"
          @keyup.enter.native="search()"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="search()"
        >查询</el-button>
        <el-button
          size="mini"
          align="right"
          icon="el-icon-delete"
          @click="resetData()"
        >清空</el-button>
        <el-button
          type="success"
          icon="el-icon-circle-plus-outline"
          size="mini"
          @click="openAddWindow()"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table
      v-loading="isLoading"
      :data="tableData"
      style="width: 100%"
      row-key="id"
      border
      stripe
      default-expand-all
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        type="selection"
        width="50"
      />
      <el-table-column
        prop="departmentName"
        label="部门名称"
      />
      <el-table-column
        prop="phone"
        label="部门电话"
      />
      <el-table-column
        prop="address"
        label="部门地址"
      />
      <el-table-column
        prop="parentName"
        label="所属部门"
      />
      <el-table-column
        label="操作"
        width="280"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >修改</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加和修改窗口 -->
    <systemDialog
      :title="deptDialog.title"
      :visible="deptDialog.visible"
      :width="deptDialog.width"
      :height="deptDialog.height"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          ref="deptForm"
          :model="dept"
          :rules="deptRuler"
          :inline="true"
          size="mini"
        >
          <el-form-item
            label="所属部门"
            prop="parentName"
          >
            <el-input
              v-model="dept.parentName"
              :readonly="true"
              @click.native="openSelectDeptWindow()"
            />
          </el-form-item>
          <el-form-item
            prop="departmentName"
            label="部门名称"
          >
            <el-input
              v-model="dept.departmentName"
            />
          </el-form-item>
          <el-form-item
            prop="phone"
            label="部门电话"
          >
            <el-input
              v-model="dept.phone"
            />
          </el-form-item>
          <el-form-item
            prop="address"
            label="部门地址"
          >
            <el-input
              v-model="dept.address"
            />
          </el-form-item>
          <el-form-item
            prop="orderNum"
            label="序号"
          >
            <el-input
              v-model="dept.orderNum"
            />
          </el-form-item>
        </el-form>
      </div>
    </systemDialog>
    <!-- 选择所属部门 -->
    <systemDialog
      :title="parentDialog.title"
      :visible="parentDialog.visible"
      :width="parentDialog.width"
      :height="parentDialog.height"
      @onClose="onParentClose"
      @onConfirm="onParentConfirm"
    >
      <div slot="content">
        <el-tree
          ref="parentTree"
          :data="treeList"
          node-key="id"
          :props="defaultProps"
          empty-text="暂无数据"
          :default-expand-all="true"
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <div slot-scope="{node,data}" class="customer-tree-node">
            <!-- 判断当前节点是否有子节点 -->
            <span v-if="data.children.length == 0 ">
              <i class="el-icon-document" />
            </span>
            <span v-else @click="changeIcon(data)">
              <i v-if="data.open" class="el-icon-circle-plus-outline" />
              <i v-else class="el-icon-remove-outline" />
            </span>
            <span style="margin-left:3px">{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
    </systemDialog>
  </el-main>
</template>

<script>
// 导入api
import departmentApi from '@/api/system/department'
// 导入组件
import systemDialog from '@/components/system/systemDialog'
export default {
  // 注册组件
  components: {
    systemDialog
  },
  data() {
    return {
      searchObj: {
        departmentName: ''
      }, // 查询表单对象
      tableData: [],
      isLoading: true, // 表格加载状态
      deptDialog: {
        title: '', // 标题
        visible: false, // 是否显示
        width: 560, // 宽度
        height: 170 // 高度
      },
      // 选择所属部门
      parentDialog: {
        title: '', // 标题
        visible: false, // 是否显示
        width: 300, // 宽度
        height: 400 // 高度
      },
      dept: {
        id: '',
        pid: '',
        parentName: '', // 所属部门
        departmentName: '', // 部门名称
        phone: '', // 部门电话
        address: '', // 部门地址
        orderNum: '' // 序号
      },
      deptRuler: {
        parentName: [
          { required: true, message: '所属部门不能为空', trigger: 'change' }
        ],
        departmentName: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '部门电话不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '部门地址不能为空', trigger: 'blur' }
        ]
      },
      treeList: [], // 树形结构数据
      // 树形结构配置
      defaultProps: {
        children: 'children',
        label: 'departmentName'
      }
    }
  },
  created() {
    // 加载数据
    this.search()
  },
  methods: {
    resetData() {
      this.searchObj.departmentName = ''
      this.search()
    },
    // 查询
    search() {
      departmentApi.getDepartmentList(this.searchObj)
        .then(res => {
          if (res.code === 200) {
            this.isLoading = false
            this.tableData = res.data
          }
        })
    },
    changeIcon(data) {
      // 修改折叠的状态
      data.open = !data.open
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open
      // this.$refs.parentTree.$store.nodeMap[data.id].expanded = !data.open
    },
    /**
     * 窗口关闭
     *
     */
    onClose() {
      this.deptDialog.visible = false
    },
    /**
     * 窗口确认
     */
    onConfirm() {
      this.$refs.deptForm.validate(valid => {
        // 校验通过
        if (valid) {
          // 判断是新增还是修改
          if (this.dept.id === '') {
            // 发送添加请求
            departmentApi.saveDepartment(this.dept)
              .then(res => {
                if (res.code === 200) {
                  // 关闭窗口
                  this.deptDialog.visible = false
                  // 重新加载数据
                  this.search()
                  this.$message.success('操作成功')
                } else {
                  this.$message.error(res.message)
                }
              }).catch(err => {
                console.log(err)
              })
          } else {
            departmentApi.updateDepartment(this.dept)
              .then(res => {
                if (res.code === 200) {
                  // 关闭窗口
                  this.deptDialog.visible = false
                  this.$message.success('操作成功')
                  // 重新加载数据
                  this.search()
                } else {
                  this.$message.error(res.message)
                }
              }).catch(err => {
                console.log(err)
              })
          }
        }
      })
    },
    /**
     * 打开添加窗口
     */
    openAddWindow() {
      // 清空验证提示信息
      if (this.$refs.deptForm !== undefined) {
        this.$refs.deptForm.resetFields()
      }
      // 清空树形结构数据
      this.$resetForm('deptForm', this.dept)
      // 设置窗口属性
      this.deptDialog.title = '添加部门'
      this.deptDialog.visible = true
    },
    onParentClose() {
      this.parentDialog.visible = false
    },
    onParentConfirm() {
      this.parentDialog.visible = false
    },
    /**
     * 打开选择所属部门窗口
     */
    openSelectDeptWindow() {
      this.parentDialog.title = '选择所属部门'
      this.parentDialog.visible = true
      // 查询所有部门
      departmentApi.getParentTreeList().then(res => {
        this.treeList = res.data
      })
    },
    /**
     * 点击树形结构节点
     */
    handleNodeClick(data) {
      // 将选择的数据赋值给所属部门
      this.dept.pid = data.id
      this.dept.parentName = data.departmentName
    },
    /**
     *  编辑部门
     */
    handleEdit(row) {
      // 数据回显
      this.$objCopy(row, this.dept)
      // 设置窗口属性
      this.deptDialog.title = '编辑部门'
      this.deptDialog.visible = true
    },
    /**
     * 删除部门
     */
    async handleDelete(row) {
      const confirm = await this.$myConfirm('确定要删除吗')
      console.log(confirm)
      if (confirm) {
        departmentApi.deleteDepartmentById(row.id)
          .then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              // 重新加载数据
              this.search()
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
            console.log(err)
          })
      } else {
        this.$message.success('取消删除')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tree {
.el-tree-node {
position: relative;
padding-left: 10px;
}

.el-tree-node__children {
padding-left: 20px;
}
.el-tree-node :last-child:before {
height: 40px;
}
.el-tree > .el-tree-node:before {
border-left: none;
}
.el-tree > .el-tree-node:after {
border-top: none;
}
.el-tree-node:before,
.el-tree-node:after {
content: "";
left: -4px;
position: absolute;
right: auto;
border-width: 1px;
}
.tree :first-child .el-tree-node:before {
border-left: none;
}
.el-tree-node:before {
border-left: 1px dotted #d9d9d9;
bottom: 0px;
height: 100%;
top: -25px;
width: 1px;
}
.el-tree-node:after {
border-top: 1px dotted #d9d9d9;
height: 20px;
top: 14px;
width: 24px;
}
.el-tree-node__expand-icon.is-leaf {
width: 8px;
}
.el-tree-node__content > .el-tree-node__expand-icon {
display: none;
}
.el-tree-node__content {
line-height: 30px;
height: 30px;
padding-left: 10px !important;
}
}
::v-deep .el-tree > div {
&::before {
display: none;
}
&::after {
display: none;
}
}
</style>
