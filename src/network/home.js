//管理首页的数据请求
import {request} from "./request";
export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}

// 获取首页商品数据
export function getHomeGoods(type, page) {
  return request({
    url: '/home/data',
    params: {
      type,
      page
    }
  })

}