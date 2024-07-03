<template>
  <div class="markdown-editor">
    <div class="toolbar">
      <button @click="surroundText('**')"><strong>B</strong></button>
      <button @click="surroundText('_')"><em>I</em></button>
      <button @click="insertText('# ')">H1</button>
      <button @click="insertText('## ')">H2</button>
      <button @click="insertText('### ')">H3</button>
      <button @click="insertText('1. ')">OL</button>
      <button @click="insertText('- ')">UL</button>
      <button @click="insertText('[Link text](url)')">Link</button>
      <button @click="insertText('![Alt text](url)')">Image</button>
      <button @click="insertText('\n```\n\n```\n')">Code</button>
      <button @click="togglePreview">
        {{ previewVisible ? "Hide" : "Show" }} Preview
      </button>
    </div>
    <div class="editor-container">
      <textarea
        ref="textarea"
        v-model="markdownText"
        class="editor"
        placeholder="Enter Markdown here..."
        @paste="handlePaste"
        @input="handleInput"
      />
      <div v-if="previewVisible" class="preview markdown-body">
        <div v-highlight class="preview-content" v-html="compiledMarkdown" />
      </div>
    </div>
    <button class="submit-button" @click="updateContent">Submit</button>
  </div>
</template>

<script>
import { marked } from "marked";
import hljs from "highlight.js";
import axios from "axios";
import { getToken } from "@/utils/auth"; // get token from cookie
import { dynamicList } from "../../../api/dynamic";

console.log("hljs", hljs);

export default {
  data() {
    return {
      token: getToken(),
      markdownText: "",
      previewVisible: true,
      dynamic: {},
      baseURL: process.env.VUE_APP_URL, // url = base url + request url
    };
  },
  computed: {
    compiledMarkdown() {
      return marked(this.markdownText, {
        highlight: function (code, lang) {
          const language = hljs.getLanguage(lang) ? lang : "plaintext";
          console.log("language", language);
          return hljs.highlight(code, { language }).value;
        },
        breaks: true,
      });
    },
  },
  watch: {
    markdownText(newContent) {
      // this.handleInput();
      this.updateContent();
    },
  },
  mounted() {
    this.fetchBlogs();
  },
  methods: {
    async fetchBlogs() {
      // fetch("http://192.168.16.50:9090/dynamic/list", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     token: this.token,
      //   },
      // })
      //   .then((response) => {
      //     console.log("response", response);
      //     this.dynamic = response.data;
      //   })
      //   .catch((error) => {
      //     console.error("Failed to submit content:", error);
      //   });

      try {
        const response = await dynamicList();
        // this.blogs = response.data;
        this.dynamic = response.data.data.at(-1);
        console.log("dynamic", this.dynamic);
        this.markdownText = this.dynamic.content;
      } catch (error) {
        console.error("获取博客列表失败:", error);
      }
    },
    handlePaste(event) {
      const clipboardData = event.clipboardData || window.clipboardData;
      const items = clipboardData.items;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file" && item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageUrl = event.target.result;
            this.convertAndUploadImage(imageUrl);
          };
          reader.readAsDataURL(blob);
          // 阻止默认粘贴行为
          event.preventDefault();
          return;
        }
      }
    },
    convertAndUploadImage(imageUrl) {
      // 将 Base64 格式的图片转换为二进制数据
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          // 压缩图片
          return this.compressBlob(blob);
        })
        .then((compressedBlob) => {
          // 上传压缩后的图片
          this.uploadImage(compressedBlob);
        })
        .catch((error) => {
          console.error("Failed to convert image:", error);
        });
    },
    // 压缩 Blob 文件
    compressBlob(blob) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxSize = 1000; // 设置最大尺寸为 500x500 像素
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (compressedBlob) => {
              resolve(compressedBlob);
            },
            "image/jpeg",
            0.8
          ); // 压缩质量为 80%
        };
        img.src = URL.createObjectURL(blob);
      });
    },
    uploadImage(blob) {
      // 创建 FormData 对象，并将文件对象添加到其中
      const formData = new FormData();
      formData.append("file", blob, "image.png");

      // 发送 FormData 对象到服务器 http://192.168.16.50:9090/uploadoss
      fetch(this.baseURL + "upload/images", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // 获取上传后的图片链接
          const uploadedImageUrl = data.data;
          // 将上传后的图片链接插入到输入区域中
          const startPos = this.$refs.textarea.selectionStart;
          const endPos = this.$refs.textarea.selectionEnd;
          this.markdownText =
            this.markdownText.slice(0, startPos) +
            `![Pasted Image](${uploadedImageUrl})` +
            this.markdownText.slice(endPos);
        })
        .catch((error) => {
          console.error("Failed to upload image:", error);
        });
    },
    insertImage(file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        console.log("imageUrl", imageUrl);
        this.markdownText += `![Pasted Image](${imageUrl})`;
      };
      reader.readAsDataURL(file);
    },
    surroundText(tag) {
      const textarea = this.$refs.textarea;
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;
      const selectedText = this.markdownText.substring(startPos, endPos);
      const replacement = `${tag}${selectedText}${tag}`;
      this.markdownText =
        this.markdownText.substring(0, startPos) +
        replacement +
        this.markdownText.substring(endPos);
      this.$nextTick(() => {
        textarea.focus();
        textarea.setSelectionRange(startPos + tag.length, endPos + tag.length);
      });
    },
    insertText(text) {
      const textarea = this.$refs.textarea;
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;
      this.markdownText =
        this.markdownText.substring(0, startPos) +
        text +
        this.markdownText.substring(endPos);
      this.$nextTick(() => {
        textarea.focus();
        textarea.setSelectionRange(
          startPos + text.length,
          startPos + text.length
        );
      });
    },
    togglePreview() {
      this.previewVisible = !this.previewVisible;
    },
    submitContent() {
      // 提交内容给后台服务器

      fetch(this.baseURL + "dynamic/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: this.token,
        },
        body: JSON.stringify({
          content: this.markdownText,
        }),
      })
        .then((response) => {
          if (response.ok) {
            // 提交成功的处理逻辑
            console.log("Content submitted successfully.");
            alert("Content submitted successfully.");
          } else {
            // 提交失败的处理逻辑
            console.error("Failed to submit content:", response.statusText);
            alert("Failed to submit content:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Failed to submit content:", error);
          alert("Failed to submit content:", error);
        });
    },
    handleInput() {
      // console.log("11111");
      // this.updateContent();
    },
    async updateContent() {
      try {
        await axios.post(
          this.baseURL + "dynamic/update",
          {
            id: this.dynamic.id,
            content: this.markdownText,
          },
          {
            headers: {
              "Content-Type": "application/json",
              token: this.token,
            },
          }
        );

        // 更新本地博客列表中的内容
      } catch (error) {
        console.error("更新博客失败:", error);
      }
    },
  },
};
</script>

