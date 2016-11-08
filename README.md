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
		//netUtil
		showContent(that)
        showErrorPage(that,msg)
        showEmptyPage(that)
```



# 下拉刷新和上拉加载更多的ui和api



# 纯listview和gridview页面的高度封装



![index](index.jpg)



 ![gridview](gridview.jpg) 



![lv](lv.jpg)



# blog

[程序基本开发框架的搭建](http://www.jianshu.com/p/d7e574e78bea )