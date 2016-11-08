/**
 * Created by Administrator on 2016/10/13 0013.
 */

function Actions(){

};
const request_firstIn = 1;
const request_refresh = 2;
const request_loadmore = 3;
const request_none = 0;

Actions.request_firstIn = 1;
Actions.request_refresh = 2;
Actions.request_loadmore = 3;
Actions.request_none = 0;

const code_unlogin = 5;
const code_unfound = 2;


function requestConfig(){
    this.page;  //页面对象
    this.isNewApi = true;
    this.urlTail='';
    this.params={
        pageIndex:0,
        pageSize:getApp().globalData.defaultPageSize,
        session_id:getApp().globalData.session_id
    };
    this.netMethod='POST';
    this.callback={
        onPre: function(){},
        onEnd: function(){

        },
        onSuccess:function (data){},
        onEmpty : function(){},
        onError : function(msgCanShow,code,hiddenMsg){},
        onUnlogin: function(){
            this.onError("您还没有登录或登录已过期,请登录",5,'')
        },
        onUnFound: function(){
            this.onError("您要的内容没有找到",2,'')
        }
    };

    this.setMethodGet = function(){
        this.netMethod = 'GET';
        return this;
    }

    this.setApiOld = function(){
        this.isNewApi = false;
        return this;
    }

    this.send = function(){
        request(this);
    }
}

function isOptStrNull(str){
    if(str == undefined || str == null || str == '' || str == 'null'||str == '[]'||str == '{}'){
        return true
    }else{
        return false;
    }
}

function objToStr(appendixStr, obj){
    var str = "" ;
    for ( var p in obj ){ // 方法
        if ( typeof ( obj [ p ]) == "function" ){
            // obj [ p ]() ; //调用方法

        } else if (obj [ p ]!= undefined && obj [ p ]!= null){ // p 为属性名称，obj[p]为对应属性的值
            str += p + "=" + obj [ p ] + appendixStr ;
        }
    }
    return str;
}


/*

 onPreFirstIn: function(){},
 onPreRefresh: function(){},
 onPreLoadMore: function(){},

 onEnd: function(){
    hideLoadingDialog(page);
 },


 getRealDataFromNetData:function(netData){
    return netData;
 },
 washItem:function(item){
 },


 onSuccessFirstIn:function (data){

 },
 onSuccessRefresh:function (data){

 },
 onSuccessLoadMore:function (data,hasMore){

 },

 onEmptyFirstIn : function(){
 },
 onEmptyRefresh : function(){
 },
 onEmptyLoadMore : function(){
 },


 onErrorFirstIn : function(msgCanShow,code,hiddenMsg){
 },
 onErrorRefresh : function(msgCanShow,code,hiddenMsg){
 },
 onErrorLoadMore : function(msgCanShow,code,hiddenMsg){
 }

 //todo 回调,拷贝这段代码去用--sendRequestByAction


* */

/**
 * 刷新和分页加载的请求
 * @param page
 * @param urlTail
 * @param params
 * @param action  本次请求的动作
 * @param currentPageIndex 需要请求的页面index
 * @param currentDatas 页面已经有的数据,是一个jsonarray
 * @param callback 回调  拷贝上方注释区的代码使用
 * @param isStandard 是不是标准的ui
 */
