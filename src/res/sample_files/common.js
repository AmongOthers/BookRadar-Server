// JScript 文件
window["MzBrowser"]={};(function()
{
if(MzBrowser.platform) return;
var ua = window.navigator.userAgent;
MzBrowser.platform = window.navigator.platform;

MzBrowser.firefox = ua.indexOf("Firefox")>0;
MzBrowser.opera = typeof(window.opera)=="object";
MzBrowser.ie = !MzBrowser.opera && ua.indexOf("MSIE")>0;
MzBrowser.mozilla = window.navigator.product == "Gecko";
MzBrowser.netscape= window.navigator.vendor=="Netscape";
MzBrowser.safari= ua.indexOf("Safari")>-1 && ua.indexOf("Chrome") < 1 ;
MzBrowser.chrome=ua.indexOf("Chrome")>-1;

if(MzBrowser.firefox) var re = /Firefox(\s|\/)(\d+(\.\d+)?)/;
else if(MzBrowser.ie) var re = /MSIE( )(\d+(\.\d+)?)/;
else if(MzBrowser.opera) var re = /Opera(\s|\/)(\d+(\.\d+)?)/;
else if(MzBrowser.netscape) var re = /Netscape(\s|\/)(\d+(\.\d+)?)/;
else if(MzBrowser.chrome) var re = /Chrome(\s|\/)(\d+(\.\d+)?)/;
else if(MzBrowser.safari) var re = /Version(\/)(\d+(\.\d+)?)/;
else if(MzBrowser.mozilla) var re = /rv(\:)(\d+(\.\d+)?)/;

if("undefined"!=typeof(re)&&re.test(ua))
MzBrowser.version = parseFloat(RegExp.$2);
})(); 

function ismsie()
{
    return MzBrowser.ie;
}

function isff()
{
    return MzBrowser.firefox;
    
}

function ischrome()
{
    return MzBrowser.chrome;
}

function getbrowserversion()
{
    return MzBrowser.version;
}

function isie()
{
    var agt = navigator.userAgent.toLowerCase();
    return (agt.indexOf("msie")!=-1 && document.all);
}
function isie6()
{
    var browser=navigator.appName 
    var b_version=navigator.appVersion 
    var version=b_version.split(";"); 
    var trim_Version=version[1].replace(/[ ]/g,""); 
    if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0") 
    { 
        return true;
    } 
    else
    {
        return false;
    }
}
function CPos(x, y)
{
    this.x = x;
    this.y = y;
}
//获取控件的位置
function GetObjPos(ATarget)
{
    var target = ATarget;
    var pos = new CPos(target.offsetLeft, target.offsetTop);
    var target = target.offsetParent;
    while (target)
    {
    pos.x += target.offsetLeft;
    pos.y += target.offsetTop;

    target = target.offsetParent
    }
/*firefox*/
// var box = document.getBoxObjectFor(target);
// pos.x = box.x;
// pos.y = box.y;
    return pos;
}
String.prototype.toHtmlEncode = function()
{
    var str = this; 
    str=str.replace("&","&amp;"); 
    str=str.replace("<","&lt;"); 
    str=str.replace(">","&gt;"); 
    str=str.replace("'","&apos;"); 
    str=str.replace("\"","&quot;"); 
    return str; 
}
String.prototype.toHtmlDecode = function()
{ 
    var str = this;
    str=str.replace("&amp;","&");  
    str=str.replace("&lt;","<"); 
    str=str.replace("&gt;",">"); 
    str=str.replace("&apos;","'"); 
    str=str.replace("&quot;","\""); 
    return str; 
} 
function attach(o,e,f){
   if (document.attachEvent)
     o.attachEvent("on"+e,f);
   else if (document.addEventListener)
     o.addEventListener(e,f,false);
}
function trim(s) {
        return s.replace( /^\s*/, "" ).replace( /\s*$/, "" );
}
function strlen(string){
      var str="";
      str=string;
      str=str.replace(/[^\x00-\xff]/g,"**"); 
      return str.length;
}

function getInnerText(obj)
{
    return (obj.textContent != null) ? (obj.textContent) : (obj.innerText);
}

