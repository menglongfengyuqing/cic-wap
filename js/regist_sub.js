jQuery.support.cors = true;
var isMobile = false;
var isMobile1 = false;
var isPwd = false;
var isCode = false;
var reg = /^1[123456789]\d{9}$/;
var regp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
var _tmp_mobile = getArgumentsByName("mobile");
var mobile = _tmp_mobile.split("-").reverse().join('')
var pwd = getArgumentsByName("pwd");
var pictureCode = getArgumentsByName("pictureCode");
var key = getArgumentsByName("key");
var recommendMobilePhone = getArgumentsByName("recommendMobilePhone");
var userNo = getArgumentsByName("userNo");
var refer = $.cookie("refer");
//注册第一步
$(function() {
	sendMessage();
});

//注册第二步
/*获取验证码倒计时*/
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数

function interval() {
	curCount = count;
	// 设置button效果，开始计时
	$("#btnSendCode").attr("disabled", "true");
	$("#btnSendCode").html("倒计时" + curCount + "S");
	InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
}

function sendMessage() {
	//向后台发送处理数据
	$.ajax({
		url: ctxpath + "/sm/newSendSmsCode",
		type: "post",
		dataType: "json",
		data: {
			mobilePhone: mobile,
			type: '1',
			from: '2',
			key: key,
			picturCode: pictureCode
		},
		success: function(result) {
			//console.log(result.data);
			if(result.state == "0") {
				console.log(result.data);
				interval();
			}
		}
	});
}

//timer处理函数
function SetRemainTime() {
	if(curCount == 0) {
		window.clearInterval(InterValObj); //停止计时器
		$("#btnSendCode").removeAttr("disabled"); //启用按钮
		$("#btnSendCode").html("重新获取");
	} else {
		curCount--;
		$("#btnSendCode , #btnSendCode02 ,#btnSendCode03").html("倒计时" + curCount + "S");
	}
}

function regist_my() {
	if(refer == null || refer == "") {
		refer = getArgumentsByName("refer");
	}
	//校验短信验证码
	var code = $("#code").val();
	$.ajax({
		url: ctxpath + "/sm/verifySmsCode",
		type: "post",
		dataType: "json",
		data: {
			mobilePhone: mobile,
			smsCode: code,
			from: '1'
		},
		success: function(result) {

			if(result.state == "0") {

				//注册
				$.ajax({
					url: ctxpath + "/wapRegist",
					type: "post",
					dataType: "json",
					data: {
						name: mobile
						// pwd: pwd,
						// recommendMobilePhone: recommendMobilePhone,
						// userNo: userNo,
						// refer: refer,
						// from: '2'
					},
					success: function(result) {
						if(result.state == "0") {
							$.cookie('token', result.token);
							window.location.href = "index.html";
						}
						if(result.state != "0") {

							getMsg(result.message);
						}
					}
				});
			} else {
				getMsg("请输入正确的短信验证码");
			}
		}
	});
	//	});

	//错误提示
	function getMsg(str) {

		$(".mask_investNo_tip").show().html(str);
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
	}
}
$(".send_code input").keyup(function() {
	var val = $(this).val();
	if(val == "") {
		$(".regist_btn_input a").removeClass("active");
	} else {
		$(this).siblings("em").show();
		$(".regist_btn_input a").addClass("active");
	}
});

$(".input_wrap em").click(function() {
	$(this).siblings("input").val("");
	$(this).hide();
	$(".regist_btn_input a").removeClass("active");

});