function sendRequestByAction(page,urlTail,params,action,currentPageIndex,currentDatas,isStandard,callback){

    var pageIndex = currentPageIndex;
    if (action == action.request_refresh || action == action.request_firstIn ){
        pageIndex = 1;
    }else if (action == action.request_loadmore){
        pageIndex = pageIndex +1;
    }
    params.pageIndex = pageIndex;

    buildRequest(page,urlTail,params,{
        onPre: function(){
            if (action == Actions.request_refresh  ){
                if(isStandard){

                }
               callback.onPreRefresh();
            }else if (action == Actions.request_loadmore){
                callback.onPreLoadMore();
            }else if (action == Actions.request_firstIn){
                if(isStandard){
                    showLoadingDialog(page);
                }
                callback.onPreFirstIn();
            }
        },
        onEnd: function(){
            hideLoadingDialog(page);
            if(isFunction(callback.onEnd))
            callback.onEnd();
        },
        onSuccess:function (data){
            var infos = callback.getRealDataFromNetData(data);
          //  console.log("onSuccess------"+infos);

            if (infos instanceof Array){
                var length = infos.length;
                if (length<=0){
                    this.onEmpty();
                    return;
                }

                for (var i in infos){
                    var info = infos[i];
                    callback.washItem(info);
                }
            }

           // console.log("Actions---- ------"+action);

            if (action == Actions.request_refresh  ){

                if(isStandard){
                   showSuccessToast(page,"数据已刷新");
                    page.setData({
                        infos:infos
                    });
                }

                callback.onSuccessRefresh(infos);
            }else if (action == Actions.request_loadmore){
                var newInfos = currentDatas.concat(infos);


                var hasMore = true;
                if(params.pageSize == undefined || params.pageSize == null || params.pageSize == 0){
                    if(infos.length < getApp().globalData.defaultPageSize){
                        hasMore = false;
                    }
                }else if(infos.length < params.pageSize){
                    hasMore = false;
                }

                if(isStandard){
                    page.setData({
                        infos:newInfos
                    });

                    if(!hasMore){
                        loadMoreNoData(page);
                    }
                }




                callback.onSuccessLoadMore(newInfos,hasMore);
            }else if (action == Actions.request_firstIn){
                if(isStandard){
                   showContent(page);
                    page.setData({
                        infos:infos
                    });
                }
                callback.onSuccessFirstIn(infos);

               // console.log("onSuccessFirstIn  after ------"+infos);
            }

        },
        onEmpty : function(){
            if (action == Actions.request_refresh  ){

                callback.onEmptyRefresh();
            }else if (action == Actions.request_loadmore){
                if(isStandard){
                    loadMoreNoData(page);
                }
                callback.onEmptyLoadMore();
            }else if (action == Actions.request_firstIn){
                if(isStandard){
                    showEmptyPage(page);

                }
                callback.onEmptyFirstIn();
            }
        },
        onError : function(msgCanShow,code,hiddenMsg){
            if (action == Actions.request_refresh  ){
                callback.onErrorRefresh(msgCanShow,code,hiddenMsg);
            }else if (action == Actions.request_loadmore){
                if(isStandard){
                    loadMoreError(page);
                }
                callback.onErrorLoadMore(msgCanShow,code,hiddenMsg);
            }else if (action == Actions.request_firstIn){
                if(isStandard){
                    showErrorPage(msgCanShow);
                }
                callback.onErrorFirstIn(msgCanShow,code,hiddenMsg);
            }
        },
        onUnlogin: function(){
            this.onError("您还没有登录或登录已过期,请登录",5,'')
        },
        onUnFound: function(){
            this.onError("您要的内容没有找到",2,'')
        }
    }).send();
}



/*

//todo 回调,拷贝这段代码去用--buildRequest
     onPre: function(){},
     onEnd: function(){
           hideLoadingDialog(page);
     },
     onSuccess:function (data){},
     onEmpty : function(){},
     onError : function(msgCanShow,code,hiddenMsg){},
     onUnlogin: function(){
     this.onError("您还没有登录或登录已过期,请登录",5,'')
     },
     onUnFound: function(){
     this.onError("您要的内容没有找到",2,'')
     }

* */

/**
 * 注意,此方法调用后还要调用.send()才是发送出去.
 * @param page
 * @param urlTail
 * @param params
 * @param callback  拷贝上方注释区的代码使用
 * @returns {requestConfig}
 */
function buildRequest(page,urlTail,params,callback){
    var config = new requestConfig();
    config.page = page;
    config.urlTail = urlTail;


    if (getApp().globalData.session_id == null  || getApp().globalData.session_id == ''){
        params.session_id=''
    }else {
        params.session_id = getApp().globalData.session_id;
    }
    if (params.pageIndex == undefined || params.pageIndex <=0 || params.pageSize == 0){
        params.pageSize=0
    }else {
        if (params.pageSize == undefined){
            params.pageSize = getApp().globalData.defaultPageSize;
        }
    }
    log(params)
    config.params = params;

    log(config.params)

    //config.callback = callback;

    if(isFunction(callback.onPre)){
        config.callback.onPre=callback.onPre;
    }

    if(isFunction(callback.onEnd)){
        config.callback.onEnd=callback.onEnd;
    }

    if(isFunction(callback.onEmpty)){
        config.callback.onEmpty=callback.onEmpty;
    }

    if(isFunction(callback.onSuccess)){
        config.callback.onSuccess=callback.onSuccess;
    }

    if(isFunction(callback.onError)){
        config.callback.onError=callback.onError;
    }

    if(isFunction(callback.onUnlogin)){
        config.callback.onUnlogin=callback.onUnlogin;
    }
    if(isFunction(callback.onUnFound)){
        config.callback.onUnFound=callback.onUnFound;
    }
    return config;
}

