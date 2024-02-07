import request from '@/utils/request'

export function getImageList(data) {
  return request({
    url: '/imageList',
    method: 'get',
    data
  })
}
