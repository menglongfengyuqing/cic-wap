var isMobile = false;
var　 isMobileUsed = '0';
var isMobileFormat = '0';
var currentMobile;
var reg = /^1[34578]\d{9}$/;
$(function() {
	if(token != null && token.trim().length > 0) {
		$.ajax({
			url: ctxpath + "/user/getUserInfo",
			type: 'post',
			dataType: 'json',
			data: {
				from: '2',
				token: token
			},
			success: function(json) {
				if(json.state == "0") {
					var user = json.data;
					$("#oldMobile").val(user.name);
					document.getElementById("oldMobile").readOnly = true;
				}
			}
		});
	} else {
		$(".login_close").click(function() {
			window.history.go(-1);

		});
		mask_login();

	}

});

/*获取验证码倒计时*/
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数

/**
 * 发送短信验证码
 * 
 */
function sendMessage() {

	curCount = count;

	var oldMobile = $("#oldMobile").val();
	$.ajax({
		url: ctxpath + "/sm/sendSmsCode",
		type: "post",
		dataType: "json",
		data: {
			mobilePhone: oldMobile,
			type: '8',
			from: '2',
			token: token
		},
		success: function(result) {
			if(result.state == "0") {

				$(".mask_investNo_tip").show().html("验证码已发送!");
				setTimeout(function() {
					$(".mask_investNo_tip").hide();
				}, 2000);
				InterValObj = window.setInterval(function SetRemainTime() {
					if(curCount == 0) {
						window.clearInterval(InterValObj); //停止计时器
						$("#sendMessage").attr("onclick", "javascript:sendMessage();");
						$("#sendMessage").removeClass("default").html("重新发送");
					} else {
						curCount--;
						$("#sendMessage").addClass("default").html("倒计时" + curCount + "S");
						$("#sendMessage").attr("onclick", "javascript:;");

					}
				}, 1000); //启动计时器，1秒执行一次

			}
			else{
				$(".mask_investNo_tip").show().html(result.message);
				setTimeout(function() {
					$(".mask_investNo_tip").hide();
				}, 2000);
			}
		}
	});

}

/**
 * 下一步
 */
 var oldMobile=$("#oldMobile").val();
 $("#newCode").keyup(function(){
 	$("#msgCode").val($(this).val());
 });
 var newCode=$("#newCode").val();
function nextMobile() {
 
     var msgCode=$("#msgCode").val();
     var oldMobile = $("#oldMobile").val();
	$.ajax({
		url: ctxpath + "/sm/verifySmsCode",
		type: "post",
		dataType: "json",
		data: {
			mobilePhone: oldMobile,
			smsCode:msgCode,
			from: '2'
		},
		success: function(result) {
			
			if(result.state == "0") {
				window.location.href = "account_setting_phone_sub.html";
			
			} else {

				$(".mask_investNo_tip").show().html("验证码错误");
				setTimeout(function() {
					$(".mask_investNo_tip").hide();
				}, 2000);
			}
		}
	});

}