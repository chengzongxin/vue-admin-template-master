import request from "@/utils/request";

export function dynamicList(data) {
  return request({
    url: "/dynamic/list",
    method: "get",
    data,
  });
}