function SetCwinHeight(fobj)
{
    var bobo=document.getElementById(fobj); //iframe id
    if (document.getElementById)
    {
       if (bobo && !window.opera)
       {
            if (bobo.contentDocument && bobo.contentDocument.body.offsetHeight)
            {
             bobo.height = bobo.contentDocument.body.offsetHeight;
            }
            else 
            if(bobo.Document && bobo.Document.body.scrollHeight)
            {
             bobo.height = bobo.Document.body.scrollHeight;
            }
       }
    }
}
/*透明div显示框，用于显示正在检索请稍候等*/
function DivAlert(messageDiv){
    this.messageDIV=messageDiv;
    //创建提示框底层 
    this.bottomDIV = document.createElement("div");
    //获取body中间点
    var x=(document.body.clientWidth > window.screen.width) ? window.screen.width/2 : document.body.clientWidth/2,y=(document.body.clientHeight > window.screen.height) ? window.screen.height/2 : document.body.clientHeight/2;
    //配置样式
    this.bottomDIV.style.cssText="background-color:#CCCCCC;height:" + document.body.clientHeight + "px;opacity:0.50;filter:Alpha(opacity=50);-moz-opacity:.50;width:100%;margin-top:0px;margin-left:0px;position:absolute;top:0px;left:0px;zIndex:100;";
    //遮盖select
    this.bottomDIV.innerHTML = "<iframe src=\"javascript:\" style=\"position:absolute; visibility:inherit; top:0px; left:0px; width:100%; height:" + document.body.clientHeight + "px; z-index:-1; filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';\"></iframe>";
    //禁用回车和tab键
    this.bottomDIV.innerHTML = this.bottomDIV.innerHTML + "<script>document.onkeydown=function(){return false;}</script><script event=\"onkeydown\" for=\"document\">return false;</script>";
    //<iframe src="javascript:false" style="position:absolute; visibility:inherit; top:0px; left:0px; width:100px; height:200px; z-index:-1; filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';"></iframe> 
//    this.bottomDIV.style.opacity="0.50";
//    this.bottomDIV.style.filter="Alpha(opacity=50);";
//    this.bottomDIV.style.backgroundColor="#CCCCCC";
//    this.bottomDIV.style.height=document.body.clientHeight + "px";
//    this.bottomDIV.style.width="100%";
//    this.bottomDIV.style.marginTop="0px";
//    this.bottomDIV.style.marginLeft="0px";
//    this.bottomDIV.style.position="absolute";
//    this.bottomDIV.style.top="0px";
//    this.bottomDIV.style.left="0px";
//    this.bottomDIV.style.zIndex=100;
    //显示提示框
    this.show = function(){
        //显示提示框底层 
        document.body.appendChild(this.bottomDIV);
        //显示messageDIV
        document.body.appendChild(this.messageDIV);
        //把messageDIV定位到body中间
        this.messageDIV.style.position="absolute";
        x=x-this.messageDIV.clientWidth/2;
        y=y-this.messageDIV.clientHeight/2;
        this.messageDIV.style.top=y+"px";
        this.messageDIV.style.left=x+"px";
        this.messageDIV.style.zIndex=101;
    }
    //移除提示框
    this.remove = function(){
        try
        {
            document.body.removeChild(this.messageDIV);
            document.body.removeChild(this.bottomDIV);
        }catch(e)
        {
            
        }
    }
}
/*创建正在检索，请稍候div*/
/*loadingTxt为显示信息*/
function createLoadingDiv(loadingTxt,loadingImgpath)
{
    var dc;
    //创建提示框内容部分    if (loadingImgpath == undefined)
        loadingImgpath = '';
    var d = document.createElement("div");
    d.style.cssText="border:1px solid #f87600;width:220px;height:100px;line-height:100px;background-color:#ffffff;padding:10px;text-align:center;vertical-align:middle";
//    d.style.border="1px solid #f87600"
//    d.style.width="220px";
//    d.style.height="100px";
//    d.style.lineHeight="100px";
//    d.style.backgroundColor="#ffffff";
//    d.style.padding="10px";
//    d.style.align="center";
//    d.style.verticalAlign="middle";
    //向提示框内容部分画需要显示的信息
    d.innerHTML='<div style=\"margin-top:0px!important;margin-top:50px;\"><img id=\"loadingimg\" src=\"'+ loadingImgpath + 'images/loading.gif\"/>&nbsp;<span style=\"color:#f87600;\">'+ loadingTxt + '</span><div>';
    //d.innerHTML='<span style="display: inline-block;background-image:url(images/loading.gif);width:20px;height:20px"></span>&nbsp;<span style=\"color:#f87600;\">'+ loadingTxt + '</span>';
    //实例化提示框
    dc = new DivAlert(d);
    //显示提示框
    dc.show();
    return dc;
}
/*透明div显示框等*/
function PopUp(messageDiv,ilframe,ilurl){
    this.messageDIV=messageDiv;
    //创建提示框底层 
    this.bottomDIV = document.createElement("div");
    //获取body中间点
    var x=(document.body.clientWidth > window.screen.width) ? window.screen.width/2 : document.body.clientWidth/2,y=(document.body.clientHeight > window.screen.height) ? window.screen.height/2 : document.body.clientHeight/2;
    //配置样式
    this.bottomDIV.style.cssText="background-color:#CCCCCC;height:" + document.body.clientHeight + "px;opacity:0.50;filter:Alpha(opacity=50);-moz-opacity:.50;width:100%;margin-top:0px;margin-left:0px;position:absolute;top:0px;left:0px;zIndex:100;";
    //遮盖select
    //this.bottomDIV.innerHTML = "<iframe src=\"javascript:false\" style=\"position:absolute; visibility:inherit; top:0px; left:0px; width:100%; height:" + document.body.clientHeight + "px; z-index:-1; filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';\"></iframe>";
    //禁用回车和tab键
    //this.bottomDIV.innerHTML = this.bottomDIV.innerHTML + "<script>document.onkeydown=function(){return false;}</script><script event=\"onkeydown\" for=\"document\">return false;</script>";
    //显示提示框
    this.show = function(){
        //显示提示框底层 
        document.body.appendChild(this.bottomDIV);
        //显示messageDIV
        document.body.appendChild(this.messageDIV);
        //把messageDIV定位到body中间
        this.messageDIV.style.position="absolute";
        x=x-this.messageDIV.clientWidth/2;
        y=y-this.messageDIV.clientHeight/2;
        this.messageDIV.style.top=y+"px";
        this.messageDIV.style.left=x+"px";
        this.messageDIV.style.zIndex=101;
        $(ilframe).src = ilurl;
    }
    //移除提示框
    this.remove = function(){
        try
        {
           document.body.removeChild(this.messageDIV);
           document.body.removeChild(this.bottomDIV);
            
        }catch(e)
        {
            
        }
    }
}
/*小小登录框*/
var pop;
var login_callback = null;
var login_callback_args = new Array();
function internallogin(loginCallBack,vpath)
{
    //创建提示框内容部分
    var d = document.createElement("div");
    d.style.cssText="border:1px solid #8fc4ee;width:350px;height:230px;background-color:#ffffff;";
    //向提示框内容部分画需要显示的信息
    d.innerHTML="<iframe id=\"internalloginframe\" frameborder=\"0\" src=\"javascript:\" style=\"width:350px;height:230px\" scrolling=\"no\"></iframe>";
    pop = new PopUp(d,"internalloginframe",vpath + "internal_login.aspx");
    pop.show();
    login_callback = loginCallBack;
	// 参数
	if(arguments.length>1){
		login_callback_args = Array.prototype.slice.call(arguments);
		if(login_callback_args.length>0){
			login_callback_args.shift(); // 去掉arguments[0] (loginCallBack)
		}
	}
}
/*取消登录*/
function cancelinternallogin()
{
    pop.remove();
}
/*登录回调*/
function internallogin_callback(){
    pop.remove();
	// 用户自定义回调函数
	if(login_callback && login_callback != null){
		if(typeof login_callback == 'function'){
			login_callback.apply(login_callback,login_callback_args);
		}
	}
}
/*退出*/
function internallogout(logoutCallBack,vpath)
{
    if(logoutCallBack==undefined || logoutCallBack==null){
			logoutCallBack=internallogout_callback;
	}
    var subdeptAjax = new Ajax.Request(
            vpath + 'internallogoutAjax.aspx',
            {
                method:'get',
                parameters:'',
                onComplete: logoutCallBack
            }
            );
}
/*退出回调*/
function internallogout_callback()
{
   location.reload();
}

