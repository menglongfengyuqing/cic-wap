jQuery.support.cors = true;
var pageNo = parseInt(1);
var pageSize = parseInt(8);

var isSend = true; //是否请求加载图片
$(function() {

	bouns(-1, pageNo, pageSize);
	getUserBouns();
	var startX = startY = endX = endY = 0;
	$(".points_con").bind('touchstart', function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//滑动起点的坐标
		startX = touch.pageX;
		startY = touch.pageY;
		// console.log("startX:"+startX+","+"startY:"+startY);
	});
	$(".points_con").bind("touchmove", function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//手势滑动时，手势坐标不断变化，取最后一点的坐标为最终的终点坐标
		endX = touch.pageX;
		endY = touch.pageY;
		// console.log("endX:"+endX+","+"endY:"+endY);
	})
	$(".points_con").bind("touchend", function(event) {
		var distanceX = endX - startX,
			distanceY = endY - startY;
		// console.log("distanceX:"+distanceX+","+"distanceY:"+distanceY);
		//移动端设备的屏幕宽度
		var clientHeight = document.documentElement.clientHeight;
		// console.log(clientHeight;*0.2);
		//判断是否滑动了，而不是屏幕上单击了
		if(startY != Math.abs(distanceY)) {
			if(Math.abs(distanceY) > $(".points_con").width() * 0.2) {
				distanceY > 0 ? someAction1() : someAction2();
			}

		}
		startX = startY = endX = endY = 0;
	})
	$(".point_tab li").eq(0).click(function() {
		$(".points_con ul").html("");
		$(".points_null").hide();
		$(this).addClass("cur").siblings().removeClass("cur");
		bouns(-1, pageNo, pageSize);
	});
	$(".point_tab li").eq(1).click(function() {
		$(this).addClass("cur").siblings().removeClass("cur");
		$(".points_con ul").html("");
		$(".points_null").hide();
		bouns(1, pageNo, pageSize);
	});
	$(".point_tab li").eq(2).click(function() {
		$(this).addClass("cur").siblings().removeClass("cur");
		$(".points_con ul").html("");
		$(".points_null").hide();
		bouns(2, pageNo, pageSize);
	});

});

function someAction1() {
	return false;
}

function someAction2() {
	pageNo = document.getElementById("pageNo").value;
	var last = document.getElementById("last").value;
	var bounsType = document.getElementById("type").value;
	if(parseInt(pageNo) > parseInt(last)) {

	} else {
		if(isSend) {
			bouns(bounsType, pageNo, pageSize);

		}

	}
}

//积分明细
function bouns(bounsType, pageNo, pageSize) {

	isSend = false;
	$.ajax({
		url: ctxpath + "/bouns/userBounsHistory ",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			token: token,
			pageNo: pageNo,
			pageSize: pageSize,
			bounsType: bounsType // 0 出借     1注册  2邀请好友  3签到   4积分抽奖 5 积分兑换  6好友出借返积分      全部-1   积分获得1,积分消耗2
		},
		success: function(json) {
			console.log(json)
			var currentType = document.getElementById("type").value;
			if(parseInt(currentType) != parseInt(bounsType)) {
				$(".points_con ul").html("");
			}
			if(json.state == 0) {

				document.getElementById("last").value = json.data.pageCount;
				document.getElementById("pageNo").value = json.data.pageNo + 1;
				var htm = "";
				document.getElementById("type").value = bounsType;
				if(json.data.userBounsHistory.length > 0) {
					$.each(json.data.userBounsHistory, function(index, item) {
						var amount = item.amount;
						if(amount < 0) {
							htm += '<li class="reduce">' +
								'<dl>' +
								'<dt class="fl font_size30">' + item.bounsType + '</dt>' +
								'<dd class="fr font_size30">' +amount + '</dd>'+
							   '<dd class="fl font_size26">' + item.createDate + '</dd>' +
							'</dl>' +
							'</li>';
						} else {
							if(amount!=0){
							htm += '<li class="add">' +
								'<dl>' +
								'<dt class="fl font_size30">' + item.bounsType + '</dt>'+
								'<dd class="fr font_size30">+' + amount + '</dd>'+
								 '<dd class="fl font_size26">' + item.createDate + '</dd>' +
							    '</dl>' +
							    '</li>';
							    	}
						}
						
					});

					$(".points_con ul").append(htm);
					$(".points_null").hide();
				} else {
					$(".points_null").show();
					
				}
				isSend = true;
			} else {
				mask_login();

			}
		}
	});
}

// 获得用户积分值
function getUserBouns() {
	$.ajax({
		url: ctxpath + "/bouns/userBouns",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token
		},
		success: function(result) {
			if(result.state == '0') {
				$("#userbouns").html(result.data.score + "分");
			} else {
				$.cookie('token', null);
				mask_login();
			}
		}
	});
}

/*暂无记录*/
function getNoneMsg() {
	$(".news_null_wrap").show();
}