function log(msg){
    var isDebug = getApp().globalData.isDebug;
    if (isDebug){
        console.log(msg);
    }
}

function isFunction(value){
    if( typeof ( value) == "function" ){
        return true;
    }else {
        return false;
    }
}


function json2Form(json) {
    var str = [];
    for(var p in json){
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }
    return str.join("&");
}


// 封装网络请求通用的处理: 参数拼接和结果处理

/**
 * @deprecated 已过期,请使用buildRequest().send()来发送请求
 * @param requestConfig
 */
function request(requestConfig){

    //检验三个公有参数并处理

    if (requestConfig.params.session_id ==null  || requestConfig.params.session_id == ''){
      delete  requestConfig.params.session_id;
    }
    if (requestConfig.params.pageIndex ==0 || requestConfig.params.pageSize == 0){
       delete requestConfig.params.pageIndex ;
        delete  requestConfig.params.pageSize;
    }


    var paramStr = objToStr("&", requestConfig.params);//拼接请求参数成一个String    json2Form(requestConfig.params);
    if( isFunction(requestConfig.callback.onPre) ){
        requestConfig.callback.onPre();//请求发出前
    }

    console.log(requestConfig.params);

    //根据请求方法来拼接url:
    var body = undefined;
    var wholeUrl = requestConfig.urlTail;
    if (wholeUrl.indexOf("http://") <0){
        wholeUrl =  getApp().globalData.apiHeadUrl+requestConfig.urlTail;
    }


    var contentType ='';
    if (requestConfig.netMethod =='GET'){
        wholeUrl = wholeUrl+"?"+paramStr;
        contentType = 'application/json';
    }else if (requestConfig.netMethod =='POST'){
     // body = paramStr;//行不通,str传递不过去,微信开发工具的bug
       // data:requestConfig.params; //这时传给服务器的是jsonObject,不符合本项目中的要求
        wholeUrl = wholeUrl+"?"+paramStr;//目前只能以get请求的方式发送post,这个还需要服务器支持get转post,fuck
        contentType = "application/x-www-form-urlencoded";
    }

    //todo 能够使用cache-control吗?以目前这工具的尿性估计是不能吧
    wx.request({
        url: wholeUrl,
        method:requestConfig.netMethod,
        head:{
            'Content-Type':contentType
        },
        data:body,
        success: function(res) {
            console.log(res);
            if( isFunction(requestConfig.callback.onEnd) ){
                requestConfig.callback.onEnd();//请求发出前
            }
            if(res.statusCode = 200){
                var responseData = res.data;

                if (!requestConfig.isNewApi){
                    //老api:
                    var isSuccess = responseData.success;
                    if (isSuccess){
                        requestConfig.callback.onSuccess(responseData);
                    }else {
                        requestConfig.callback.onError(responseData.message,responseData.error_code,"");
                    }

                    return;
                }

                //新api

                var code = responseData.code;
                var msg = responseData.message;

                if(code == 0){
                    var data = responseData.data;
                    var isDataNull = isOptStrNull(data);

                    if(isDataNull){
                        requestConfig.callback.onEmpty();
                    }else{
                        requestConfig.callback.onSuccess(data);
                    }
                }else if(code == 2){
                    if(isOptStrNull(msg)){
                        requestConfig.callback.onUnFound();
                    }else {
                        requestConfig.callback.onError(msg,code,msg);
                    }

                }else if(code == 5){

                    if(isOptStrNull(msg)){
                        requestConfig.callback.onUnlogin();
                    }else {
                        requestConfig.callback.onError(msg,code,msg);
                    }

                }else{
                    var isMsgNull = isOptStrNull(msg);
                    if(isMsgNull){
                        var isCodeNull = isOptStrNull(code);
                        if (isCodeNull){
                            requestConfig.callback.onError("数据异常！,请核查",code,'');
                        }else {
                            requestConfig.callback.onError("数据异常！,错误码为"+code,code,'');
                        }

                    }else{
                        requestConfig.callback.onError(msg,code,'');
                    }
                }
            }else if(res.statusCode >= 500){
                requestConfig.callback.onError("服务器异常！",res.statusCode,'');
            }else if(res.statusCode >= 400 && res.statusCode < 500){
                requestConfig.callback.onError("没有找到内容",res.statusCode,'');
            }else{
                requestConfig.callback.onError("网络请求异常！",res.statusCode,'');
            }
        },
        fail:function(res){
            console.log("fail",res);
            if( isFunction(requestConfig.callback.onEnd) ){
                requestConfig.callback.onEnd();//请求发出前
            }
            requestConfig.callback.onError("网络请求异常！",res.statusCode,'');

        },
        complete:function(res){
           // requestConfig.callback.onEnd();


            // that.setData({hidden:true,toast:true});
        }
    })
}


