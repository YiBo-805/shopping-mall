module.exports = {
  plugins: {
    autoprefixer: {}, // 用来给不同的浏览器自动添加相应前缀，如-webkit-，-moz-等等
    // 'postcss-px-to-viewport': {
    //   viewportWidth: 375,// 视窗的宽度，UI设计稿的宽度15px
    //   viewportHeight: 667,
    //   unitPrecision: 5,// 转换后的精度，即小数点位数
    //   viewportUnit: 'vw',// 指定需要转换成的视窗单位，默认vw
    //   selectorBlackList: ['ignore', 'tab-bar', 'tab-bar-item'],// 指定不转换为视窗单位的类名，
    //   minPixelValue: 1,// 默认值1，小于或等于1px则不进行转换
    //   mediaQuery: false, // 是否在媒体查询的css代码中也进行转换，默认false
    //   exclude:[/TabBar/],//必须是正则
    // },
  }
}

/**
 * 1.在js中使用正则使用：/正则相关规则/
 * 2.exclude中存放的元素必须是正则表达式：
 * 3.按照排除的文件写对应的正则：
 * 正则的规则：
 * 1>:^abc表示匹配的内容，必须以什么内容开头[以abc开头]
 * 2>:abc$表示匹配的内容，必须以什么内容结尾[以abc结尾]
 *
 */
