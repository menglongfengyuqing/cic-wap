jQuery.support.cors = true;
var pageNo = parseInt(1);
var pageSize = parseInt(8);
$(function() {

	accountTradingRecord(0, pageNo, pageSize);
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
			if(json.state == 0) {
				var recordList = json.data.translist;
				var str = "";
				if(recordList.length > 0) {
					$.each(recordList, function(index,item) {
						var amount=toFixed2(item.amount);
						var balancemoney=toFixed2(item.balancemoney);
						str += '<dl class="font_size30">' +
							'<dt class="fl">'+item.tranddate+'</dt>' +
							'<dd class="fr">' +
							'<span>充值金额:<em>元</em><b>'+amount+'</b></span>' +
							'<span>账户余额: <em>'+balancemoney+'元</em></span>' +
							'</dd>'+
							'</dl>';
					});
					$(".recharge_record").html(str);
				} else {
					getNoneMsg();
					$(".mui-content").hide();
				}
			}
			else{
				$.cookie('token', null);
			}

			document.getElementById("last").value = json.data.last;
			document.getElementById("pageNo").value = json.data.pageNo + 1;
			document.getElementById("type").value = json.pramatype;

		}

	});
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
function getNoneMsg() {
	$(".news_null_wrap").show();
	$(".mui-content,html,body").css("background","#f8f8f8");
}