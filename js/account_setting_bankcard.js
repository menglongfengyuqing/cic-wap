jQuery.support.cors = true;

// cgbBindBankCardState==1	------未绑卡   2为已绑卡 
var cgbBindBankCard = getArgumentsByName("cgbBindBankCard");
//1  ------实名认证说明已经开户  2或null为未开户
var certificateChecked = getArgumentsByName("certificateChecked");
$(function() {
	console.log("certificateChecked=" +certificateChecked)
	$("#bind_card_btn").click(function() {
		LANMAOFunction(certificateChecked);
	});
});

// 懒猫2.0
function LANMAOFunction(_checked) {
	var realName = $("#realName").val();
	var idCard = $("#IdCard").val();
	var bankCard = $("#bankCard").val();
	var bankCardPhone = $("#bankCardPhone").val();
	if(checkedName() && checkedIdCard() && checkbankCardPhone()) {
		var _link_url = "/lanmaoAccount/personalRegisterExpand";
		if( _checked == 1 ){ //实名认证说明已经开户
			_link_url = "/lanmaoAccount/changeBankCard";
		}
		console.log("_link_url =- " + _link_url)
		$.ajax({
			url: ctxpath + _link_url,
			type: "post",
			async: false,
			dataType: "json",
			data: {
				from: '2',
				token: token,
				bankCardNo: bankCard,
				bankCardPhone: bankCardPhone,
				certNo: idCard,
				realName: realName,
				bizType: '01'
			},
			success: function(json) {
				if(json.state == 4) {
					mask_login();
				} else if(json.state == 0) {
					var obj = json.data;
					var data = obj.data;
					console.log("obj = " +JSON.stringify(obj))
					console.log("data = " +JSON.stringify(data))
					// var tm = obj.tm;
					// var merchantId = obj.merchantId;
					// var url = cgbpath;
					// url = url + "?data= " + data + "&tm=" + tm + "&merchantId=" + merchantId; //130
					// $("#prepositPayBillForm").attr("action", url);
					// $("#prepositPayBillForm").submit();
					// 采用懒猫的请求方式
					openPostWindow(json.data);
				} else {
					//银行卡校验错误，进行处理

					$(".mask_investNo_tip").show().html("您输入的银行卡号有误，请您核实后重新输入。");
					setTimeout(function() {
						$(".mask_investNo_tip").hide();
					}, 2000);
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
	}
}


//CGB
function CGBFunction() {
	var realName = $("#realName").val();
	var idCard = $("#IdCard").val();
	var bankCard = $("#bankCard").val();
	var bankCardPhone = $("#bankCardPhone").val();
	if(checkedName() && checkedIdCard() && checkbankCardPhone()) {

		$.ajax({
			url: ctxpath + "/cgbPay/accountCreateH5",
			type: "post",
			async: false,
			dataType: "json",
			data: {
				from: '2',
				token: token,
				bankCardNo: bankCard,
				bankCardPhone: bankCardPhone,
				certNo: idCard,
				realName: realName,
				bizType: '01'
			},
			success: function(json) {
		
				if(json.state == 4) {
					mask_login();
				} else if(json.state == 0) {
					var obj = json.data;
					var data = obj.data;
					var tm = obj.tm;
					var merchantId = obj.merchantId;
					var url = cgbpath;
					url = url + "?data= " + data + "&tm=" + tm + "&merchantId=" + merchantId; //130
					$("#prepositPayBillForm").attr("action", url);
					$("#prepositPayBillForm").submit();
				} else {
					//银行卡校验错误，进行处理

					$(".mask_investNo_tip").show().html("您输入的银行卡号有误，请您核实后重新输入。");
					setTimeout(function() {
						$(".mask_investNo_tip").hide();
					}, 2000);
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
	}
}

//验证真实姓名
function checkedName() {
	var rt = false;
	var uName = $("#realName");
	if(uName.val().length > 1 && uName.val().length < 21) {
		$("#errorMsg").hide();
		rt = true;
	} else {

		$(".mask_investNo_tip").show().html("您输入的姓名长度有误，请您核实后重新输入。");
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		rt = false;
	}
	return rt;
}

//验证身份证
function checkedIdCard() {
	var rt = false;
	var uIdCard = $("#IdCard")
	var uIdCardVal = $("#IdCard").val();
	var b = uIdCardVal.substring(17);
	if(uIdCardVal.length == 18) {
		if(isNaN(uIdCardVal.substring(0, 17))) {

			$(".mask_investNo_tip").show().html("您输入的身份证号有误，请您核实后重新输入。");
			setTimeout(function() {
				$(".mask_investNo_tip").hide();
			}, 2000);

			rt = false;
		} else
		if((b == 'X') || !isNaN(b)) {
			$("#errorMsg").hide();
			rt = true;
		} else {

			$(".mask_investNo_tip").show().html("您输入的身份证号有误，请您核实后重新输入。");
			setTimeout(function() {
				$(".mask_investNo_tip").hide();
			}, 2000);
			rt = false;
		}

	} else {

		$(".mask_investNo_tip").show().html("您输入的身份证号有误，请您核实后重新输入。");
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		rt = false;
	}
	return rt;
}

//验证手机号
function checkbankCardPhone() {
	var rt = false;
	var bankCardPhone = $("#bankCardPhone").val();
	var re = /^1\d{10}$/;
	if(re.test(bankCardPhone)) {
		rt = true;
	} else {

		$(".mask_investNo_tip").show().html("您输入的手机号有误，请您核实后重新输入。");
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		rt = false;
	}
	return rt;
}