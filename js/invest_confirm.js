var projectId = getArgumentsByName("projectId");

var pageNo = parseInt(1);
var pageSize = parseInt(7);
var vouid = new Array();
var vouchers = "";
var vouidT;
var vouidT2;
var vouAmount; //代金券
var availableAmount; //用户可用金额
var bindBank;
var isTest;
var userInfo;
var isCanUseCoupon;
var awardsLength = 0;
var balanceAmount; //项目剩余金额
var minAmount; //项目起投金额
var allInvestAmount; //全投金额
var awardsId = "";
var overDateTime2;
var isShow = true;
var awardsAmount; //抵用券金额
var awardsAmountMax; //抵用券最大金额
var selectedLength = 0; //抵用券选中数量
var selectedAmount = 0; //抵用券选中金额
var selectedLengthT; //推荐抵用券数量
var selectedAmountT; //推荐抵用券金额

var _isCheckFlag = false;
/*项目详情*/
$(function() {
	if(token != null && token.trim() != "") {

		$.ajax({
			url: ctxpath + "/user/getUserInfo",
			type: "post",
			dataType: "json",
			data: {
				from: '2',
				token: token
			},
			success: function(result) {
				console.log("出借:" + JSON.stringify(result))
				if(result.state == '0') {
					userInfo = result.data;
					bindCard = userInfo.cgbBindBankCardState;

					isTest = userInfo.isTest
				} else if(result.state == '4') {
					$.cookie('token', null);
					mask_login();
				}

			}
		});
		//项目介绍
		getProjectInfo();
		//获取账户余额
		$.ajax({
			url: ctxpath + "/user/getcgbUserAccount ",
			type: 'post',
			dataType: 'json',
			data: {
				from: '2',
				token: token
			},
			success: function(json) {
				if(json.state == 0) {
					availableAmount = formatCurrency(json.data.availableAmount);
					$("#available_money").html(availableAmount);
					while(availableAmount.indexOf(",") > 0) {
						availableAmount = availableAmount.replace(",", "");
					}
				} else {
					$.cookie('token', null);
					mask_login();
				}
			}
		});

	} else {
		mask_login();
	}
});

function getProjectInfo() {
	$.ajax({
		url: ctxpath + "/project/getProjectInfoWap",
		type: 'post',
		dataType: 'json',
		data: {
			from: '2',
			projectid: projectId
		},
		success: function(json) {
			// 查找成功.
			if(json.state == 0) {
				var data = json.data;
				var rate = toFixed2(data.rate);
				$("#minamount").html(data.minamount);

				$("#rate").html(rate + "%");
				/*隐藏区域*/
				$("#project_amount").val(data.amount); // 项目融资金额
				$("#project_rate").val(data.rate); // 利息
				$("#loan_date").val(data.loandate); // 放款日期
				$("#project_span").val(data.span); // 项目期限
				$("#project_amount").val(data.amount); // 项目融资金额
				$("#project_rate").val(data.rate); // 利息
				$("#loan_date").val(data.loandate); // 放款日期
				$("#project_id").val(projectId);
				$("#project_minamount").val(data.minamount); // 起投金额
				$("#project_maxamount").val(data.maxamount); // 最大金额
				$("#project_stepamount").val(data.stepamount); // 递增金额
				$("#project_balanceamount").val(data.balanceamount); // 可出借金额
				if(data.projectProductType == 1) {
					$("#porFile").attr("href", "invest_mine_agreement.html");
				} else if(data.projectProductType == 2) {
					$("#porFile").attr("href", "invest_mine_agreement_scf.html");
				}
				var max_amount = data.maxamount;
				var project_available_amount = data.balanceamount;
				if(project_available_amount < max_amount) {
					$("#maxamount").html("剩余最高可投金额" + project_available_amount + "元");
				} else {
					$("#maxamount").html("单笔最高出借金额" + max_amount + "元");
				}
				isCanUseCoupon = data.isCanUseCoupon; //优惠券是否可用 0 1不可用
			} else {
				console.log(json.data.message);
			}
		}

	});

}