/**
 * 给纯listview,单一item封装的网络请求
 * @param that
 * @param pageIndex
 * @param action
 */
function requestSimpleList(that,pageIndex,action){
    var config = new requestConfig();
    config.page = that;
    config.urlTail= that.data.urlTail;
    config.params.pageIndex = pageIndex;
    that.setNetparams(config.params);
    that.data.currentAction = action;
    config.callback.onPre = function(){

        if(action == request_firstIn  ){
            showLoadingDialog(that);
        }else if (action == request_loadmore){
            loadMoreStart(that);
        }
    };

    config.callback.onSuccess=function(data){
        that.data.currentAction = request_none;

        console.log("onsuccess-----------")

        var currentDatas = that.getListFromNetData(data);//todo 如果是其中一个字段,需要取出.

        if (currentDatas.length==0){
            config.callback.onEmpty();
            return;
        }
        that.hasSuccessed = true;
        showContent(that);

        if(action == request_firstIn ){

        }else if (action == request_refresh){
            showSuccessToast(that,"数据刷新成功");

        }
        //that.handleDataAndRefreshUI(data);
        //处理数据
        that.data.currentPageIndex = pageIndex;



        //数据的一些处理,包括了一维和二维数组的处理,全部都解析到单个item层次返回
        currentDatas.forEach(function(info){
            if(info instanceof Array){
                info.forEach(function(item){
                    that.handldItemInfo(item)
                });
            }else {
                that.handldItemInfo(info)
            }
        });

        //根据操作的action不同而处理:
        if(action == request_firstIn){
            // that.data.infos.length =0;
        }else if (action == request_loadmore){

        }else if (action == request_refresh){
            that.data.infos.length =0;
        }

        that.data.infos=that.data.infos.concat(currentDatas);
        console.log('before setData----------'+that.data.infos);
        that.setData({infos:that.data.infos});


    };

    config.callback.onEmpty = function(){

        that.data.currentAction = request_none;
        if(action == request_firstIn){
            showEmptyPage(that);
        }else if (action == request_loadmore){
            loadMoreNoData(that);
        }else if (action == request_refresh){
            showSuccessToast(that,"没有新内容");

            if (that.hasSuccessed){
                showSuccessToast(that,"没有新内容");
            }else {
                showEmptyPage(that);
            }

        }
    };

    config.callback.onError= function(msgCanShow,code,hiddenMsg){
        that.data.currentAction = request_none;
        console.log(hiddenMsg+"--"+code);


        if(action == request_firstIn){
            showErrorPage(that,msgCanShow);
        }else if (action == request_loadmore){
            loadMoreError(that);
        }else if (action == request_refresh){
            if (that.hasSuccessed){

            }else {
                showErrorPage(that,msgCanShow)
            }
        }
    };

    config.callback.onEnd=function(){
        if (action == request_refresh){
            stopPullRefresh(that);
        }

        hideLoadingDialog(that);
    };

    request(config)
}


