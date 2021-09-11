import request from '@/utils/request'

export function subAppUrls() {
  return request(
    {
      method: 'get',
      url: '/portal/subAppUrls'
    });
}
