<template>
  <el-main>
    <el-form
      ref="searchFrom"
      :inline="true"
      size="mini"
    >
      <el-form-item>
        <el-button
          type="success"
          icon="el-icon-circle-plus-outline"
          size="mini"
          @click="openAddWindow()"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <el-table
      v-loading="isLoading"
      :data="menuList"
      :height="tableHeight"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      stripe
      default-expand-all
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      :tree-props="{children: 'children'}"
    >
      <el-table-column
        prop="label"
        label="菜单名称"
        sortable
      />
      <el-table-column
        prop="type"
        label="菜单类型"
        sortable
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0 " size="mini">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1 " size="mini" type="success">菜单</el-tag>
          <el-tag v-else size="mini" type="warning">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.icon.includes('el-icon')" :class="scope.row.icon" />
          <svg-icon v-else :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="路由名称"
        sortable
      />
      <el-table-column
        prop="path"
        label="路由地址"
        sortable
      />
      <el-table-column
        prop="url"
        label="组件路径"
        sortable
      />
      <el-table-column
        label="操作"
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
    <!-- 新增或者修改窗口 -->
    <systemDialog
      :title="menuDialog.title"
      :visible="menuDialog.visible"
      :width="menuDialog.width"
      :height="menuDialog.height"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          ref="menuForm"
          :model="menu"
          :rules="menuRules"
          :inline="true"
          size="mini"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="菜单类型" prop="type">
                <el-radio-group v-model="menu.type">
                  <el-radio :label="0">目录</el-radio>
                  <el-radio :label="1">菜单</el-radio>
                  <el-radio :label="2">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="所属菜单" size="mini" prop="parentName">
            <el-input v-model="menu.parentName" :readonly="true" @click.native="openSelectMenuWindow" />
          </el-form-item>
          <el-form-item label="菜单名称" size="mini" prop="label">
            <el-input v-model="menu.label" />
          </el-form-item>
          <el-form-item v-if="menu.type==1" label="路由名称" size="mini" prop="name">
            <el-input v-model="menu.name" />
          </el-form-item>
          <el-form-item v-if="menu.type!=2" label="路由地址" size="mini" prop="path">
            <el-input v-model="menu.path" />
          </el-form-item>
          <el-form-item v-if="menu.type==1" label="组件路径" size="mini" prop="url">
            <el-input v-model="menu.url" />
          </el-form-item>
          <el-form-item label="权限字段" size="mini" prop="code">
            <el-input v-model="menu.code" />
          </el-form-item>
          <el-form-item label="菜单序号" size="mini" prop="orderNum">
            <el-input v-model="menu.orderNum" />
          </el-form-item>
          <el-form-item label="菜单图标" size="mini" prop="icon">
            <my-icon ref="child" @selecticon="setIcon" />
          </el-form-item>
        </el-form>
      </div>
    </systemDialog>
    <!-- 所属菜单 -->
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
          style="font-size: 14px"
          :props="defaultProps"
          empty-text="暂无数据"
          :default-expand-all="true"
          :show-checkbox="false"
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
import menuApi from '@/api/system/menu'
import systemDialog from '@/components/system/systemDialog'
import MyIcon from '@/components/system/myIcon'
export default {
  components: {
    systemDialog,
    MyIcon
  },
  data() {
    return {
      menuList: [], // 表格数据
      tableHeight: 0, // 表格高度
      isLoading: true, // 是否加载中
      menuDialog: {
        title: '', // 弹窗标题
        visible: false, // 弹窗是否显示
        width: 630, // 弹窗宽度
        height: 270 // 弹窗高度
      },
      menu: {
        id: '', // 菜单id
        type: 0, // 菜单类型
        parentId: '', // 父级菜单id
        parentName: '', // 父级菜单名称
        label: '', // 菜单名称
        icon: '', // 菜单图标
        name: '', // 路由名称
        path: '', // 路由地址
        url: '', // 组件路径
        code: '', // 权限字段
        orderNum: '' // 菜单序号
      },
      menuRules: {
        type: [
          { required: true, message: '请选择菜单类型', trigger: 'change' }
        ],
        parentName: [
          { required: true, message: '请输入所属菜单', trigger: 'change' }
        ],
        label: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入路由名称', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入菜单图标', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入路由地址', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入组件路径', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入权限字段', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '请输入菜单序号', trigger: 'blur' }
        ]
      },
      treeList: [], // 树形结构数据
      // 树形结构配置
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      parentDialog: {
        title: '', // 弹窗标题
        visible: false, // 弹窗是否显示
        width: 280, // 弹窗宽度
        height: 450 // 弹窗高度
      }
    }
  },
  created() {
    this.search()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 180
    })
  },
  methods: {
    changeIcon(data) {
      // 修改折叠的状态
      data.open = !data.open
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open
      // this.$refs.parentTree.$store.nodeMap[data.id].expanded = !data.open
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
    openSelectMenuWindow() {
      this.parentDialog.title = '选择所属部门'
      this.parentDialog.visible = true
      // 查询所有部门
      menuApi.getParentPermissionList().then(res => {
        if (res.code === 200) {
          this.treeList = res.data
        }
      })
    },
    /**
     * 点击树形结构节点
     */
    handleNodeClick(data) {
      // 新选择的菜单ID不能归属自己
      console.log(this.menu.id)
      console.log(data.id)
      if (this.menu.id === data.id) {
        this.$message.warning('选中项不可用，请选择其它项!')
        return
      }
      // 将选择的数据赋值给所属部门
      // 所属父级菜单ID
      this.menu.parentId = data.id
      // 所属父级菜单名称
      this.menu.parentName = data.label
    },
    /**
     * 打开添加窗口
     */
    openAddWindow() {
      // 清空验证提示信息
      if (this.$refs.menuForm !== undefined) {
        this.$refs.menuForm.resetFields()
      }
      // 清空表单
      this.$resetForm('menuFrom', this.menu)
      this.menuDialog.title = '新增菜单'
      this.menuDialog.visible = true
      this.$nextTick(() => {
        this.$refs['child'].userChooseIcon = '' // 清空菜单图标
      })
    },
    /**
     * 查询菜单列表
     */
    search() {
      menuApi.getPermissionList().then(res => {
        if (res.code === 200) {
          this.isLoading = false
          this.menuList = res.data
        }
      })
    },
    onClose() {
      this.menuDialog.visible = false
    },
    onConfirm() {
      // 校验表单
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          // 判断是新增还是修改
          if (this.menu.id === '') {
            menuApi.savePermission(this.menu).then(res => {
              if (res.code === 200) {
                this.$message.success('操作成功')
                this.menuDialog.visible = false
                this.search()
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            menuApi.updatePermission(this.menu).then(res => {
              if (res.code === 200) {
                this.$message.success('操作成功')
                this.menuDialog.visible = false
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
    * 给icon绑定的点击事件
    * @param icon
    */
    setIcon(icon) {
      this.menu.icon = icon
    },
    /**
     * 打开修改窗口
     */
    handleEdit(row) {
      this.$objCopy(row, this.menu)
      // 回显图标
      this.$nextTick(() => {
        this.$refs['child'].userChooseIcon = row.icon
      })
      this.menuDialog.title = '修改菜单'
      this.menuDialog.visible = true
    },
    /**
     * 删除菜单
     */
    async handleDelete(row) {
      const confirm = await this.$myConfirm('确定要删除吗')
      if (confirm) {
        menuApi.deletePermissionById(row.id)
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

<style scoped>

</style>
