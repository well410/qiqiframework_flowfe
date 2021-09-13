const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : '/'

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  /**
   * 本地环境添加路由转发解决跨域问题
   */
  devServer: {
    proxy:{
      '/api/prod': {    //将www.example.com印射为/api
        target: 'http://localhost:8081/',  // 接口域名
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true,  //是否跨域
        // pathRewrite: {
        //   '^/': ''
        // },
        // logLevel: 'debug'   // 控制台打出是否转发到网关的日志
      },
      '/api': {    //将www.example.com印射为/api
        target: 'http://localhost:8081/',  // 接口域名
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true,  //是否跨域
        // pathRewrite: {
        //   '^/': ''
        // },
        // logLevel: 'debug'   // 控制台打出是否转发到网关的日志
      },
      '/portal': {    //将www.example.com印射为/api
         target: 'http://localhost:8081',  // 接口域名
        //target: 'http://gateway.tcs.paas.cmbchina.cn',  // 接口域名
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/': ''
        },
        logLevel: 'debug'   // 控制台打出是否转发到网关的日志
      },
      '/update':{
        target : 'http://localhost:8081',
        secure: false,
        changeOrigin: true
      },
      '/api/decs':{
        //target : 'http://gateway.tcs.paas.cmbchina.cn',
        target : 'http://localhost:8081',
        // target : 'http://gateway.tcs.paas.cmbchina.cn',
        //target : 'http://localhost:8088',
        secure: false,
        changeOrigin: true
      },
      '/api/cmpt':{
        target : 'http://localhost:8081',
        secure: false,
        changeOrigin: true
      },
      '/api/func':{
        target :'http://localhost:8081',
        secure: false,
        changeOrigin: true
      },
      '/api/vars':{
        // target :'http://localhost',
        target :'http://localhost:8081',
        secure: false,
        changeOrigin: true
      },
      '/api/tqsvars':{
        target :'http://localhost:8081',
        // target :'http://localhost:8093',
        secure: false,
        changeOrigin: true
      },
      '/api/prod':{
        target : 'http://localhost:8081',
        secure: false,
        changeOrigin: true
      },
      '/api/monitor':{
        target: 'http://localhost:8081',   // 网关地址
        //target : 'http://localhost:8765',
        secure: false,
        changeOrigin: true
      },
      '/cmb-auth': {                       // prefix固定
        target: 'http://localhost:8081',   // 网关地址
        pathRewrite: {
          '^/cmb-auth': ''
        },
        changeOrigin: true, // 允许跨域访问
        logLevel: 'debug'   // 控制台打出是否转发到网关的日志
      },
      '/api/cmpt':{
        // target : 'http://gateway.tcs.paasst.cmbchina.cn',
        target : 'http://localhost:8087',
        secure: false,
        changeOrigin: true
      },

    },
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8083 // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
  },

  chainWebpack: config => {
    config.resolve.alias
        .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
        .set('_c', resolve('src/components'))
    //set svg-speite-loader
    config.module
        .rule('svg')
        .exclude.add(resolve('src/icons'))
        .end()
    config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(resolve('src/icons'))
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })
        .end()
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  // devServer: {
  //   proxy: 'localhost:3000'
  // }
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less"
    }
  }
}
