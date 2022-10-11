<template>
  <div class="chooseIcons">
    <el-popover placement="bottom" width="450" trigger="click">
      <span
        slot="reference"
        style="
        display: inline-block;
        width: 170px;
        height: 28px;
        margin: 0;
        line-height: 28px;
        "
      >
        <i :class="userChooseIcon" />
        {{ userChooseIcon }}
      </span>
      <div class="iconList">
        <i
          v-for="item in iconList"
          :key="item"
          :class="item"
          style="font-size: 20px"
          @click="setIcon(item)"
        />
      </div>
    </el-popover>
  </div>
</template>

<script>
import { elementIcons } from '@/utils/icons'
export default {
  data() {
    return {
      iconList: [], // 图标列表
      userChooseIcon: '' // 用户选择的图标
    }
  },
  created() {
    this.getIconList()
  },
  methods: {
    /**
     * 查询图标
     */
    getIconList() {
      this.iconList = elementIcons
    },
    /**
     *  设置选择的图标
     */
    setIcon(icon) {
      // 将i的样式设为选中的样式el-icon-xxx
      this.userChooseIcon = icon
      // 将选中的图标传递给父组件
      this.$emit('selecticon', icon)
    }
  }
}
</script>

<style scoped>
.iconList {
  width: 400px;
  height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
  .iconList i {
    display: inline-block;
    width: 60px;
    height: 45px;
    color: #000000;
    font-size: 20px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    line-height: 45px;
    margin: 5px;
  }
.iconList i:hover {
    color: orange;
    border-color:orange;
}
.chooseIcons{
  width: 170px;
  background-color: #FFFFFF;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: 12px;
  height: 28px;
  line-height: 28px;
  outline: none;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>
