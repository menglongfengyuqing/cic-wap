$(function() {
	if(token != null && token.trim().length > 0) {
		$.ajax({
			url: ctxpath + "/user/getUserInfoNew",
			type: 'post',
			dataType: 'json',
			data: {
				from: '1',
				token: token
			},
			success: function(result) {
				if(result.state == '0') {
					console.log("account_info_home="+JSON.stringify(result))
					var user = result.data;
					var realName = user.realName;
					var phone = user.name;
					var phoneNum = phone.substr(0, 3) + '****' + phone.substr(7);
					var IdCard = user.IdCard;
					// cgbBindBankCardState==1	------未绑卡   2为已绑卡
					var cgbBindBankCard = user.cgbBindBankCardState;
					//1  ------实名认证说明已经开户  2或null为未开户
					var certificateChecked = user.certificateChecked;
					var userType = result.data.userType;
					var bindBankCardNo = user.bindBankCardNo.substr(-4);
					var bankName = user.bankName;
					if(user.avatarPath == "" || user.avatarPath == null) {

					} else {
						$("#userImg").attr("src", user.avatarPath);
					}
					if(realName == "") {
						$("#username").html(phoneNum);
					} else {
						$("#username").html(realName);
					}
					$("#phoneNum").html(phoneNum);

					if(cgbBindBankCard == 1) {

						$(".cgbBindBankCard,.bankName,.IdCard").children("a").attr("href", "account_setting_bankcard.html");
						$("#cgbBindBankCard").html("立即开通");
						var _cgbBindBankCard_href = $(".cgbBindBankCard a").attr("href");
						$(".cgbBindBankCard a").attr("href", _cgbBindBankCard_href+"?cgbBindBankCard="+cgbBindBankCard+"&certificateChecked="+certificateChecked)
						$("#IdCard").html("立即认证");
						var _IdCard_href = $(".IdCard a").attr("href");
						$(".IdCard a").attr("href", _IdCard_href+"?cgbBindBankCard="+cgbBindBankCard+"&certificateChecked="+certificateChecked)
						$("#bankName").html("立即绑定");
						var _tmp_href = $(".bankName a").attr("href");
						$(".bankName a").attr("href", _tmp_href+"?cgbBindBankCard="+cgbBindBankCard+"&certificateChecked="+certificateChecked)
						console.log($(".bankName a").attr("href"))

					} else if(cgbBindBankCard == 2) {
						$(".cgbBindBankCard,.IdCard").addClass("cur");
						$(".cgbBindBankCard,.IdCard").children("a").attr("href", "javascript:;");
						$("#cgbBindBankCard").removeClass("cur").html("已开通");
						$("#IdCard").removeClass("cur").html(IdCard);
						$("#bankName").removeClass("cur").html(bankName + "(" + bindBankCardNo + ")");
						$(".bankName").children("a").attr("href", "account_bankcard.html");
					}

					if(userType != "") {
						$("#userType").html(result.data.userType);
					} else {
						$("#userType").removeClass("cur").html("立即测评");
					}

				} else {
					console.log(result.message);
				}
			}
		});
	} else {
		mask_login();
	}
});
function imgError(image){  
 image.src="images/account/user_icon.png";    
} 