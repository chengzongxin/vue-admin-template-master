<template>
  <div style="margin-top: 20px; margin: 50px; margin-right: 100px">
    <!-- <img
      src="https://pic.to8to.com/tc/spiders/87e81080f8c64903933c67b239ae8114.png"
      alt=""
      style="width: 100px; height: 100px"
    /> -->

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
          <!-- 只能上传jpg/png文件，且不超过500kb -->
        </div>
      </el-upload>
    </div>
    <!-- <div class="grid">
      <div v-for="item in list" :key="item" class="grid-item">
        <img class="grid-item-img" :src="item.url" alt="">
        <div>{{ formatSize(item.size) }}</div>
      </div>
    </div> -->

    <el-tag
      v-for="item in tags"
      :key="item"
      :type="''"
      style="margin-right: 20px; margin-top: 20px"
      @click="handleClick(item)"
      >{{ item }}</el-tag
    >

    <div style="margin-top: 20px; margin: 50px; margin-right: 100px" />

    <el-tag v-if="tags.length" type="danger" @click="handleClear"
      >清除待上传文件</el-tag
    >
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
        stripe
      >
        <el-table-column prop="id" label="id" width="100">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="" trigger="hover">
              <img
                :src="scope.row.imgUrl"
                alt=""
                style="width: 50px; height: 50px"
              />
              <img
                slot="reference"
                :src="scope.row.imgUrl"
                style="width: 50px; height: 50px"
              />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="content" width="300" />
        <el-table-column prop="imgUrl" label="imgUrl" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleCopy(scope.$index, scope.row)"
              >复制链接</el-button
            >
          </template>
        </el-table-column>
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
import { fileList, deleteOssFiles, getFile } from "@/api/upload";

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
      tableData: [
        {
          imgUrl:
            "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          content: "123",
        },
      ],
      tags: [],
    };
  },
  async mounted() {
    // 当页面加载完成后自动执行。
    this.init();
    console.log("mountd", this.tableData);
    const res = await fileList();
    console.log("res", res);
    if (res.data.code === 1) {
      this.tags = res.data.data;
    }
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
    async handleClick(item) {
      const res = await getFile(item);
      console.log("res", res);
      const data = res;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", item);
      document.body.appendChild(link);
      link.click();
    },
    async handleClear() {
      const res2 = await deleteOssFiles();
      console.log("res2", res2);
    },
    handleCopy(a1, { imgUrl, content }) {
      console.log(a1, imgUrl, content);

      // 获取要复制的文本
      const textToCopy = imgUrl;

      // 创建一个临时的 textarea 元素
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);

      // 选择文本
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      // 复制文本到剪贴板
      document.execCommand("copy");
      // 移除临时的 textarea 元素
      document.body.removeChild(textarea);
      this.$message.success("复制成功");
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