//确定按钮
$("#setting_submite").click(function() {
	user_invest();
	// use_test_invest();
});

function use_test_invest() {

	if(!_isCheckFlag) {
		getMsg("请勾选并同意相关协议后再进行出借");
		return;
	} else {
		getMsg("你已经勾选并同意相关协议后再进行出借");
		return ; 
	}
}

//是否 、绑卡  否
$(".refuse").click(function() {
	$(".mask_bank_two,.mask_backdrop,.mask_risk").hide();

	$(".invet_mask_wrap").removeClass("active");
});

/**
 * 描述: 当前系统日期字符串. <br>
 */
function nowDate() {
	var nowDate = new Date();
	// 日.
	var day = nowDate.getDate();
	// 月(0-11，0代表1月份).
	var month = nowDate.getMonth();
	//年(完整的年份4位).
	var year = nowDate.getFullYear();
	return year + '-' + (month + 1) + '-' + day;
}

/**
 * 描述: 出借日期距离放款日期的天数. <br>
 */
function calcDays() {
	// 放款日期.
	var loanDate = $("#loan_date").val();
	// 当前系统日期.
	var currentDate = nowDate();
	// 出借日期距离放款日期的天数.
	var days = calcDateDiff(currentDate, loanDate);
	return days;
}

/**
 * 描述: 计算出借日期与放款日期之间的天数. <br>
 */
function calcDateDiff(currentDate, loanDate) {
	var type1 = typeof currentDate,
		type2 = typeof loanDate;
	if(type1 == 'string')
		currentDate = stringToTime(currentDate);
	else if(currentDate.getTime)
		currentDate = currentDate.getTime();
	if(type2 == 'string')
		loanDate = stringToTime(loanDate);
	else if(loanDate.getTime)
		loanDate = loanDate.getTime();
	if(currentDate > loanDate) {
		return 0;
	}
	return(loanDate - currentDate) / (1000 * 60 * 60 * 24); // 结果是秒
}

Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if(index > -1) {
		this.splice(index, 1);
	}
};

function showEarnints() {
	var amount = $("#invest_input").val();
	var span = $("#project_span").val();
	var rate = $("#project_rate").val();
	//	var days = calcDays();
	//	span = parseInt(span) + parseInt(days);
	var interest = amount * rate / 36500;
	interest = toDecimal2(interest);

	interest = toDecimal2(interest * parseFloat(span));

	$("#mask_expect").html(formatCurrency(interest));

	if(token != null && token.trim().length > 0) {
		myCouponList(amount);
	}
}

/**
 * 显示用户出借金额可用抵用券列表
 * @param {Object} amount
 */
function myCouponList(amount) {
	if(isCanUseCoupon == 0) {

		$.ajax({
			url: ctxpath + "/activity/getUserAwardsHistoryList",
			type: 'post',
			dataType: 'json',
			data: {
				from: '2',
				token: token,
				state: '1',
				projectId: projectId
			},
			success: function(json) {
				if(json.state == 4) {
					$.cookie('token', null);
					console.log("系统超时！");
					mask_login();
				}
				if(json.state == 0) {
					vouid.splice(0, vouid.length);
					vouidT = new Array();
					vouidT2 = new Array();
					var awards = json.data.awardsList;
					if(awards != null && awards.length > 0) {
						selectedLength = 0;
						selectedAmount = 0;
						awardsLength = awards.length;
						var couponLength = 0;
						awardsAmount = Math.floor(amount / 1000) * 10; //抵用券金额
						awardsAmountMax = awardsAmount;
						$.each(awards, function(index, item) {
							var limit_amount = item.limitAmount;
							var overDateTime = item.overdueDate;
							var nowDateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
							if(amount >= limit_amount && compareTo(nowDateTime, overDateTime)) {
								var value = item.value;
								if(awardsAmount >= value) {
									//选中当前优惠券
									awardsAmount -= value;
									selectedLength++;
									selectedAmount += value;
									vouid.push(item.id);
									console.log(vouid);

									if(awardsAmount < 10) {

										return true;
									}
								}
							}

						});
						selectedLengthT = selectedLength;
						selectedAmountT = selectedAmount;
						$.each(vouid, function(index, item) {
							vouidT.push(item);
							vouidT2.push(item);
						});
						awardsAmountMaxOn = awardsAmountMax - awardsAmount;
						$("#awardsValue").html("<span><em class='font_size30'>已选择" + selectedLength + "张(最优方案)</em><i class='font_size26'>抵扣支付金额" + selectedAmount + "元</i></span>");
					}
				}
			}
		});
	} else {
		console.log("优惠券不可用");
	}
}