function showMessage(tarobj,l,t,w,h,tmsg,cmsg)
{
    var d = document.createElement("div");
    d.style.cssText="border:1px solid #8fc4ee;width:" + w + "px;height:" + h + "px;background-color:#EBF5FB;";
    d.style.position = "absolute";
    d.style.top = t + "px";
    d.style.left = l + "px";
    d.style.zIndex = 10;
    /*创建内容及关闭按钮*/
    var dtop = document.createElement("div");
    dtop.style.cssText = "text-align:center;line-height:25px;margin-left:5px;margin-right:5px;overflow:hidden;height:12%;border-bottom:1px solid #ddd";
    dtop.innerHTML = tmsg;
    d.appendChild(dtop);
    var dcontent = document.createElement("div");
    dcontent.style.cssText = "text-align:left;line-height:20px;overflow:hidden;overflow-y:scroll;height:78%;";
    dcontent.innerHTML = cmsg;
    d.appendChild(dcontent);
    var dbottom = document.createElement("div");
    dbottom.style.cssText = "padding-right:10px;text-align:right;line-height:20px;overflow:hidden;height:10%;border-top:1px solid #ddd;background-color:#ddd";
    var dbottomlink = document.createElement("a");
    dbottomlink.innerHTML = "关闭";
    Event.observe(dbottomlink,"click",function(){$(tarobj).up(0).removeChild(d)});
    Event.observe(dbottomlink,"mouseover",function(){dbottomlink.style.cssText = dbottomlink.style.cssText + "cursor:pointer;"});
    dbottom.appendChild(dbottomlink);
    d.appendChild(dbottom);
    $(tarobj).up(0).appendChild(d);
}

