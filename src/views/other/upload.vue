<template>
  <div style="margin-top: 20px; margin: 50px; margin-right: 100px">
    <el-upload
      class="upload-demo"
      drag
      action="/api/upload/images"
      :headers="token"
      multiple
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>
  </div>
</template>

<script>
import { getLog } from "@/api/log.js";
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      formLabelWidth: "120px",
      dialogFormVisible: false, // 控制对话框是否可见
      dept: {
        name: "",
      },
      tableData: [],
      token: { token: getToken() },
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
