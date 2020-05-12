$(function() {

	// --
	$(".account_kind_tab li").click(function(event) {
		$(this).addClass('cur').siblings().removeClass('cur');
	});
	// --
	accountVouchersList(3);
	// --

});

// token.
var token = $.cookie('token');

/**
 * 描述: 客户抵用券. <br>
 * 作者: Mr.云.李 <br>
 */
function accountVouchersList(state) {

	// 调用客户优惠券接口.
	$.ajax({
		url : ctxpath + "/activity/getUserVouchersList",
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
			var vouchers = $('#vouchers');
			// 每次请求之前删除之前页面的缓存内容.
			vouchers.empty();

			// 接口调用成功.
			if (json.state == 0) {
				// console.log("接口调用成功！");
				var content = '';
				if (json.data.vouchersList != null && json.data.vouchersList.length > 0) {
					$.each(json.data.vouchersList, function(index, item) {
						content += '<div class="account_counpon_wrap">';
						if(item.state == 1){
							// 可使用.
							content += '<div class="account_counpon_con_one cur account_counpon_01">';
						}
						if(item.state == 2){
							// 已使用.
							content += '<div class="account_counpon_con_one account_counpon_07 forbid_one forbid_two">';
						}
						if(item.state == 3){
							// 已过期.
							content += '<div class="account_counpon_con_one account_counpon_09 forbid_one">';
						}
						content += '<h3 class="font_size56">' + item.amount + '<span class="font_size30">元</span></h3>';
						content += '<p class="font_size22">起投金额' + item.limitAmount + '元</p>';
						content += '<p class="font_size22">到期时间：' + item.overdueDate + '</p>';
						content += '</div></div>';
					});
					vouchers.append(content);
				} else {
					// --
				}
			}
		}
	});
}