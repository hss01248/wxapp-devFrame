/**
 * Created by Administrator on 2016/10/19 0019.
 */

//此js针对纯listview数据,没有头部

var utils=require("../../utils/util.js");
var netUtil=require("../../utils/netUtil.js");
var viewBeans=require("../../beans/viewBeans.js");
var infoBeans=require("../../beans/infoBeans.js");
var consData=require("../../utils/consData.js");
var color=require("../../utils/color.js");
var IntentUtil=require("../../utils/IntentUtil.js");
var API=require("../../utils/API.js");
const request_firstIn = 1;
const request_refresh = 2;
const request_loadmore = 3;
const request_none = 0;


//表格布局
var WXGrid =require("../../utils/wxgrid.js");
var wxgrid = new WXGrid ;
wxgrid.init(1,3);
var img = "http://pic.qqtn.com/up/2016-9/20169281936395677.png";
var classifies = [
    ];
/*{name:"领聘1",img:img},
 {name:"领聘2",img:img},
 {name:"领聘3",img:img},
 {name:"领聘4",img:img},
 {name:"领聘5",img:img},
 {name:"领聘6",img:img},
 {name:"领聘7",img:img},
 {name:"领聘8",img:img}*/
wxgrid.data.add("classifies",classifies);//一维变成二维数组


//订单状态
const NEW = 1;
const PENDING = 2;
const PAID = 3;
const FAIL = 4;
const CANCELED = 5;
const REPLACE = 6;
const DONE = 7;

var app = getApp();
var that;
var id =0;  //页面id


var intentDatas;
var isFristIn = true;


var voiceType =0;
var albumType =0;


var needRefreshOnResume = true;//todo 页面需要自己决定