/*back_coupon*/
//优惠券点击
$("#coupon").click(function() {

	if(awardsLength == '0') {
		getMsg("没有符合当前金额的优惠券")
	} else {
		addVouids();
		$(".mask_counpon").addClass("active");
	}
});

//选中优惠券
$(".back_coupon").click(function() {
	if(vouidT.sort().toString() == vouidT2.sort().toString()) {
		$("#awardsValue").html("<span><em>已选择" + selectedLengthT + "张(最优方案 )</em><i class='font_size24'>抵扣支付金额" + selectedAmountT + "元</i></span>");
	} else {
		$("#awardsValue").html("<span><em>已选择" + selectedLengthT + "张</em><i class='font_size24'>抵扣支付金额" + selectedAmountT + "元</i></span>");
	}
	vouid = vouidT;
	$(".mask_counpon").removeClass("active");
});

$("#vouidOk").click(function() {
	vouidT = vouid;
	selectedLengthT = selectedLength;
	selectedAmountT = selectedAmount;
	$("#awardsValue").html("<span><em>已选择" + selectedLength + "张</em><i class='font_size24'>抵扣支付金额" + selectedAmount + "元</i></span>");
	$(".mask_counpon").removeClass("active");
});

//渲染优惠券列表
function addVouids() {
	$.ajax({
		url: ctxpath + "/activity/getUserAwardsHistoryList",
		type: 'post',
		dataType: 'json',
		data: {
			from: '2',
			token: token,
			state: '1',
			projectId: projectId
		},
		success: function(json) {
			if(json.state == 4) {
				$.cookie('token', null);
				console.log("系统超时！");
				mask_login();
			}
			if(json.state == 0) {
				$("#awardsRecommend").html("");
				$("#awardsNormal").html("");
				var awards = json.data.awardsList;
				if(awards != null && awards.length > 0) {
					var str = "";
					var str2 = "";

					$.each(awards, function(index, item) {
						$.each(vouid, function(index2, item2) {
							if(item.id == item2) {
								str += '<div class="counpon_new counpon_selected" onclick="saveAwardsId(' + index + ',' + item.value + ',' + item.type + ')">' +
									'<input type="hidden" id = "' + index + '" value="' + item.id + '" >' +
									'<input type="hidden" id = "a' + index + '" value="' + item.overdueDate + '" >' +
									'<input type="hidden" id = "b' + index + '" value="' + item.value + '" >' +
									'<dl>' +
									'<dt class="font_size40">抵用券</dt>' +
									'<dd class="font_size28">' + item.spans + '</dd>' +
									'<dd class="font_size28">出借满' + item.limitAmount + '元可用</dd>' +
									'<span class="font_size44">¥' + item.value + '</span>' +
									'</dl>' +
									'<h6 class="font_size24"><i class="fl"></i><span class="fl">' + item.getDate + '至' + item.overdueDate + '</span></h6>' +
									'</div>';
								return false;

							} else if(index2 + 1 == vouid.length) {
								str2 += '<div class="counpon_new" onclick="saveAwardsId(' + index + ',' + item.value + ',' + item.type + ')">' +
									'<input type="hidden" id = "' + index + '" value="' + item.id + '" >' +
									'<input type="hidden" id = "a' + index + '" value="' + item.overdueDate + '" >' +
									'<dl>' +
									'<dt class="font_size40">抵用券</dt>' +
									'<dd class="font_size28">' + item.spans + '</dd>' +
									'<dd class="font_size28">出借满' + item.limitAmount + '元可用</dd>' +
									'<span class="font_size44">¥' + item.value + '</span>' +
									'</dl>' +
									'<h6 class="font_size24"><i class="fl"></i><span class="fl">' + item.getDate + '至' + item.overdueDate + '</span></h6>' +
									'</div>';
							}
						});

					});
					$("#awardsRecommend").html(str);
					$("#awardsNormal").html(str2);
				}
			}
		}
	});
}

