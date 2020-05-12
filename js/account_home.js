var bindCard = 1;
$(function() {
	if(token != null && token.trim().length > 0) {

		// 客户账户信息
		customerAccountInfo();
		// 获得用户积分值
		getUserBouns();
		//获取用户优惠券信息
		//	accountCoupon();
		// --
		$.ajax({
			url: ctxpath + "/user/getUserInfo",
			type: 'post',
			dataType: 'json',
			data: {
				from: '2',
				token: token
			},
			success: function(result) {
				if(result.state == 0) {
					bindCard = result.data.cgbBindBankCard;

					$("#account_total_coupon").html(result.data.voucherNum + "张");
					var userType = result.data.userType;
					if(userType != "") {
						$("#userType").html(result.data.userType);
					} else {
						$("#userType").removeClass("cur").html("立即测评");
					}
					//用户头像
					$("#userImg").attr("src", result.data.avatarPath);
					var name = result.data.name;
					var realName = result.data.realName;
					var userName = name.substr(0, 3) + '****' + name.substr(7);
					if(realName == "") {
						$("#useName").html(userName);
					} else {
						$("#useName").html(realName);
					}
				} else {
					$.cookie('token', null);
					console.log(result.message);
				}

			}
		});
		//站内信是否未读
		letterState();
	} else {
		mask_login();
	}
});

/**
 * 激活用户
 */
function toActive() {
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

function letterState() {
	$.ajax({
		url: ctxpath + "/station/letterState",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			token: token
		},
		success: function(result) {
			if(result.state == '0') {
				var letterState = result.data.letterState;
				if(letterState == "1") { //有未读消息
					$("#letterState").addClass("cur");
				} else if(letterState == "0") { //无未读消息
					$("#letterState").removeClass("cur");
				}
			}
			else{
				$.cookie('token', null);
			}

		}
	});
}

//客户账户信息
function customerAccountInfo() {

	// console.log("token = " + token);
	// 调用客户账户接口.
	$.ajax({
		url: ctxpath + "/user/getcgbUserAccount",
		type: 'post',
		dataType: 'json',
		data: {
			token: token,
			from: '2'
		},
		success: function(json) {
			// 系统超时.
			if(json.state == 4) {
				// console.log("系统超时！");
				$.cookie('token', null);
				mask_login();
				$(".login_close").click(function() {

					window.location.href = "index.html";

				});
			}
			// 接口调用成功.
			if(json.state == 0) {
				// console.log("接口调用成功！");
				// 账户总额.
				$("#account_total_amount").html(formatCurrency(json.data.totalAmount));
				// 可用余额.
				$("#account_available_amount").html(formatCurrency(json.data.availableAmount));
				// 累计利息(定期利息 + 活期利息).
				$("#accumulated_earnings").html(formatCurrency(json.data.regularTotalInterest));
				/*冻结金额*/
				$("#freezeAmount").html(formatCurrency(json.data.freezeAmount));
			}
		}
	});
}

//提现
function withdraw() {
	if(bindCard == '2') {
		window.location.href = "account_withdraw.html";
	} else {
		$(".mask_bank_two,.mask_backdrop").show();
	}
}
//充值
function recharge() { 
	if(bindCard == '2') { 
		window.location.href = "account_recharge.html"; 
		// window.location.href = "account_recharge_big.html";
	} else {
		//		mask.show();
		$(".mask_bank_two,.mask_backdrop").show();
	}
}

// 获得用户积分值
function getUserBouns() {
	$.ajax({
		url: ctxpath + "/bouns/userBouns",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token
		},
		success: function(result) {
			if(result.state == '0') {
				$("#userbouns").html(result.data.score + "分");
			} else {
				mask_login();
				$.cookie('token', null);
			}
		}
	});
}

/*开户取消操作*/
$(".refuse").click(function() {
	$(".mask_bank_two,.mask_backdrop").hide();
});

/*kefu info*/
$(".kefuInfo").click(function() {
	$(".kefu_mask_wrap").addClass("active");
	$(".mask_backdrop").show();
})
$(".kefu_mask_wrap span").click(function() {
	$(".kefu_mask_wrap").removeClass("active");
	$(".mask_backdrop").hide();
});
$(".freezing_amount i").click(function(){
	$(this).siblings("b").toggle();
});
function imgError(image){  
 image.src="images/account/user_icon.png";    
} 