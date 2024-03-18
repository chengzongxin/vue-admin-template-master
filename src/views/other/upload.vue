<template>
  <div style="margin-top: 20px; margin: 50px; margin-right: 100px">
    <div>
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
      </el-upload></div>
    <div class="grid">
      <div v-for="item in list" :key="item" class="grid-item">
        <img class="grid-item-img" :src="item.url" alt="">
        <div>{{ formatSize(item.size) }}</div>
      </div>
    </div>

    </el-upload>
  </div>
</template>

<script>
import { getImageList } from '@/api/images'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6, 7, 8],
      token: { token: getToken() }
    }
  },
  mounted() {
    // 当页面加载完成后自动执行。
    this.init()
  },

  methods: {
    // 初始化 - 查询全部
    init() {
      getImageList().then((result) => {
        console.log(result)
        if (result.data.code === 1) {
          this.list = result.data.data
        }
      })
    },
    formatSize(size) {
      if (!size) return ''
      if (size < 1024) {
        return size + 'B'
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'KB'
      } else {
        return (size / 1024 / 1024).toFixed(2) + 'M'
      }
    }
  }
}
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
