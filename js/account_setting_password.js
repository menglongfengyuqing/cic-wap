var isOldMobile = false;
var isNewMobile = false;
var phoneNm;
$(function() {

	$.ajax({
		url: ctxpath + "/user/getUserInfo",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			token: token
		},
		success: function(result) {
			if(result.state == '0') {
				phoneNm = result.data.name;
			} else {
				mask_login();
				$.cookie('token', null);
			}

		}

	});
});

function updateUserLoginPwd() {
	var old_pwd = $("#old_pwd").val();
	var pwd_md = $("#pwd_md").val();
	if(old_pwd == null || $.trim(old_pwd) == "") {

		$(".mask_investNo_tip").show().html("请输入原密码");
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		return false;
	} else {
		old_pwd = str_md5(old_pwd);
		old_pwd = $.base64.encode(old_pwd);
		$.ajax({
			url: ctxpath + "/user/newCheckOldPwd",
			type: 'post',
			dataType: 'json',
			data: {
				from: '2',
				token: token,
				pwd: old_pwd
			},
			success: function(json) {
				console.log(json);
				if(json.state == "0") {

					$("#old_pwd").attr("readonly", "readonly");

					isOldMobile = true;

				} else {

					$(".mask_investNo_tip").show().html("原密码错误");
					setTimeout(function() {
						$(".mask_investNo_tip").hide();
					}, 2000);
					isOldMobile = false;
					return false;
				}
			}
		});
	}
	if(pwd_md == null || $.trim(pwd_md) == "") {
		$(".mask_investNo_tip").show().html("请输入新密码");
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		return false;
	} else if(checkLoginPassword(pwd_md) == false) {

		$(".mask_investNo_tip").show().html("请输入6-16位包含数字和字母的密码");
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		return false;
	} else {
		pwd_md = str_md5(pwd_md);
		pwd_md = $.base64.encode(pwd_md);
	}
	var newCode = $("#newCode").val();
	if(newCode == null || $.trim(newCode) == "") {
		$(".mask_investNo_tip").show().html("请输入短信验证码");
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		return false;
	} else {
		$.ajax({
			url: ctxpath + "/sm/verifySmsCode",
			type: "post",
			dataType: "json",
			data: {
				mobilePhone: phoneNm,
				smsCode: newCode,
				from: '2',
				token: token
			},
			success: function(result) {
				if(result.state == 0) {
					$.ajax({
						url: ctxpath + "/user/newUpdateUserPwd",
						type: "post",
						dataType: "json",
						data: {
							from: '2',
							token: token,
							pwd: pwd_md
						},
						success: function(result) {
							if(result.state == "0") {
								$(".mask_investNo_tip").show().html("修改登录密码成功");
								setTimeout(function() {
									logout();
									$(".mask_investNo_tip").hide();
								}, 2000);

							} else {
								$(".mask_investNo_tip").show().html("失败，请重试！");
								setTimeout(function() {
									$(".mask_investNo_tip").hide();
								}, 2000);
								return false;

							}
						}
					});

				} else if(result.state == 4) {
					$.cookie('token', null);
				} else {

					$(".mask_investNo_tip").show().html(result.message);
					setTimeout(function() {
						$(".mask_investNo_tip").hide();
					}, 2000);
				}
			}
		});
	}

}

$(".setting_close").click(function() {
	mask_login();
	$(".login_close").click(function() {

		window.location.href = "index.html";

	});
});

/**
 * 发送短信验证码
 * 
 */
/*获取验证码倒计时*/
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数
function sendMessage() {

	curCount = count;

	$.ajax({
		url: ctxpath + "/sm/sendSmsCode",
		type: "post",
		dataType: "json",
		data: {
			mobilePhone: phoneNm,
			type: 8,
			from: '2',
			token: token
		},
		success: function(result) {
			if(result.state == 0) {

				$(".mask_investNo_tip").show().html("验证码已发送!");
				setTimeout(function() {
					$(".mask_investNo_tip").hide();
				}, 2000);
				//设置button不可点击，开始倒计时
				$("#sendMessage").attr("onclick", "");
				$("#sendMessage").html("倒计时" + curCount + "S");
				InterValObj = window.setInterval(function SetRemainTime() {
					if(curCount == 0) {
						window.clearInterval(InterValObj); //停止计时器
						$("#sendMessage").attr("onclick", "javascript:sendMessage();");
						$("#sendMessage").removeClass("default").html("重新发送");
					} else {
						curCount--;
						$("#sendMessage").addClass("default").html("倒计时" + curCount + "S");

					}
				}, 1000); //启动计时器，1秒执行一次
			} else if(result.state == 2) {
				$(".mask_investNo_tip").show().html("发送失败!");
				setTimeout(function() {
					$(".mask_investNo_tip").hide();
				}, 2000);
			}
		}
	});

}
$(".setting_close").click(function() {
	logout();
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