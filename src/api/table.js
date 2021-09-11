import request from '@/utils/request'

export function getList() {
  return request({
    url: '/test/api/test',
    method: 'get'
  })
}
