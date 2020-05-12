jQuery.support.cors = true;
//1	------未绑卡   2为已绑卡
var cgbBindBankCardState = -1;
//1  ------实名认证说明已经开户  2或null为未开户
var certificateChecked = -1;
$(function() {

	if(token != null && token.trim().length > 0) {

		$.ajax({
			url: ctxpath + "/user/getUserInfoNew",
			type: "post",
			async: false,
			dataType: "json",
			data: {
				from: '2',
				token: token,

			},
			success: function(json) {
				console.log("个人信息： " + JSON.stringify(json))
				if(json.state == 4) {
					mask_login();
				} else if(json.state == 0) {
					cgbBindBankCardState = json.data.cgbBindBankCardState;
					certificateChecked = json.data.certificateChecked;
					var data = json.data;
					var bindBankCardNo = "尾号" + data.bindBankCardNo.substr(-4);
					var bankName = data.bankName;

					$("#bankName").html(bankName + "(" + bindBankCardNo + ")");
					// 动态调整弹出菜单的显示名称
					if(parseInt(certificateChecked) === 2 && parseInt(cgbBindBankCardState) === 2){
						$("#bind_untying_btn").html("解绑银行卡")// 给按钮添加点击事件
						$("#bind_untying_btn").click(function() {
							lanMaoUytingBankCardFun();
						})
					}
					if((parseInt(certificateChecked) === 1 || parseInt(certificateChecked) === 2) && parseInt(cgbBindBankCardState) === 1){
						$("#bind_untying_btn").html("绑定银行卡")
						// 给按钮添加点击事件
						$("#bind_untying_btn").click(function() {
							lanMaoBindBankCardFun();
						})
					}
					if(certificateChecked === 2){
						$("#bind_untying_btn").hide()
					}
				} else {

				}
			},
			error: function(e) {
				//系统出现异常
				$(".mask_investNo_tip").show().html("网络出现异常，请您稍后再试。");
				setTimeout(function() {
					$(".mask_investNo_tip").hide();
				}, 2000);
				return false;
			}
		});

	} else {
		mask_login();

	}

});
// 解绑和绑定银行卡
function lanMaoUytingBankCardFun() {
	console.log("解绑和绑定银行卡")
	$.ajax({
		url: ctxpath + "/lanmaoAccount/untyingCard",
		type: "post",
		dataType: "json",
		data: {
			from: '1',
			token: token
		},
		success: function(result) {
			if(result.state == 4) {
				logout();
			} else if(result.state == 0) {
				// var obj = result.data;
				// var data = obj.data;
				// var tm = obj.tm;
				// var merchantId = obj.merchantId;
				// var url = cgbpath;
				// window.location.href = url + "?data=" + data + "&tm=" + tm + "&merchantId=" + merchantId; //130
				openPostWindow(result.data);
			}
			if(result.state == 3) {
				$(".mask_investNo_tip").show().html(result.message);
				setTimeout(function() {
					$(".mask_investNo_tip").hide();
				}, 2000);

			}
		}
	});
}
// 绑定银行卡
function lanMaoBindBankCardFun() {
	console.log("绑定银行卡")
}
//修改银行卡信息
function modifyBankCard() {

	$.ajax({
		url: ctxpath + "/cgbPay/changeBankCardH5",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			token: token
		},
		success: function(result) {
			if(result.state == 4) {
				logout();
			} else if(result.state == 0) {
				var obj = result.data;
				var data = obj.data;
				var tm = obj.tm;
				var merchantId = obj.merchantId;
				var url = cgbpath;
				window.location.href = url + "?data=" + data + "&tm=" + tm + "&merchantId=" + merchantId; //130
			}
			if(result.state == 3) {
				$(".mask_investNo_tip").show().html(result.message);
				setTimeout(function() {
					$(".mask_investNo_tip").hide();
				}, 2000);

			}
		}
	});
}
function lanMaoModifyPhone() {

	$.ajax({
		url: ctxpath + "/lanmaoAccount/modifyMobileExpand",
		type: "post",
		dataType: "json",
		data: {
			from: '1',
			token: token
		},
		success: function(result) {
			if(result.state == 4) {
				logout();
			} else if(result.state == 0) {
				// var obj = result.data;
				// var data = obj.data;
				// var tm = obj.tm;
				// var merchantId = obj.merchantId;
				// var url = cgbpath;
				// window.location.href = url + "?data=" + data + "&tm=" + tm + "&merchantId=" + merchantId; //130
				openPostWindow(result.data);
			}
			if(result.state == 3) {
				$(".mask_investNo_tip").show().html(result.message);
				setTimeout(function() {
					$(".mask_investNo_tip").hide();
				}, 2000);

			}
		}
	});
}

function modifyPhone() {

	$.ajax({
		url: ctxpath + "/cgbPay/changeBankPhoneH5",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			token: token
		},
		success: function(result) {
			if(result.state == 4) {
				logout();
			} else if(result.state == 0) {
				var obj = result.data;
				var data = obj.data;
				var tm = obj.tm;
				var merchantId = obj.merchantId;
				var url = cgbpath;
				window.location.href = url + "?data=" + data + "&tm=" + tm + "&merchantId=" + merchantId; //130
			}
			if(result.state == 3) {
				$(".mask_investNo_tip").show().html(result.message);
				setTimeout(function() {
					$(".mask_investNo_tip").hide();
				}, 2000);

			}
		}
	});
}