jQuery.support.cors = true;
$(function() {
	$(".all_page").addClass("active");
});

function login() {
	var mobile = $("#mobile").val();
	var pwd = $("#pwd").val();
	if(mobile == "" || mobile == null) {
		getMsg("手机号不能为空");
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

				if(result.state == "5") {//未注册
					getMsg("用户名或密码错误");
					return false;
				} else if(result.state == "0") {
					if(pwd == null || pwd == "") {
						getMsg("密码不能为空");
						return false;
					}
					if(checkLoginPassword(pwd) == "false") {
						getMsg("请输入6-16位包含数字和字母的密码");
						return false;
					} else {
						pwd = str_md5(pwd);
						pwd = $.base64.encode(pwd);
						$.ajax({
							url: ctxpath + "/newLogin",
							type: "post",
							dataType: "json",
							data: {
								from: 2,
								mobile: mobile,
								pwd: pwd
							},
							success: function(result) {
								if(result.state == 0) {
									console.log("result = " + JSON.stringify(result))
									//懒猫用户激活已开户&&未激活（certificateChecked = 2 && isActivate =  null)需要激活
									console.log("!result.isActivate  = " + (result.isActivate === "FALSE"))
									console.log("parseInt(result.certificateChecked)  = " +parseInt(result.certificateChecked) )
									if(result.isActivate === "FALSE"  &&  parseInt(result.certificateChecked) === 2)  {
										// 跳转
										//$.cookie("token", result.token);
										//var uri = document.referrer;
										var tmpinfo = result.token;
										var tmpinfo = result.token.split("").reverse().join('-');
										window.location.href = 'account_activation.html?a='+tmpinfo; 
									}else {
										$.cookie("token", result.token);
										var uri = document.referrer;
										window.location.href = 'index.html'; 
									}
								}else{
									getMsg(result.message);
								}
							}
						});
					}

				}

			}

		});
	}
}

function toActive(tokenstr) {
	$.ajax({
		url: ctxpath + "/lanmaoAccount/memberActivation",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			token: token
		},
		success: function(result) {
			console.log(JSON.stringify(result))
			openPostWindow(result.data)
		},
		fail: function(fail){

			console.log("fail=" + JSON.stringify(fail))
		}
	});
}

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
/** 登录显示/隐藏密码*/
function pwdShow() {
	var type = $("#pwd").attr("type");
	if(type == "password") {
		$("#pwd").attr("type", "text");
	} else {
		$("#pwd").attr("type", "password");
	}
}
//手机号验证
function checkMobile(str) {
	var re = /^1\d{10}$/;
	if(re.test(str)) {

		return "true";

	} else {
		return "false";
	}
}
$("#hidePwd").click(function() {
	$(this).toggleClass("cur");
	pwdShow();
});
$(".login_btn").click(function() {
	login();
});

function login_close_history() {
	window.location.href = "index.html";
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
	if(val !== "") {
		$(this).siblings("em").show();
	}
});
$(".input_wrap em").click(function() {
	$(this).siblings("input").val("");
	$(this).hide();
	$(".regist_btn_input a").removeClass("active");
});