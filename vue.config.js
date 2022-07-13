// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   devServer:{
//     proxy: {
//       '/api':{
//         ws: false,
//         //目标地址
//         target:'http://192.168.199.231:9090/',
//         //发送请求头host会被设置target
//         changeOrigin: true,
//         //不重写请求地址
//         pathReWrite:{
//           '^/api': ''
//         }
//       }
//     }
//   }
// })
module.exports = {
  lintOnSave: false
}

