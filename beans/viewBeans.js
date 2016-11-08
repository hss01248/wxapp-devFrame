/**
 * 
 * btn:
 * size	String	default	有效值 default, mini
type	String	default	按钮的样式类型，有效值 primary, default, warn
plain	Boolean	false	按钮是否镂空，背景色透明
disabled	Boolean	false	是否禁用
loading	Boolean	false	名称前是否带 loading 图标
form-type	String	无	有效值：submit, reset，用于 <form/> 组件，点击分别会触发 submit/reset 事件
hover-class	String	button-hover	指定按钮按下去的样式类。当 hover-class="none" 时，没有点击态效果
 */
function btn(){
    this.size = 'default',
    this.type = 'default',
    this.plain = false,
    this.loading = false,
     this.formType = ''
}


/**img
 * 属性名	类型	默认值	说明
src	String		图片资源地址
mode	String	'scaleToFill'	图片裁剪、缩放的模式
binderror	HandleEvent		当错误发生时，发布到 AppService 的事件名，事件对象event.detail = {errMsg: 'something wrong'}
bindload	HandleEvent		当图片载入完毕时，发布到 AppService 的事件名，事件对象event.detail = {} */
function img(){
      this.src = '',
       this.mode = 'aspectFill'//相当于centerCrop
}

module.exports = {
  img: img,
  btn:btn
}

