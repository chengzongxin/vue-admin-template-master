import request from "@/utils/request";

export function upload() {
  return request({
    url: "/upload",
    method: "post",
  });
}
export function fileList() {
  return request({
    url: "/fileList",
    method: "get",
  });
}

export function getFile(id) {
  return request({
    url: `uploadoss/${id}`,
    method: "get",
    responseType: "blob", // 设置响应类型为blob,这样才能触发下载
  });
}

export function deleteOssFiles() {
  return request({
    url: "/deleteOssFiles",
    method: "get",
  });
}
