# wxapp-devFrame
小程序基本的开发框架



# 提供的封装

## 网络访问的二次封装

 内部部分字段需要根据自己具体项目进行修改

    netUtil.buildRequest(page,urlTail,params,callback)//必须的参数和回调
    .setXxx(xxx)//额外的设置,链式调用
    ...
    .send();//最终发出请求的动作
## 页面状态管理

loading页面,空白页面,错误页面

```
		//wxml里引用模板:直接拷贝这段代码
		<!--状态管理模板-->
        <import src="../../template/pagestate.wxml"/>
        <view >
            <template is="pagestate" data="{{...netStateBean}}"/>
        </view>
		
		
		//js里,page的data中加字段:
		 netStateBean: new netUtil.netStateBean()
		
		
		//网络回调处控制显示:netUtil
		showLoadingDialog(that)
		showContent(that)
        showErrorPage(that,msg)
        showEmptyPage(that)
```



# 下拉刷新和上拉加载更多的ui和api



# 纯listview和gridview页面的高度封装

>只需要配置页面url,请求参数,返回的数据每个item字段的处理,wxml里写item的布局即可.无需关心页面状态,刷新和加载更多的ui和数据拼接.









![index](index.jpg)



 ![gridview](gridview.jpg) 



![lv](lv.jpg)



# blog

[程序基本开发框架的搭建](http://www.jianshu.com/p/d7e574e78bea )