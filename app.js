


App({
  onLaunch: function () {
    console.log('App Launch')
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);



  },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData:{
    userInfo:null,
    uid:248,
    session_id:'',
    isLogin:false,
    

    //一些配置
    isDebug:true,
    apiHeadUrl: "",//todo 增加切换服务器的功能
    qiNiuHeadUrl:"",
    socketHeadUrl:"",
    defaultPageSize:20
  },
  removeHTMLTag: function(str) {
      // str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
      // str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
      // //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
      // str=str.replace(/ /ig,'');//去掉 
      // str.replace(/(\\&)?(quot|#34);|(\\&)?(nbsp|#160);|(\\&)?(amp|#38);|(\\&)?(lt|#60);|(\\&)?(gt|#62);|(\\&)?(iexcl|#161);|(\\&)?(cent|#162);|(\\&)?(pound|#163);|(\\&)?(copy|#169);|(\\&)?#(\\d+);|\\n/g,'');
      // return str;

      //过滤script标签
    	str = str.replace(/<[\\s]*?script[^>]*?>[\\s\\S]*?<[\\s]*?\/[\\s]*?script[\\s]*?>/g,'');
        //过滤style标签
      str = str.replace(/<[\\s]*?style[^>]*?>[\\s\\S]*?<[\\s]*?\/[\\s]*?style[\\s]*?>/g,'');
      //过滤html标签
      str = str.replace(/<[^>]+>/g,'');
      //过滤空格等标签
      str = str.replace(/(\\&)?(quot|#34);|(\\&)?(nbsp|#160);|(\\&)?(amp|#38);|(\\&)?(lt|#60);|(\\&)?(gt|#62);|(\\&)?(iexcl|#161);|(\\&)?(cent|#162);|(\\&)?(pound|#163);|(\\&)?(copy|#169);|(\\&)?#(\\d+);|\\n/g,'');
      return str;
  }
})