<style scoped>
.markdown-editor {
  display: flex;
  flex-direction: column;
  font-family: "Arial", sans-serif;
  height: 100vh;
  background-color: #f0f0f0;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  background-color: #3b3b3b;
  color: #fff;
  border-bottom: 2px solid #2b2b2b;
}

.toolbar button {
  margin: 5px;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  background-color: #4b4b4b;
  color: #fff;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.toolbar button:hover {
  background-color: #6b6b6b;
}

.editor-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.editor {
  flex: 1;
  border: none;
  padding: 15px;
  font-size: 16px;
  resize: none;
  outline: none;
  height: 100%;
  background-color: #fff;
  color: #333;
  border-right: 2px solid #e0e0e0;
  box-sizing: border-box;
}

.preview {
  flex: 1;
  padding: 15px;
  font-size: 16px;
  background-color: #fff;
  overflow-y: auto;
  box-sizing: border-box;
}

.preview {
  flex: 1;
  padding: 15px;
  font-size: 16px;
  background-color: #fff;
  overflow-y: auto;
  box-sizing: border-box;
  text-align: left; /* 添加左对齐样式 */
}

.preview-content {
  text-align: left; /* 文字左对齐 */
}

/* 代码高亮样式 */
.preview-content pre code {
  display: block;
  white-space: pre-wrap;
}

/* 自定义高亮样式 */
.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  background: #f0f0f0;
}
.submit-button {
  padding: 12px 24px;
  background-color: #6c757d;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #5a6268;
}
</style>
