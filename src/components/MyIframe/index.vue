<template>
  <div class="frame-div">
    <iframe ref="iframe" scrolling="auto" width="100%" height="100%" frameborder="0">
      您当前的浏览器不支持子页面功能，请使用最新的chrome浏览器重新尝试
    </iframe>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    props: {
      subAppName: {
        type: String,
        required: true
      },
      subAppUrl: {
        type: String,
        default: '',
        required: false
      },
      routeName: {
        type: String,
        default: '',
        required: false
      }
    },
      computed: {
          ...mapGetters([
              'eventSourceOa',
              'eventSourceBiz',
              'componentOa',
              'componentBiz',
              'decisionsOa',
              'decisionsBiz',
              'functionsOa',
              'functionsBiz',
              'variablesOa',
              'variablesBiz',
              'tqsDatasourceOa',
              'tqsDatasourceBiz',
              'timerOa',
              'timerBiz',
              'fileOa',
              'fileBiz',
              'apprOa',
              'apprBiz',
              'prodOa',
              'prodBiz',
              'dataOa',
              'dataBiz',
              'logOa',
              'logBiz',
              'monitorOa',
              'monitorBiz'
          ])
      },
    mounted() {
      // this.getSubAppUrl().then(() => {
      //   this.turnToIFrame()
      // })
      this.getSubAppUrl().then(() => {
        this.turnToIFrame()
        window.addEventListener('message', this.handleMessage, false)
      }).catch(err => {
        // tip(err);
      })
    },
    /*activated() {
      this.turnToIFrame()
    },*/
    methods: {
      ...mapActions([
        // 将this.getSubAppUrl()映射为this.$store.dispatch('getSubAppUrl')
        'getSubAppUrl'
      ]),
      turnToIFrame() {
        console.log("=================路由信息========================");
        console.log("window.location", window.location);
        console.log("subAppUrl", this.subAppUrl);
        // 本地
        if (window.location.href.indexOf('localhost') !== -1 || window.location.href.indexOf('99.6') !== -1 || window.location.href.indexOf('local') !== -1) {
          switch (this.subAppName.toLowerCase()) {
            // case 'tcsevetfrontapp': {
            //   this.$refs.iframe.contentWindow.location.replace('http://99.6.147.143:8083' + this.subAppUrl)
            //   break
            // }
            // case 'tcsvarsfrontapp': {
            //   this.$refs.iframe.contentWindow.location.replace('http://vars.tcs.local.paas.cmbchina.cn:8083' + this.subAppUrl)
            //   break
            // }
            case 'tcsdecsfrontapp': {
               //this.$refs.iframe.contentWindow.location.replace('http://99.6.147.96:8083' + this.subAppUrl)
               this.$refs.iframe.contentWindow.location.replace('http://localhost:8083' + this.subAppUrl)
               break
              }
            case 'tcsfuncfrontapp': {
               this.$refs.iframe.contentWindow.location.replace('http://localhost:8083' + this.subAppUrl)
               break
            }
            case 'tcscmptfrontapp': {
               this.$refs.iframe.contentWindow.location.replace('http://localhost:8083' + this.subAppUrl);
               break
            }
            // case 'tcstimerfrontapp': {
            //   this.$refs.iframe.contentWindow.location.replace('http://99.14.230.47:8098' + this.subAppUrl);
            //   break
            // }
            // case 'tcsfilemanagerfrontapp': {
            //   this.$refs.iframe.contentWindow.location.replace('http://99.14.230.47:8100' + this.subAppUrl);
            //   break
            // }
            // case 'tcsapprfrontapp': {
            //   this.$refs.iframe.contentWindow.location.replace('http://appr.tcs.paas.cmbchina.cn:8080' + this.subAppUrl);
            //   break
            // }
            // case 'tcsprodfrontapp': {
            //   this.$refs.iframe.contentWindow.location.replace('http://funclocaltcs.paas.cmbchina.cn:8103' + this.subAppUrl);
            //   break
            // }
            // case 'tcsdatafrontapp': {
            //   this.$refs.iframe.contentWindow.location.replace(this.dataBiz+ this.subAppUrl);
            //   break
            // }
            // default: {
            //   console.log('未找到业务网子应用')
            // }
              // 本地都用开发环境的，想要本地测就注回上面的代码
            case 'tcsvarsfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.variablesBiz + this.subAppUrl)
              break
            }
            case 'tqsdatasourcefrontapp': {
                this.$refs.iframe.contentWindow.location.replace(this.tqsDatasourceBiz + this.subAppUrl)
                break
            }
            /*case 'tcsdecsfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.decisionsBiz + this.subAppUrl)
              break
            }*/
            case 'tcsfuncfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.functionsBiz + this.subAppUrl)
              break
            }
            case 'tcscmptfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.componentBiz + this.subAppUrl)
              break
            }
            case 'tcstimerfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.timerBiz + this.subAppUrl);
              break
            }
            case 'tcsfilemanagerfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.fileBiz + this.subAppUrl);
              break
            }
            case 'tcsapprfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.apprBiz + this.subAppUrl);
              break
            }
            case 'tcsprodfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.prodBiz + this.subAppUrl);
              break
            }
            case 'tcsdatafrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.dataBiz + this.subAppUrl);
              break
            }
            case 'tcslogfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.logBiz + this.subAppUrl);
              // this.$refs.iframe.contentWindow.location.replace('http://funclocaltcs.paas.cmbchina.cn:8083' + this.subAppUrl);
              break
            }
            case 'tcsmonitorfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.monitorBiz + this.subAppUrl);
              // this.$refs.iframe.contentWindow.location.replace('http://funclocaltcs.paas.cmbchina.cn:8888' + this.subAppUrl);
              break
            }
            default: {
              console.log('未找到业务网子应用')
            }
          }

        } else if (window.location.href.indexOf('oa') !== -1) {
          // 办公网
          switch (this.subAppName.toLowerCase()) {
            case 'tcsevetfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.eventSourceOa + this.subAppUrl)
              break
            }
            case 'tcsvarsfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.variablesOa + this.subAppUrl)
              break
            }
            case 'tqsdatasourcefrontapp': {
                this.$refs.iframe.contentWindow.location.replace(this.tqsDatasourceOa + this.subAppUrl)
                break
              }
            case 'tcsdecsfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.decisionsOa + this.subAppUrl)
              break
            }
            case 'tcsfuncfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.functionsOa + this.subAppUrl)
              break
            }
            case 'tcscmptfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.componentOa + this.subAppUrl)
              break
            }
            case 'tcstimerfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.timerOa + this.subAppUrl);
              break
            }
            case 'tcsfilemanagerfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.fileOa + this.subAppUrl);
              break
            }
            case 'tcsapprfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.apprOa + this.subAppUrl);
              break
            }
            case 'tcsprodfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.prodOa + this.subAppUrl);
              break
            }
            case 'tcsdatafrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.dataOa + this.subAppUrl);
              break
            }
            case 'tcslogfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.logOa + this.subAppUrl);
              break
            }
            case 'tcsmonitorfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.monitorOa + this.subAppUrl);
              break
            }
            default: {
              console.log('未找到业务网子应用')
            }
          }
        } else {
          // 业务网
          switch (this.subAppName.toLowerCase()) {
            case 'tcsevetfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.eventSourceBiz + this.subAppUrl)
              break
            }
            case 'tcsvarsfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.variablesBiz + this.subAppUrl)
              break
            }
            case 'tqsdatasourcefrontapp': {
                this.$refs.iframe.contentWindow.location.replace(this.tqsDatasourceBiz + this.subAppUrl)
                break
              }
            case 'tcsdecsfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.decisionsBiz + this.subAppUrl)
              break
            }
            case 'tcsfuncfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.functionsBiz + this.subAppUrl)
              break
            }
            case 'tcscmptfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.componentBiz + this.subAppUrl)
              break
            }
            case 'tcstimerfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.timerBiz + this.subAppUrl);
              break
            }
            case 'tcsfilemanagerfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.fileBiz + this.subAppUrl);
              break
            }
            case 'tcsapprfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.apprBiz + this.subAppUrl);
              break
            }
            case 'tcsprodfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.prodBiz + this.subAppUrl);
              break
            }
            case 'tcsdatafrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.dataBiz + this.subAppUrl);
              break
            }
            case 'tcslogfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.logBiz + this.subAppUrl);
              break
            }
            case 'tcsmonitorfrontapp': {
              this.$refs.iframe.contentWindow.location.replace(this.monitorBiz + this.subAppUrl);
              break
            }
            default: {
              console.log('未找到业务网子应用')
            }
          }
        }
      },
      handleMessage (event) {
        let data = event.data;
        debugger
        console.log("当前通信值：" + "flag = " + data['flag'] + ",decsFrontUrl = " + data['decsFrontUrl']);
        // console.log("当前操作页面pre：" + this.$route.name);
        console.log("当前操作页面pre：" + this.routeName);
        // if (this.$route.name === 'decsManage') {
        if (this.routeName === 'decsManage' || this.routeName === 'decsManageNew') {
          console.log("当前操作页面是decsManage");
          if(data['flag'] === null || data['flag'] === ''){
            console.log("页面跳转时，data['flag']为空")
          }else{
            try {
              // 本地
              if (window.location.href.indexOf('localhost') !== -1 || window.location.href.indexOf('99.6') !== -1 || window.location.href.indexOf('local') !== -1) {
                switch (data['flag']) {
                  case 'tcsdecsfrontapp': {
                    console.log("switch分支：tcsdecsfrontapp");
                    if(this.$refs.iframe.contentWindow === null || this.$refs.iframe.contentWindow.location == null){
                      console.log("iframe.contentWindow为空或者iframe.contentWindow.location为空");
                    }else{
                      console.log("switch分支：tcsdecsfrontapp，" + this.decisionsBiz + '/ui/decsManage');
                      //http://decs.tcs.localhost.cmbchina.cn:9002
                      this.$refs.iframe.contentWindow.location.replace(this.decisionsBiz + '/ui/decsManage');
                    }
                    break
                  }
                  //由于代码重构，重设设计版本一致性控制方式
                  case 'tcsdecsfrontappnew': {
                    console.log("switch分支：tcsdecsfrontappnew");
                    if(this.$refs.iframe.contentWindow === null || this.$refs.iframe.contentWindow.location == null){
                      console.log("iframe.contentWindow为空或者iframe.contentWindow.location为空");
                    }else{
                      //http://decs.tcs.localhost.cmbchina.cn:9002
                      console.log("switch分支：tcsdecsfrontappnew，" + this.decisionsBiz + '/ui/decsManageNew');
                      this.$refs.iframe.contentWindow.location.replace(this.decisionsBiz + '/ui/decsManageNew');
                    }
                    break
                  }
                  case 'tcsdecsfrontappnewother': {
                    console.log("switch分支：tcsdecsfrontappnewother");
                    if(this.$refs.iframe.contentWindow === null || this.$refs.iframe.contentWindow.location == null){
                      console.log("iframe.contentWindow为空或者iframe.contentWindow.location为空");
                    }else{
                      console.log("switch分支：tcsdecsfrontappnewother， " + data['decsFrontUrl']);
                      this.$refs.iframe.contentWindow.location.replace(data['decsFrontUrl'])
                      this.$notify({
                        title: '提示',
                        dangerouslyUseHTMLString: true,
                        message: `若访问不成功，请点击<a href="${data['decsFrontUrl']}" target="_blank">超链接</a>`,
                        duration: 3000
                      });
                    }
                    break
                  }
                  case 'tcssdkfrontapp': {
                    console.log("switch分支：tcssdkfrontapp");
                    if(this.$refs.iframe.contentWindow === null || this.$refs.iframe.contentWindow.location == null){
                      console.log("iframe.contentWindow为空或者iframe.contentWindow.location为空");
                    }else{
                      console.log("switch分支：tcssdkfrontapp， " + data['decsFrontUrl']);
                      this.$refs.iframe.contentWindow.location.replace(data['decsFrontUrl'])

                      this.$notify({
                        title: '提示',
                        dangerouslyUseHTMLString: true,
                        message: `若访问不成功，请点击<a href="${data['decsFrontUrl']}" target="_blank">超链接</a>`,
                        duration: 3000
                      });
                    }
                    break
                  }
                  default: {
                    console.log('页面跳转，未找到业务网子应用')
                  }
                }
              } else if (window.location.href.indexOf('oa') !== -1) {
                switch (data['flag']) {
                  case 'tcsdecsfrontapp': {
                    console.log("switch分支：tcsdecsfrontapp");
                    if(this.$refs.iframe.contentWindow === null || this.$refs.iframe.contentWindow.location == null){
                      console.log("iframe.contentWindow为空或者iframe.contentWindow.location为空");
                    }else{
                      console.log("switch分支：tcsdecsfrontapp，" + this.decisionsOa + '/ui/decsManage');
                      //http://decs.tcs.localhost.cmbchina.cn:9002
                      this.$refs.iframe.contentWindow.location.replace(this.decisionsOa + '/ui/decsManage');
                    }
                    break
                  }
                  //由于代码重构，重设设计版本一致性控制方式
                  case 'tcsdecsfrontappnew': {
                    console.log("switch分支：tcsdecsfrontappnew");
                    if(this.$refs.iframe.contentWindow === null || this.$refs.iframe.contentWindow.location == null){
                      console.log("iframe.contentWindow为空或者iframe.contentWindow.location为空");
                    }else{
                      //http://decs.tcs.localhost.cmbchina.cn:9002
                      console.log("switch分支：tcsdecsfrontappnew，" + this.decisionsOa + '/ui/decsManageNew');
                      this.$refs.iframe.contentWindow.location.replace(this.decisionsOa + '/ui/decsManageNew');
                    }
                    break
                  }
                  case 'tcsdecsfrontappnewother': {
                    console.log("switch分支：tcsdecsfrontappnewother");
                    if(this.$refs.iframe.contentWindow === null || this.$refs.iframe.contentWindow.location == null){
                      console.log("iframe.contentWindow为空或者iframe.contentWindow.location为空");
                    }else{
                      console.log("switch分支：tcsdecsfrontappnewother， " + data['decsFrontUrl']);
                      this.$refs.iframe.contentWindow.location.replace(data['decsFrontUrl'])
                      this.$notify({
                        title: '提示',
                        dangerouslyUseHTMLString: true,
                        message: `若访问不成功，请点击<a href="${data['decsFrontUrl']}" target="_blank">超链接</a>`,
                        duration: 3000
                      });
                    }
                    break
                  }
                  case 'tcssdkfrontapp': {
                    console.log("switch分支：tcssdkfrontapp");
                    if(this.$refs.iframe.contentWindow === null || this.$refs.iframe.contentWindow.location == null){
                      console.log("iframe.contentWindow为空或者iframe.contentWindow.location为空");
                    }else{
                      console.log("switch分支：tcssdkfrontapp， " + data['decsFrontUrl']);
                      this.$refs.iframe.contentWindow.location.replace(data['decsFrontUrl'])
                      this.$notify({
                        title: '提示',
                        dangerouslyUseHTMLString: true,
                        message: `若访问不成功，请点击<a href="${data['decsFrontUrl']}" target="_blank">超链接</a>`,
                        duration: 3000
                      });
                    }
                    break
                  }
                  default: {
                    console.log('页面跳转，未找到办公网子应用')
                  }
                }
              } else {
                // 业务网
                switch (data['flag']) {
                  case 'tcsdecsfrontapp': {
                    console.log("switch分支：tcsdecsfrontapp");
                    if(this.$refs.iframe.contentWindow === null || this.$refs.iframe.contentWindow.location == null){
                      console.log("iframe.contentWindow为空或者iframe.contentWindow.location为空");
                    }else{
                      //http://decs.tcs.localhost.cmbchina.cn:9002
                      console.log("switch分支：tcsdecsfrontapp，" + this.decisionsBiz + '/ui/decsManage');
                      this.$refs.iframe.contentWindow.location.replace(this.decisionsBiz + '/ui/decsManage');
                    }
                    break
                  }
                  //由于代码重构，重设设计版本一致性控制方式
                  case 'tcsdecsfrontappnew': {
                    console.log("switch分支：tcsdecsfrontappnew");
                    if(this.$refs.iframe.contentWindow === null || this.$refs.iframe.contentWindow.location == null){
                      console.log("iframe.contentWindow为空或者iframe.contentWindow.location为空");
                    }else{
                      //http://decs.tcs.localhost.cmbchina.cn:9002
                      console.log("switch分支：tcsdecsfrontappnew，" + this.decisionsBiz + '/ui/decsManageNew');
                      this.$refs.iframe.contentWindow.location.replace(this.decisionsBiz + '/ui/decsManageNew');
                    }
                    break
                  }
                  case 'tcsdecsfrontappnewother': {
                    console.log("switch分支：tcsdecsfrontappnewother");
                    if(this.$refs.iframe.contentWindow === null || this.$refs.iframe.contentWindow.location == null){
                      console.log("iframe.contentWindow为空或者iframe.contentWindow.location为空");
                    }else{
                      console.log("switch分支：tcsdecsfrontappnewother， " + data['decsFrontUrl']);
                      this.$refs.iframe.contentWindow.location.replace(data['decsFrontUrl'])
                      this.$notify({
                        title: '提示',
                        dangerouslyUseHTMLString: true,
                        message: `若访问不成功，请点击<a href="${data['decsFrontUrl']}" target="_blank">超链接</a>`,
                        duration: 3000
                      });
                    }
                    break
                  }
                  case 'tcssdkfrontapp': {
                    console.log("switch分支：tcssdkfrontapp");
                    if(this.$refs.iframe.contentWindow === null || this.$refs.iframe.contentWindow.location == null){
                      console.log("iframe.contentWindow为空或者iframe.contentWindow.location为空");
                    }else{
                      console.log("switch分支：tcssdkfrontapp， " + data['decsFrontUrl']);
                      this.$refs.iframe.contentWindow.location.replace(data['decsFrontUrl'])
                      this.$notify({
                        title: '提示',
                        dangerouslyUseHTMLString: true,
                        message: `若访问不成功，请点击<a href="${data['decsFrontUrl']}" target="_blank">超链接</a>`,
                        duration: 3000
                      });
                    }
                    break
                  }
                  default: {
                    console.log('页面跳转，未找到办公网子应用')
                  }
                }
              }
            }catch(err){
              console.log("portal跳转：" + err);
            }
          }
        }
        console.log("当前操作页面after：" + this.$route.name);

      }
    },
    destroyed() {
      window.removeEventListener('message', this.handleMessage, false)
    },
  }
</script>

<style scoped>
  .frame-div {
    width: 100%;
    height: calc(100vh - 80px);
  }
</style>