/*获取图书的相关资源*/
function getbookresource(ctrlno,btitle,tarobj,aurl)
{
    var params = "ctrlno=" + ctrlno;
    var getbookresourceAjax = new Ajax.Request(
            aurl,
            {
                method:'get',
                parameters:params,
                onComplete: function(response)
                {
                    var result = response.responseText;
                    if (result == '1')
                    {
                        alert("此书没有相关资源！");
                    }
                    else
                    if (result == '4')
                    {
                        alert("获取相关资源失败！");
                    }
                    else
                    {
                        if (result.length > 1)
                        {
                            var rc = result.substr(0,1);
                            if (rc == '2')
                            {
                                var rurl = result.substr(2);
                                var newwin = window.open(rurl);
                                if (newwin == undefined) 
                                    alert('您阻止了本站点的弹出窗口，请设置成不阻止！');
                            }
                            else
                            if (rc == '3')
                            {
                                var result = result.substr(2);
                                var tarobj_left,tarobj_top;/*取得控件位置的left和top*/
                                var pos = GetObjPos(tarobj);
                                tarobj_left = pos.x;
                                tarobj_top = pos.y;
                                var t=tarobj_top;
                                var l=tarobj_left-330;
                                if (l < 0)
                                    l = tarobj_left;
                                if (t + 200 > document.body.clientHeight)
                                {
                                    t = t - 200;
                                }
                                showMessage(tarobj,l,t,350,200,"相关资源-" + btitle,result);
                            }
                            
                        }
                    }
                }
            }
            );
}

function fitResolution()
{
    if (window.screen.width < 1024)
        return false;
    else 
        return true;
}


function callInProgress(xmlhttp) {
  switch (xmlhttp.readyState) {
    case 1: case 2: case 3:
      return true;
      break;
    // Case 4 and 0
    default:
      return false;
      break;
    }
}
// Register global responders that will occur on all AJAX requests
Ajax.Responders.register({
  onCreate: function(request) {
    request['timeoutId'] = window.setTimeout(
     function() {
       // If we have hit the timeout and the AJAX request is active, abort it and let the user know
       if (callInProgress(request.transport)) {
       request.transport.abort();
       //showFailureMessage();
       // Run the onFailure method if we set one up when creating the AJAX object
         if (request.options['onFailure']) {
           request.options['onFailure'](request.transport, request.json);
         }
       }
     }, request.options.timeoutSeconds?request.options.timeoutSeconds*1000:30*1000
    );
  },
  onComplete: function(request) {
    // Clear the timeout, the request completed ok
    window.clearTimeout(request['timeoutId']);
  }
});