function requestForDetail(that, action){
    var config = new requestConfig();
    config.page = that;
    config.urlTail= that.data.urlTail;
   // config.params.pageIndex = pageIndex;
    console.log(" before setNetparams");
    console.log(config.params);
    that.setNetparams(config.params);
    console.log(" after setNetparams");
    console.log(config.params);
    if (that.data.requestMethod != undefined)
    config.netMethod = that.data.requestMethod;
    that.data.currentAction = action;
    config.callback.onPre = function(){

        console.log("onpre:"+action);
        if(action == request_firstIn  ){
            console.log(" pre showLoadingDialog:"+action);
            showLoadingDialog(that);
            console.log(" after showLoadingDialog:"+action);
        }
    };

    config.callback.onSuccess=function(data){
        that.data.currentAction = request_none;
        hideLoadingDialog(that);
        var currentDatas = that.getDetailFromNetData(data);//todo 如果是其中一个字段,需要取出.

        console.log(currentDatas);

        if (currentDatas == null|| currentDatas == undefined){
            console.log("before onEmpty:");
            config.onEmpty();
            console.log("after onEmpty:");
        }else {
            console.log("onsuccess");
            that.hasSuccessed = true;
            showContent(that);

            if(action == request_firstIn ){

            }else if (action == request_refresh){
                showSuccessToast(that,"数据刷新成功");

            }

            //数据的一些处理:
            that.handlerDetailInfoAndRefresUI(currentDatas,action);
        }



    };

    config.callback.onEmpty = function(){
        hideLoadingDialog(that);
        that.data.currentAction = request_none;
        console.log("Actions:"+action);
        if(action == request_firstIn){
            showEmptyPage(that);
        }else if (action == request_loadmore){
            loadMoreNoData(that);
        }else if (action == request_refresh){
            if (that.hasSuccessed){
                showSuccessToast(that,"没有新内容");
            }else {
                showEmptyPage(that);
            }

        }
    };

    config.callback.onError= function(msgCanShow,code,hiddenMsg){
        that.data.currentAction = request_none;
        console.log(hiddenMsg+"--"+code);
        hideLoadingDialog(that);

        if(action == request_firstIn){
            showErrorPage(that,msgCanShow);
        }else if (action == request_loadmore){
           // loadMoreError(that);
        }else if (action == request_refresh){
            if (that.hasSuccessed){

            }else {
                showErrorPage(that,msgCanShow)
            }

        }


    };

    request(config)
}


function requestForComments(that,pageIndex,action){
    var config = new requestConfig();
    config.page = that;
    config.urlTail= that.data.urlTail;
    config.params.pageIndex = pageIndex;
    that.setNetparams(config.params);
    that.data.currentAction = action;
    config.callback.onPre = function(){
        loadMoreStart(that);

    };

    config.callback.onSuccess=function(data){
        that.data.currentAction = request_none;
       // hideLoadingDialog(that);
        var currentDatas = that.getListFromNetData(data);//todo 如果是其中一个字段,需要取出.

        if (currentDatas.length==0){
            config.onEmpty();
            return;
        }

        //that.handleDataAndRefreshUI(data);
        //处理数据
        that.data.currentPageIndex = pageIndex;



        //数据的一些处理:
        currentDatas.forEach(function(info){
            that.handldItemInfo(info)
        });

        //根据操作的action不同而处理:
        if(action == request_firstIn){
            // that.data.infos.length =0;
        }else if (action == request_loadmore){

        }else if (action == request_refresh){
            that.data.infos.length =0;
        }

        that.data.infos=that.data.infos.concat(currentDatas);
        that.setData({infos:that.data.infos});


    };

    config.callback.onEmpty = function(){
       // hideLoadingDialog(that);
        that.data.currentAction = request_none;
        if(action == request_firstIn){
            loadMoreNoData(that);
        }else if (action == request_loadmore){
            loadMoreNoData(that);
        }else if (action == request_refresh){
            that.data.infos.length =0;
            that.setData({infos:that.data.infos});
            loadMoreNoData(that);

        }
    };

    config.callback.onError= function(msgCanShow,code,hiddenMsg){
        that.data.currentAction = request_none;
        console.log(hiddenMsg+"--"+code);
        hideLoadingDialog(that);

        if(action == request_firstIn){
           // showErrorPage(that,msgCanShow);
            loadMoreError(that);
        }else if (action == request_loadmore){
            loadMoreError(that);
        }else if (action == request_refresh){

        }


    };

    request(config)
}

function btnBean(){
    this.size='default';
    this.type='primary';
    this.plain=false;
    this.disabled=false;
    this.loading=false;
    this.text='确定';
}

function setBtnLoading(that,msg){
    var btn = that.data.btn;
    btn.disabled = true;
    btn.loading = true;
    if (!isOptStrNull(msg)){
        btn.text = msg;
    }

    that.setData({
        btn:btn
    });
}

function setBtnSuccess(that,msg){
    var btn = that.data.btn;
    btn.disabled = false;
    btn.loading = false;
    this.type='primary';
    if (!isOptStrNull(msg)){
        btn.text = msg;
    }
    that.setData({
        btn:btn
    });
}

function setBtnError(that,msg){
    var btn = that.data.btn;
    btn.disabled = false;
    btn.loading = false;
    btn.type='warn';
    if(!isOptStrNull(msg)){
        btn.text = msg;
    }
    that.setData({
        btn:btn
    });
}

