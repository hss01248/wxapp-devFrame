
//此js针对纯listview数据,没有头部

var utils=require("../../utils/util.js");
var netUtil=require("../../utils/netUtil.js");
var viewBeans=require("../../beans/viewBeans.js");
var infoBeans=require("../../beans/infoBeans.js");
var API=require("../../utils/API.js");
const request_firstIn = 1;
const request_refresh = 2;
const request_loadmore = 3;
const request_none = 0;

var app = getApp();
var that;
var id =0;  //页面id


var intentDatas;
var isFristIn = true;





var needRefreshOnResume = false;//todo 页面需要自己决定




Page({
  data: {
    title:'免费排行榜',//todo 设置标题栏
      emptyMsg:'暂时没有内容,去别处逛逛吧',//todo 空白显示内容
      requestMethod:"POST",//todo 如果不是post,则在这里改
      app: app,


      netStateBean: new netUtil.netStateBean(),

      currentPageIndex:1,
      currentAction : 0,
      urlTail:API.Lesson.MORE,//todo 需补全的,页面请求的url


    infos:[],//列表数据



  },


//以下四个方法是生命周期方法,已封装好,无需改动
 onLoad: function(options) {
   that = this;
   intentDatas = options;
     if (that.data.emptyMsg != null &&　that.data.emptyMsg != ''　){
         that.data.netStateBean.emptyMsg = that.data.emptyMsg;
     }
    that.parseIntent(options);
   this.requestList(1,request_firstIn)
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.title
    });
    
    
  },
  onHide:function(){

    },
  onShow:function(){
    if (isFristIn){
        isFristIn = false;
    }else {
        if (needRefreshOnResume){
           if (that.data.currentAction ==request_none){
                this.requestList(1,request_refresh);//刷新
           }

        }

    }
  },
    //上拉加载更多
    onLoadMore: function(e) {
    console.log(e);
        console.log(that.data.currentAction +"---"+request_none);
     if (that.data.currentAction ==request_none){
         this.requestList(that.data.currentPageIndex+1,request_loadmore)
     }

  },
    //下拉刷新,通过onPullDownRefresh来实现,这里不做动作
    onRefesh: function(e) {
    console.log(e);
   // this.onPullDownRefresh(e)//刷新
  },



 onPullDownRefresh:function(e){
  console.log(e);
    // if (that.data.currentAction == request_none){
         this.requestList(1,request_refresh);
   //  }
},



    //针对纯listview,网络请求直接一行代码调用
    requestList:function(pageIndex, action){
       netUtil.requestSimpleList(that,pageIndex,action)
    },



    //todo 滑动监听,各页面自己回调
    scroll: function(e) {
        console.log(e)
    },



    //todo 将intent传递过来的数据解析出来
    parseIntent:function(options){


    },

    //todo 设置网络参数
    /**
     * 设置网络参数
     * @param params config.params
     * @param id 就是请求时传入的id,也是成员变量-id
     */
    setNetparams: function (params) {
        params.type=3;


    },

    //todo 如果list数据是netData里一个字段,则更改此处
    getListFromNetData:function(netData){
        return netData;
    },


    //todo 数据的一些处理并刷新数据
    handldItemInfo:function(info){


    },








})