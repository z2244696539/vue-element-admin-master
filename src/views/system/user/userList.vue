<template>
  <el-container :style="{ height: containerHeight + 'px' }">
    <!-- 左侧部门树形菜单列表 -->
    <el-aside
      style="
      padding: 10px 0px 0px 0px;
      background: #fff;
      border-right: 1px solid #dfe6ec;
      "
      width="220px"
    >
      <el-tree
        ref="leftTree"
        style="font-size: 14px"
        :data="deptList"
        node-key="id"
        :props="defaultProps"
        default-expand-all
        empty-text="暂无数据"
        :show-checkbox="false"
        :highlight-current="true"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      >
        <div slot-scope="{ node, data }" class="custom-tree-node">
          <div>
            <span v-if="data.children.length == 0">
              <i class="el-icon-document" />
            </span>
            <span v-else @click.stop="changeIcon(data)">
              <i v-if="data.open" class="el-icon-circle-plus-outline" />
              <i v-else class="el-icon-remove-outline" />
            </span>
            <!-- 名称 -->
            <span style="margin-left: 3px">{{ node.label }}</span>
          </div>
        </div>
      </el-tree>
    </el-aside>
    <!-- 右侧用户数据 -->
    <!-- 表格数据 -->
    <el-main>
      <!-- 查询条件 -->
      <el-form
        ref="searchForm"
        :model="searchModel"
        label-width="80px"
        :inline="true"
        size="small"
      >
        <el-form-item>
          <el-input
            v-model="searchModel.username"
            size="mini"
            suffix-icon="el-icon-search"
            placeholder="请输入用户名"
            @keyup.enter.native="search()"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchModel.realName"
            size="mini"
            suffix-icon="el-icon-search"
            placeholder="请输入真实姓名"
            @keyup.enter.native="search()"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchModel.phone"
            size="mini"
            suffix-icon="el-icon-search"
            placeholder="请输入电话"
            @keyup.enter.native="search()"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            icon="el-icon-search"
            type="primary"
            @click="search(departmentId,page)"
          >查询</el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            @click="resetValue()"
          >重置</el-button>
          <el-button
            icon="el-icon-plus"
            size="mini"
            type="success"
            @click="openAddWindow()"
          >新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 用户表格数据 -->
      <!--  -->
      <el-table
        v-loading="isLoading"
        :data="userList"
        :height="tableHeight"
        border
        stripe
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        default-expand-all
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        :tree-props="{children: 'children'}"
      >
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="realName" label="姓名" />
        <el-table-column prop="departmentName" label="所属部门" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column align="center" width="290" label="操作">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-button
              icon="el-icon-setting"
              type="primary"
              size="mini"
              @click="assignRole(scope.row)"
            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页工具栏 -->
      <el-pagination
        background
        :current-page="page"
        :page-sizes="[5,7, 10, 20, 30, 40, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- 添加和编辑用户窗口 -->
      <systemDialog
        :title="userDialog.title"
        :height="userDialog.height"
        :width="userDialog.width"
        :visible="userDialog.visible"
        @onClose="onClose"
        @onConfirm="onConfirm"
      >
        <div slot="content">
          <el-form
            ref="userForm"
            :model="user"
            :rules="rules"
            label-width="80px"
            :inline="true"
            size="small"
          >
            <el-form-item prop="username" label="用户名">
              <el-input v-model="user.username" />
            </el-form-item>
            <el-form-item v-if="user.id === ''" prop="password" label="密码">
              <el-input v-model="user.password" type="password" />
            </el-form-item>
            <el-form-item prop="departmentName" label="所属部门">
              <el-input
                v-model="user.departmentName"
                :readonly="true"
                @click.native="selectDepartment()"
              />
            </el-form-item>
            <el-form-item prop="realName" label="姓名">
              <el-input v-model="user.realName" />
            </el-form-item>
            <el-form-item prop="phone" label="电话">
              <el-input v-model="user.phone" />
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="user.nickName" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email" />
            </el-form-item>
            <el-form-item prop="gender" label="性别">
              <el-radio-group v-model="user.gender">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="http://localhost:8203/admin/oss/file/fileUpload?module=avatar"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :data="uploadHeader"
              >
                <img v-if="user.avatar" :src="user.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </systemDialog>
      <!-- 所属部门弹框 -->
      <system-dialog
        :title="parentDialog.title"
        :width="parentDialog.width"
        :height="parentDialog.height"
        :visible="parentDialog.visible"
        @onClose="onParentClose"
        @onConfirm="onParentConfirm"
      >
        <div slot="content">
          <el-tree
            ref="parentTree"
            :data="parentList"
            default-expand-all
            node-key="id"
            :props="parentProps"
            :show-checkbox="false"
            :highlight-current="true"
            :expand-on-click-node="false"
            @node-click="parentClick"
          >
            <div slot-scope="{ node, data }" class="customer-tree-node">
              <span v-if="data.children.length == 0">
                <i class="el-icon-document" />
              </span>
              <span v-else @click="openParentBtn(data)">
                <i v-if="data.open" class="el-icon-circle-plus-outline" />
                <i v-else class="el-icon-remove-outline" />
              </span>
              <span style="margin-left: 3px">{{ node.label }}</span>
            </div>
          </el-tree>
        </div>
      </system-dialog>
      <!-- 分配角色窗口 -->
      <system-dialog
        :title="assignDialog.title"
        :height="assignDialog.height"
        :width="assignDialog.width"
        :visible="assignDialog.visible"
        @onClose="onAssignClose"
        @onConfirm="onAssignConfirm"
      >
        <div slot="content">
          <!-- 分配角色数据列表 -->
          <el-table
            ref="assignRoleTable"
            :data="assignRoleList"
            border
            stripe
            :height="assignHeight"
            style="width: 100%; margin-bottom: 10px"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
            />
            <el-table-column prop="roleCode" label="角色编码" />
            <el-table-column prop="roleName" label="角色名称" />
            <el-table-column prop="remark" label="角色备注" />
          </el-table>
          <!-- 分页工具栏 -->
          <el-pagination
            current-page.sync="roleVo.page"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="roleVo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            style="padding: 30px 0; text-align: center;"
            :total="roleVo.total"
            background
            @size-change="assignSizeChange"
            @current-change="assignCurrentChange"
          />
        </div>
      </system-dialog>
    </el-main>
  </el-container>
