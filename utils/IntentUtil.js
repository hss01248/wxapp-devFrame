/**
 * Created by Administrator on 2016/10/19 0019.
 */

function toPay(type,id,transId,goodsId,goodsName,fee,userName,status){

     return  'type='+type+'&id='+id+'&transId='+transId+'&goodsId='+goodsId+'&goodsName='+goodsName+'&fee='+fee+'&userName='+userName+'&status='+status;



}

function toAudioDetail(id){

        var url = '../lession/detail?id='+id;
        // url: '../expert/experts'
    jumpTo(url);
}

function toOrderDetail(id){

        var url =  '../order/detail?id='+id;
        // url: '../expert/experts'
        jumpTo(url);
}

function jumpTo(path){
    wx.navigateTo( {
        url: path
        // url: '../expert/experts'
       /* fail:function(){
            wx.redirectTo({
                url: url
            })
        }*/
    })
}


module.exports = {
    toPay:toPay,
    toAudioDetail:toAudioDetail,
    toOrderDetail:toOrderDetail,
    navigateTo:jumpTo
}