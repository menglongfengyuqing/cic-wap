var pageNo = parseInt(1);
var pageSize = parseInt(15);
$(function() {

	projectTypeSF(pageNo, pageSize);
	var startX = startY = endX = endY = 0;

	$(".new_item_v,.new_item_axt").bind('touchstart', function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//滑动起点的坐标
		startX = touch.pageX;
		startY = touch.pageY;
		// console.log("startX:"+startX+","+"startY:"+startY);
	});
	$(".new_item_v,.new_item_axt").bind("touchmove", function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//手势滑动时，手势坐标不断变化，取最后一点的坐标为最终的终点坐标
		endX = touch.pageX;
		endY = touch.pageY;

	})
	$(".new_item_v").bind("touchend", function(event) {
		var distanceX = endX - startX,
			distanceY = endY - startY;

		//移动端设备的屏幕宽度
		var clientHeight = document.documentElement.clientHeight;

		//判断是否滑动了，而不是屏幕上单击了
		if(startY != Math.abs(distanceY)) {
			if(Math.abs(distanceY) > clientHeight * 0.2) {
				distanceY > 0 ? someAction1() : someAction2();
			}

		}
		startX = startY = endX = endY = 0;
	})
	$(".new_item_axt").bind("touchend", function(event) {
		var distanceX = endX - startX,
			distanceY = endY - startY;
		//移动端设备的屏幕宽度
		var clientHeight = document.documentElement.clientHeight;

		//判断是否滑动了，而不是屏幕上单击了
		if(startY != Math.abs(distanceY)) {
			if(Math.abs(distanceY) > clientHeight * 0.2) {
				distanceY > 0 ? someAction1() : someAction3();
			}

		}
		startX = startY = endX = endY = 0;
	})

	function someAction2() {
		pageNo = document.getElementById("pageNo").value;
		var last = document.getElementById("last").value;

		if(parseInt(pageNo) > parseInt(last)) {
			//     			$(".no_news_traders_wrap p").html("没有更多数据");

		} else {
			projectTypeSF(pageNo, pageSize);
		}
	}

	function someAction1() {
		return;
	}

});

function someAction3() {
	pageNo = document.getElementById("pageNo").value;
	var last = document.getElementById("last").value;

	if(parseInt(pageNo) > parseInt(last)) {
		//     			$(".no_news_traders_wrap p").html("没有更多数据");

	} else {
		projectTypeAXT(pageNo, pageSize);
	}
}
//供应链
$("#project_supply").click(function() {
	$(".new_item_v .new_tj,.new_item_v .new_zc").html("");
	$(".new_item_axt .new_tj,.new_item_axt .new_zc").html("");
	$('html,body').animate({
		'scrollTop': 0
	}, 0);
	$(this).parent().addClass("cur").siblings().removeClass("cur");
	projectTypeSF(pageNo, pageSize);

});
//安心投
$("#project_peace").click(function() {
	$(".new_item_v .new_tj,.new_item_v .new_zc").html("");
	$(".new_item_axt .new_tj,.new_item_axt .new_zc").html("");
	$('html,body').animate({
		'scrollTop': 0
	}, 0);
	$(this).parent().addClass("cur").siblings().removeClass("cur");
	projectTypeAXT(pageNo, pageSize);
});

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
	num = toDecimal2(num);
	num = num.toString();
	num = num.substring(0, num.lastIndexOf('.') + 3);
	return num;
}

