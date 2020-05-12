jQuery.support.cors = true;
var isMobile = false;
var isMobile1 = false;
var isPwd = false;
var isCode = false;
var reg = /^1[34578]\d{9}$/;
var regp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
//注册第一步
$(function() {
	

})
//注册第二步

function sendMessage() {

  var mobile = $("#mobile").val();
  //向后台发送处理数据
	 $.ajax({
		url: ctxpath + "/sm/sendSmsCodeForPartner",
		type:"post",
		dataType:"json",
		data:{
			mobilePhone:mobile,
			type:'1',
			from:'2',
		},
		success:function(result){
			//console.log(result.data);
			if(result.state == "0"){
				$("#alert_message").show();
				$("#alert_message").html("短信验证码发送成功！");
			}
			if(result.state == "1"){
				$("#alert_message").show();
				$("#alert_message").html("系统错误！");
			}
			if(result.state == "2"){
				$("#alert_message").show();
				$("#alert_message").html("缺少必要参数！");
			}
			if(result.state == "5"){
				$("#alert_message").show();
				$("#alert_message").html("短信验证码发送失败！");
			}
			if(result.state == "6"){
				$("#alert_message").show();
				$("#alert_message").html("短信发送过于频繁，请稍后操作！");
			}
			if(result.state == "4"){
				$("#alert_message").show();
				$("#alert_message").html("系统超时！");
			}
		}
	});

}



//注册用户
function login(){
	
	//校验短信验证码
	 
		var mobile = $("#mobile").val();
		var code = $("#code").val();
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
			//console.log(result.message);
			if(result.state == "0"){
				$.cookie('mobile', mobile);
				window.location.href = "zt_login_details.html";
			}else{
				if(result.state == "6"){
				$("#alert_message").show();
				$("#alert_message").html("校验手机短信验证码失败！");
				}
			}
		}
		});

	
	
	
	
}