/**
 * 描述: 日期字符串转换成Time. <br>
 */
function stringToTime(str) {
	var f = str.split(' ', 2);
	var d = (f[0] ? f[0] : '').split('-', 3);
	var t = (f[1] ? f[1] : '').split(':', 3);
	return(new Date(parseInt(d[0], 10) || null, (parseInt(d[1], 10) || 1) - 1, parseInt(d[2], 10) || null, parseInt(t[0], 10) || null, parseInt(t[1], 10) || null, parseInt(t[2], 10) || null)).getTime();
}

//保存使用的优惠券
function saveAwardsId(index, awardsValue, type) {
	$(".counpon_not_enough").hide();
	awardsId = $("#" + index + "").val();
	overDateTime2 = $("#a" + index + "").val();
	overDateTime2 = overDateTime2.substring(0, 10);
	if($("#" + index + "").parent().hasClass("counpon_selected")) {
		$("#" + index + "").parent().toggleClass("counpon_selected");
		selectedAmount -= awardsValue;
		selectedLength--;
		vouid.remove(awardsId);
	} else {
		var awardsAmount2 = selectedAmount + awardsValue;
		if(awardsAmount2 > awardsAmountMax) {
			$(".counpon_not_enough h4").html("抵扣金额最多不超过" + awardsAmountMax + "元")
			$(".counpon_not_enough").show();
			setTimeout(closeEro, 2000);
			return;
		} else {
			selectedAmount += awardsValue;
		}
		$("#" + index + "").parent().toggleClass("counpon_selected");
		selectedLength++;
		vouid.push(awardsId);
	}
	$("#awardsValue").html("<span><em>已选择" + selectedLength + "张 </em><i class='font_size24'>抵扣支付金额" + selectedAmount + "元</i><span>");

}

//关闭错误提示
function closeEro() {
	$(".counpon_not_enough").hide();
}

//出借弹窗提示
function investWindow() {
	if(token != null && token != "") {
		$(".mask_backdrop").show();
		$(".invet_mask_wrap").addClass("active");
		$("#invest_input").val("");
		$("#mask_expect").html("0.00");
		$("#awardsValue").html("您有0张可用优惠券");
	} else {

		$(".mask_login_tip,.mask_backdrop").show();
	}
}

//充值业务逻辑
$("#pay").click(function() {

	if(bindCard == '2') {
		window.location.href = "account_recharge.html";
	} else {

		$(".mask_bank_two,.mask_backdrop").show();
	}
});
//拒绝开户
$("#refuseBankcard").click(function() {
	$(".mask_bank_two,.mask_backdrop").hide();
})

/**
 * 用户出借逻辑
 */
