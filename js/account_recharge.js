jQuery.support.cors = true;
var _bankCode = "";
$(function() {
	//获取用户绑卡信息
	if(token != null && token.trim().length > 0) {
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
							data: {
								from: '2',
								token: token
							},
							success: function(json) {
								if(json.state == 4) {
									mask_login();
								} else if(json.state == 0) {
									console.log("INFO = " + JSON.stringify(json))
									var data = json.data;
									var bindBankCardNo = "尾号" + data.bindBankCardNo.substr(-4);
									var bankName = data.bankName;
									_bankCode = data.bankCode;
									$("#bankName").html(bankName + "(" + bindBankCardNo + ")");
									$("#limit").html(data.limitAmountTxt);
								} else if(json.state == 5) {
									window.location.href = "account_setting_bankcard.html";
								}
							}
						});
					} else {
						history.go(-1);
					}
				} else {
					$.cookie('token', null);
					logout();
				}
			}
		});
	} else {
		mask_login();
	}

	// 给按钮添加点击事件
	$("#recharge_btn").click(function() {
		clickRecharge2_0();
	})
});

//CGB
function clickRecharge1_0() {
	var amount = $("#amount").val();
	amount = amount.trim();

	$.ajax({
		url: ctxpath + "/newpay/authRechargeH5",
		type: "post",
		async: false,
		dataType: 'json',
		data: {
			from: "2",
			token: token,
			amount: amount,
			bizType: '01'
		},
		success: function(json) {
			if(json.state == 4) {
				$.cookie('token', null);
				mask_login();
				
			} else {
				if(json.state == 0) {
					var data = json.data;
					var tm = data.tm;
					var merchantId = data.merchantId;

					var url = cgbpath;
					window.location.href = url + "?data=" + data.data + "&tm=" + tm + "&merchantId=" + merchantId;

				} else {
					if(amount == "") {

						$(".mask_investNo_tip").show().html("请输入充值金额");
						setTimeout(function() {
							$(".mask_investNo_tip").hide();
						}, 2000);
					}

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

};


//懒猫 2.0 银联充值 
/**
 * 	网银充值：
 * 			from: "2",// 1:pc, 2: wap, 3: android, 4: ios
			isbankcode: "1",
			token: token,
			amount: amount
	网捷充值：

 */
function clickRecharge2_0 () {
	console.log("lanmao 2.0........")
	var amount = $("#amount").val();
	amount = amount.trim();
	if(!checkAmount(amount)){
		return 
	}
	$.ajax({
		url: ctxpath + "/lmpay/lanmaoSwiftRecharge",
		type: "post",
		async: false,
		dataType: 'json',
		data: {
			from: "2",// 1:pc, 2: wap, 3: android, 4: ios
			token: token,
			amount: amount,
			isbankcode: "1"
		},
		success: function(json) {
			if(json.state == 4) {
				$.cookie('token', null);
				mask_login();
				
			} else {
				if(json.state == 0) {
					// var data = json.data;
					// var tm = data.tm;
					// var merchantId = data.merchantId;

					// var url = cgbpath;
					// window.location.href = url + "?data=" + data.data + "&tm=" + tm + "&merchantId=" + merchantId;

					var data = json.data.reqData;// 参数对象
					console.log("data=" +data)
					console.log(JSON.stringify(json))
					openPostWindow(json.data); // 发起网关请求

				} else {
					if(amount == "") {

						$(".mask_investNo_tip").show().html("请输入充值金额");
						setTimeout(function() {
							$(".mask_investNo_tip").hide();
						}, 3000);
					}else{
						$(".mask_investNo_tip").show().html(json.message);
						setTimeout(function() {
							$(".mask_investNo_tip").hide();
						}, 3000);
					}

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

};



function checkBlus() {
	var rechargeMoney = $("#amount").val().trim();
	var obj = document.getElementById("amount");
	obj.value = obj.value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符   
	obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
	obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数   
	if(obj.value.indexOf(".") < 0 && obj.value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
		obj.value = parseFloat(obj.value);
	}
	if(rechargeMoney==""){
	$("#recharge_btn").html("确认支付");
	  $(".recharge_btn").removeClass("cur");
		
	}
	else{
	  $("#recharge_btn").html("确认支付" + rechargeMoney + "元");
	  $(".recharge_btn").addClass("cur");
		
	}

}
//金额校验
function checkAmount(amount) {
	if(parseInt(amount) <= 0 && parseInt(amount) > 1000000) {
		$(".mask_investNo_tip").show().html("请输入有效充值金额");
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		return false;
	}
	var reg = /^\d+(\.\d{1,2})?$/;
	if(reg.test(amount)) {

		return true;
	};
	$(".mask_investNo_tip").show().html("请输入充值金额");
	setTimeout(function() {
		$(".mask_investNo_tip").hide();
	}, 2000);
	return false;
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