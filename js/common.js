jQuery.support.cors = true;

var ctxpath = 'https://www.cicmorgan.com/svc/services'; //正式服务器
//var ctxpath = 'http://192.168.1.11:8082/svc/services';
//var ctxpath = 'http://192.168.1.93:8082/svc/services'; //chj测试服务器
//    var ctxpath = 'http://182.92.114.130:8082/svc/services';//测试服务器
//var cgbpath = 'http://sandbox.firstpay.com/hk-fsgw/gateway';
// var cgbpath = 'https://cgpt.unitedbank.cn/gateway';
var cgbpath = 'https://hk.lanmaoly.com/bha-neo-app/lanmaotech/gateway';
var server_path = "https://www.cicmorgan.com/";

var token = getArgumentsByName("token");
if(token == null || token == "null") {
	token = $.cookie('token');
} else {
	$.cookie("token", token);
}

/**
 * 描述: 根据参数名获取地址栏参数的值. <br>
 */
function getArgumentsByName(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null)
		return unescape(r[2]);
	return null;
}
var refer = getArgumentsByName("refer");
if(refer != '' && refer != null) {
	$.cookie('refer', refer);
}

var userid = getArgumentsByName("id");
if(userid != '' && refer != userid) {
	$.cookie('userid', userid);
}
$(document).ready(function() {

//	/*页面初始化登录弹框   lmask_login */
//	var login_wrap = ["<div class=\"mask_login\">",
//		" <h2 class=\"login_close\"></h2>",
//		" <h1 class=\"font_size64\">欢迎登录</h1>",
//		" <div class=\"login_input fixed_input\">",
//		"   <input type=\"number\" placeholder=\"手机号\" id=\"mobile\" class=\"font_size34\">",
//		"   <div class=\"pwd_wrap\">",
//		"     <input type=\"text\" placeholder=\"密码\" class=\"font_size34\" id=\"pwd\" onfocus=\"this.type='password'\" >",
//		"     <i  id=\"hidePwd\"></i>",
//		"   </div>",
//		"   <div class=\"wrong_msg font_size22\" style=\"display:none\" id=\"pwdCheck\"></div>",
//		" </div>",
//		" <div class=\"login_btn_wrap\">",
//		"   <span class=\"font_size32 login_btn\">同意协议并登录</span>",
//		"   <p><a href=\"forget_password.html\" class=\"font_size28\">忘记密码?</a></p>",
//		" </div>",
//		" <div class=\"login_other\">",
//		"   <a href=\"login_agreement.html\" class=\"font_size34\">用户协议</a>",
//		"   <a href=\"regist.html\" class=\"font_size34\">注册享好礼</a>",
//		" </div>",
//		" <div class=\"font_size26  tip_msg_p \">* 市场有风险，出借需谨慎</div>",
//		"</div>"
//	].join("");
//
//	$("body").append(login_wrap);
//
//	$(".login_close").click(function() {
//
//		mask_login_close();
//		window.location.href = "index.html";
//
//	});



});


//将当前时间转换成yyyymmddhhmmss格式
function timeStamp2String() {
	var datetime = new Date();
	//  datetime.setTime(time);  
	var year = datetime.getFullYear();
	var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
	var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
	var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
	var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
	return year.toString() + month.toString() + date.toString() + hour.toString() + minute.toString() + second.toString();
}

Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

//校验项目是否过期   true过期  false不过期
function checkDate(startTime, endTime) {
	var start = startTime;
	var end;
	//  var start=new Date(startTime.replace("-", "/").replace("-", "/"));  
	if(endTime.indexOf("-")!=-1){
		end = endTime.replace("-", "").replace("-", "").replace(":", "").replace(":", "").replace(" ", "");
		if(end.indexOf("/")!=-1){
			end = end.replace("/","").replace("/","");
		}
	}else if(endTime.indexOf("/")!=-1){
		end = endTime.replace("/", "").replace("/", "").replace(":", "").replace(":", "").replace(" ", "");
		if(end.indexOf("-")!=-1){
			end = end.replace("-","").replace("-","");
		}
	}
	if(end < start) {
		return true;
	}
	return false;
}

/**
 * 格式化金额
 * @param {Object} num
 */
