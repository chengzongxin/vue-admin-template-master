<template>
  <div style="margin-top: 20px; margin: 50px; margin-right: 100px">
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
        <el-table-column prop="id" label="方法名" width="100" />
        <el-table-column prop="imgUrl" label="imgUrl" />
        <el-table-column prop="content" label="content" />
      </el-table>
    </template>
  </div>
</template>

<script>
import { dynamicList } from "@/api/dynamic.js";

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
      dynamicList().then((result) => {
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