</template>

<script>
import departmentApi from '@/api/system/department'
import userApi from '@/api/user'
import systemDialog from '@/components/system/systemDialog'
import { getToken } from '@/utils/auth'
export default {
  components: {
    systemDialog
  },
  data() {
    // 自定义验证规则
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      // 使用正则表达式进行验证手机号码
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    const validPassword = (rule, value, callback) => {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
      if (!reg.test(value)) {
        callback(new Error('密码必须是由6-20位字母+数字组合'))
      } else {
        callback()
      }
    }
    // 验证密码是否一致
    // const checkPassword = (rule, value, callback) => {
    //   if (value.trim().length === 0) {
    //     callback(new Error('请确认密码不能为空'))
    //   } else if (value !== this.user.password) {
    //     callback(new Error('2次密码不一致'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      // 部门树形菜单列表
      deptList: [],
      // 部门树形菜单列表默认属性
      defaultProps: {
        children: 'children',
        label: 'departmentName'
      },
      containerHeight: 0,
      tableHeight: 0, // 表格高度
      userList: [], // 用户数据
      searchModel: {
        username: '',
        realName: '',
        phone: '',
        departmentId: ''
      }, // 查询条件
      page: 1, // 当前页码
      pageSize: 7, // 每页显示条数
      total: 0, // 总条数
      departmentId: '', // 部门id
      isLoading: true, // 是否显示加载中
      userDialog: {
        title: '',
        height: 410,
        width: 610,
        visible: false
      }, // 用户对象
      user: {
        id: '',
        departmentId: '',
        departmentName: '',
        email: '',
        realName: '',
        phone: '',
        nickName: '',
        password: '',
        username: '',
        gender: '',
        avatar: ''
      },
      rules: {
        departmentName: [{ required: true, trigger: 'change', message: '请选择所属部门' }],
        realName: [{ required: true, trigger: 'blur', message: '请填写姓名' }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        username: [{ required: true, trigger: 'blur', message: '请填写登录名' }],
        password: [{ required: true, trigger: 'blur', validator: validPassword }],
        gender: [{ required: true, trigger: 'change', message: '请选择性别' }]
      },
      parentDialog: {
        title: '选择所属部门',
        height: 300,
        width: 450,
        visible: false
      },
      parentProps: {
        children: 'children',
        label: 'departmentName'
      },
      parentList: [], // 所属部门节点数据
      // 文件上传携带的token
      uploadHeader: {
        'token': getToken()
      },
      // 分配角色窗口属性
      assignDialog: {
        title: '',
        visible: false,
        width: 800,
        height: 510
      },
      // 角色对象
      roleVo: {
        page: 1,
        pageSize: 10,
        userId: '',
        total: 0
      },
      assignRoleList: [], // 角色列表
      assignHeight: 0, // 分配角色表格高度
      selectedIds: [], // 被选中的角色id
      selectedUserId: '' // 被分配角色的用户ID
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 内容高度
      this.containerHeight = window.innerHeight - 85
      // 表格高度
      this.tableHeight = window.innerHeight - 250
      // 角色表格高度
      this.assignHeight = window.innerHeight - 350
    })
  },
  created() {
    this.getDepartmentList()
    this.search(this.page)
  },
  methods: {
    /**
     * 树点击时间
     */
    handleNodeClick(data) {
      // 将当前节点id赋值给查询条件
      this.searchModel.departmentId = data.id
      this.page = 1
      this.pageSize = 7
      this.search(this.page)
    },
    changeIcon(data) {
      // 修改折叠的状态
      data.open = !data.open
      this.$refs.leftTree.store.nodesMap[data.id].expanded = !data.open
      // this.$refs.parentTree.$store.nodeMap[data.id].expanded = !data.open
    },
    /**
     * 获取部门列表
     */
    getDepartmentList() {
      departmentApi.getDepartmentList().then(res => {
        if (res.code === 200) {
          this.deptList = res.data
        }
      })
    },
    /**
     * 查询用户列表
     */
    search(page = 1) {
      this.page = page
      userApi.getUserList(this.page, this.pageSize, this.searchModel).then(res => {
        if (res.code === 200) {
          this.userList = res.data.records
          this.total = res.data.total
          this.isLoading = false
        }
      })
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
      console.log(page)
      this.page = page
      this.search(page)
    },
    /**
     * 打开添加窗口
     */
    openAddWindow() {
      // 清空表单
      this.$resetForm('userForm', this.user)
      this.userDialog.title = '添加用户'
      this.userDialog.visible = true
    },
    /**
     * 重置查询条件
     */
    resetValue() {
      this.searchModel = {
        username: '',
        realName: '',
        phone: '',
        departmentId: ''
      }
      this.search()
    },
    /**
     * 窗口关闭事件
     */
    onClose() {
      this.userDialog.visible = false
    },
    /**
     * 窗口确认事件
     */
    onConfirm() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          // 判断是添加还是修改
          if (this.user.id === '') {
            // 添加
            userApi.saveUser(this.user).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.userDialog.visible = false
                if (this.page * this.pageSize < this.total) {
                  this.page = this.page + 1
                }
                this.search(this.page)
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
            })
          } else {
            // 修改
            userApi.updateUser(this.user).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.userDialog.visible = false
                this.search()
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
            })
          }
        }
      })
    },
    /**
     * 选中所属部门
     */
    selectDepartment() {
      // 查询所有部门
      departmentApi.getDepartmentList().then(res => {
        if (res.code === 200) {
          this.parentList = res.data
          this.parentDialog.visible = true
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
      //
    },
    /**
     * 选中所属部门关闭事件
     */
    onParentClose() {
      this.parentDialog.visible = false
    },
    /**
     * 选中所属部门确认事件
     */
    onParentConfirm() {
      this.parentDialog.visible = false
    },
    /**
     * 图标点击事件 加号减号
     */
    openParentBtn(data) {
      data.open = !data.open
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open
    },
    // 所属部门树节点点击事件
    parentClick(data) {
      this.user.departmentId = data.id
      this.user.departmentName = data.departmentName
    },
    /**
     * 上传文件成功事件
     */
    handleAvatarSuccess(res, file) {
      this.user.avatar = res.data
      // 强制更新
      this.$forceUpdate()
    },
    beforeAvatarUpload(file) {
      // 判断文件类型
      const isJPG = file.type === 'image/jpeg ' || 'image/gif '
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG,GIF 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    /**
     * 修改用户信息
     */
    handleEdit(row) {
      // 回显数据
      this.$objCopy(row, this.user)
      this.userDialog.title = '修改用户'
      this.userDialog.visible = true
    },
    /**
     * 删除用户
     */
    async handleDelete(row) {
      const confirm = await this.$myConfirm('确定要删除吗')
      if (confirm) {
        userApi.deleteUser(row.id)
          .then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              // 重新加载数据
              console.log(this.page)
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
     * 分配角色
     */
    assignRole(row) {
      // 清空
      this.selectedIds = []
      // 被分配的用户id
      this.selectedUserId = row.id
      // 设置标题
      this.assignDialog.title = `给【${row.realName}】分配角色`
      this.assignDialog.visible = true
      // 调用查询角色列表的方法
      this.getAssignRoleList()
      // 查询用户已经拥有的角色 回显数据
      userApi.getRoleListByUserId(row.id).then(res => {
        // 如果存在数据
        if (res.code === 200 && res.data) {
          this.selectedIds = res.data
          // 循环
          this.selectedIds.forEach(key => {
            this.assignRoleList.forEach(item => {
              // 如果id相等,则设置为选中状态
              if (key === item.id) {
                this.$refs.assignRoleTable.toggleRowSelection(item, true)
              }
            })
          })
        }
      })
    },
    /**
     * 查询用角色列表
     */
    getAssignRoleList(page = 1, pageSize = 10) {
      this.roleVo.userId = this.$store.getters.id
      this.roleVo.page = page
      this.roleVo.pageSize = pageSize
      userApi.getRoleListForAssign(this.roleVo).then(res => {
        if (res.code === 200) {
          this.assignRoleList = res.data.records
          this.roleVo.total = res.data.total
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    /**
     * 分配角色关闭事件
     */
    onAssignClose() {
      this.assignDialog.visible = false
    },
    /**
     * 分配角色确认事件
     */
    onAssignConfirm() {
      const params = {
        userId: this.selectedUserId,
        roleIds: this.selectedIds
      }
      if (this.selectedIds.length === 0) {
        // 调用删除用户角色的方法
        this.clearUserRole(this.selectedUserId)
        return
      }
      // 调用接口
      userApi.saveAssignRole(params).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.assignDialog.visible = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 清除用户全部角色
     */
    async clearUserRole(userId) {
      const confirm = await this.$myConfirm('确定要清除全部角色吗！')
      if (confirm) {
        userApi.clearRole(userId).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.assignDialog.visible = false
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.$message.success('取消删除')
      }
    },
    /**
     * 复选框选中事件
     */
    handleSelectionChange(rows) {
      const roleIds = []
      //  循环
      rows.forEach(item => {
        roleIds.push(item.id)
      })
      this.selectedIds = roleIds
    },
    /**
     * 分页事件
     */
    assignSizeChange(size) {
      this.roleVo.pageSize = size
      this.getAssignRoleList(this.roleVo.page, size)
    },
    /**
     * 分页事件 页码改变
     */
    assignCurrentChange(page) {
      this.roleVo.page = page
      this.getAssignRoleList(page, this.roleVo.pageSize)
    }
  }
}
</script>

<style lang="scss">
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
