<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        :is-checked="isSelectAll"
        class="check-button"
        @click.native="checkClick"
      />
      <span>全选</span>
    </div>

    <div class="price">
      合计:{{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>

</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";

import {mapGetters} from "vuex";

export default {
  name: "cartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked;
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count;
      }, 0).toFixed(2)
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length;
    },
    isSelectAll() {
      if(this.cartList.length == 0) return false;

      // 方案一:使用filter
      // return !(this.cartList.filter(item => !item.checked).length);

      // 方案二:使用find函数
      // return !this.cartList.find(item => !item.checked);

      // 方案三:普通遍历
      for(let item of this.cartList) {
        if(!item.checked) {
          return false;
        }
      }
      return true;
    }
  },
  methods: {
    checkClick() {
      if(this.isSelectAll) { //全部选中
        this.cartList.forEach(item => item.checked = false);
      }else {  //部分或者全部不选中
        this.cartList.forEach(item => item.checked = true);
      }

      // 不能做简化,两个值之间相互影响,否则会乱七八糟 isSelected与遍历时更改的chencked的值相互影响
      // this.cartList.forEach(item => item.checked = !this.isSelectAll);
    },
    calcClick() {
      if(!this.isSelectAll) {
        this.$toast.show('请选择购买的商品', 2000);
      }
    }
  }
}
</script>

<style scoped>
.bottom-bar {
  position: relative;
  display: flex;
  height: 40px;
  line-height: 40px;
  background-color: #eee;
  font-size: 14px;
}
.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}
.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}
.price {
  margin-left: 30px;
  flex: 1;
}
.calculate {
  width: 90px;
  background-color: #ff8198;
  text-align: center;
}
</style>
