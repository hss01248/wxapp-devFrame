function formatTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatAudioLength(audioLength){
  var hour=parseInt(audioLength/(60*60));
  var remainTime=audioLength-hour*60*60;

  var minute=parseInt(remainTime/60);
  remainTime=remainTime-minute*60;
  if(hour>0){
    return [hour,minute,remainTime].map(formatNumber).join(":");
  }else {
    return [minute,remainTime].map(formatNumber).join(":");
  }
}

/**
 * 格式化剩余时间
 * params remaindTime 毫秒
 */
function formatRemaindTime(remaindTime){
  var day=parseInt(remaindTime/(1000*60*60*24));
  remaindTime=remaindTime-day*1000*60*60*24;
  var hour=parseInt(remaindTime/(1000*60*60));
  remaindTime=remaindTime-hour*1000*60*60;
  var minute=parseInt(remaindTime/(1000*60));
  remaindTime=remaindTime-minute*1000*60;

  if(day!=0){
    return day+"天"+hour+"小时"+minute+"分"+remaindTime+"秒";
  }
  if(hour>0){
    return hour+"小时"+minute+"分"+remaindTime+"秒";
  }
  if(minute>0){
    return minute+"分"+remaindTime+"秒";
  }
  return remaindTime+"秒";
}

/**
 * 把一个一维数组转换成二维数组
 * param arrayData 一维数组
 * param sliceLength 每个小数组的长度 
 */
function arrayToDoubleArray(arrayData,sliceLength){
  var newArr = new Array();

    if (arrayData == undefined){
        return newArr;
    }
  var subArr=null;
  for(var i =0;i<arrayData.length;i++){
    if((i%sliceLength==0) ||subArr==null){
      subArr = new Array();
      newArr.push(subArr);
    }
    subArr.push(arrayData[i]);
  }
  return newArr;
}


/**
 *
 * @param arr
 * @param num
 */
function to2DimensionArr(arr,num){
    var newArr = new Array();//二维数组

    if (arr == undefined){
        return newArr;
    }
    var subArr=null;
    for(var i =0;i<arr.length;i++){
        var item = arr[i];
        if((i%num==0) ||subArr==null){
            subArr = new Array();//内部的一维数组
            newArr.push(subArr);
        }
        subArr.push(item);
    }
    return newArr;


}











function log(msg){
    var isDebug = getApp().globalData.isDebug;
    if (isDebug){
        console.log(msg);
    }
}

function isStrEmpty(str){
    if(str == null || str == '' || str == 'null'|| str == undefined ){
        return true
    }else{
        return false;
    }
}

function objToStr(obj,appendixStr){
    var str = "" ;
    for ( var p in obj ){ // 方法
      if ( typeof ( obj [ p ]) == "function" ){ 
       // obj [ p ]() ; //调用方法

      } else { // p 为属性名称，obj[p]为对应属性的值
        str += p + "=" + obj [ p ] + appendixStr ;
      }
    } 
    return str;
}

function getQiniuOriginalUrl(url){
    if (url.indexOf("http://") == -1){
        url = getApp().globalData.qiNiuHeadUrl +url;
    }

    var index1 = url.indexOf("?");
    if (index1 >0){
        url = url.substring(0,index1);
    }

    return url;

}

function getQiniuSmallPic(url,width,height){

   var  oUrl = getQiniuOriginalUrl(url);

    if (width ==0 || height ==0){
        return oUrl+"?imageMogr2/format/jpg";
    }else {
        return oUrl+"?imageMogr2/thumbnail/!"+width+"x"+height+"r/gravity/Center/crop/"+width+"x"+height;
    }

}

function getBlurPic(url){
    var  oUrl = getQiniuOriginalUrl(url);
    return oUrl+"?imageMogr2/thumbnail/!400x600r/blur/50x99";
}

function getAudioCoverReal(url){
    if(isStrEmpty(url)){
        return "http://static.qxinli.com/HeadPicture/255_2016-02-16_09-52-02_180_180.jpg";
    }

   return getQiniuSmallPic(url,80,80);
}

function refreshUI(that){
    that.setData(that.data);

}










module.exports = {
  formatTime: formatTime,
  formatRemaindTime:formatRemaindTime,
  formatAudioLength:formatAudioLength,
  arrayToDoubleArray:arrayToDoubleArray,
    getQiniuSmallPic:getQiniuSmallPic,
    getBlurPic:getBlurPic,
    isStrEmpty:isStrEmpty,
    refreshUI:refreshUI,
    objToStr:objToStr,
    getAudioCoverReal:getAudioCoverReal,
    to2DimensionArr:to2DimensionArr




}