function netStateBean(){
        this.toastHidden=true,
        this.toastMsg='',

        this.loadingHidden=false,
        this.emptyMsg='暂时没有内容,去别处逛逛吧',
        this.emptyHidden = true,
        this.errorHidden=true,
         this.errorMsg='',

        this.loadmoreMsg='加载中...',
        this.loadmoreHidden=true,

         this.contentHidden = true,

       // this.contentHeight='600rpx',
        this.toastChange=function(e){
            dismissToast()

        }
       // this.contentHeight='100%',


}

/*
*        netStateBean: {
             toastHidden:true,
             toastMsg:'',

             loadingHidden:true,
             emptyHidden : true,

             errorMsg:'',
             errorHidden:true,


             loadmoreMsg:'加载中...',
             loadmoreHidden:true,

             contentHeight:'1200rpx'
         }
*
*
* */


//显示toast的方法
function showSuccessToast(that,msg){
   /* var bean = that.data.netStateBean;
    bean.toastMsg = msg;
    bean.toastHidden = false;
    that.setData({
        netStateBean: bean
    });*/

    wx.showToast({
        title: msg,
        icon: 'success',
        duration: 1500
    })
}

function showFailToast(that,msg){
  /*  var bean = that.data.netStateBean;
    bean.toastMsg = msg;
    bean.toastHidden = false;
    that.setData({
        netStateBean: bean
    });*/

    wx.showToast({
        title: msg,
        icon: 'success',
        duration: 1500
    })

}

function dismissToast(that){
   /* var bean = that.data.netStateBean;
    bean.toastHidden = true;
    that.setData({
        netStateBean: bean
    });*/

    wx.hideToast();

}

function stopPullRefresh(that){
    /* var bean = that.data.netStateBean;
     bean.toastHidden = true;
     that.setData({
     netStateBean: bean
     });*/

    wx.stopPullDownRefresh();

}

function hideKeyBoard(that){
    wx.stopPullDownRefresh();
}


//加载对话框的显示和隐藏
function showLoadingDialog(that){
    /*var bean = that.data.netStateBean;
    bean.loadingHidden = false;
    that.setData({
        netStateBean: bean
    });*/

    wx.showToast({
        title: "加载中",
        icon: 'loading',
        duration: 10000
    })

}
function  hideLoadingDialog(that){
    /*var bean = that.data.netStateBean;
    bean.loadingHidden = true;
    that.setData({
        netStateBean: bean
    });*/

    wx.hideToast();

}

//loadmore的状态与信息
function  loadMoreError(that){
    var bean = that.data.netStateBean;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg= '加载出错,请上拉重试';
    that.setData({
        netStateBean: bean
    });

}

function loadMoreStart(that){

    var bean = that.data.netStateBean;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg= '加载中...';
    that.setData({
        netStateBean: bean
    });

}

function loadMoreNoData(that){
    var bean = that.data.netStateBean;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg= '没有数据了';
    that.setData({
        netStateBean: bean
    });
}

//以下三个方法是用于页面状态管理
function showEmptyPage(that){
    hideLoadingDialog(that);
    var bean = that.data.netStateBean;
    bean.emptyHidden = false;
    bean.loadingHidden = true;
    var empty = that.data.emptyMsg;
    if (isOptStrNull(empty)){
        empty = "没有内容,去别的页面逛逛吧"
    }
    bean.emptyMsg= empty;
    bean.contentHidden=true;
    bean.errorHidden = true;
    that.setData({
        netStateBean: bean
    });
}

function showErrorPage(that,msg){
    hideLoadingDialog(that);
    var bean = that.data.netStateBean;
    bean.errorHidden = false;
    bean.errorMsg= msg;
    bean.loadingHidden = true;
    bean.contentHidden=true;
    that.setData({
        netStateBean: bean
    });

}
function showContent(that){
    hideLoadingDialog(that);
    var bean = that.data.netStateBean;
    bean.errorHidden = true;
    bean.emptyHidden = true;
    bean.contentHidden=false;
    bean.loadingHidden = true;
    that.setData({
        netStateBean: bean
    });
}

function  loadMoreError1(that){
    var bean = that.data.netStateBean1;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg= '加载出错,请上拉重试';
    that.setData({
        netStateBean1: bean
    });

}

function loadMoreStart1(that){

    var bean = that.data.netStateBean1;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg= '加载中...';
    that.setData({
        netStateBean1: bean
    });

}

