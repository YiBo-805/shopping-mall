<template>
  <div class="cart">
    <!--导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>

    <!--商品的列表-->
    <cart-list/>

    <!--底部的汇总-->
    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

import CartList from "./childComps/CartList"
import CartBottomBar from "./childComps/CartBottomBar"

import { mapGetters } from 'vuex'
export default {
  name: "cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    // 使用mapGetters将store中的getters中的方法转换为计算属性
    ...mapGetters([
      'cartLength'
    ])
    //或...mapGetters({ length: "cartLength" }),
    //...mapGetters()函数，将store的getters映射到局部计算属性
  }
}
</script>

<style scoped>
.cart {
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 700;
}

</style>
