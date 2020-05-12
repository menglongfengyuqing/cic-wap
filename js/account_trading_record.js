var pageNo = parseInt(1);
var pageSize = parseInt(8);
/**
 * 个人中心，交易记录.
 */
$(function() {
	// --
	accountTradingRecord(-1, pageNo, pageSize);
	// --

	// -- 

	var startX = startY = endX = endY = 0;
	$(".mui-content").bind('touchstart', function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//滑动起点的坐标
		startX = touch.pageX;
		startY = touch.pageY;
		// console.log("startX:"+startX+","+"startY:"+startY);
	});
	$(".mui-content").bind("touchmove", function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//手势滑动时，手势坐标不断变化，取最后一点的坐标为最终的终点坐标
		endX = touch.pageX;
		endY = touch.pageY;
		// console.log("endX:"+endX+","+"endY:"+endY);
	})
	$(".mui-content").bind("touchend", function(event) {
		var distanceX = endX - startX,
			distanceY = endY - startY;
		// console.log("distanceX:"+distanceX+","+"distanceY:"+distanceY);
		//移动端设备的屏幕宽度
		var clientHeight = document.documentElement.clientHeight;
		// console.log(clientHeight;*0.2);
		//判断是否滑动了，而不是屏幕上单击了
		if(startY != Math.abs(distanceY)) {
			if(Math.abs(distanceY) > $(".mui-content").width() * 0.2) {
				distanceY > 0 ? someAction1() : someAction2();
			}

		}
		startX = startY = endX = endY = 0;
	})

	$(".account_trading_record_tab li").click(function(event) {
		$(this).addClass('cur').siblings().removeClass('cur');
	});
	$("#item_01").click(function() {
		clsNoneMsg();
		accountTradingRecord(-1, 1, 8);
	});
	$("#item_02").click(function() {
		clsNoneMsg();
		accountTradingRecord(0, 1, 8);
	});
	$("#item_03").click(function() {
		clsNoneMsg();
		accountTradingRecord(1, 1, 8);
	});
	$("#item_04").click(function() {
		clsNoneMsg();
		accountTradingRecord(3, 1, 8);
	});
	$("#item_05").click(function() {
		clsNoneMsg();
		accountTradingRecord(4, 1, 8);
	});
});

function someAction1() {
	return;
}

function someAction2() {
	pageNo = document.getElementById("pageNo").value;
	var last = document.getElementById("last").value;
	var type = document.getElementById("type").value;
	if(parseInt(pageNo) > parseInt(last)) {
		//     			$(".error_msg_wrap p").html("没有更多数据");
		//				$(".error_msg_wrap p").css("visibility", "visible");
		//     			setTimeout("getMsg()",2000);
	} else {
		accountTradingRecord(type, pageNo, pageSize);
	}
}

/**
 * 描述: 账户中心，交易记录. <br>
 * 作者: Mr.云.李 <br>
 */
function accountTradingRecord(type, pageNo, pageSize) {

	// 调用客户账户接口.
	$.ajax({
		url: ctxpath + "/trans/getcgbUserTransDetailList",
		type: 'post',
		dataType: 'json',
		data: {
			token: token,
			pageNo: pageNo,
			pageSize: pageSize,
			from: '2',
			type: type
		},
		success: function(json) {
			// 系统超时.
			if(json.state == 4) {
				// console.log("系统超时！");
				mask_login();
			}
			// --
			var muiContent = $('.mui-content');
			// 每次请求之前删除之前页面的缓存内容.
			var currentType = document.getElementById("type").value;
			console.log('type:' + type);
			console.log(json.pramatype);
			console.log(currentType);
			if(parseInt(currentType) != parseInt(type)) {
				muiContent.empty();
			}

			// --

			// 接口调用成功.
			if(json.state == 0) {
				document.getElementById("last").value = json.data.last;
				document.getElementById("pageNo").value = json.data.pageNo + 1;
				document.getElementById("type").value = json.pramatype;

				console.log("pageNo:" + pageNo + "pageSize:" + pageSize);

				// console.log("接口调用成功！");
				var content = '';
				if(json.data.translist != null && json.data.translist.length > 0) {
					$(".news_null_wrap").hide();
					$.each(json.data.translist, function(index, item) {
						content += '<div class="record_trading">' +
							'<dl class="fl">';
						if(item.type == 0) {
							content += '<dt class="font_size30">充值</dt>';
						} else if(item.type == 1) {
							content += '<dt class="font_size30">提现</dt>';
						} else if(item.type == 2 || item.type == 3) {
							if(item.inouttype == 1) {
								var remark = item.remark;
								remark = remark.substring(0, 2);
								if(remark == "流标") {
									if(item.projectProductType == 2) {
										content += '<dt class="font_size30">' + item.name + '(' + item.sn + ')</dt><span class="font_size30">(流标)</span>';
									} else {
										content += '<dt class="font_size30">' + item.name + '</dt><span class="font_size30">(流标)</span>';
									}
								} else {
									if(item.projectProductType == 2) {
										content += '<dt class="font_size30">' + item.name + '(' + item.sn + ')</dt><span class="font_size30">(退款)</span>';
									} else {
										content += '<dt class="font_size30">' + item.name + '</dt><span class="font_size30">(退款)</span>';
									}
								}

							} else if(item.inouttype == 2) {
								if(item.projectProductType == 2) {
									content += '<dt class="font_size30">' + item.name + '(' + item.sn + ')</dt><span class="font_size30">(出借)</span>';
								} else {
									content += '<dt class="font_size30">' + item.name + '</dt><span class="font_size30">(出借)</span>';
								}
							}

						} else if(item.type == 4) {
							content += '<dt class="font_size30">还利息</dt>';
						} else if(item.type == 5) {
							content += '<dt class="font_size30">还本金</dt>';
						} else if(item.type == 7) {
							content += '<dt class="font_size30">活动返现</dt>';
						} else if(item.type == 9) {
							content += '<dt class="font_size30">佣金</dt>';
						} else if(item.type == 10) {
							content += '<dt class="font_size30">抵用券</dt>';
						}
						content += '<dd class="font_size26">' + item.tranddate + '</dd>' +
							'</dl>' +
							'<dl class="fr">';
						if(item.inouttype == 1) {
							content += '<dt class="font_size30 in">+' + item.amount + '</dt>';
						} else if(item.inouttype == 2) {
							content += '<dt class="font_size30 out">-' + item.amount + '</dt>';
						}

						content += '<dd class="font_size26">余额(元)：' + item.balancemoney + '</dd>' +
							'</dl>' +
							'</div>';
					});
					muiContent.append(content);
				} else {
					getNoneMsg();
				}
			}
		}
	});
}

/*暂无记录*/
function getNoneMsg() {
	$(".news_null_wrap").show();
	$(".mui-content,html,body").css("background", "#f8f8f8");
	$(".mui-content").css("paddingBottom", "0");
}

function clsNoneMsg() {
	$(".news_null_wrap").hide();
	$(".mui-content,html,body").css("background", "#fff");
	$(".mui-content").html("");

}