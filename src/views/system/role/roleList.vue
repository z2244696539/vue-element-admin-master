<template>
  <el-main>
    <!-- 查询条件 -->
    <!-- <el-form
      ref="searchForm"
      :model="searchModel"
      label-width="80px"
      :inline="true"
      size="mini"
    >
      <el-form-item>
        <el-input v-model="searchModel.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search">查询</el-button>
        <el-button icon="el-icon-refresh-right">重置</el-button>
        <el-button type="success" icon="el-icon-plus">新增</el-button>
      </el-form-item>
    </el-form> -->
    <el-form
      ref="searchForm"
      :model="searchModel"
      size="mini"
      :inline="true"
      class="demo-form-inline"
      label-width="80px"
    >
      <el-form-item>
        <el-input
          v-model="searchModel.roleName"
          size="mini"
          placeholder="请输入角色名称"
          suffix-icon="el-icon-search"
          @keyup.enter.native="search()"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          align="right"
          icon="el-icon-search"
          @click="search()"
        >查询</el-button>
        <el-button
          size="mini"
          align="right"
          icon="el-icon-delete"
          @click="resetData()"
        >清空</el-button>
        <el-button
          size="mini"
          align="right"
          type="success"
          icon="el-icon-circle-plus-outline"
          @click="openAddWindow()"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <el-table
      v-loading="isLoading"
      :data="roleList"
      stripe
      style="width: 100%"
      border
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
    >
      <el-table-column
        prop="id"
        label="角色编号"
        width="100"
        align="center"
      />
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="remark" label="角色备注" />
      <el-table-column label="操作" align="center" width="290">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
          >编辑
          </el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
          <el-button
            icon="el-icon-setting"
            type="primary"
            size="small"
            @click="assignRole(scope.row)"
          >分配权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页工具栏 -->
    <el-pagination
      background
      :current-page="page"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 添加和修改角色窗口 -->
    <systemDialog
      :title="roleDialog.title"
      :visible="roleDialog.visible"
      :width="roleDialog.width"
      :height="roleDialog.height"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          ref="roleForm"
          :model="role"
          :rules="rules"
          label-width="80px"
          :inline="false"
          size="mini"
        >
          <el-form-item label="角色编码" prop="roleCode">
            <el-input v-model="role.roleCode" />
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="role.roleName" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="role.remark" type="textarea" :rows="5" />
          </el-form-item>
        </el-form>
      </div>
    </systemDialog>
    <!-- 分配权限弹窗 -->
    <system-dialog
      :title="assignDialog.title"
      :visible="assignDialog.visible"
      :width="assignDialog.width"
      :height="assignDialog.height"
      @onClose="onAssignClose"
      @onConfirm="onAssignConfirm"
    >
      <div slot="content">
        <el-tree
          ref="assignTree"
          :data="assignTreeData"
          node-key="id"
          :props="defaultProps"
          empty-text="暂无数据"
          :show-checkbox="true"
          :highlight-current="true"
          default-expand-all
          :default-checked-keys="rolePermissionList"
        />
      </div>
    </system-dialog>
  </el-main>
