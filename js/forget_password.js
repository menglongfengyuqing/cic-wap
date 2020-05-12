jQuery.support.cors = true;
var reg = /^1[34578]\d{9}$/;
var regp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
var isMobile = false;
var isCode = false;
var isPwd = false;
$(function() {
	getPictureCode();

});

function nextCheck() {

	var mobile = $("#mobile").val();
	//手机号校验
	if(mobile == null || mobile == "") {
		getMsg("请输入手机号");
		return false;
	}
	if(checkMobile(mobile) == "false") {

		getMsg("请输入正确的手机号");
		return false;
	} else {
		$.ajax({
			url: ctxpath + "/verify/checkMobilePhoneIsRegistered",
			type: "post",
			dataType: "json",
			data: {
				mobilePhone: mobile,
				from: '2'
			},
			success: function(result) {
				if(result.state == "0") {
					//已注册
					console.log(result.message);

					var code = $("#code").val();
					var key = $("#codeKey").val();
					var pictureCode = $("#pictureCode").val();
					if(code == null || code == "") {
						getMsg("验证码不能为空");
						return false;
					} else {
						$.ajax({
							url: ctxpath + "/sm/checkPictureCode",
							type: "post",
							dataType: "json",
							data: {
								from: '2',
								key: key,
								pictureCode: code
							},
							success: function(result) {
								//console.log(result.data);
								if(result.state == "0") {
									//				sendMessage(mobile, pictureCode, key);
									window.location.href = "forget_password_sub.html?mobile=" + mobile + "&key=" + key + "&pictureCode=" + pictureCode;
								} else {
									getMsg("请输入正确的验证码");
									//				getMsg(result.message);
								}
							}
						});
					}

				} else if(result.state == "5") {

					getMsg("用户名输入错误");
					console.log(result.message);
					return false;
				} else {
					console.log(result.message);
				}
			}
		});
	}

}

/**
 * 获取图形验证码
 */
function getPictureCode() {
	var mobile = $("#mobile").val();

	$.ajax({
		url: ctxpath + "/sm/getPictureCode",
		type: "post",
		dataType: "json",
		data: {
			from: '2'
		},
		success: function(result) {
			if(result.state == "0") {
				$("#pictureCode").html(result.pictureCode);
				$("#pictureCode").val(result.pictureCode);
				$("#codeKey").val(result.key);
			}
		}
	});
}

//手机号验证
function checkMobile(str) {
	var re = /^1\d{10}$/;
	if(re.test(str)) {

		return "true";

	} else {
		return "false";
	}
} //错误提示
function getMsg(str) {

	$(".mask_investNo_tip").show().html(str);
	setTimeout(function() {
		$(".mask_investNo_tip").hide();
	}, 2000);
} /*输入框清除内容*/
$(".input_wrap input").keyup(function() {
	var val = $(this).val();
	var phone = $("#mobile").val();
	var pwd = $("#code").val();
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

//注册第二步
/*获取验证码倒计时*/
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数

function sendMessage(mobile, pictureCode, key) {
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
			}
		}
	});

}