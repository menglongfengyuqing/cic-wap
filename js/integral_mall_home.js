var pageNo = '1';
var pageSize = '8';
var from = '2';
var isSend = true; //是否请求加载图片

$(function() {

	getAwardInfoList(pageNo, pageSize);
	getUserBouns();
	getCouponList(pageNo, 20);
	var startX = startY = endX = endY = 0;
	$("#hot").bind('touchstart', function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//滑动起点的坐标
		startX = touch.pageX;
		startY = touch.pageY;
		// console.log("startX:"+startX+","+"startY:"+startY);
	});
	$("#hot").bind("touchmove", function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//手势滑动时，手势坐标不断变化，取最后一点的坐标为最终的终点坐标
		endX = touch.pageX;
		endY = touch.pageY;
		// console.log("endX:"+endX+","+"endY:"+endY);
	})
	$("#hot").bind("touchend", function(event) {
		var distanceX = endX - startX,
			distanceY = endY - startY;
		// console.log("distanceX:"+distanceX+","+"distanceY:"+distanceY);
		//移动端设备的屏幕宽度
		var clientHeight = document.documentElement.clientHeight;
		// console.log(clientHeight;*0.2);
		//判断是否滑动了，而不是屏幕上单击了
		if(startY != Math.abs(distanceY)) {
			if(Math.abs(distanceY) > clientHeight * 0.2) {
				distanceY > 0 ? someAction1() : someAction2();
			}

		}
		startX = startY = endX = endY = 0;
	})

});
$(".login_close").click(function() {

	login_close_history();

});

function someAction2() {
	pageNo = document.getElementById("pageNo").value;
	var last = document.getElementById("last").value;

	if(parseInt(pageNo) > parseInt(last)) {

	} else {
		if(isSend) {
			getAwardInfoList(pageNo, pageSize);
		}

	}
}

function someAction1() {
	return;
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
				$("#myPoints").val(result.data.score);
				$("#myPoints").html(result.data.score + "分");
			} else {
				mask_login();
			}
		}
	});
}

function getAwardInfoList(pageNo, pageSize) {
	isSend = false;
	$.ajax({
		url: ctxpath + "/awardInfo/getNewAwardInfoList",
		type: "post",
		dataType: "json",
		data: {
			from: from,
			pageNo: pageNo,
			pageSize: pageSize,
			isTrue: '0',
		},
		success: function(result) {

			if(result.state == "4") {
				mask_login();
			}

			if(result.state == "0") {

				var isLock = result.islock;
				$("#islockVal").val(isLock);

				var str = $('#hot').html();
				var awardInfoList = result.data.awardlist;
				console.log(result.data);
				document.getElementById("pageNo").value = parseInt(result.data.pageNo) + 1;
				document.getElementById("last").value = result.data.pageCount;

				$.each(awardInfoList, function(index, item) {
					str += '<dl class="fl">' +
						'<dt>' +
						'<a href="integral_mall_product.html?id=' + item.awardId + '">' +
						'<img src="' + item.imgWap + '" alt="" onerror="imgError(this);">' +
						'</a>' +
						'</dt>' +
						'<dd>' +
						'<a href="integral_mall_product.html?id=' + item.awardId + '" class="font_size26 limit_word">' + item.name + '</a>' +
						'</dd>' +
						'<dd class="font_size26"><span class="font_size26">' + item.needAmount + '</span>积分</dd>' +
						'</dl>'

				})
				$('#hot').html(str);
				isSend = true;
			}
		}
	});
}

function getCouponList(pageNo, pageSize) {
	$.ajax({
		url: ctxpath + "/awardInfo/getNewAwardInfoList",
		type: "post",
		dataType: "json",
		data: {
			from: from,
			pageNo: pageNo,
			pageSize: pageSize,
			isTrue: '1',
		},
		success: function(result) {

			if(result.state == "4") {
				mask_login();
			}

			if(result.state == "0") {
				var str = $('#coupon').html();
				var awardInfoList = result.data.awardlist;
				$.each(awardInfoList, function(index, item) {
					str += '<dl class="fl">' +
						'<dt>' +
						'<a href="integral_mall_product.html?id=' + item.awardId + '">' +
						'<img src="' + item.imgWap + '" alt="" onerror="imgError(this);">' +
						'</a>' +
						'</dt>' +
						'<dd>' +
						'<a href="integral_mall_product.html?id=' + item.awardId + '" class="font_size26 limit_word">' + item.name + '</a>' +
						'</dd>' +
						'<dd class="font_size26"><span class="font_size26">' + item.needAmount + '</span>积分</dd>' +
						'</dl>'

				})
				$('#coupon').html(str);
			}
		}
	});
}

function imgError(image) {
	image.src = "images/find/default_03.png";
}
$("#isLock").click(function() {
	var isLock = $("#islockVal").val();
	if(isLock == 0) {
		$("#isLock a").attr("href", "integral_mall_game.html");
	} else if(isLock == 1) {
		$(".mask_investNo_tip").show();
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
		$("#isLock a").attr("href", "javascript:;");
	}
})