jQuery.support.cors = true;
$(function() {
	//获取用户绑卡信息
//	customerAccountInfo();

});


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
				// 可用余额.
				$("#account_available_amount").html("账户余额" + formatCurrency(json.data.availableAmount) + "元");
			}
		}
	});
}
//CGB
$("#recharge_btn").click(function() {
	var amount = $("#amount").val();
	amount = amount.trim();
	$.ajax({
		url: ctxpath + "/newpay/largeRechargeH5",
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
					} else if(amount == "0" || amount == "0.0") {
						$(".mask_investNo_tip").show().html(json.message);
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

});

//金额校验
function checkAmount(amount) {
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
	if(rechargeMoney == "") {

		$(".recharge_btn").removeClass("cur");

	} else {

		$(".recharge_btn").addClass("cur");

	}

}