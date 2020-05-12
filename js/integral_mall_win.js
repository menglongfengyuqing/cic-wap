jQuery.support.cors = true;
var pageNo = parseInt(1);
var pageSize = parseInt(8);
var awardGetType=null;
var isTrue=null;
$(function() {

	userAwardList(pageNo, pageSize, null, null);
	var startX = startY = endX = endY = 0;
	$("#myAwardList").bind('touchstart', function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//滑动起点的坐标
		startX = touch.pageX;
		startY = touch.pageY;
		// console.log("startX:"+startX+","+"startY:"+startY);
	});
	$("#myAwardList").bind("touchmove", function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//手势滑动时，手势坐标不断变化，取最后一点的坐标为最终的终点坐标
		endX = touch.pageX;
		endY = touch.pageY;
		// console.log("endX:"+endX+","+"endY:"+endY);
	})
	$("#myAwardList").bind("touchend", function(event) {
		var distanceX = endX - startX,
			distanceY = endY - startY;
		// console.log("distanceX:"+distanceX+","+"distanceY:"+distanceY);
		//移动端设备的屏幕宽度
		var clientHeight = document.documentElement.clientHeight;
		// console.log(clientHeight;*0.2);
		//判断是否滑动了，而不是屏幕上单击了
		if(startY != Math.abs(distanceY)) {
			if(Math.abs(distanceY) > $("#myAwardList").width() * 0.2) {
				distanceY > 0 ? someAction1() : someAction2();
			}

		}
		startX = startY = endX = endY = 0;
	})
	$(".win_tab ul>li").click(function() {
		$(this).children(".win_tab_li").show();
		$(this).siblings().children(".win_tab_li").hide();
		$(this).addClass("cur").siblings().removeClass("cur");
	});
	$(".win_tab_li li").click(function() {
		$(this).addClass("cur").siblings().removeClass("cur");
		$(this).parent().parent().siblings("span").html($(this).html());
		$(".win_tab_li").hide(100);

	});

	$("#tab_fir_01").click(function() {
		clsNoneMsg();
		awardGetType=null;
		userAwardList(pageNo,pageSize, awardGetType, isTrue);
	});
	$("#tab_fir_02").click(function() {
		clsNoneMsg();
		awardGetType=1;
		userAwardList(pageNo,pageSize,awardGetType, isTrue);
	});
	$("#tab_fir_03").click(function() {
		clsNoneMsg();
		awardGetType=0;
		
		userAwardList(pageNo,pageSize, awardGetType, isTrue);
	});
	$("#tab_sec_01").click(function() {
		clsNoneMsg();
		isTrue=null;
		userAwardList(pageNo,pageSize, awardGetType, isTrue);
	});
	$("#tab_sec_02").click(function() {
		clsNoneMsg();

		isTrue=0;
		userAwardList(pageNo,pageSize, awardGetType, isTrue);
	});
	$("#tab_sec_03").click(function() {
		clsNoneMsg();
		
		isTrue=1;
		userAwardList(pageNo,pageSize, awardGetType,isTrue);
	});

});

function someAction1() {
	return false;
}

function someAction2() {
	pageNo = document.getElementById("pageNo").value;
	var last = document.getElementById("last").value;
	if(parseInt(pageNo) > parseInt(last)) {

	} else {
		userAwardList(pageNo, pageSize, awardGetType, isTrue);
	}
}

