//index.js
var utils=require("../../utils/util.js");
var netUtil=require("../../utils/netUtil.js");
var API=require("../../utils/API.js");
var app = getApp();
var that;
Page( {
  data: {
    userInfo: {},
    indicatorDots:".",
    adinfos: [],
    netStateBean: new netUtil.netStateBean(),
    currentSliderIndex:0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo( {
      url: '../logs/logs'
    })
  },
  onLoad: function() {
     that = this;
    //netUtil.loginTest("hejinghui@qxinli.com","123456");
    //调用应用实例的方法获取全局数据
    app.getUserInfo( function( userInfo ) {
      //更新数据
    that.setData( {
        userInfo: userInfo
      })
    });
  },
  onReady: function( e ) {
    wx.setNavigationBarTitle( { title: "首页" });
    this.loadWebData();
  },

  swiperchange:function(e){
    console.log(e.detail )
    that.data.currentSliderIndex = e.detail.current;
  },

  /**
   * banner：轮播图
   url：图片地址
   type：类型，有：微课-1、测试-2、文章-3、咨询-4,专辑-5,名师-6
   targetId：对应内容的ID
   * @param e
     */
  clickSwiper:function(e){
    console.log(e )
    if(that.data.adinfos.length <=0){
      return;
    }


    var info = that.data.adinfos[that.data.currentSliderIndex];
    switch (info.type){
      case 1:
          wx.navigateTo({
            url:"../lession/detail?id="+info.targetId
          })
            break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        wx.navigateTo({
          url:"../lession/album?id="+info.targetId
        })
        break;
      case 6:
        wx.navigateTo({
          url:"../expert/expertDetail?id="+info.targetId
        })
        break;
    }
  },
  loadWebData:function(){

    netUtil.buildRequest(that,API.Url.HOME_DATA,new Object(),{
      onPre: function(){
        netUtil.showLoadingDialog(that)
      },
      onSuccess:function (data){
        netUtil.showContent(that);
        var recommendAlbum=data.recommendAlbum;
        recommendAlbum.forEach(function(item){
          item.items=utils.arrayToDoubleArray(item.items,3);
        });
        var recommendCounselor = data.recommendCounselor;
        recommendCounselor.forEach(function(item){
          item.items=utils.arrayToDoubleArray(item.items,3);
        });

        var freeTop = data.freeTop;
        var app=getApp();
        freeTop.forEach(function(e){
          if(e.coverUrl.indexOf("http://",0)==-1){
            e.coverUrl=app.globalData.qiNiuHeadUrl+e.coverUrl;
          }
          if(e.coverUrl==app.globalData.qiNiuHeadUrl){
            e.coverUrl="/image/default_cover.jpg";
          }
        });

        var chargeTop = utils.arrayToDoubleArray(data.chargeTop,3);
        that.setData({adinfos:data.banner,recommendAlbum:data.recommendAlbum,recommendCounselor:data.recommendCounselor,
          freeTop:data.freeTop,chargeTop:chargeTop});
      },
      onEmpty : function(){
        netUtil.showEmptyPage(that);
      },
      onError : function(msgCanShow,code,hiddenMsg){
        netUtil.showErrorPage(msgCanShow,that);
      },
      onUnlogin: function(){
        this.onError("您还没有登录或登录已过期,请登录",5,'')
      },
      onUnFound: function(){
        this.onError("您要的内容没有找到",2,'')
      }
    }).send();
  }
});
