<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="detail-nav"/>
    <scroll
        class="detail-content"
        ref="scroll"
        @scroll="contentScroll"
        :probe-type="3"
    >
          <!--<ul>-->
          <!--  <li v-for="item in $store.state.cartList">-->
          <!--    {{item}}-->
          <!--  </li>-->
          <!--</ul>-->
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommend"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!-- <toast :message="message" :show="show"/>-->
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
// import Toast from "components/common/toast/Toast";


import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail";
import {debounce} from "common/utils";
import {itemImageListenerMixin, backTopMixin} from "common/mixin";
import {BACKTOP_DISTANCE} from "common/const";

import {mapActions} from 'vuex';

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    // Toast
  },
  data() {
    return {
      iid: '',
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      // message: '',
      // show: false
    }
  },
  mixins: [itemImageListenerMixin, backTopMixin],
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;

    // 2.根据iid请求详细数据
    getDetail(this.iid).then(res => {
      // console.log(res);
      const data = res.result;
      // 2.1.获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages;

      // 2.2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

      // 2.3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);

      // 2.4.保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 2.5.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);

      // 2.6.取出评论信息
      if(data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }

      // 1.第一次值不对：页面没有渲染，this.$refs.params.$el没有渲染
      /*this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      console.log(this.themeTopYs);

      // 2.第二次值不对：图片没有加载完全，高度不对
      //一般offsetTop值不对的时候，都是图片的问题
      this.$nextTick(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        console.log(this.themeTopYs);
      });*/

    });

    // 3.请求推荐数据
    getRecommend().then(res => {
      // console.log(res);
      this.recommends = res.data.list;
    });

    // 4.给getThemeTopYs赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
      // console.log(this.themeTopYs);
    }, 100);
  },
  mounted() {

  },
  updated() {

  },
  destroyed() {
    this.$bus.$off('itemImageLoad', this.itemImgListener);
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      // this.$refs.scroll.refresh();  //会执行多次refresh
      this.newRefresh();  //只会执行一次refresh
      this.getThemeTopY();
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
    },
    contentScroll(position) {
      // 1.获取y值
      const positionY = -position.y;

      // 2.positionY和主题中的值进行对比
      let length = this.themeTopYs.length;
      for(let i = 0; i < length - 1; i++) {

        // 2.hack做法
        if((this.currentIndex !== i) && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
          this.currentIndex = i;
          this.$refs["detail-nav"].currentIndex = this.currentIndex;

        // 1.普通做法
        // if(this.currentIndex !== i && (i < length-1 &&  positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])
        //     || (i == length -1 && positionY >= this.themeTopYs[i])) {
        //   this.currentIndex = i;
        //   this.$refs["detail-nav"].currentIndex = this.currentIndex;
        // }
        }
      }

      // 3.是否显示回到顶部
      this.isShowBackTop = (-position.y) > BACKTOP_DISTANCE;
    },
    addToCart() {
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      // 2.将商品添加到购物车(1.promise, 2.mapActions)
      // this.$store.commit('addCart', product)  //使用mutations调用:不推荐
      //使用actions调用
      this.addCart(product).then(res => {
        // this.show = true;
        // this.message = res;

        // setTimeout(() => {
        //   this.show = false;
        //   this.message = '';
        // }, 1500)

        this.$toast.show(res, 1500);
        // console.log(this.$toast);
      })

      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res);
      // })

    }

  }
}
</script>

<style scoped>
 #detail {
   height: 100vh;
   position: relative;
   z-index: 9;
   background-color: #fff;
 }
 .detail-nav {
   position: relative;
   z-index: 9;
   background-color: #fff;
   font-weight: 700;
 }
 /*使用这个有bug,顶部的导航栏变为了原生滚动*/
 /*.detail-content {*/
 /*  height: calc(100% - 44px - 49px);*/
 /*  !*overflow: hidden;*!*/
 /*}*/
 .detail-content {
   overflow: hidden;
   position: absolute;
   top: 44px;
   bottom: 49px;
   left: 0;
   right: 0;
 }
</style>