//我的奖品
function userAwardList(pageNo, pageSize, awardGetType, isTrue) {

	$.ajax({
		url: ctxpath + "/awardInfo/newUserAwardList",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			token: token,
			pageNo: pageNo,
			pageSize: pageSize,
			awardGetType: awardGetType, //0 抽奖 1 兑奖 null 全部
			isTrue: isTrue //0 实物 1抵用券 null-全部
		},
		success: function(json) {

			console.log(json)
			if(json.state == 0) {

				document.getElementById("last").value = json.data.pageCount;
				document.getElementById("pageNo").value = json.data.pageNo + 1;
				var htm = $('#myAwardList').html();
				if(json.state == 0 && json.data.awardlist.length > 0) {
					$.each(json.data.awardlist, function(index, value) {

						if(value.isTrue == 0) { //实体
							if(value.state == 0) {
								htm += "<div class='prize_win_one'>" +
									"<a href='integral_mall_order.html?userAwardId=" + value.myAwardId + "&awardId=" + value.awardId + "'>" +
									"<div class='prize_win_img fl'>" +
									"<img src='" + value.awardimgWeb + "'  alt='' onerror='imgError(this)'/>" +
									"</div>" +
									"<div class='prize_win_detalis fl'>" +
									"<h4 class='font_size30'>" + value.awardName + "</h4>" +
									"<h5 class='font_size26'>" + value.docs + "</h5>" +
									"<p><span class='font_size26'>兑换时间:" + value.awardDate + "</span></p>" +
									"<p><span class='font_size26'>失效时间:" + value.deadline + "</span></p>" +
									"</div>" +
									"<a href='integral_mall_order.html?userAwardId=" + value.myAwardId + "&awardId=" + value.awardId + "'  class='font_size22'>待下单</a>" +
									"</a>" +
									"</div>";
							} else if(value.state == 1) {
								htm += "<div class='prize_win_one' onclick='window.location.href=\"integral_mall_order.html?userAwardId=" + value.myAwardId + "'>" +
									"<a href='integral_mall_order.html?userAwardId=" + value.myAwardId + "&awardId=" + value.awardId + "'>" +
									"<div class='prize_win_img fl'>" +
									"<img src='" + value.awardimgWeb + "'  alt='' onerror='imgError(this)'/>" +
									"</div>" +
									"<div class='prize_win_detalis fl'>" +
									"<h4 class='font_size30'>" + value.awardName + "</h4>" +
									"<h5 class='font_size26'>" + value.docs + "</h5>" +
									"<p><span class='font_size26'>兑换时间:" + value.awardDate + "</span></p>" +
									"</div>" +
									"<a href='integral_mall_order.html?userAwardId=" + value.myAwardId + "'  class='font_size22'>已下单</a>" +
									"</a>" +
									"</div>";
							} else if(value.state == 2) {
								htm += "<div class='prize_win_one' onclick='window.location.href=\"integral_mall_order.html?userAwardId=" + value.myAwardId + "'>" +
									"<a href='integral_mall_order.html?userAwardId=" + value.myAwardId + "&awardId=" + value.awardId + "'>" +
									"<div class='prize_win_img fl'>" +
									"<img src='" + value.awardimgWeb + "'  alt='' onerror='imgError(this)'/>" +
									"</div>" +
									"<div class='prize_win_detalis fl'>" +
									"<h4 class='font_size30'>" + value.awardName + "</h4>" +
									"<h5 class='font_size26'>" + value.docs + "</h5>" +
									"<p><span class='font_size26'>兑换时间:" + value.awardDate + "</span></p>" +
									"</div>" +
									"<a href='integral_mall_order.html?userAwardId=" + value.myAwardId + "'   class='font_size22'>已发货</a>" +
									"</a>" +
									"</div>";
							} else if(value.state == 3) {
								htm += "<div class='prize_win_one default'>" +
									"<div class='prize_win_img fl'>" +
									"<img src='" + value.awardimgWeb + "'  alt='' onerror='imgError(this)'/>" +
									"</div>" +
									"<div class='prize_win_detalis fl'>" +
									"<h4 class='font_size30'>" + value.awardName + "</h4>" +
									"<h5 class='font_size26'>" + value.docs + "</h5>" +
									"<p><span class='font_size26'>兑换时间:" + value.awardDate + "</span></p>" +
									"</div>" +
									"<a href='javascript:;' class='font_size22 endPrize'>已结束</a>" +
									"</div>";

							} else if(value.state == 4) {
								htm += "<div class='prize_win_one default'>" +
									"<div class='prize_win_img fl'>" +
									"<img src='" + value.awardimgWeb + "'  alt='' onerror='imgError(this)'/>" +
									"</div>" +
									"<div class='prize_win_detalis fl'>" +
									"<h4 class='font_size30'>" + value.awardName + "</h4>" +
									"<h5 class='font_size26'>" + value.docs + "</h5>" +
									"<p><span class='font_size26'>兑换时间:" + value.awardDate + "</span></p>" +
									"</div>" +
									"<a href='javascript:;' class='font_size22'>已兑现</a>" +
									"</div>";

							} else if(value.state == 5) {
								htm += "<div class='prize_win_one default'>" +
									"<div class='prize_win_img fl'>" +
									"<img src='" + value.awardimgWeb + "'  alt='' onerror='imgError(this)'/>" +
									"</div>" +
									"<div class='prize_win_detalis fl'>" +
									"<h4 class='font_size30'>" + value.awardName + "</h4>" +
									"<h5 class='font_size26'>" + value.docs + "</h5>" +
									"<p><span class='font_size26'>兑换时间:" + value.awardDate + "</span></p>" +
									"</div>" +
									"<a href='javascript:;' class='font_size22'>已失效</a>" +
									"</div>";

							}

						} else { //虚拟

							if(value.state == 1) {
								htm += "<div class='prize_win_one' onclick='window.location.href=\"invest_home.html\"'>" +
									"<a href='invest_home.html'>" +
									"<div class='prize_win_img fl'>" +
									"<img src='" + value.awardimgWeb + "'  alt='' onerror='imgError(this)'/>" +
									"</div>" +
									"<div class='prize_win_detalis fl'>" +
									"<h4 class='font_size30'>" + value.awardName + "</h4>" +
									"<h5 class='font_size26'>" + value.docs + "</h5>" +
									"<p><span class='font_size26'>兑换时间:" + value.awardDate + "</span></p>" +
									"<p><span class='font_size26'>失效时间:" + value.deadline + "</span></p>" +
									"</div>" +
									"<a href='invest_home.html'  class='font_size22'>待使用</a>" +
									"</a>" +
									"</div>";
							} else if(value.state == 2) {
								htm += "<div class='prize_win_one default'>" +
									"<div class='prize_win_img fl'>" +
									"<img src='" + value.awardimgWeb + "'  alt='' onerror='imgError(this)'/>" +
									"</div>" +
									"<div class='prize_win_detalis fl'>" +
									"<h4 class='font_size30'>" + value.awardName + "</h4>" +
									"<h5 class='font_size26'>" + value.docs + "</h5>" +
									"<p><span class='font_size26'>兑换时间:" + value.awardDate + "</span></p>" +
									"</div>" +
									"<a href='javascript:;' class='font_size22'>已使用</a>" +
									"</div>";
								$(".prize_win_one").addClass("default");
							} else if(value.state == 3) {
								htm += "<div class='prize_win_one default'>" +
									"<div class='prize_win_img fl'>" +
									"<img src='" + value.awardimgWeb + "'  alt='' onerror='imgError(this)'/>" +
									"</div>" +
									"<div class='prize_win_detalis fl'>" +
									"<h4 class='font_size30'>" + value.awardName + "</h4>" +
									"<h5 class='font_size26'>" + value.docs + "</h5>" +
									"<p><span class='font_size26'>兑换时间:" + value.awardDate + "</span></p>" +
									"</div>" +
									"<a href='javascript:;'  class='font_size22'>已过期</a>" +
									"</div>";

							}
						}

					});
					$('#myAwardList').html(htm);
				} else {
					getNoneMsg();
					$('#myAwardList').html("");
				}
			} else {
				mask_login();

			}
		}
	});
}

/*暂无记录*/
function getNoneMsg() {
	$(".news_null_wrap").show();
	$('#myAwardList').html("");
	$(".prize_win_wrap,html,body").css("background", "#f8f8f8");
}
function clsNoneMsg() {
	$(".news_null_wrap").hide();
	$('#myAwardList').html("");

}


function imgError(image) {
	image.src = "images/integral_mall/default_02.png";
}