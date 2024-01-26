import request from "@/utils/request";

export function getLog(data) {
  return request({
    url: "/getLog",
    method: "get",
    data,
  });
}
