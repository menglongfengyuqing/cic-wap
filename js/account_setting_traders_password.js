

$(".mask_backdrop").click(function(){
	$(".setting_success").hide();
	$(this).hide();
});

$(".setting_submite").click(function(){
	updateUserDealPwd();
});

$(".setting_close").click(function(){
	$(".setting_success").hide();
	$(".mask_backdrop").hide();
});


function updateUserDealPwd(){
	$(".error_msg_wrap p").css("visibility", "hidden");
	var code = document.getElementById("code").value;
	var dealPwd = document.getElementById("dealPwd").value;
	var mobile = $("#mobile").val();

	if (code == null || code == "") {
		$(".error_msg_wrap p").html("请输入验证码");
		$(".error_msg_wrap p").css("visibility", "visible");
		return;
	}

	if(checkPwd(dealPwd)){
		// 交易密码校验失败
		$(".error_msg_wrap p").html("请输入交易密码");
		$(".error_msg_wrap p").css("visibility", "visible");
		return;
	}

	if(!/^\d{6}$/.test(dealPwd)){
		$(".error_msg_wrap p").html("交易密码只能为6位数字");
		$(".error_msg_wrap p").css("visibility", "visible");
		return;
	}

	$.ajax({
		url: ctxpath + "/sm/verifySmsCode",
		type:"post",
		dataType:"json",
		data:{
			mobilePhone:mobile,
			smsCode:code,
			from:'2'
		},
		success:function(result){
			if(result.state != "0"){
				$(".error_msg_wrap p").html("请输入正确的验证码");
				$(".error_msg_wrap p").css("visibility", "visible");
				return;
			} else {
				if( token != null && $.trim(token) != "" ){
					$.ajax({
						url: ctxpath + "/user/findTradePassword",
						type:"post",
						dataType:"json",
						data:{
							from: '2',
							token: token,
							pass: dealPwd
						},
						success:function(result){
							if(result.state == "1"){
								mask_login();
							}
							if(result.state == "0"){
								$(".setting_success").show();
								$(".mask_backdrop").show();
								 window.setInterval(function(){
								 	window.history.go(-1);
								 },3000);
							}
						}
					});
				} else {
					mask_login();
				}
			}
		}
	});

}

function checkPwd(dealPwd){
	var flag = false;
	if (dealPwd != null && dealPwd != "") {
		flag = false;
	} else {
		flag = true;
	}
	return flag;
}



/*获取验证码倒计时*/
var InterValObj; 		//timer变量，控制时间
var count = 60; 		//间隔函数，1秒执行
var curCount;			//当前剩余秒数


/**
 * 发送短信验证码
 * @param {Object} str
 */
function sendMessage() {
	curCount = count;
	$("#btnSendCode").attr("onclick", "");
	$("#btnSendCode").html("倒计时" + curCount + "S");
	InterValObj = window.setInterval(function SetRemainTime() {
	    if (curCount == 0) {
	        window.clearInterval(InterValObj);//停止计时器
	        $("#btnSendCode").html("重新获取");
	        $("#btnSendCode").attr("onclick", "sendMessage();");
	    } else {
	        curCount--;
	        $("#btnSendCode").html("倒计时" + curCount + "S");
	    }
	}, 1000); //启动计时器，1秒执行一次

	if( token != null && $.trim(token) != "" ){
		$.ajax({
			url: ctxpath + "/user/getUserInfo",
			type:"post",
			dataType:"json",
			data:{
				from: '2',
				token: token
			},
			success:function(result){
				if(result.state == "4"){
					mask_login();
				}
				if(result.state == "0"){
					var user = result.data;
					document.getElementById("mobile").value = user.name;

					$.ajax({
						url: ctxpath + "/sm/sendSmsCode",
						type:"post",
						dataType:"json",
						data:{
							from:'2',
							type:'4',
							mobilePhone: user.name,
							token: token
						},
						success:function(result){
							if(result.state == "0"){
								// console.log(result.data);
							}
						}
					});
				}
			}
		});
	} else {
		mask_login();
	}
}

$(function(){
	if( token != null && token.trim().length > 0 ){
		$.ajax({
			url : ctxpath + "/user/getUserInfo",
			type : 'post',
			dataType : 'json',
			data : {
				from : '2',
				token: token
			},
			success : function(json) {
				if(json.state == "0"){
					var user = json.data;
					$("#phone_num").html(user.name);

				}
			}
		});
	} else {
			mask_login();
	}

});


