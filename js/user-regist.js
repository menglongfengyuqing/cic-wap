jQuery.support.cors = true;
var isMobile = false;
var isMobile1 = false;
var isPwd = false;
var isCode = false;
var currentMobile;
var currentPwd;
var currentPic;
var recommendRefer = getArgumentsByName("id");
var refer = getArgumentsByName("refer");
var userNo;
//注册第一步
$(function() {
	if(recommendRefer != null && recommendRefer.trim().length > 0) {
		$("#recommendMobilePhone").attr("value", recommendRefer);
		$("#recommendMobilePhone").attr("readOnly", "true");
	}
	getPictureCode();

});
$("#agreement").click(function() {
	var mobile = $("#mobileR").val();
	var pwd = $.trim($("#pwd_rs").val());
	var recommendMobilePhone = $("#recommendMobilePhone").val();
	var code = $("#code").val();
	var pictureCode = $("#checkCode").val();
	var key = $("#codeKey").val();
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
					getMsg("该手机号已注册");
					return false;

				} else if(result.state == "5") { //未注册
					console.log(result.message);

					if(pwd == null || pwd.trim() == "") {
						getMsg("密码不能为空");
						return false;
					}
					if(checkLoginPassword(pwd) == "false") {
						getMsg("请输入6-16位包含数字和字母的密码");
						return false;
					}

					//图片验证码校验
					if(code == null || code == "") {
						getMsg("验证码不能为空");
						return false;
					}
					if(recommendMobilePhone == mobile) {
						getMsg("邀请人不能为本人");
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
								if(result.state == 0) {
									pwd = str_md5(pwd);
									pwd = $.base64.encode(pwd);
									// 添加调接口存用户预注册信息
									$.ajax({
										url: ctxpath + "/wapPreRegist",
										type: "post",
										dataType: "json",
										data: {
											from: '2',
											name: mobile,
											refer: refer,
											pwd: pwd,
											recommendMobilePhone: recommendMobilePhone
										},
										success: function(result){
											if(result.state == 0 ) {
												var tmpMobile = mobile.split("").reverse().join('-');
												window.location.href = "regist_sub.html?mobile="+tmpMobile+"&key="+key+"&pictureCode="+pictureCode+"&refer=" + refer;
											}else{
												getMsg("用户注册异常，请稍后再试！");
												return false;
											}
										}
									});
								} else {
									getMsg("请输入正确的验证码");
									return false;
								}
								// if(result.state == 0) {
								// 	// 					sendMessage(mobile, pictureCode, key);
								// 	if(recommendMobilePhone == "" || recommendMobilePhone == null) {
								// 		window.location.href = "regist_sub.html?mobile=" + mobile + "&pictureCode=" + pictureCode + "&key=" + key + "&pwd=" + pwd + "&refer=" + refer;
								// 	} else {
								// 		window.location.href = "regist_sub.html?mobile=" + mobile + "&pictureCode=" + pictureCode + "&key=" + key + "&recommendMobilePhone=" + recommendMobilePhone + "&pwd=" + pwd + "&refer=" + refer;
								// 	}
								// } else {
								// 	getMsg("请输入正确的验证码");
								// 	return false;
								// }
							}
						});
					}
				} else {
					console.log(result.message);
				}
			}
		});
	}

});

/**
 * 获取图形验证码
 */
function getPictureCode() {

	$.ajax({
		url: ctxpath + "/sm/getPictureCode",
		type: "post",
		dataType: "json",
		data: {
			from: '2'
		},
		success: function(result) {
			if(result.state == "0") {
				console.log(result);
				$("#checkCode").html(result.pictureCode);
				$("#checkCode").val(result.pictureCode);
				$("#codeKey").val(result.key);
			}
		}
	});
}
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

//手机号验证
function checkMobile(str) {
	var re = /^1\d{10}$/;
	if(re.test(str)) {

		return "true";

	} else {
		return "false";
	}
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
	var phone = $("#mobileR").val();
	var pwd = $("#pwd_rs").val();
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
$("#hidePwd_rs").click(function() {
	$(this).toggleClass("cur");
	pwdShow_rs();
});

function pwdShow_rs() {
	var type = $("#pwd_rs").attr("type");
	if(type == "password") {
		$("#pwd_rs").attr("type", "text");
	} else {
		$("#pwd_rs").attr("type", "password");
	}
}