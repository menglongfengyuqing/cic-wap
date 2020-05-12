//mui初始化
mui.init();

var mask = mui.createMask(function(){
	$(".setting_success").hide();
});

$(".setting_submite").click(function(){
	updateUserMail();
});

$(".setting_close").click(function(){
	$(".setting_success").hide();
	mask.close();//显示遮罩
});
	
	
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
					if(user.bindEmail == "2"){
						document.getElementById("email").value = user.email.replace(user.email.substr(2,4),"****");
					}
				}
			}
		});
	} else {
		window.location.href = "login.html";
	}
	
});

function updateUserMail(){
	var email = document.getElementById("email").value;
	if(checkMail(email)){
		if( token != null && token.trim().length > 0 ){
			$.ajax({
				url : ctxpath + "/user/sendCheckEmail",
				type : 'post',
				dataType : 'json',
				data : {
					from : '2',
					token: token,
					email: email
				},
				success : function(json) {
					if(json.state == "0"){
						$(".setting_success").show();
						mask.show();
					}
				}
			});
		} else {
			window.location.href = "login.html";
		}
	}
}


function checkMail(mail) {
	var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (filter.test(mail)){
		$(".error_msg_wrap p").css("visibility", "hidden");
		return true;
	} else {
		$(".error_msg_wrap p").html("您的电子邮件格式不正确");
		$(".error_msg_wrap p").css("visibility", "visible");
		return false;
	}
}