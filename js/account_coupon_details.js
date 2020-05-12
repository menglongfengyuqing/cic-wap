$(function() {
	var index = getArgumentsByName("number");
	// --
	accountCoupon(index);
	// --

});

// token.
var token = $.cookie('token');

function FormatDate (strTime) {
    var date = new Date(strTime);
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
}


/**
 * 描述: 客户优惠券. <br>
 * 作者: Mr.云.李 <br>
 */
function accountCoupon(index) {

	// 调用客户优惠券接口.
	$.ajax({
		url : ctxpath + "/activity/getUserAwardsHistoryList",
		type : 'post',
		dataType : 'json',
		data : {
			token : token,
			from : '2',
			state : '1'
		},
		success : function(json) {
			// 系统超时.
			if (json.state == 4) {
				// console.log("系统超时！");
				window.location.href = "login.html";
			}
			
			// --
			var couponContent = $('.account_coupon_one');
			// 每次请求之前删除之前页面的缓存内容.
			couponContent.empty();
			
			// 接口调用成功.
			if (json.state == 0) {
				// console.log("接口调用成功！");
				var content = '';
				if (json.data.awardsList != null && json.data.awardsList.length > 0) {
						var item = json.data.awardsList[index];
						if(item.type == 1){
							content += '<dl class="fl">';
							content += '<dt class="font_size24"><b class="font_size48">' + item.value +'现金券</b></dt>';
							content += '<dd class="clear font_size26">来源:新手注册奖励</dd>';
							content +='<dd class="font_size26">起始时间:'+FormatDate(item.getDate)+'</dd>';
							content += '<dd class="font_size26">截至时间:'+FormatDate(item.overdueDate) + '</dd>';
							content += '</dl>';
						}
						if(item.type == 2){
							content += '<dl class="fl">';
							content += '<dt class="font_size24"><b class="font_size48">' + item.value +'加息券</b></dt>';
							content += '<dd class="clear font_size26">来源:新手注册奖励</dd>';
							content +='<dd class="font_size26">起始时间:'+FormatDate(item.getDate)+'</dd>';
							content += '<dd class="font_size26">截至时间:'+FormatDate(item.overdueDate) + '</dd>';
							content += '</dl>';
						}
						
					couponContent.append(content);
				} else {
					// --
				}
			}
		}
	});
}