<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control
        ref = "tabcontrol1"
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        class="tab-control"
        v-show="isTabFixed"
    />

    <!--使用better-scroll滚动-->
    <scroll
        class="content"
        ref="scroll"
        :probe-type = "3"
        @scroll="contentScroll"
        :pull-up-load="true"
        @pullingUp="loadMore"
    >
      <!--1.封装的轮播图组件-->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <!--2.封装的推荐部分-->
      <recommend-view :recommends="recommends" />
      <!--3.封装的本周流行部分-->
      <feature-view/>

      <!--4.3个流行、新款、精选tabbar按钮部分-->
      <tab-control
          ref = "tabcontrol2"
          :titles="['流行', '新款', '精选']"
          @tabClick="tabClick"
      />
      <!--5.对应的3个选项展示的内容部分-->
      <goods-list :goods="showGoods"/>
    </scroll>

    <!--监听组件原生事件时需要使用native属性-->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>

  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";


import {getHomeMultidata, getHomeGoods} from "network/home";
import {itemImageListenerMixin} from "common/mixin";
import {BACKTOP_DISTANCE} from "common/const";

export default {
   name: "home",
   components: {
     HomeSwiper,
     RecommendView,
     FeatureView,
     NavBar,
     TabControl,
     GoodsList,
     Scroll,
     BackTop
   },
   data() {
     return {
       banners: [],
       recommends: [],
       goods: {
         'pop': {page: 0, list: []},
         'new': {page: 0, list: []},
         'sell': {page: 0, list: []}
       },
       currentType: 'pop',
       isShowBackTop: false,
       tabOffsetTop: 0,
       isTabFixed: false,
       saveY: 0
     }
   },
   mixins: [itemImageListenerMixin],
   computed: {
     showGoods() {
       return this.goods[this.currentType].list;
     }
   },

   // 吸顶效果
   activated() {
     this.$refs.scroll.scrollTo(0, this.saveY, 0);
     this.$refs.scroll.refresh();
   },
   deactivated() {
     // 1.保存y值
     this.saveY = this.$refs.scroll.getScrollY();

     // 2.取消全局事件监听
     this.$bus.$off('itemImageLoad', this.itemImgListener);
   },

   created() {
     // 1.请求多个数据
     this.getHomeMultidata();

     // 2.请求商品数据
     this.getHomeGoods('pop');
     this.getHomeGoods('new');
     this.getHomeGoods('sell');
   },
   mounted() {
     //已经使用mixin.js进行混入实现
     /*// 实现频繁刷新的防抖操作
     // const refresh = this.debounce(this.$refs.scroll && this.$refs.scroll.refresh, 500)
     const refresh = debounce( this.$refs.scroll.refresh, 50);

     // 对监听的事件进行保存
     this.itemImgListener = () => {
       // 解决refresh()找不到为null的报错
       // this.$refs.scroll && this.$refs.scroll.refresh();
       refresh();
     }
     // 1.监听item中图片加载完成
     this.$bus.$on('itemImageLoad', this.itemImgListener);*/
   },
   methods: {
     /**
      * 网络请求相关的方法
      */
     getHomeMultidata() {
       getHomeMultidata().then(res => {
         this.banners = res.data.banner.list;
         this.recommends = res.data.recommend.list;
       });
     },
     getHomeGoods(type) {
       const page = this.goods[type].page + 1
       getHomeGoods(type, page).then(res => {
         // console.log(res);
         this.goods[type].list.push(...res.data.list);
         this.goods[type].page += 1;

         // 完成上拉加载更多
         this.$refs.scroll.finishPullUp();
       })
     },

     /**
      * 事件监听的相关方法
      */

     // 1.流行、新款、精选的tabbar点击事件
     tabClick(index) {
       switch (index) {
         case 0:
           this.currentType = 'pop';
           break;
         case 1:
           this.currentType = 'new';
           break;
         case 2:
           this.currentType = 'sell';
           break;
       }
       this.$refs.tabcontrol1.currentIndex = index;
       this.$refs.tabcontrol2.currentIndex = index;
     },

     // 2.点击界面右下角图标回到顶部监听事件: 可以抽取到混入中去
     backClick() {
       // scrollTo(x坐标, y坐标, 所用的时间)
       this.$refs.scroll.scrollTo(0, 0, 1000);
     },

     // 3.界面右下角图标显示和隐藏监听事件
     contentScroll(position) {
       // 1.判断backTop是否显示
       this.isShowBackTop = (-position.y) > BACKTOP_DISTANCE;

       // 2.判断tabControl是否吸顶(position:fixed)
       this.isTabFixed = (-position.y) > this.offsetTop;
     },

     // 4.下拉加载更多
     loadMore() {
       this.getHomeGoods(this.currentType);
     },

     // 5.轮播图加载完成判定
     swiperImageLoad() {
       // 1.获取tabControl函数的offsetTop的值
       // 所有的组件都有一个属性: $el->获取组件中的元素
       this.offsetTop = this.$refs.tabcontrol2.$el.offsetTop;
     }
   }
 }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    font-weight: 700;

    /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  .content {
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /*.content {*/
  /*  margin-top: 44px;*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*}*/
  .tab-control {
    position: relative;
    z-index: 9;
  }

</style>