function loadMoreNoData1(that){
    var bean = that.data.netStateBean1;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg= '没有数据了';
    that.setData({
        netStateBean1: bean
    });
}

//以下三个方法是用于页面状态管理
function showEmptyPage1(that){
    hideLoadingDialog(that);
    var bean = that.data.netStateBean1;
    bean.emptyHidden = false;
    bean.loadingHidden = true;
    var empty = that.data.emptyMsg;
    if (isOptStrNull(empty)){
        empty = "没有内容,去别的页面逛逛吧"
    }
    bean.emptyMsg= empty;
    bean.contentHidden=true;
    bean.errorHidden = true;
    that.setData({
        netStateBean1: bean
    });

}

function showErrorPage1(that,msg){
    hideLoadingDialog(that);
    var bean = that.data.netStateBean1;
    bean.errorHidden = false;
    bean.errorMsg= msg;
    bean.loadingHidden = true;
    bean.contentHidden=true;
    that.setData({
        netStateBean1: bean
    });

}
function showContent1(that){
    hideLoadingDialog(that);
    var bean = that.data.netStateBean1;
    bean.errorHidden = true;
    bean.emptyHidden = true;
    bean.contentHidden=false;
    bean.loadingHidden = true;
    that.setData({
        netStateBean1: bean
    });
}


/**
 * 调用微信的支付
 */
function pay(page,orderId,callback){

    //先让服务器生成需要的字段,然后
    var params = new Object();
    params.orderId = orderId;
    params.payway = 4;
    buildRequest(page,'order/preparePay/v1.json',params,{
        onPre: function(page){
            showLoadingDialog(page);
        },
        onSuccess:function (data){

            //调用微信支付
            wx.requestPayment({
                'timeStamp': data.timestamp,
                'nonceStr': data.noncestr,
                'package': data.package,
                'signType': 'MD5',
                'paySign': data.sign,
                'success':function(res){
                    console.log(res);
                    callback.onSuccess('success')
                    hideLoadingDialog(page)
                    showSuccessToast(page,"支付成功")
                },
                'fail':function(res){
                    console.log(res);
                    callback.onError("支付失败了",0,res.toString());
                    hideLoadingDialog(page)
                }
            })
        },
        onEmpty : function(){
            callback.onEmpty()
        },
        onError : function(msgCanShow,code,hiddenMsg){
            callback.onError(msgCanShow,code,hiddenMsg);
            showSuccessToast(page,msgCanShow)
        },
        onUnlogin: function(){
            this.onError("您还没有登录或登录已过期,请登录",code_unlogin,'')
        },
        onUnFound: function(){
            this.onError("您要的内容没有找到",code_unfound,'')
        }
    }).send();


}

/*public int type;
 public int id;
 public String transId;
 public int goodsId;
 public String goodsName;
 public String fee;
 public String userName;
 public int status;*/


function newPayInfo(type,id,transId,goodsId,goodsName,fee,userName,status){
    this.type = type;
    this.id = id;
    this.transId = transId;
    this,goodsId = goodsId;
    this.goodsName = goodsName;
    this.fee = fee;
    this.userName = userName;
    this.status = status
}


/**
 * 创建微课订单
 */
function createAudioOrder(that,audioId,discountCode,listener){
    var url = 'order/voice/create/v1.json';
    var params ={};
    params.voiceId= audioId;
    if(!isOptStrNull(discountCode)){
        params.promoCode = discountCode;
    }
    buildRequest(that,url,params,{
        onPre: function(){
            showLoadingDialog(that);
        },
        onEnd: function(){
            hideLoadingDialog(that);
        },
        onSuccess:function (data){
            listener.onSuccess(data);
        },
        onEmpty : function(){
            listener.onError("数据为空");
        },
        onError : function(msgCanShow,code,hiddenMsg){
            listener.onError(msgCanShow);
        },
        onUnlogin: function(){
            this.onError("您还没有登录或登录已过期,请登录",5,'')
        },
        onUnFound: function(){
            this.onError("您要的内容没有找到",2,'')
        }
    }).send();

}


/**
 * 创建专辑的订单
 */
function createAlbumOrder(){

}