function projectTypeSF(pageNo, pageSize) {
	//供应链
	$.ajax({
		url: ctxpath + "/project/getProjectListWap",
		type: "post",
		dataType: "json",
		data: {

			from: '2',
			pageNo: pageNo,
			pageSize: pageSize,
			projectProductType: 2
		},
		success: function(json) {

			var dataTJ = json.data.listTJ;
			var dataZC = json.data.listZC;
			var str = $(".new_item_v .new_tj").html();
			var strNewZc = $(".new_item_v .new_zc").html();
			var currentSpan = $(".new_item_v .new_tj");
			var strNewZcSpan = $(".new_item_v .new_zc");
			if(json.state == "0") {
				document.getElementById("pageNo").value = json.pageNo + 1;
				document.getElementById("last").value = json.last;
				if(pageNo == 1) {
					$.each(dataTJ, function(index, project) {

						var currentAmount = parseFloat(project.currentAmount);
						var amount = parseFloat(project.amount);
						var percentage = currentAmount / amount * 100;
						var interestRateIncrease = project.interestRateIncrease; //加息利率
						interestRateIncrease = toFixed2(interestRateIncrease);
						var rate = toFixed2(project.annualRate);
						var ratePI = parseInt(rate);
						var ratePF = rate.toString().split(".")[1];

						if(currentAmount == amount) {
							percentage = 100;
						} else if(percentage >= 99.5) {

							percentage = 99;
						} else if(percentage < 0.5 && percentage > 0) {
							percentage = 1;
						} else {
							percentage = Math.round(percentage);
						}

						if(project.state == 3) {
							str = str + '<div class="preferred_item preferred_item_cur" onclick="jsUrl(\'' + project.id + '\');">' +
								'<dl>' +
								'<dt class="font_size30"><span class="fl">' + project.name + '(' + project.sn + ')' + '</span></dt>' +
								'<dd>';
							if(interestRateIncrease == 0) {
								str += '<div class="fl"><span><em class="font_size70">' + ratePI + '</em><i class="font_size40">.' + ratePF + '%</i></span><b class="font_size26">年化利率</b></div>';
							} else {
								var rateBase = rate - interestRateIncrease;
								rateBase = toFixed2(rateBase);
								var rateBasePI = parseInt(rateBase);
								var rateBasePF = rateBase.toString().split(".")[1];
								str += '<div class="fl"><span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span><b class="font_size26">年化利率</b></div>';

							}
							str += '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限</b></div>' +
								'</dd>' +
								'<dd>' +
								'<div class="progress fl">' +
								'<div class="outer">' +
								'<div class="inner" style="width: ' + percentage + '%"></div>' +
								'<div class="inner_cic" style="left: ' + percentage + '%"></div>' +
								'</div>' +
								'</div>' +
								'<div class="item_static font_size26 fl">即将上线</div>';

						} else if(project.state == 4 && checkDate(new Date().format("yyyyMMddhhmmss"), project.loanDate)) {
							str = str + '<div class="preferred_item preferred_item_overdue overdue_pr" onclick="jsUrl(\'' + project.id + '\');">' +
								'<dl>' +
								'<dt class="font_size30"><span class="fl">' + project.name + '(' + project.sn + ')' + '</span></dt>' +
								'<dd>';
							if(interestRateIncrease == 0) {
								str += '<div class="fl"><span><em class="font_size70">' + ratePI + '</em><i class="font_size40">.' + ratePF + '%</i></span><b class="font_size26">年化利率</b></div>';
							} else {
								var rateBase = rate - interestRateIncrease;
								rateBase = toFixed2(rateBase);
								var rateBasePI = parseInt(rateBase);
								var rateBasePF = rateBase.toString().split(".")[1];
								str += '<div class="fl"><span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span><b class="font_size26">年化利率</b></div>';
							}
							str += '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限</b></div>' +
								'</dd>' +
								'<dd>' +
								'<div class="progress fl">' +
								'<div class="outer">' +
								'<div class="inner" style="width: ' + percentage + '%"></div>' +
								'<div class="inner_cic" style="left: ' + percentage + '%"></div>' +
								'</div>' +
								'</div>' +
								'<div class="item_static font_size26 fl">已过期</div>';

						} else if(project.state == 4) {
							str = str + '<div class="preferred_item preferred_item_cur" onclick="jsUrl(\'' + project.id + '\');">' +
								'<dl>' +
								'<dt class="font_size30"><span class="fl">' + project.name + '(' + project.sn + ')' + '</span></dt>' +
								'<dd>';
							if(interestRateIncrease == 0) {
								str += '<div class="fl"><span><em class="font_size70">' + ratePI + '</em><i class="font_size40">.' + ratePF + '%</i></span><b class="font_size26">年化利率</b></div>';
							} else {
								var rateBase = rate - interestRateIncrease;
								rateBase = toFixed2(rateBase);
								var rateBasePI = parseInt(rateBase);
								var rateBasePF = rateBase.toString().split(".")[1];
								str += '<div class="fl"><span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span><b class="font_size26">年化利率</b></div>';
							}
							str += '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限</b></div>' +
								'</dd>' +
								'<dd>' +
								'<div class="progress fl">' +
								'<div class="outer">' +
								'<div class="inner" style="width: ' + percentage + '%"></div>' +
								'<div class="inner_cic" style="left: ' + percentage + '%"></div>' +
								'</div>' +
								'</div>' +
								'<div class="item_static font_size26 fl">已投' + percentage + '%</div>';
						}
						str = str + '</dd>' +
							'</dl>' +
							'</div>';

					});
					currentSpan.html(str);
				}

				//普通标
				$.each(dataZC, function(index, project) {
					var currentAmount = parseFloat(project.currentAmount);
					var amount = parseFloat(project.amount);
					var percentage = currentAmount / amount * 100;
					var interestRateIncrease = project.interestRateIncrease; //加息利率
					interestRateIncrease = toFixed2(interestRateIncrease);
					var rate = toFixed2(project.annualRate);
					var ratePI = parseInt(rate);
					var ratePF = rate.toString().split(".")[1];
					if(currentAmount == amount) {
						percentage = 100;
					} else if(percentage >= 99.5) {

						percentage = 99;
					} else if(percentage < 0.5 && percentage > 0) {
						percentage = 1;
					} else {
						percentage = Math.round(percentage);
					}
					if(project.state == 3) {
						strNewZc = strNewZc + '<div class="preferred_item" onclick="jsUrl(\'' + project.id + '\');">' +
							'<dl>' +
							'<dt class="font_size30"><span class="fl">' + project.name + '(' + project.sn + ')' + '</span></dt>' +
							'<dd>';

						if(interestRateIncrease == 0) {
							strNewZc += '<div class="fl"><span><em class="font_size70">' + ratePI + '</em><i class="font_size40">.' + ratePF + '%</i></span><b class="font_size26">年化利率</b></div>';
						} else {
							var rateBase = rate - interestRateIncrease;
							rateBase = toFixed2(rateBase);
							var rateBasePI = parseInt(rateBase);
							var rateBasePF = rateBase.toString().split(".")[1];
							strNewZc += '<div class="fl"><span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span><b class="font_size26">年化利率</b></div>';
						}
						strNewZc += '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限</b></div>' +
							'</dd>' +
							'<dd>' +
							'<div class="progress fl">' +
							'<div class="outer">' +
							'<div class="inner" style="width: ' + percentage + '%"></div>' +
							'<div class="inner_cic" style="left: ' + percentage + '%"></div>' +
							'</div>' +
							'</div>' +
							'<div class="item_static font_size26 fl">即将上线</div>';

					} else if(project.state == 4 && checkDate(new Date().format("yyyyMMddhhmmss"), project.loanDate)) {
						strNewZc = strNewZc + '<div class="preferred_item preferred_item_overdue" onclick="jsUrl(\'' + project.id + '\');">' +
							'<dl>' +
							'<dt class="font_size30"><span class="fl">' + project.name + '(' + project.sn + ')' + '</span></dt>' +
							'<dd>';
						if(interestRateIncrease == 0) {
							strNewZc += '<div class="fl"><span><em class="font_size70">' + ratePI + '</em><i class="font_size40">.' + ratePF + '%</i></span><b class="font_size26">年化利率</b></div>';
						} else {
							var rateBase = rate - interestRateIncrease;
							rateBase = toFixed2(rateBase);
							var rateBasePI = parseInt(rateBase);
							var rateBasePF = rateBase.toString().split(".")[1];
							strNewZc += '<div class="fl"><span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span><b class="font_size26">年化利率</b></div>';
						}

						strNewZc += '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限</b></div>' +
							'</dd>' +
							'<dd>' +
							'<div class="progress fl">' +
							'<div class="outer">' +
							'<div class="inner" style="width: ' + percentage + '%"></div>' +
							'<div class="inner_cic" style="left: ' + percentage + '%"></div>' +
							'</div>' +
							'</div>' +
							'<div class="item_static font_size26 fl">已过期</div>';
					} else if(project.state == 4) {
						strNewZc = strNewZc + '<div class="preferred_item " onclick="jsUrl(\'' + project.id + '\');">' +
							'<dl>' +
							'<dt class="font_size30"><span class="fl">' + project.name + '(' + project.sn + ')' + '</span></dt>' +
							'<dd>';
						if(interestRateIncrease == 0) {
							strNewZc += '<div class="fl"><span><em class="font_size70">' + ratePI + '</em><i class="font_size40">.' + ratePF + '%</i></span><b class="font_size26">年化利率</b></div>';
						} else {
							var rateBase = rate - interestRateIncrease;
							rateBase = toFixed2(rateBase);
							var rateBasePI = parseInt(rateBase);
							var rateBasePF = rateBase.toString().split(".")[1];
							strNewZc += '<div class="fl"><span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span><b class="font_size26">年化利率</b></div>';
						}

						strNewZc += '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限</b></div>' +
							'</dd>' +
							'<dd>' +
							'<div class="progress fl">' +
							'<div class="outer">' +
							'<div class="inner" style="width: ' + percentage + '%"></div>' +
							'<div class="inner_cic" style="left: ' + percentage + '%"></div>' +
							'</div>' +
							'</div>' +
							'<div class="item_static font_size26 fl">已投' + percentage + '%</div>';
					} else if(project.state == 5 || project.state == 6) {
						strNewZc = strNewZc + '<div class="preferred_item preferred_item_repayments" onclick="jsUrl(\'' + project.id + '\');">' +
							'<dl>' +
							'<dt class="font_size30"><span class="fl">' + project.name + '(' + project.sn + ')' + '</span></dt>' +
							'<dd>';
						if(interestRateIncrease == 0) {
							strNewZc += '<div class="fl"><span><em class="font_size70">' + ratePI + '</em><i class="font_size40">.' + ratePF + '%</i></span><b class="font_size26">年化利率</b></div>';
						} else {
							var rateBase = rate - interestRateIncrease;
							rateBase = toFixed2(rateBase);
							var rateBasePI = parseInt(rateBase);
							var rateBasePF = rateBase.toString().split(".")[1];
							strNewZc += '<div class="fl"><span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span><b class="font_size26">年化利率</b></div>';
						}
						strNewZc += '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限</b></div>' +
							'</dd>' +
							'<dd>' +
							'<div class="progress fl">' +
							'<div class="outer">' +
							'<div class="inner" style="width:100%"></div>' +
							'</div>' +
							'</div>' +
							'<div class="item_static font_size26 fl">还款中</div>';
					} else if(project.state == 7) {
						strNewZc = strNewZc + '<div class="preferred_item preferred_item_reimbursement" onclick="jsUrl(\'' + project.id + '\');">' +
							'<dl>' +
							'<dt class="font_size30"><span class="fl">' + project.name + '(' + project.sn + ')' + '</span></dt>' +
							'<dd>';
						if(interestRateIncrease == 0) {
							strNewZc += '<div class="fl"><span><em class="font_size70">' + ratePI + '</em><i class="font_size40">.' + ratePF + '%</i></span><b class="font_size26">年化利率</b></div>';
						} else {
							var rateBase = rate - interestRateIncrease;
							rateBase = toFixed2(rateBase);
							var rateBasePI = parseInt(rateBase);
							var rateBasePF = rateBase.toString().split(".")[1];
							strNewZc += '<div class="fl"><span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span><b class="font_size26">年化利率</b></div>';
						}

						strNewZc += '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限</b></div>' +
							'</dd>' +
							'<dd>' +
							'<div class="progress fl">' +
							'<div class="outer">' +
							'<div class="inner" style="width:100%"></div>' +
							'</div>' +
							'</div>' +
							'<div class="item_static font_size26 fl">已还款</div>';
					}
					strNewZc = strNewZc + '</dd>' +
						'</dl>' +
						'</div>';
				});
				strNewZcSpan.html(strNewZc);
			} else {
				window.location.href = "index.html";
			}
		}
	});
}

