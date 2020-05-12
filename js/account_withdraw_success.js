jQuery.support.cors = true;
$(function() {
	var amount = getArgumentsByName("amount");
	var feeAmount =getArgumentsByName("feeAmount");
	var token = $.cookie('token');
	var bankName ='';
	//用户银行卡信息
	$.ajax({
		url : ctxpath + "/user/getUserInfo",
		type : 'post',
		dataType : 'json',
		async: false,
		data : {
			from : '2',
			token : token
		},
		success : function(json) {
			if(json.state == 4){
				window.location.href = "login.html";
			}else if(json.state == 0){
				bankName = json.data.bankName + "(" + json.data.bindBankCardNo + ")"
			} else if(json.state == 5){
				window.location.href = "account_setting_bankcard.html";
			}
		},
		error:function(e) {
			$("#errorMsg a").html("网络出现异常，请您稍后再试。");
			$("#errorMsg").show();
		}
	});
	var realAmount = parseFloat(amount)-parseFloat(feeAmount);
	var successText = "<ul><li class='font_size30'>成功申请：" + amount +"</li>"
	+ "<li class='font_size30'>手续费：" +feeAmount + "</li>"
	+ "<li class='font_size30'>可到账：" + parseFloat(realAmount) + "</li>"
	+ "<li class='font_size30'>" + bankName + "</li>"
	+ "<li class='font_size30'>预计下个工作日23:59前到账</li></ul>";
	$(".rechange_write").html(successText);
}); 

 