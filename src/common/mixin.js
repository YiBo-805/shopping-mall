import {debounce} from "./utils";
import BackTop from "components/content/backTop/BackTop";
import {POP, NEW, SELL} from "./const";

export const itemImageListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      newRefresh: null
    }
  },
  mounted() {
    this.newRefresh = debounce( this.$refs.scroll.refresh, 50);
    this.itemImgListener = () => {
      this.newRefresh();
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener);
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      // scrollTo(x坐标, y坐标, 所用的时间)
      this.$refs.scroll.scrollTo(0, 0, 1000);
    },
  }
}

export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      // console.log(this.currentType);
    }
  }
}