function user_invest() {
	// 校验token 是否存在，不存在去登录页面
	if(token == null || token.trim().length <= 0) {
		mask_login();
		return;
	}

	//判断是否绑卡
	if(bindCard != '2') { //未绑卡
		$(".mask_bank_two,.mask_backdrop").show();
		return;
	}
	//判断用户是否风险评测
	if(isTest == 0) { //未评测
		$(".mask_risk,.mask_backdrop").show();
		return;
	}

	// 看用户是否输入出借金额
	var amount = $("#invest_input").val();
	amount = amount.trim();
	var type = /^[0-9]*[1-9][0-9]*$/; // 正整数校验
	var re = new RegExp(type);

	if(amount == null || amount.trim().length <= 0) {

		getMsg("请输入出借金额");
		return;
	}

	var projectId = $("#project_id").val();

	if(parseFloat(amount) > parseFloat(availableAmount)) {
		// 出借金额大于账户可用余额
		getMsg("账户余额不足,请先进行充值");
		return;
	}
	var project_available_amount = $("#project_balanceamount").val(); // 项目剩余金额
	var min_amount = $("#project_minamount").val(); // 1000    起投金额
	var max_amount = $("#project_maxamount").val(); // 500000 最大金额
	var step_amount = $("#project_stepamount").val(); // 100  递增金额
	var spot_amount = project_available_amount - amount; //小数点金额
	// 最后一次出借逻辑
	if(parseFloat(project_available_amount) < parseFloat(min_amount)) {
		if(parseFloat(amount) < parseFloat(project_available_amount)) {
			getMsg("所投金额小于剩余可投金额，请一次性输入剩余可投金额");
			return;
		}

		if(parseFloat(amount) > parseFloat(project_available_amount)) {
			getMsg("所投金额大于剩余可投金额，请一次性输入剩余可投金额");
			return;
		}

	}
	// 正常出借逻辑
	else {
		if(parseFloat(amount) < parseFloat(min_amount)) {
			getMsg("所投金额请不小于起投金额");
			return;
		}
		if(parseFloat(amount) > parseFloat(project_available_amount)) {
			getMsg("输入金额请不大于项目剩余可投金额");
			return;
		}

		if(parseFloat(amount) % parseFloat(step_amount) != 0 && parseFloat(amount) != parseFloat(project_available_amount)) {

			getMsg("请输入" + step_amount + "的整数倍金额");
			return;

		}
		if(parseFloat(amount) > parseFloat(max_amount)) {
			getMsg("所投金额请不大于单笔最高出借金额");
			return;
		}
		if(parseFloat(spot_amount) < parseFloat(100) && parseFloat(amount) != parseFloat(project_available_amount)) {
			$(".mask_backdrop,.mask_spot").show();
			$("#spot_min").html(parseFloat(100));
			var spotMax = parseInt(project_available_amount - 100);
			spotMax = parseInt(spotMax / 100);
			spotMax = spotMax * 100;
			$("#spot_max").html(spotMax);
			return;
		}

	}

	//判断用户是否同意协议
	// var isAgree = isAgreement();
	if(!_isCheckFlag) {
		getMsg("请勾选并同意相关协议后再进行出借");
		return;
	} else {

		for(var i = 0; i < vouid.length; i++) {
			if(i == vouid.length - 1) {
				vouchers += vouid[i];
			} else {
				vouchers += vouid[i] + ",";
			}

		}

		$(".mask_wait,.mask_backdrop").show();
		setTimeout(function() {

			// $.ajax({
			// 	url: ctxpath + "/newinvest/userToInvest2_2_1",
			// 	type: 'post',
			// 	dataType: 'json',
			// 	async: false,
			// 	data: {
			// 		from: '2',
			// 		token: token,
			// 		amount: amount,
			// 		vouchers: vouchers,
			// 		projectId: projectId
			// 	},
			// 	traditional: true,
			// 	success: function(json) {
			// 		if(json.state == "0") {
			// 			var obj = json.data;
			// 			var data = obj.data;
			// 			var tm = obj.tm;
			// 			var merchantId = obj.merchantId;
			// 			var url = cgbpath;
			// 			$(".mask_wait,.mask_backdrop").show();
			// 			window.location.href = url + "?data= " + data + "&tm=" + tm + "&merchantId=" + merchantId;

			// 		} else if(json.state == "3") {

			// 			$(".mask_wait,.mask_backdrop").hide();
			// 			if(json.data == null) {
			// 				getMsg(json.message);
			// 			} else {
			// 				getMsg(json.message);

			// 			}
			// 		} else {
			// 			$(".mask_wait,.mask_backdrop").hide();
			// 			getMsg(json.message);
			// 			$.cookie('token', null);
			// 		}
			// 	}
			// });

			$.ajax({
				url: ctxpath + "/lanMaoTenderPre/userTender",
				type: 'post',
				dataType: 'json',
				async: false,
				data: {
					from: '2',
					token: token,
					amount: amount,
					vouchers: vouchers,
					projectId: projectId
				},
				traditional: true,
				success: function(json) {
					if(json.state == "0") {
						// var obj = json.data;
						// var data = obj.data;
						// var tm = obj.tm;
						// var merchantId = obj.merchantId;
						// var url = cgbpath;
						// $(".mask_wait,.mask_backdrop").show();
						// window.location.href = url + "?data= " + data + "&tm=" + tm + "&merchantId=" + merchantId;
						openPostWindow(json.data);

					} else if(json.state == "3") {

						$(".mask_wait,.mask_backdrop").hide();
						if(json.data == null) {
							getMsg(json.message);
						} else {
							getMsg(json.message);

						}
					} else {
						$(".mask_wait,.mask_backdrop").hide();
						getMsg(json.message);
						$.cookie('token', null);
					}
				}
			});
		}, 300);
	}

}