Page({
    data: {
        title:'更多课程',//todo 设置标题栏
        emptyMsg:'暂时没有内容,去别处逛逛吧',//todo 空白显示内容
        urlTail:'order/list/order/v1.json',//todo 需补全的,页面请求的url
        app: app,
        wxgrid: wxgrid,
        netStateBean: new netUtil.netStateBean(),
        netStateBean1: new netUtil.netStateBean(),

        tabIndex:'0',
        currentPageIndex0:1,
        currentPageIndex1:1,
        currentAction : 0,//1:第一次进入 , 2: 刷新
        hasSuccessed:false,
        url1:API.Album.MORE,
        url2:API.Lesson.MORE,


        id:0, //页面id
        //info:new Object(),//页面详情数据


        payStateColor:color.oriange(),
        remainTimeHidden:true,
        hasPaidTxt:'应',
        btnLeftTxt:'取消订单',
        btnRightTxt:'立即支付',
        albums:[],
        voices:[],

        labelId:'',
        priceType:'',
        categoryIds:'',
        isFilter:false





    },




//以下四个方法是生命周期方法,已封装好,无需改动
    onLoad: function(options) {
        that = this;
        intentDatas = options;
        that.parseIntent(options);
        this.requestList0(request_firstIn,that.data.currentPageIndex0)
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
            var optionsback = getApp().globalData.filte;
            if(optionsback != undefined && optionsback != null){


                that.setData({
                    labelId:optionsback.labelId,
                    priceType:optionsback.priceType,
                    categoryIds:optionsback.categoryIds,
                    url1:'lesson/search/v1.json',
                    url2:'lesson/search/v1.json',
                    isFilter:true
                });
            }else {

            }



            if (needRefreshOnResume){
                if (that.data.currentAction ==request_none){
                    //this.requestList(request_refresh);//刷新
                    if (that.data.tabIndex ==0){
                        that.requestList0(request_refresh,1);
                    }else if(that.data.tabIndex ==1){
                        that.requestList1(request_refresh,1);
                    }
                }

            }



        }
    },

    onUnload:function(e){
        getApp().globalData.filte=undefined;
    },
    //上拉加载更多
    onLoadMore: function(e) {
        console.log(e);
        if (that.data.tabIndex ==0){
            that.requestList0(request_loadmore,that.data.currentPageIndex0+1);
        }else if(that.data.tabIndex ==1){
            that.requestList1(request_loadmore,that.data.currentPageIndex1+1);
        }


    },
    //下拉刷新,通过onPullDownRefresh来实现,这里不做动作
    onRefesh: function(e) {
        console.log(e);
        // this.onPullDownRefresh(e)//刷新


        if (that.data.tabIndex ==0){
            that.requestList0(request_refresh,1);
        }else if(that.data.tabIndex ==1){
            that.requestList1(request_refresh,1);
        }

    },





    onRetry:function(e){
        console.log(e);
        // if (that.data.currentAction == request_none){
        if (that.data.tabIndex ==0){
            that.requestList0(request_refresh,1);
        }else if(that.data.tabIndex ==1){
            that.requestList0(request_refresh,1);
        }
        netUtil.showLoadingDialog(that);
        //  }
    },



    requestList0:function(action,index){
        var params = {};

        that.setNetparams(params);
        netUtil.sendRequestByAction(that,that.data.url1,params,action,index,that.data.albums,false,{
            onPreFirstIn: function(){},
            onPreRefresh: function(){},
            onPreLoadMore: function(){
                var bean = that.data.netStateBean;
                bean.loadmoreHidden0 = false;
                bean.loadmoreMsg0= '加载中...';
                that.setData({
                    netStateBean: bean
                });
            },

            getRealDataFromNetData:function(netData){
                return netData;
            },
            washItem:function(item){
            },


            onSuccessFirstIn:function (data){
                netUtil.showContent(that);
                wxgrid.init(data.length/3,3);
                wxgrid.data.add("classifies",data);

                that.setData({
                    albums:data,
                    wxgrid:wxgrid
                });
                var bean = that.data.netStateBean;
                if(data.length <15){
                    bean.loadmoreHidden0 = true;
                }else {
                    bean.loadmoreHidden0 = false;
                }
                bean.loadmoreMsg0= '没有了...';
                that.setData({
                    netStateBean: bean
                });
            },
            onSuccessRefresh:function (data){
                that.data.currentPageIndex0 =1;
                wxgrid.init(data.length/3,3);
                wxgrid.data.add("classifies",data);
                netUtil.showContent(that);
                that.setData({
                    albums:data,
                    wxgrid:wxgrid
                })

                var bean = that.data.netStateBean;
                if(data.length <15){
                    bean.loadmoreHidden0 = true;
                }else {
                    bean.loadmoreHidden0 = false;
                }
                bean.loadmoreMsg0= '没有了...';
                that.setData({
                    netStateBean: bean
                });
            },
            onSuccessLoadMore:function (data,hasMore){
                wxgrid.init(data.length/3,3);
                wxgrid.data.add("classifies",data);

                that.setData({
                    albums:data,
                    wxgrid:wxgrid
                });

                if(!hasMore){
                    var bean = that.data.netStateBean;
                    if(data.length <15){
                        bean.loadmoreHidden0 = true;
                    }else {
                        bean.loadmoreHidden0 = false;
                    }
                    bean.loadmoreMsg0= '没有了...';
                    that.setData({
                        netStateBean: bean
                    });
                }
            },

            onEmptyFirstIn : function(){
                netUtil.showEmptyPage(that);
            },
            onEmptyRefresh : function(){
                if(that.data.isFilter){
                    that.setData({
                        emptyMsg:'当前筛选条件下没有内容,请更换筛选条件!'
                    });
                }
                netUtil.showEmptyPage(that);
            },
            onEmptyLoadMore : function(){
                var bean = that.data.netStateBean;
                bean.loadmoreHidden0 = false;
                bean.loadmoreMsg0= '没有了...';
                that.setData({
                    netStateBean: bean
                });
            },


            onErrorFirstIn : function(msgCanShow,code,hiddenMsg){
                netUtil.showErrorPage(that,msgCanShow);
            },
            onErrorRefresh : function(msgCanShow,code,hiddenMsg){
            },
            onErrorLoadMore : function(msgCanShow,code,hiddenMsg){
                var bean = that.data.netStateBean;
                bean.loadmoreHidden0 = false;
                bean.loadmoreMsg0= '加载出错,请上拉重试.';
                that.setData({
                    netStateBean: bean
                });
            }
        });
    },
    requestList1:function(action,index){
        var params = {};

        that.setNetparams(params);
        netUtil.sendRequestByAction(that,that.data.url2,params,action,index,that.data.voices,false,{
            onPreFirstIn: function(){},
            onPreRefresh: function(){},
            onPreLoadMore: function(){


               netUtil.loadMoreStart1(that);
            },

            getRealDataFromNetData:function(netData){
                return netData;
            },
            washItem:function(item){
                item.coverUrl = utils.getAudioCoverReal(item.coverUrl);
                if(item.price ==0 || item.price == null){
                    item.price = "免费";
                }else {
                    if (item.price == item.discountPrice){
                        item.discountPrice=0;
                    }
                }


            },


            onSuccessFirstIn:function (data){
                netUtil.showContent1(that);

                that.setData({
                    voices:data
                })
            },
            onSuccessRefresh:function (data){
                netUtil.showContent1(that);
                that.data.currentPageIndex1 =1;
                that.setData({
                    voices:data
                })
            },
            onSuccessLoadMore:function (data,hasMore){
                that.data.currentPageIndex1 = index;
                that.setData({
                    voices:data
                })

                if(!hasMore){
                   netUtil.loadMoreNoData1(that);
                }
            },

            onEmptyFirstIn : function(){
                netUtil.showEmptyPage1(that);
            },
            onEmptyRefresh : function(){

               if(that.data.isFilter){
                   that.setData({
                       emptyMsg:'当前筛选条件下没有内容,请更换筛选条件!'
                   });
               }


                netUtil.showEmptyPage1(that);
            },
            onEmptyLoadMore : function(){

               netUtil.loadMoreNoData1(that);
            },


            onErrorFirstIn : function(msgCanShow,code,hiddenMsg){
                netUtil.showErrorPage1(that,msgCanShow);
            },
            onErrorRefresh : function(msgCanShow,code,hiddenMsg){
                netUtil.showErrorPage1(that,msgCanShow);
            },
            onErrorLoadMore : function(msgCanShow,code,hiddenMsg){
                netUtil.loadMoreError1(that);
            }
        });
    },



    onPullDownRefresh:function(e){
        console.log(e);
        // if (that.data.currentAction == request_none){
        //this.requestList(request_refresh);
        //  }
        if (that.data.tabIndex ==0){
            that.requestList0(request_refresh,1);
        }else if(that.data.tabIndex ==1){
            that.requestList1(request_refresh,1);
        }
        netUtil.showLoadingDialog(that);

    },

//toast的自动消失.wxml里自动调用
    toastDismiss:function(){
        netUtil.dismissToast(that);
    },

    //针对纯listview,网络请求直接一行代码调用





    changeTab:function(e) {
        console.log(e)
        var index = e.currentTarget.dataset.tabIndex;
        switch (index){
            case '0':
                that.setData({
                    tabIndex:index,
                });

                break;
            case '1':
                that.setData({
                    tabIndex:index,
                });

                if(that.data.voices.length ==0){
                    that.requestList1(request_firstIn,1);
                }

                break;



        }
    },



    //todo 滑动监听,各页面自己回调
    scroll: function(e) {
        console.log(e)
    },



    //todo 将intent传递过来的数据解析出来
    parseIntent:function(options){
        id = options.id;
        if(id==0 || id ==null || id == undefined){
            id=0;
        }
        that.data.id= id;


        /*category=voice&type=3&uid=3*/
        voiceType = options.voiceType;
        albumType = options.albumType;

        if(options.category=='voice'){
            that.setData({
                tabIndex:'1'
            });
            var e={};
            e.currentTarget ={};
            e.currentTarget.dataset ={};
            e.currentTarget.dataset.tabIndex = '1';
            that.changeTab(e);
        }


    },

    //todo 设置网络参数
    /**
     * sourceType 不必传 int 资源类型  0-全部  1-精品  2-推荐
     *
     *  labelId  不必传  int 年龄段 0：全部  1：幼儿  2：小学低年级  3：小学高年级  4：初中生  5：高中生
     priceType 不必传 int 价格    0：全部 1：限时免费 2：免费 3：收费
     categoryIds 不必传 string  多分类id 逗号隔开
     *
     * 设置网络参数
     * @param params config.params
     * @param id 就是请求时传入的id,也是成员变量-id
     */
    setNetparams: function (params) {
        var catergory = that.data.tabIndex;
        if (catergory == 0){
            params.type = albumType;
        }else if (catergory ==1){
            params.type = voiceType;
        }
        //params.status = catergory;
        params.pageIndex = 1;
        /*map.put("status", category +"");*/
        params.uid = id;


        if(that.data.url1 =='lesson/search/v1.json'){//是筛选
            //筛选时用的参数
            if(!utils.isStrEmpty(that.data.labelId)){
                params.labelId = that.data.labelId;
            }
            if(!utils.isStrEmpty(that.data.priceType)){
                params.priceType = that.data.priceType;
            }
            if(!utils.isStrEmpty(that.data.categoryIds)){
                params.categoryIds = that.data.categoryIds;
            }
            var catergory = that.data.tabIndex;
            if (catergory == 0){
                params.type = 1;
            }else if (catergory ==1){
                params.type = 2;
            }
        }










    },

    //todo 如果list数据是netData里一个字段,则更改此处
    washItemData:function(item){

        item.createTime = utils.formatTime(new Date(item.createTime));



        if (utils.isStrEmpty(item.goodsCover)){
            item.goodsCover = consData.defaultAudioUrl();
        }

        if (item.goodsCover.indexOf('http://') <0){
            item.goodsCover = getApp().globalData.qiNiuHeadUrl+item.goodsCover;
        }




        if (item.status ==7 || item.status ==3){//已完成或者已支付
            item.payStatusStr='已完成';
            item.payStatusAction='去听课'
        }else if (item.status ==5){//订单已取消
            item.payStatusStr='已取消';

        }else {
            item.payStatusStr='待付款';
            item.payStatusAction='去支付'
        }

    },

    clickBtn:function(e){
        console.log(e)
        var id = e.currentTarget.dataset.id;
        var str = e.currentTarget.dataset.str;
        var obj = e.currentTarget.dataset;
        if (str == '去听课'){
            IntentUtil.toAudioDetail(id);

        }else if(str == '去支付'){
            var str = IntentUtil.toPay(obj.type,obj.id,obj.transId,obj.goodsName,obj.fee,obj.userName,obj.status);;
            var path = "pay?"+str;
            wx.navigateTo( {
                url: path,
                fail:function(){
                    wx.redirectTo({
                        url: path
                    })
                }

            })
        }


    },


    //todo rootview 的item点击事件,如果是其他的按钮,需要自己写方法,传递数据.这个类似于android里的点击事件
    clickItemRoot:function(e){
        console.log(e)
        var id = e.currentTarget.dataset.id;//rootview 已经将item的整个info带过来了.
        wx.navigateTo( {
            url: '../order/detail?id='+id
            // url: '../expert/experts'
        })
    }

})