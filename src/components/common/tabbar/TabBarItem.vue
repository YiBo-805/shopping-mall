<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <div :style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props: {
    path: String,
    activeColor: {
      type: String,
      default: 'red'
    }
  },
  data() {
    return {
      // isActive: true
    }
  },
  computed: {
    isActive() {
      return this.$route.path.indexOf(this.path) != -1
    },
    activeStyle() {
      return this.isActive ? {color: this.activeColor} : {}
    }
  },
  methods: {
    itemClick() {
      // 如果当前路由活跃，再次点击，报错
      // 会实现所有效果，但是会报错，解决方案：路由激活之后，禁止点击
      if(this.$route.path == this.path) return
      this.$router.replace(this.path).catch(err => {
        console.log(err)})
    }
  }
}
</script>

<style scoped>
.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}
.tab-bar-item img {
  margin-top: 3px;
  margin-bottom: 2px;
  height: 24px;
  width: 24px;
  vertical-align: middle;
}
/*.active {*/
/*  color: red;*/
/*}*/
</style>