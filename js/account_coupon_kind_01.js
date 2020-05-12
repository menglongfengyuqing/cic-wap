$(function() {

	// --
	$(".account_kind_tab li").click(function(event) {
				$(this).addClass('cur').siblings().removeClass('cur');
			});
	// --
	accountRateCouponList(3);
	// --

});

// token.
var token = $.cookie('token');

/**
 * 描述: 客户加息券. <br>
 * 作者: Mr.云.李 <br>
 */
function accountRateCouponList(state) {

	// 调用客户优惠券接口.
	$.ajax({
		url : ctxpath + "/activity/getUserRateCouponList",
		type : 'post',
		dataType : 'json',
		data : {
			token : token,
			pageNo : '1',
			pageSize : '4',
			from : '2',
			state : state
		},
		success : function(json) {
			// 系统超时.
			if (json.state == 4) {
				// console.log("系统超时！");
				window.location.href = "login.html";
			}

			// --
			var rateCoupon = $('#rate_coupon_list');
			// 每次请求之前删除之前页面的缓存内容.
			rateCoupon.empty();

			// 接口调用成功.
			if (json.state == 0) {
				// console.log("接口调用成功！");
				var content = '';
				if (json.data.rateCouponList != null && json.data.rateCouponList.length > 0) {
					$.each(json.data.rateCouponList, function(index, item) {
						content += '<div class="account_counpon_wrap">';
						if(item.state == 1){
							// 可使用.
							content += '<div class="account_counpon_con_one cur account_counpon_02">';
						}
						if(item.state == 2){
							// 已使用.
							content += '<div class="account_counpon_con_one account_counpon_03 forbid_one forbid_two">';
						}
						if(item.state == 3){
							// 已过期.
							content += '<div class="account_counpon_con_one account_counpon_04 forbid_one forbid_two">';
						}
						content += '<h3 class="font_size56">' + item.rate + '%<span class="font_size30">加息</span></h3>';
						content += '<p class="font_size22">起投金额' + item.limitAmount + '元</p>';
						content += '<p class="font_size22">到期时间：' + item.overdueDate + '</p>';
						content += '</div></div>';
					});
					rateCoupon.append(content);
				} else {
					// --
				}
			}
		}
	});
}
