var isMobile = false;
var　 isMobileUsed = '0';
var isMobileFormat = '0';
var currentMobile;
var reg = /^1[123456789]\d{9}$/;
$(".setting_submite").click(function() {
	updateUserPhone();

});

$(".setting_close").click(function() {
	$(".setting_success").hide();

});
$(function() {
	if(token == null && token.trim().length == "") {
		mask_login();
	}
});

/*获取验证码倒计时*/
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数

$("#newMobile").keyup(function() {
	$("#currentMobile").val($(this).val());
});

/**
 * 发送短信验证码
 * 
 */
function sendMessage() {
	var newMobile = $("#newMobile").val();
	curCount = count;

	var newMobile = $("#newMobile").val();
	var newCode = $("#newCode").val();
	if(newMobile == "") {
		$(".mask_investNo_tip").show().html("请输入新手机号");
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		return;
	}
	if(checkMobile(newMobile) == "false") {

		$(".mask_investNo_tip").show().html("手机号格式错误");
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		return;
	} else {
		$.ajax({
			url: ctxpath + "/verify/checkMobilePhoneIsRegistered",
			type: "post",
			dataType: "json",
			data: {
				mobilePhone: newMobile,
				from: '2'
			},
			success: function(result) {

				if(result.state == 0) {
					isMobile = false;
					$(".mask_investNo_tip").show().html("该手机号已注册");
					setTimeout(function() {
						$(".mask_investNo_tip").hide();
					}, 2000);

					window.clearInterval(InterValObj); //停止计时器
					$("#sendMessage").attr("onclick", "javascript:sendMessage();");
					$("#sendMessage").removeClass("default").html("重新发送");
				} else if(result.state == 5) {

					$.ajax({
						url: ctxpath + "/sm/sendSmsCode",
						type: "post",
						dataType: "json",
						data: {
							mobilePhone: newMobile,
							type:8,
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
				} else {
					console.log(result.message);
				}
			}

		});
	}
}

function bindPhone() {
	var newMobile = $("#newMobile").val();
	var newCode = $("#newCode").val();
	if(newMobile == "") {
		$(".mask_investNo_tip").show().html("请输入新手机号");
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		return;
	}
	if(checkMobile(newMobile) == "false") {

		$(".mask_investNo_tip").show().html("手机号格式错误");
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		return;
	}
	if(newCode == "") {
		$(".mask_investNo_tip").show().html("请输入验证码");
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		return;
	} else {
		$.ajax({
			url: ctxpath + "/sm/verifySmsCode",
			type: "post",
			dataType: "json",
			data: {
				mobilePhone: newMobile,
				smsCode: newCode,
				from: '2',
				token: token
			},
			success: function(result) {
				if(result.state == 0) {
					updateUserPhone();

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

/**
 * 修改用户手机号
 */
function updateUserPhone() {
	var newphone = document.getElementById("newMobile").value;
	$.ajax({
		url: ctxpath + "/user/updateUserPhone",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			token: token,
			newphone: newphone
		},
		success: function(result) {
			if(result.state == 0) {
				
				$(".mask_backdrop,.setting_success").show();
				setTimeout(function() {
					logout();
				}, 2000);
				
			} else if(result.state == 4) {
				mask_login();
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
$(".setting_close").click(function(){
	logout();	
});

//手机号验证
function checkMobile(str) {
	var re = /^1\d{10}$/;
	if(re.test(str)) {

		return "true";

	} else {
		return "false";
	}
}