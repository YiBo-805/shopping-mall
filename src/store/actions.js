import {
  ADD_COUNTER,
  ADD_TO_CART
} from "./mutation-types";

export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // payload:新添加的商品
      // 1.查找之前是否有该商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);

      // 2.判断oldProduct
      if(oldProduct) {  //数量+1
        // oldProduct.count += 1;
        context.commit(ADD_COUNTER, oldProduct);
        resolve('当前的数量+1');
      }else {  //添加了新的商品
        payload.count = 1;
        context.commit(ADD_TO_CART, payload)
        // context.state.cartList.push(payload);
        resolve('添加了新的商品');

        // 方法一:查找商品
        // let oldProduct = null;
        // for(let item of state.cartList) {
        //   if(item.iid === payload.iid) {
        //     oldProduct = item;
        //   }
        // }
      }
    })
  }
}