//关闭出借弹框
$(".close_mask").click(function() {

	$(".mask_backdrop").hide();
	$(".mask_invset_static").hide();
	$(".invet_mask_wrap").removeClass("active");
});

/*未登录 状态  登录操作*/
//登录按钮
$(".mask_login_btn").click(function() {
	$(".mask_login_tip,.mask_backdrop").hide();
	mask_login();
});

var check = true;
$(".inputRad").click(function() {
	// if($("#checkBox").attr("checked")){
	// 	_isCheckFlag = true;
	// }else {
	// 	_isCheckFlag = false;
	// }
	_isCheckFlag = !$("#checkBox").attr("checked");
	
	if(check) {
		$("#checkBox").attr("checked", "checked");
		$(this).children("label").addClass("cur");
		$("#checkNum").val(true);
		check = false;
		return;
	} else {

		$("#checkBox").attr("checked", false);
		$("#checkNum").val(false);
		$(this).children("label").removeClass("cur");
		check = true;
	}

});



//判断用户是否同意协议
function isAgreement() {
	var checkNum = $("#checkNum").val();
	if(checkNum) {
		$(".inputRad").children("label").addClass("cur");
		return true;
	} else {

		return false;
	}
}
//错误提示
function getMsg(str) {

	$(".mask_investNo_tip").show().html(str);
	setTimeout(function() {
		$(".mask_investNo_tip").hide();
	}, 2000);
}
/*ie8 、兼容模式下 trim方法*/
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, '');
}

function toDecimal2(x) {
	var f = parseFloat(x);
	if(isNaN(f)) {
		return false;
	}
	var f = Math.round(x * 100) / 100;
	var s = f.toString();
	var rs = s.indexOf('.');
	if(rs < 0) {
		rs = s.length;
		s += '.';
	}
	while(s.length <= rs + 2) {
		s += '0';
	}
	return s;
}

function toFixed2(num) {
	if(!(/(^[1-9]\d*$)/.test(num))) {
		return num = Math.floor(num * 100) / 100;

	} else {
		return num = toDecimal2(num)
	}
}

function checkNum(value) {
	var str = value;
	var len1 = str.substr(0, 1);
	var len2 = str.substr(1, 1);

	//如果第一位是0，第二位不是点，就用数字把点替换掉  
	if(str.length > 1 && len1 == 0 && len2 != '.') {
		str = str.substr(1, 1);
	}

	//第一位不能是.  
	if(len1 == '.' || len1 == 0) {
		str = '';
	}

	//限制只能输入一个小数点  
	if(str.indexOf(".") != -1) {
		var str_ = str.substr(str.indexOf(".") + 1);
		//限制只能输入一个小数点  
		if(str_.indexOf(".") != -1) {
			str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
		}
	}

	return str;
}

function checkBlus() {
	var rechargeMoney = $("#invest_input").val();
	var checkedValue = checkNum(rechargeMoney);
	$("#invest_input").val(checkedValue);
	$(".confirm_btn").addClass("cur");
	$(".confirm_btn").html("确认出借" + rechargeMoney + "元");
	showEarnints();
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
$("#close_spot").click(function() {
	$(".mask_backdrop,.mask_spot").hide();
	$("#invest_input").val("");
});
$("#submit_spot").click(function() {
	$(".mask_backdrop,.mask_spot").hide();
	var smAmountSpot = $("#project_balanceamount").val();
	$("#invest_input").val(smAmountSpot);
	$("#setting_submite").html("确认出借" + smAmountSpot + "元");
});