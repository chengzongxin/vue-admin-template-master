<template>
  <div style="margin-top: 20px; margin: 50px; margin-right: 100px">
    <div>
      <el-upload
        class="upload-demo"
        drag
        action="/api/uploadoss"
        :headers="token"
        multiple
        :on-success="handleSuccess"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </div>
    <!-- <div class="grid">
      <div v-for="item in list" :key="item" class="grid-item">
        <img class="grid-item-img" :src="item.url" alt="">
        <div>{{ formatSize(item.size) }}</div>
      </div>
    </div> -->

    <div style="margin-top: 20px; margin: 50px; margin-right: 100px" />

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
        <el-table-column prop="id" label="id" width="100" />
        <el-table-column prop="imgUrl" label="imgUrl" />
        <el-table-column prop="content" label="content" />
      </el-table>
    </template>

    <!-- <el-row :gutter="10">
      <el-col v-for="item in list" :key="item" :xs="8" :sm="6" :md="4" :lg="3" :xl="3">
        <img class="grid-item-img" :src="item.url" alt="">
        <div>{{ formatSize(item.size) }}</div>
      </el-col>
    </el-row> -->

    <!-- <el-row :gutter="20">
      <el-col v-for="item in list" :span="3">
        <img class="grid-item-img" :src="item.url" alt="">
        <div>{{ formatSize(item.size) }}</div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import { getImageList } from "@/api/images";
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6, 7, 8],
      token: { token: getToken() },
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
    console.log("mountd", this.tableData);
  },

  methods: {
    // 初始化 - 查询全部
    init() {
      getImageList().then((result) => {
        console.log(result);
        if (result.data.code === 1) {
          this.list = result.data.data;
        }
      });
    },
    formatSize(size) {
      if (!size) return "";
      if (size < 1024) {
        return size + "B";
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + "KB";
      } else {
        return (size / 1024 / 1024).toFixed(2) + "M";
      }
    },
    handleSuccess(response, file, fileList) {
      console.log("handleSuccess", response, file, fileList);

      if (response.code === 1) {
        // this.$message.success('上传成功')
        // const obj = {
        //   imgUrl: response.data[2].splite(" ")[0],
        //   content: response.data[2].splite(" ")[1],
        // };
        const array = response.data;
        for (let i = 0; i < array.length; i++) {
          const { imgUrl, content } = array[i];
          this.tableData.push({
            content: content.split("/").pop(),
            imgUrl,
          });
        }

        // this.tableData.push(obj);
      } else {
        this.$message.error("上传失败");
      }
    },
  },
};
</script>
<style>
.grid {
  margin-top: 100px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: 200px 200px 200px 200px;
  gap: 20px;
}
.grid-item {
  background-color: aqua;
}

.grid-item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
