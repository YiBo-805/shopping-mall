<template>
  <div class="goods-item" @click="goToDetail">
    <img v-lazy="showImage" :key="showImage" alt="" @load="imageLoad">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>

</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    showImage() {
      return (
        this.goodsItem.img ||
        this.goodsItem.image ||
        this.goodsItem.show.img
      )
    }
  },
  methods: {
    imageLoad() {
      // 1.发送事件总线
      this.$bus.$emit('itemImageLoad');
      // console.log(this.$bus);

      // 1.方案一：复用组件是，根据对象不同选择在home中是否监听
      // if(this.$route.path.indexOf('/home')) {
      //   this.$bus.$emit('homeItemImageLoad');
      // } else if(this.$route.path.indexOf('/detail')) {
      //   this.$bus.$emit('detailItemImageLoad');
      // }
    },
    goToDetail() {
      // console.log('跳转到详情页');
      this.$router.push("/detail/" + this.goodsItem.iid);
    }
  }
}
</script>

<style scoped>
.goods-item {
  position: relative;
  width: 48%;
  padding-bottom: 40px;
}

.goods-item img {
  width: 100%;
  border-radius: 5px;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}

</style>