</template>
<script>
import roleApi from '@/api/system/role'
// 导入组件
import systemDialog from '@/components/system/systemDialog'
import leafUtils from '@/utils/leaf'
export default {
  components: {
    systemDialog
  },
  data() {
    return {
      // 查询条件
      searchModel: {
        roleName: '',
        userId: this.$store.getters.id // 用户id
      },
      page: 1, // 当前页码
      pageSize: 10, // 每页显示数量
      roleList: [], // 数据列表
      total: 0, // 总数量
      isLoading: true, // 是否加载中
      // 角色对象
      role: {
        id: '',
        roleCode: '',
        roleName: '',
        remark: '',
        createUser: this.$store.getters.id
      },
      rules: {
        roleCode: [{ required: true, trigger: 'blur', message: '请输入角色编码' }],
        roleName: [{ required: true, trigger: 'blur', message: '请输入角色名称' }]
      },
      roleDialog: {
        title: '',
        visible: false,
        width: 500,
        height: 230
      },
      assignDialog: {
        title: '',
        visible: false,
        width: 450,
        height: 300
      },
      roleId: '', // 角色id
      assignTreeData: [], // 分配权限树数据
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rolePermissionList: [] // 角色权限列表
    }
  },
  // 初始化时调用
  created() {
    this.search()
  },
  methods: {
    /**
     * 查询
     */
    search(page = 1) {
      this.page = page
      roleApi.getRoleList(this.page, this.pageSize, this.searchModel).then(res => {
        if (res.code === 200) {
          this.isLoading = false
          this.roleList = res.data.records
          this.total = res.data.total
        }
      })
    },
    /**
     * 重置查询条件
     */
    resetData() {
      this.searchModel.roleName = ''
      this.search()
    },
    /**
     * 当每页数量发生变化时触发该事件
     */
    handleSizeChange(size) {
      this.pageSize = size
      this.search(this.page)
    },
    /**
     * 当页码发生变化时触发该事件
     */
    handleCurrentChange(page) {
      this.page = page
      this.search(page)
    },
    /**
     * 打开编辑窗口
     */
    handleEdit(row) {
      this.$objCopy(row, this.role)
      this.roleDialog.title = '修改角色'
      this.roleDialog.visible = true
    },
    /**
     * 删除
     */
    async handleDelete(row) {
      const confirm = await this.$myConfirm('确定要删除吗')
      if (confirm) {
        roleApi.deleteRoleById(row.id)
          .then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              // 重新加载数据
              if (this.total % this.pageSize === 1) {
                this.page = this.page - 1
              }
              this.search(this.page)
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
            console.log(err)
          })
      } else {
        this.$message.success('取消删除')
      }
    },
    /**
     * 分配权限
     */
    assignRole(row) {
      this.roleId = row.id
      this.rolePermissionList = []
      roleApi.getAssignPermissionTree(this.$store.getters.id, row.id).then(res => {
        if (res.code === 200) {
          this.assignTreeData = res.data.permissionList
          // 获取当前登录用户拥有的所有权限
          const permissionList = res.data.permissionList
          // 获取当前被分配的角色已经拥有的权限信息
          const checkList = res.data.checkList
          // 判断当前菜单是否是末级
          const { setLeaf } = leafUtils()
          // 设置权限菜单列表
          const newPermissionList = setLeaf(permissionList)
          // 设置树节点菜单数据
          this.assignTreeData = newPermissionList
          // 将回调延迟到下次DOM更新循环之后执行,在修改数据之后立即使用它,然后等待DOM更新。
          this.$nextTick(() => {
          // 获取树菜单的节点数据
            const nodes = this.$refs.assignTree.children
            // 设置子节点
            this.setChild(nodes, checkList)
          })
        }
      })

      this.assignDialog.title = `给【${row.roleName}】分配权限`
      this.assignDialog.visible = true
    },
    setChild(childNodes, checkList) {
    // 判断是否存在子节点
      if (childNodes && childNodes.length > 0) {
        // 循环所有权限
        for (let i = 0; i < childNodes.length; i++) {
          // 根据 data 或者 key 拿到 Tree 组件中的 node
          const node = this.$refs.assignTree.getNode(childNodes[i])
          // 判断是否已经拥有对应的角色数据
          if (checkList && checkList.length > 0) {
          // 循环遍历已有的权限集合
            for (let j = 0; j < checkList.length; j++) {
            // 找到已经存在的菜单权限节点
              if (checkList[j] === childNodes[i].id) {
              // 如果节点是展开状态，则将树节点选中
                if (childNodes[i].open) {
                  this.$refs.assignTree.setChecked(node, true)
                  break
                }
              }
            }
          }
          // 如果存在子节点，则递归选中
          if (childNodes[i].children) {
            this.setChild(childNodes[i].children, checkList)
          }
        }
      }
    },
    /**
     * 关闭分配权限窗口
     */
    onAssignClose() {
      this.assignDialog.visible = false
    },
    /**
     * 分配权限确认
     */
    onAssignConfirm() {
      // 获取选中的树节点key
      const ids = this.$refs.assignTree.getCheckedKeys()
      // 获取选中的父节点id
      const pid = this.$refs.assignTree.getHalfCheckedKeys()
      console.log(this.$refs.assignTree)
      // 合并id数据
      const listId = ids.concat(pid)
      // 组装参数
      const params = {
        roleId: this.roleId,
        permissionIdList: listId
      }
      roleApi.saveOrUpdateRoleAssign(params).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.search()
          this.assignDialog.visible = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 新增角色
     */
    openAddWindow() {
      // 清空表单
      this.$resetForm('roleForm', this.role)
      // 设置窗口标题
      this.roleDialog.title = '新增角色'
      this.roleDialog.visible = true
    },
    /**
     * 提交表单
     */
    onConfirm() {
      this.$refs.roleForm.validate(valid => {
        this.role.createUser = this.$store.getters.id
        if (valid) {
        // 判断是新增还是修改
          if (this.role.id === '') {
            roleApi.saveRole(this.role).then(res => {
              if (res.code === 200) {
                this.$message.success('操作成功')
                this.roleDialog.visible = false
                if (this.page * this.pageSize < this.total) {
                  this.page = this.page + 1
                }
                this.search(this.page)
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            roleApi.updateRole(this.role).then(res => {
              if (res.code === 200) {
                this.$message.success('操作成功')
                this.roleDialog.visible = false
                this.search()
              } else {
                this.$message.error(res.message)
              }
            })
          }
        }
      })
    },
    /**
     * 关闭窗口
     */
    onClose() {
      this.roleDialog.visible = false
    }
  }
}
</script>
