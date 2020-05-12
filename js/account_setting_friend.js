//mui初始化
mui.init();

var mask = mui.createMask(function(){
	$(".setting_success").hide();
});

$(".setting_submite").click(function(){
	updateUserFriend();
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
					document.getElementById("friendName").value = (user.emergencyUser == null ? "" : user.emergencyUser.replace(user.emergencyUser.substr(1,1),"*"));
					document.getElementById("friendPhone").value = (user.emergencyTel == null ? "" : user.emergencyTel.replace(user.emergencyTel.substr(3,4),"****"));
				}
			}
		});
	} else {
		window.location.href = "login.html";
	}
	
});

function updateUserFriend(){
	$(".error_msg_wrap p").html("");
	$(".error_msg_wrap p").css("visibility", "visible");
	var friendName = $("#friendName").val();
	var friendPhone = $("#friendPhone").val();
	console.log(friendName);
	console.log(friendPhone);
	if( token != null && token.trim().length > 0 ){
		if( $.trim(friendName) != "" && friendName != null ){
			if( $.trim(friendPhone) != "" && friendPhone != null){
				if( checkMobile(friendPhone) == "true" ){
						$.ajax({
							url : ctxpath + "/user/updateEmergency",
							type : 'post',
							dataType : 'json',
							data : {
								from : '2',
								token: token,
								emergencyUser: friendName,
								emergencyTel: friendPhone
							},
							success : function(json) {
								if(json.state == "0"){
									$(".setting_success").show();
									mask.show();
								}
							}
						});
				} else {
					$(".error_msg_wrap p").html("请输入正确的联系方式");
					$(".error_msg_wrap p").css("visibility", "visible");
				}
			} else {
				$(".error_msg_wrap p").html("请输入联系人联系方式");
				$(".error_msg_wrap p").css("visibility", "visible");
			}
		} else {
			$(".error_msg_wrap p").html("请输入联系人姓名");
			$(".error_msg_wrap p").css("visibility", "visible");
		}
	} else {
		window.location.href = "login.html";
	}
	
}
