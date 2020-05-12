jQuery.support.cors = true;
$(function() {

	var availableAmount = '0';
	var businessPwd;

	if(token != null && token.trim().length > 0) {
		//用户银行卡信息
		//获取用户绑卡信息
		$.ajax({
			url: ctxpath + "/user/getUserInfo",
			type: 'post',
			dataType: 'json',
			data: {
				from: '1',
				token: token
			},
			success: function(result) {

				if(result.state == '0') {
					bindCard = result.data.cgbBindBankCard;
					if(bindCard == 2) {
						$.ajax({
							url: ctxpath + "/user/getcgbUserBankCard",
							type: 'post',
							dataType: 'json',
							async: false,
							data: {
								from: '1',
								token: token,
							},
							success: function(json) {
								if(json.state == 4) {
									mask_login();
								} else if(json.state == 5) {
									window.location.href = "account_setting_bankcard.html";
								} else if(json.state == 0) {
									var data = json.data;
									var bindBankCardNo = "尾号" + data.bindBankCardNo.substr(-4);
									var bankName = data.bankName;
									$("#bankName").html(bankName + "(" + bindBankCardNo + ")");
									$("#freeCash").html(data.freeCash);
									if(data.freeCash == 0) {
										$("#withFree").html("1.00元");
									} else {
										$("#withFree").html("0.00元");
									}

								} else {}
							}
						});
						//用户账户信息
						$.ajax({
							url: ctxpath + "/user/getcgbUserAccount ",
							type: 'post',
							dataType: 'json',
							async: false,
							data: {
								from: '2',
								token: token,
							},
							success: function(json) {
								if(json.state == 4) {
									mask_login();
								} else if(json.state == 0) {
									var data = json.data;
									availableAmount = data.availableAmount;
									$("#availableAmount").html(formatCurrency(availableAmount));
								} else {
									if(amount == "") {

										$(".mask_investNo_tip").show().html("请输入充值金额");
										setTimeout(function() {
											$(".mask_investNo_tip").hide();
										}, 2000);
									}
								}
							},
							error: function(e) {
								$(".mask_investNo_tip").show().html("网络出现异常，请您稍后再试。");
								setTimeout(function() {
									$(".mask_investNo_tip").hide();
								}, 2000);
							}
						});
					} else {
						history.go(-1);
					}
				} else {
					//				alert("getUserInfo:"+result);
					logout();
				}
			}
		});
	} else {
     mask_login();
	}

	// 提取按钮动作
	$("#withdraw_btn").click(function() {
		withdrawLanmao();
	});
});

//CGB支付
function withdrawCGB() {
	/*var cityCode = $("#selCity").val();*/
	var amount = $("#amount").val();
	amount = amount.trim();
	if(checkAmount(amount)) {
		$.ajax({
			url: ctxpath + "/newwithdraw/withdrawH5",
			type: 'post',
			dataType: 'json',
			data: {
				from: '2',
				token: token,
				amount: amount,
				bizType: '01'
				/*	branchBank:branchBank,*/
				//	    			busiPwd:busiPwd
				/*cityCode:cityCode*/
			},
			success: function(json) {
				if(json.state == 4) {
					mask_login();
				} else if(json.state == 0) {
					var data = json.data;
					var tm = data.tm;
					var merchantId = data.merchantId;

					var url = cgbpath;
					window.location.href = url + "?data=" + data.data + "&tm=" + tm + "&merchantId=" + merchantId;
				} else if(json.state == 5) {
					$(".mask_investNo_tip").show().html("您输入的提现金额有误，请您核实后重新输入。");
					setTimeout(function() {
						$(".mask_investNo_tip").hide();
					}, 2000);
				} else if(json.state == 6) {
					$(".mask_investNo_tip").show().html("交易密码错误，请您核实后重新输入。");
					setTimeout(function() {
						$(".mask_investNo_tip").hide();
					}, 2000);
				} else if(json.state == 7) {
					window.location.href = "account_setting_bankcard.html";
				}
			}
		});
	}
}


//懒猫2.0
function withdrawLanmao() {
	/*var cityCode = $("#selCity").val();*/
	var amount = $("#amount").val();
	amount = amount.trim();
	if(checkAmount(amount)) {
		$.ajax({
			//url: ctxpath + "/newwithdraw/withdrawH5",
			url: ctxpath + "/lanmaowithdraw/withdrawWeb",
			type: 'post',
			dataType: 'json',
			data: {
				from: '2',
				token: token,
				amount: amount,
				bizType: '01'
				/*	branchBank:branchBank,*/
				//	    			busiPwd:busiPwd
				/*cityCode:cityCode*/
			},
			success: function(json) {
				if(json.state == 4) {
					mask_login();
				} else if(json.state == 0) {
					var _reqData = json.data.reqData;// 参数对象
					console.log("_reqData=" +_reqData);
					console.log(JSON.stringify(json));
					openPostWindow(json.data); // 发起网关请求
				} else if(json.state == 5) {
					$(".mask_investNo_tip").show().html("您输入的提现金额有误，请您核实后重新输入。");
					setTimeout(function() {
						$(".mask_investNo_tip").hide();
					}, 2000);
				} else if(json.state == 6) {
					$(".mask_investNo_tip").show().html("交易密码错误，请您核实后重新输入。");
					setTimeout(function() {
						$(".mask_investNo_tip").hide();
					}, 2000);
				} else if(json.state == 7) {
					window.location.href = "account_setting_bankcard.html";
				}
			}
		});
	}
}

// $("#withdraw_btn").bind("click", withdrawLanmao);
//检查输入金额
function checkAmount(amount) {
	var reg = /^\d+(\.\d{1,2})?$/;
	if(!reg.test(amount)) {
		$(".mask_investNo_tip").show().html("请输入提现金额");
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		return false;
	};

	var availableAmount = $("#availableAmount").html();
	while(availableAmount.indexOf(",") > 0) {
		availableAmount = availableAmount.replace(",", "");
	}
	if(parseFloat(availableAmount) < parseFloat(amount)) {
		$(".mask_investNo_tip").show().html("提现金额不可大于可用余额");
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		$("#errorMsg").show();
		return false;
	}
	$("#errorMsg").hide();
	return true;
}



function checkBlus() {
	var rechargeMoney = $("#amount").val().trim();

   if(rechargeMoney==""){
   	$("#withdraw_btn").html("提现");
   	$(".recharge_btn").removeClass("cur");
   }
   else{
   	$("#withdraw_btn").html("确认提现" + rechargeMoney + "元");
	$(".recharge_btn ").addClass("cur");
   	
   }
	

}
/*kefu info*/
$(".kefu_btn").click(function() {
	$(".kefu_mask_wrap").addClass("active");
	$(".mask_backdrop").show();
})
$(".kefu_mask_wrap span").click(function() {
	$(".kefu_mask_wrap").removeClass("active");
	$(".mask_backdrop").hide();
});