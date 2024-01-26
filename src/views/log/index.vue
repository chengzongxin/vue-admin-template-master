<template>
  <div style="margin-top: 20px; margin: 50px; margin-right: 100px">
    <!-- 按钮 -->

    <el-row>
      <el-button
        style="float: right"
        type="primary"
        @click="
          dialogFormVisible = true;
          dept = {};
        "
        >+ 新增部门</el-button
      >
    </el-row>
    <br />
    <!-- 数据表格 -->
    <template>
      <el-table
        ref="multipleTable"
        highlight-current-row
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border
      >
        <el-table-column prop="methodName" label="方法名" width="100" />
        <el-table-column prop="className" label="类名" />
        <el-table-column prop="methodParams" label="操作用户" />
        <el-table-column prop="operateTime" label="操作用户" width="100" />
        <el-table-column prop="operateUserName" label="操作用户" width="100" />
        <el-table-column prop="costTime" label="花费时间(ms)" width="100" />
      </el-table>
    </template>
  </div>
</template>

<script>
import { getLog } from "@/api/log.js";

export default {
  data() {
    return {
      formLabelWidth: "120px",
      dialogFormVisible: false, // 控制对话框是否可见
      dept: {
        name: "",
      },
      tableData: [],
    };
  },
  mounted() {
    // 当页面加载完成后自动执行。
    this.init();
  },

  methods: {
    // 初始化 - 查询全部
    init() {
      getLog().then((result) => {
        console.log(result);
        if (result.data.code == 1) {
          this.tableData = result.data.data;
        }
      });
    },
  },
};
</script>
<style></style>
