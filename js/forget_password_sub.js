jQuery.support.cors = true;
var reg = /^1[34578]\d{9}$/;
var regp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
var isMobile = false;
var isCode = false;
var isPwd = false;
var mobile = getArgumentsByName("mobile");
var pictureCode = getArgumentsByName("pictureCode");
var key = getArgumentsByName("key");
//var inputCode = $("#inputCode").val();
$(function() {

	sendMessage();

});

/*获取验证码倒计时*/
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数

function sendMessage() {
	curCount = count;
	//设置button效果，开始计时
	$("#btnSendCode").attr("disabled", "true");
	$("#btnSendCode").html("倒计时" + curCount + "S");
	InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
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
			if(result.state == "0") {

				getMsg("验证码已发送");
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
//修改密码
function updatePwd() {

	var msgCode = $("#message_code").val();
	var pwd = $.trim($("#pwd_fg").val());

	if(msgCode == null || msgCode == "") {
		getMsg("短信验证码不能为空");
		return false;
	} else {

		$.ajax({
			url: ctxpath + "/sm/verifySmsCode",
			type: "post",
			dataType: "json",
			data: {
				mobilePhone: mobile,
				smsCode: msgCode,
				from: '1'
			},
			success: function(result) {

				if(result.state == "0") {

					//密码校验
					if(pwd == null || pwd == "") {

						getMsg("新密码不能为空");
						return false;
					} else if(checkLoginPassword(pwd) == "false") {
						getMsg("请输入6-16位包含数字和字母的新密码");
						return false;
					}

					pwd = str_md5(pwd);
					pwd = $.base64.encode(pwd);
					//注册
					$.ajax({
						url: ctxpath + "/newForgetPassword",
						type: "post",
						dataType: "json",
						data: {
							name: mobile,
							pwd: pwd,
							from: '2'
						},
						success: function(result) {
							if(result.state == "0") {
								$(".wrong_msg").show(result.message);
								setTimeout(function() {
									mask_login();
								}, 500);

							}
						}
					});
				} else {
					getMsg("请输入正确的短信验证码");
					return false;
				}
			}

		});
	}

}

$("#hidePwd_fg").click(function() {
	$(this).toggleClass("cur");
	pwdShow_fg();
});

function pwdShow_fg() {
	var type = $("#pwd_fg").attr("type");
	if(type == "password") {
		$("#pwd_fg").attr("type", "text");
	} else {
		$("#pwd_fg").attr("type", "password");
	}
}
//错误提示
function getMsg(str) {

	$(".mask_investNo_tip").show().html(str);
	setTimeout(function() {
		$(".mask_investNo_tip").hide();
	}, 2000);
}
/*输入框清除内容*/
$(".input_wrap input").keyup(function() {
	var val = $(this).val();
	var phone = $("#message_code").val();
	var pwd = $("#pwd_fg").val();
	if(val != "") {
		$(this).siblings("em").show();
	}
	if(phone !== "" && pwd !== "") {
		$(".regist_btn_input a").addClass("active");
	} else {
		$(".regist_btn_input a").removeClass("active");

	}
});
$(".input_wrap em").click(function() {
	$(this).siblings("input").val("");
	$(this).hide();
	$(".regist_btn_input a").removeClass("active");
});
//密码验证
function checkLoginPassword(str) {
	var regp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
	if(regp.test(str)) {
		if(str.length > 5 && str.length < 17) {
			return "true";
		} else {
			return "false";
		}
	} else {
		return "false";
	}
}

function checkJyPassword(str) {
	var reg = new RegExp(/^\d{6}$/);
	if(reg.test(str)) {
		return "true";
	} else {
		return "false";
	}
}

function checkMailStr(str) {
	var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(reg.test(str)) {
		return "true";
	} else {
		return "false";
	}
}