function projectTypeAXT(pageNo, pageSize) {
	$.ajax({
		url: ctxpath + "/project/getProjectListWap",
		type: "post",
		dataType: "json",
		data: {

			from: '2',
			pageNo: pageNo,
			pageSize: pageSize,
			projectProductType: 1
		},
		success: function(json) {

			var dataTJ = json.data.listTJ;
			var dataZC = json.data.listZC;
			var str = $(".new_item_axt .new_tj").html();
			var strNewZc = $(".new_item_axt .new_zc").html();
			var currentSpan = $(".new_item_axt .new_tj");
			var strNewZcSpan = $(".new_item_axt .new_zc");
			if(json.state == "0") {
				document.getElementById("pageNo").value = json.pageNo + 1;
				document.getElementById("last").value = json.last;
				if(pageNo == 1) {
					$.each(dataTJ, function(index, project) {

						var currentAmount = parseFloat(project.currentAmount);
						var amount = parseFloat(project.amount);
						var interestRateIncrease = project.interestRateIncrease; //加息利率
						interestRateIncrease = toFixed2(interestRateIncrease);
						var rate = toFixed2(project.annualRate);
						var ratePI = parseInt(rate);
						var ratePF = rate.toString().split(".")[1];
						if(project.state == 3) {
							str = str + '<div class="preferred_item preferred_item_cur" onclick="jsUrl(\'' + project.id + '\');">' +
								'<dl>' +
								'<dt class="font_size30"><span class="fl">' + project.name + '</span></dt>' +
								'<dd>';
							if(interestRateIncrease == 0) {
								str += '<div class="fl">' +
									'<span><em class="font_size70">' + ratePI + '</em><i class="font_size40">.' + ratePF + '%</i></span>' +
									'<b class="font_size26">年化利率</b>' +
									'</div>';
							} else {
								var rateBase = rate - interestRateIncrease;
								rateBase = toFixed2(rateBase);
								var rateBasePI = parseInt(rateBase);
								var rateBasePF = rateBase.toString().split(".")[1];
								str += '<div class="fl">' +
									'<span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span>' +
									'<b class="font_size26">年化利率</b>' +
									'</div>';
							}
							str = str + '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限<u>即将上线</u></b></div>';

						} else if(project.state == 4 && checkDate(new Date().format("yyyyMMddhhmmss"), project.loanDate)) {
							str = str + '<div class="preferred_item preferred_item_overdue overdue_pr" onclick="jsUrl(\'' + project.id + '\',\'' + project.loanDate + '\');">' +
								'<dl>' +
								'<dt class="font_size30"><span class="fl">' + project.name + '</span></dt>' +
								'<dd>';
								var rateBase = rate - interestRateIncrease;
								rateBase = toFixed2(rateBase);
								var rateBasePI = parseInt(rateBase);
								var rateBasePF = rateBase.toString().split(".")[1];
							if(interestRateIncrease == 0) {
								str += '<div class="fl">' +
									'<span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + ratePF + '%</i></span>' +
									'<b class="font_size26">年化利率</b>' +
									'</div>';
							} else {
								var rateBase = rate - interestRateIncrease;
								rateBase = toFixed2(rateBase);
								var rateBasePI = parseInt(rateBase);
								var rateBasePF = rateBase.toString().split(".")[1];
								
								str += '<div class="fl">' +
									'<span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span>' +
									'<b class="font_size26">年化利率</b>' +
									'</div>';
							}

							str += '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限<u>已过期</u></b></div>';

						} else if(project.state == 4) {
							str = str + '<div class="preferred_item preferred_item_cur" onclick="jsUrl(\'' + project.id + '\');">' +
								'<dl>' +
								'<dt class="font_size30"><span class="fl">' + project.name + '</span></dt>' +
								'<dd>';
							if(interestRateIncrease == 0) {
								str += '<div class="fl">' +
									'<span><em class="font_size70">' + ratePI + '</em><i class="font_size40">.' + ratePF + '%</i></span>' +
									'<b class="font_size26">年化利率</b>' +
									'</div>';
							} else {
								var rateBase = rate - interestRateIncrease;
								rateBase = toFixed2(rateBase);
								var rateBasePI = parseInt(rateBase);
								var rateBasePF = rateBase.toString().split(".")[1];
								str += '<div class="fl">' +
									'<span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span>' +
									'<b class="font_size26">年化利率</b>' +
									'</div>';
							}
							str += '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限<u>可加入</u></b></div>';
						}
						str = str + '</dd>' +
							'</dl>' +
							'</div>';

					});
					currentSpan.html(str);
				}
				//普通标
				$.each(dataZC, function(index, project) {
					var currentAmount = parseFloat(project.currentAmount);
					var amount = parseFloat(project.amount);
					var interestRateIncrease = project.interestRateIncrease; //加息利率
					interestRateIncrease = toFixed2(interestRateIncrease);
					var rate = toFixed2(project.annualRate);
					var ratePI = parseInt(rate);
					var ratePF = rate.toString().split(".")[1];

					if(project.state == 3) {
						strNewZc = strNewZc + '<div class="preferred_item" onclick="jsUrl(\'' + project.id + '\');">' +
							'<dl>' +
							'<dt class="font_size30"><span class="fl">' + project.name + '</span></dt>' +
							'<dd>';
						if(interestRateIncrease == 0) {
							strNewZc += '<div class="fl">' +
								'<span><em class="font_size70">' + ratePI + '</em><i class="font_size40">.' + ratePF + '%</i></span>' +
								'<b class="font_size26">年化利率</b>' +
								'</div>';
						} else {
							var rateBase = rate - interestRateIncrease;
							rateBase = toFixed2(rateBase);
							var rateBasePI = parseInt(rateBase);
							var rateBasePF = rateBase.toString().split(".")[1];
							strNewZc += '<div class="fl">' +
								'<span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span>' +
								'<b class="font_size26">年化利率</b>' +
								'</div>';
						}

						strNewZc += '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限<u>即将上线</u></b></div>';

					} else if(project.state == 4 && checkDate(new Date().format("yyyyMMddhhmmss"), project.loanDate)) {
						strNewZc = strNewZc + '<div class="preferred_item preferred_item_overdue" onclick="jsUrl(\'' + project.id + '\');">' +
							'<dl>' +
							'<dt class="font_size30"><span class="fl">' + project.name + '</span></dt>' +
							'<dd>';
						if(interestRateIncrease == 0) {
							strNewZc += '<div class="fl">' +
								'<span><em class="font_size70">' + ratePI + '</em><i class="font_size40">.' + ratePF + '%</i></span>' +
								'<b class="font_size26">年化利率</b>' +
								'</div>';
						} else {
							var rateBase = rate - interestRateIncrease;
							rateBase = toFixed2(rateBase);
							var rateBasePI = parseInt(rateBase);
							var rateBasePF = rateBase.toString().split(".")[1];
							strNewZc += '<div class="fl">' +
								'<span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span>' +
								'<b class="font_size26">年化利率</b>' +
								'</div>';
						}
						strNewZc += '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限<u>已过期</u></b></div>';

					} else if(project.state == 4) {
						strNewZc = strNewZc + '<div class="preferred_item" onclick="jsUrl(\'' + project.id + '\',\'' + project.loanDate + '\');">' +
							'<dl>' +
							'<dt class="font_size30"><span class="fl">' + project.name + '</span></dt>' +
							'<dd>';
						if(interestRateIncrease == 0) {
							strNewZc += '<div class="fl">' +
								'<span><em class="font_size70">' + ratePI + '</em><i class="font_size40">.' + ratePF + '%</i></span>' +
								'<b class="font_size26">年化利率</b>' +
								'</div>';
						} else {
							var rateBase = rate - interestRateIncrease;
							rateBase = toFixed2(rateBase);
							var rateBasePI = parseInt(rateBase);
							var rateBasePF = rateBase.toString().split(".")[1];
							strNewZc += '<div class="fl">' +
								'<span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span>' +
								'<b class="font_size26">年化利率</b>' +
								'</div>';
						}

						strNewZc += '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限<u>可加入</u></b></div>';

					} else if(project.state == 5 || project.state == 6) {
						strNewZc = strNewZc + '<div class="preferred_item preferred_item_repayments" onclick="jsUrl(\'' + project.id + '\',\'' + project.loanDate + '\');">' +
							'<dl>' +
							'<dt class="font_size30"><span class="fl">' + project.name + '</span></dt>' +
							'<dd>';
						if(interestRateIncrease == 0) {
							strNewZc += '<div class="fl">' +
								'<span><em class="font_size70">' + ratePI + '</em><i class="font_size40">.' + ratePF + '%</i></span>' +
								'<b class="font_size26">年化利率</b>' +
								'</div>';
						} else {
							var rateBase = rate - interestRateIncrease;
							rateBase = toFixed2(rateBase);
							var rateBasePI = parseInt(rateBase);
							var rateBasePF = rateBase.toString().split(".")[1];
							strNewZc += '<div class="fl">' +
								'<span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span>' +
								'<b class="font_size26">年化利率</b>' +
								'</div>';
						}

						strNewZc += '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限<u>还款中</u></b></div>';

					} else if(project.state == 7) {
						strNewZc = strNewZc + '<div class="preferred_item preferred_item_reimbursement" onclick="jsUrl(\'' + project.id + '\');">' +
							'<dl>' +
							'<dt class="font_size30"><span class="fl">' + project.name + '</span></dt>' +
							'<dd>';
						if(interestRateIncrease == 0) {
							strNewZc += '<div class="fl">' +
								'<span><em class="font_size70">' + ratePI + '</em><i class="font_size40">.' + ratePF + '%</i></span>' +
								'<b class="font_size26">年化利率</b>' +
								'</div>';
						} else {
							var rateBase = rate - interestRateIncrease;
							rateBase = toFixed2(rateBase);
							var rateBasePI = parseInt(rateBase);
							var rateBasePF = rateBase.toString().split(".")[1];
							strNewZc += '<div class="fl">' +
								'<span><em class="font_size70">' + rateBasePI + '</em><i class="font_size40">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span>' +
								'<b class="font_size26">年化利率</b>' +
								'</div>';
						}

						strNewZc = strNewZc + '<div class="fl"><span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span><b class="font_size26">借款期限<u>已还款</u></b></div>';
					}
					strNewZc = strNewZc + '</dd>' +
						'</dl>' +
						'</div>';
				});
				strNewZcSpan.html(strNewZc);
			} else {
				window.location.href = "index.html";
			}
		}
	});
}

function jsUrl(id) {
	window.location.href = "invest_details.html?id=" + id;
}