function  thirdLogin(openId,name){
    /*   map.put("type",type);
     map.put("openId",openId);
     map.put("name",name);
     String imei = SPApi.Accout.getIEMI();
     if (TextUtils.isEmpty(imei)){
     imei = UUID.randomUUID()+"";
     SPApi.Accout.setIEMI(imei);
     }
     map.put("imei",imei);
     map.put("platform","Android");*/

    var url = "http://test.qxinli.com/api.php?s=/user/thirdLogin";
    var params = new Object();
    params.openId = openId;
    params.name = name;
    params.type="weixin";
    params.platform = "Android";
    buildRequest(new Object(),url,params,{
        onPre: function(page){},
        onSuccess:function (data){
            console.log(data);
            getApp().globalData.session_id = data.session_id;
            getApp().globalData.uid = data.uid;
            getApp().globalData.isLogin = true;
        },
        onEmpty : function(){},
        onError : function(msgCanShow,code,hiddenMsg){},
        onUnlogin: function(){
            this.onError("您还没有登录或登录已过期,请登录",code_unlogin,'')
        },
        onUnFound: function(){
            this.onError("您要的内容没有找到",code_unfound,'')
        }
    }).setApiOld().send();
}

function loginTest(username,password){
    var url = encodeURI("http://test.qxinli.com/api.php?s=/user/login");
    var params = new Object();
    params.username = username;
    params.password = password;
    params.platform = "Android";
    buildRequest(new Object(),url,params,{
        onPre: function(page){},
        onSuccess:function (data){
            getApp().globalData.session_id = data.session_id;
            getApp().globalData.uid = data.uid;
            getApp().globalData.isLogin = true;
        },
        onEmpty : function(){},
        onError : function(msgCanShow,code,hiddenMsg){},
        onUnlogin: function(){
            this.onError("您还没有登录或登录已过期,请登录",code_unlogin,'')
        },
        onUnFound: function(){
            this.onError("您要的内容没有找到",code_unfound,'')
        }
    }).setApiOld().send();
}



/*

 {
    onItemClick:function (index,item){

    }

 }
* */

/**
 *
 * @param that
 * @param itemList
 * @param itemColor
 * @param listener
 */
function  showActionSheet(that,itemList,itemColor,listener){
    wx.showActionSheet({
        itemList: itemList,
        itemColor:itemColor,
        success: function(res) {
            if (!res.cancel) {
                var index = res.tapIndex;
                console.log(res.tapIndex)
                listener.onItemClick(index,itemList[index]);
            }else {//取消按钮

            }
        }
    })
}


/*{
    onConfirm:function (){

    }
}*/
function showAlertDialog(title,msg,showCancle,confirmText,confirmColor,listener){
    if(isOptStrNull(confirmColor)){
        confirmColor='#3CC51F';
    }
    wx.showModal({
        title: title,
        content:msg,
        success: function(res) {
            if (res.confirm) {
                console.log('用户点击确定')
                listener.onConfirm();
            }
        },
        showCancel:showCancle,
        confirmText:confirmText,
        confirmColor:confirmColor
    })
}



module.exports = {
    request:request,
    requestConfig:requestConfig,
    requestSimpleList:requestSimpleList,
   // viewBeansForSimpleList:viewBeansForSimpleList
    requestForDetail:requestForDetail,
    requestForComments:requestForComments,
    netStateBean:netStateBean,

    buildRequest:buildRequest,
    action:Actions,
    sendRequestByAction:sendRequestByAction,


    showContent:showContent,
    showErrorPage:showErrorPage,
    showEmptyPage:showEmptyPage,
    loadMoreNoData:loadMoreNoData,
    loadMoreStart:loadMoreStart,
    loadMoreError:loadMoreError,
    hideLoadingDialog:hideLoadingDialog,
    showLoadingDialog:showLoadingDialog,
    showSuccessToast:showSuccessToast,
    dismissToast:dismissToast,
    showFailToast:showFailToast,

    pay:pay,
    newPayInfo:newPayInfo,
    thirdLogin:thirdLogin,
    loginTest:loginTest,
    createAudioOrder:createAudioOrder,
    btnBean:btnBean,
    setBtnLoading:setBtnLoading,
    setBtnSuccess:setBtnSuccess,
    setBtnError:setBtnError,
    showActionSheet:showActionSheet,
    showAlertDialog:showAlertDialog,
    stopPullRefresh:stopPullRefresh,
    hideKeyBoard:hideKeyBoard,

    loadMoreError1:loadMoreError1,
    loadMoreStart1:loadMoreStart1,
    loadMoreNoData1:loadMoreNoData1,
    showEmptyPage1:showEmptyPage1,
    showErrorPage1:showErrorPage1,
    showContent1:showContent1















}