function formatCurrency(num) {
	num = num.toString().trim();
	if(isNaN(num))
		num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if(cents < 10)
		cents = "0" + cents;
	for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + ',' +
		num.substring(num.length - (4 * i + 3));
	return(((sign) ? '' : '-') + num + '.' + cents);
}

/**
 * 下拉加载更多用来显示提示语句
 */
function getMsg() {
	$(".error_msg_wrap p").css("visibility", "hidden");
}

//退出登录
function logout() {
	$.cookie('token', null);
	mask_login();
}
//退出登录2
function log_out() {
	$.cookie('token', null);
}
/*登录js*/

function mask_login() {
 window.location.href="login.html";
}

function mask_login_close() {
window.history.go(-1);
}

function login_close_history() {
	window.history.go(-1);
}


/*验证是否登录  -----*/
$("#account_home").click(function() {
	login_in("account_home.html");
});

function login_in(url) {
	 if(token==""||token==null){
	   window.location.href="login.html";
	 }
	 else{
	 	window.location.href=url;
	 }
}

// var _hmt = _hmt || [];
// (function() {
// 	var hm = document.createElement("script");
// 	hm.src = "https://hm.baidu.com/hm.js?c2657abeeb82cdfb771a72b76314650b";
// 	var s = document.getElementsByTagName("script")[0];
// 	s.parentNode.insertBefore(hm, s);
// })();

var body_src = document.getElementsByTagName('body')[0];
var script = document.createElement('script');
var box = document.createElement("div");
script.type = 'text/javascript';
script.onload = script.onreadystatechange = function() {
	if(!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {

		// Handle memory leak in IE 
		script.onload = script.onreadystatechange = null;
	}
};
script.src = 'https://s4.cnzz.com/z_stat.php?id=1261944151&web_id=1261944151';
box.style.visibility = "hidden";
box.appendChild(script);
body_src.appendChild(box);

/**
 * 用window.open()方法跳转至新页面并且用post方式传参
 * 懒猫2.0 接口，form post 请求方法， 
 * url:  网关类接口的url 
 *  */ 
function openPostWindow(result){
	var tempForm = document.createElement("form");
    tempForm.id = "tempForm1";
    tempForm.method = "post";
    tempForm.action = cgbpath;  // 懒猫网关接口
	// tempForm.target="_blank"; //打开新页面
    // hideInput1
    var hideInput1 = document.createElement("input");
    hideInput1.type = "hidden";
    hideInput1.name="keySerial"; // 后台要接受这个参数来取值
    hideInput1.value = result.keySerial; // 后台实际取到的值
    tempForm.appendChild(hideInput1);
    // hideInput2
    var hideInput2 = document.createElement("input");
    hideInput2.type = "hidden";
    hideInput2.name="serviceName"; // 后台要接受这个参数来取值
    hideInput2.value = result.serviceName; // 后台实际取到的值
	tempForm.appendChild(hideInput2);
    // hideInput3
    var hideInput3 = document.createElement("input");
    hideInput3.type = "hidden";
    hideInput3.name="reqData"; // 后台要接受这个参数来取值
    hideInput3.value = result.reqData; // 后台实际取到的值
    tempForm.appendChild(hideInput3);
    // hideInput4
    var hideInput4 = document.createElement("input");
    hideInput4.type = "hidden";
    hideInput4.name="sign"; // 后台要接受这个参数来取值
    hideInput4.value = result.sign; // 后台实际取到的值
    tempForm.appendChild(hideInput4);
    // hideInput5
    var hideInput5 = document.createElement("input");
    hideInput5.type = "hidden";
    hideInput5.name="platformNo"; // 后台要接受这个参数来取值
    hideInput5.value = result.platformNo; // 后台实际取到的值
	tempForm.appendChild(hideInput5);
    if(document.all){
        tempForm.attachEvent("onsubmit",function(){});        //IE
    }else{
        var subObj = tempForm.addEventListener("submit",function(){},false);    //firefox
    }
	document.body.appendChild(tempForm);
    if(document.all){
        tempForm.fireEvent("onsubmit");
    }else{
        tempForm.dispatchEvent(new Event("submit"));
	}
    tempForm.submit();
    document.body.removeChild(tempForm);
}

// Global site tag (gtag.js) - Google Analytics 
script.async.src="https://www.googletagmanager.com/gtag/js?id=UA-149452431-1"
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-149452431-1');