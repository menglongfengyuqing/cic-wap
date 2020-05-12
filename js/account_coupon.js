var couponType = '1';//1未使用，2已使用，3已过期
var pageNo = parseInt(1);
var pageSize = parseInt(7);
$(function() {


var startX = startY = endX = endY = 0;
	$(".account_coupon").bind('touchstart', function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//滑动起点的坐标
		startX = touch.pageX;
		startY = touch.pageY;
	});
	$(".account_coupon").bind("touchmove", function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//手势滑动时，手势坐标不断变化，取最后一点的坐标为最终的终点坐标
		endX = touch.pageX;
		endY = touch.pageY;
	})
	$(".account_coupon").bind("touchend", function(event) {
		var distanceX = endX - startX,
			distanceY = endY - startY;
		//移动端设备的屏幕宽度
		var clientHeight = document.documentElement.clientHeight;
		//判断是否滑动了，而不是屏幕上单击了
		if(startY != Math.abs(distanceY)) {
			console.log(Math.abs(distanceY));
			if(Math.abs(distanceY) > $(".account_coupon_list").width() * 0.2) {
				distanceY > 0 ? someAction1() : someAction2();
			}

		}
		startX = startY = endX = endY = 0;
	})
	// --
	accountCoupon(couponType,pageNo, pageSize);
	// --
});
function someAction2() {
	var pageNo = document.getElementById("pageNo").value;
	var last = document.getElementById("last").value;
//	var couponType=document.getElementById("couponType").value;
	if(parseInt(pageNo) > parseInt(last)) {
		//     			$(".error_msg_wrap p").html("没有更多数据");
		//				$(".error_msg_wrap p").css("visibility", "visible");
		//     			setTimeout("getMsg()",2000);
	} else {
		accountCoupon(couponType,pageNo, pageSize);
	}
}

function someAction1() {
	return;
}
// token.
var token = $.cookie('token');

function FormatDate (strTime) {
	strTime = strTime.replace(/-/g, "/");
    var date = new Date(strTime);
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
}

$(".item_select_tab li").click(function(){
	$(this).addClass("cur").siblings().removeClass("cur");
})

//抵用券筛选
$("#unUsed").click(function(){
	couponType = '1';
	clsNoneMsg();
	accountCoupon(couponType,pageNo, pageSize);
});
$("#used").click(function(){
	couponType = '2';
	clsNoneMsg();
	accountCoupon(couponType,pageNo, pageSize);
});
$("#overdue").click(function(){
	couponType = '3';
	clsNoneMsg();
	accountCoupon(couponType,pageNo, pageSize);
});

/**
 * 描述: 客户优惠券. <br>
 * 作者: Mr.云.李 <br>
 */
function accountCoupon(couponType,pageNo, pageSize) {

	// 调用客户优惠券接口.
	$.ajax({
		url : ctxpath + "/activity/getUserVouchersList",
		type : 'post',
		dataType : 'json',
		data : {
			token : token,
			from : '2',
			state : couponType,
			pageNo : pageNo,
			pageSize : pageSize
		},
		success : function(json) {
			// 系统超时.
			if (json.state == 4) {
				$.cookie('token', null);
				// console.log("系统超时！");
				mask_login();
			}
						
			// --
			var couponContent = $('.account_coupon_list');
			// 每次请求之前删除之前页面的缓存内容.
//			

			// 接口调用成功.
			if (json.state == 0) {
				// console.log("接口调用成功！");
				var content = "";
				if (json.data.vouchersList != null && json.data.vouchersList.length > 0) {
					$(".news_null_wrap").hide();
					if(couponType=='1'){//未使用
						$.each(json.data.vouchersList, function(index, item) {
							if(item.state=='1'){
									content +='<div class="counpon_new">'
											+'<dl>'
											+'<dt class="font_size40">抵用券</dt>'
											 +'<dd class="font_size28">'+item.spans+'</dd>' 
											+'<dd class="font_size28">出借满'+item.limitAmount+'元可用</dd>'
											+'<span class="font_size44">¥'+item.amount+'</span>'
											+'</dl>'
											+'<h6 class="font_size24"><i class="fl"></i><span class="fl">'+FormatDate(item.getDate)+'至'+FormatDate(item.overdueDate)+'</span></h6>'
											+'</div>';
							}
						});
					}
					if(couponType=='2'){//已使用
						$.each(json.data.vouchersList, function(index, item) {
							if(item.state=='2'){
									content +='<div class="counpon_new counpon_used">'
											+'<dl>'
											+'<dt class="font_size40">抵用券</dt>'
											+'<dd class="font_size28">'+item.spans+'</dd>' 
											+'<dd class="font_size28">出借满'+item.limitAmount+'元可用</dd>'
											+'<span class="font_size44">¥'+item.amount+'</span>'
											+'</dl>'
											+'<h6 class="font_size24"><i class="fl"></i><span class="fl">'+FormatDate(item.getDate)+'至'+FormatDate(item.overdueDate)+'</span></h6>'
											+'</div>';
							}
						});
					}
					if(couponType=='3'){//已过期
						$.each(json.data.vouchersList, function(index, item) {
							if(item.state=='3'){
									content +='<div class="counpon_new counpon_overdue">'
											+'<dl>'
											+'<dt class="font_size40">抵用券</dt>'
											+'<dd class="font_size28">'+item.spans+'</dd>' 
											+'<dd class="font_size28">出借满'+item.limitAmount+'元可用</dd>'
											+'<span class="font_size44">¥'+item.amount+'</span>'
											+'</dl>'
											+'<h6 class="font_size24"><i class="fl"></i><span class="fl">'+FormatDate(item.getDate)+'至'+FormatDate(item.overdueDate)+'</span></h6>'
											+'</div>';
							}
						});
					}

					couponContent.append(content);
						// --
			document.getElementById("last").value = json.data.last;
			document.getElementById("pageNo").value = Number(json.data.pageNo) + 1;
//			document.getElementById("couponType").value =couponType;
//			console.log(document.getElementById("couponType").value = json.state);
				} else {
					getNoneMsg();
				}
			}
		}
	});
}

/*暂无优惠券*/
function getNoneMsg() {
	$(".news_null_wrap").show();
}
function clsNoneMsg() {
	$('.account_coupon_list').empty();
	$(".news_null_wrap").hide();
}