/**
 * 邀请积分获得详情.
 */
var pageNo = parseInt(1);
var pageSize = parseInt(10);
var isSend = true; //是否请求加载图片

$(function() {
	if(token == "" || token == null) {
		mask_login();
	} else {

		getBrokerageList(pageNo, pageSize);
	}

	var startX = startY = endX = endY = 0;
	$(".brokerage_list_wrap").bind('touchstart', function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//滑动起点的坐标
		startX = touch.pageX;
		startY = touch.pageY;
		// console.log("startX:"+startX+","+"startY:"+startY);
	});
	$(".brokerage_list_wrap").bind("touchmove", function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//手势滑动时，手势坐标不断变化，取最后一点的坐标为最终的终点坐标
		endX = touch.pageX;
		endY = touch.pageY;
		// console.log("endX:"+endX+","+"endY:"+endY);
	})
	$(".brokerage_list_wrap").bind("touchend", function(event) {
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

function someAction2() {
	pageNo = document.getElementById("pageNo").value;
	var last = document.getElementById("last").value;

	if(parseInt(pageNo) > parseInt(last)) {

	} else {
		if(isSend) {
			getBrokerageList(pageNo, pageSize);
		}

	}
}

function someAction1() {
	return;
}
/**
 * 描述:邀请好友列表页. <br>
 * Fern <br>
 */
function getBrokerageList(pageNo, pageSize) {

	isSend = false;

	$.ajax({
		url: ctxpath + "/user/getMyInviteList",
		type: 'post',
		dataType: 'json',
		data: {
			token: token,
			pageNo: pageNo,
			pageSize: pageSize,
			from: '2'
		},
		success: function(json) {
			var muiContent = $('.brokerage_list_wrap');
			// 每次请求之前删除之前页面的缓存内容.
			// muiContent.empty();
			// --
			document.getElementById("last").value = json.data.last;
			document.getElementById("pageNo").value = json.data.pageNo + 1;

			console.log("pageNo:" + pageNo + "pageSize:" + pageSize);

			// 系统超时.
			if(json.state == 4) {
				// console.log("系统超时！");
				mask_login();
			}

			// 接口调用成功.
			if(json.state == 0) {
				var content = '';
				if(json.data.uBounsHistoryList != null && json.data.uBounsHistoryList.length > 0) {
					$.each(json.data.uBounsHistoryList, function(index, item) {
						content += '<div class="invest_user_group"><ul class="invest_user_group_one">';
						content += '<li class="font_size30">' + item.phone + '</li>';
						content += '<li class="font_size30"><p class="font_size30">' + item.amount + '</p></li>';
						var createDate = item.createDate;
						createDate = createDate.substring(0, 10);
						content += '<li class="font_size30"><p class="font_size30">' + createDate + '</p></li>' +
							'</ul></div>';

					});
					muiContent.append(content);
					$("html,body").css("background", "#fff");

				} else {
					getNoneMsg();
					$("html,body").css("background", "#f2f2f2");
				}
				isSend = true;

			}
		}
	});

}

/*暂无积分记录*/
function getNoneMsg() {
	$(".news_null_wrap").show();
}