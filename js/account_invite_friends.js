$(function() {

	// 客户佣金信息
	customerBrokerageInfo();
	// --
	// customerInvestCount();
	
	getUserFriendsBouns();

});


/**
 * 描述: 客户佣金信息. <br>
 * 作者: Mr.云.李 <br>
 */
function customerBrokerageInfo() {

	// console.log("token = " + token);
	// 调用接口.
	$.ajax({
		url : ctxpath + "/activity/getInviteFriends",
		type : 'post',
		dataType : 'json',
		data : {
			token : token,
			from : '2'
		},
		success : function(json) {
			// 系统超时.
			if (json.state == 4) {
				// console.log("系统超时！");
                         mask_login();
			}
			// 接口调用成功.
			if (json.state == 0) {
				// 您已邀请好友××人.
				$("#inviteFriends").html(json.data.inviteFriends + "<em class='font_size30'>人</em>");
				// 您获得佣金××元.
//				$("#brokerage").html("您获得佣金" + json.data.brokerage + "元");
				// 生成邀请链接.
				$("#inviteLink").html(json.data.inviteLink);
			}
		}
	});
	
	
	$.ajax({
		url : ctxpath + "/user/getUserQRCode",
		type : 'post',
		dataType : 'json',
		data : {
			token : token,
			from : '2'
		},
		success : function(json) {
			// 系统超时.
			if (json.state == 4) {
				// console.log("系统超时！");
                         mask_login();
			}
			// 接口调用成功.
			if (json.state == 0) {
				// 您已邀请好友××人.
				$("#inviteFriendsEwm").attr("src",json.path);
				// 您获得佣金××元.
//				$("#brokerage").html("您获得佣金" + json.data.brokerage + "元");
				// 生成邀请链接.
				$("#inviteFriendsPhone").val(json.refCode);
			}
		}
	});
	
}


//获取用户推荐好友返利总积分
function getUserFriendsBouns(){
	// 调用接口.
	$.ajax({
		url: ctxpath + "/bouns/getUserFriendsBouns",
		type: 'post',
		dataType: 'json',
		data: {
			token: token,
			from: '2'
		},
		success: function(json) {
			// 系统超时.
			if(json.state == 4) {
				logout();
			}
			// 接口调用成功.
			if(json.state == 0) {
				$("#brokerage").html(json.data.bounsTotalAmount + "<em class='font_size30'>分</em>"); // 总积分

			}
		}
	});
}

/**
 * 描述: 客户出借人数. <br>
 * 作者: Mr.云.李 <br>
 */
//function customerInvestCount() {
//
//	// console.log("token = " + token);
//	// 调用接口.
//	$.ajax({
//		url : ctxpath + "/activity/getInviteInvestmentFriends",
//		type : 'post',
//		dataType : 'json',
//		data : {
//			token : token,
//			type : '0',
//			pageNo : '1',
//			pageSize : '4',
//			from : '2'
//		},
//		success : function(json) {
//			// 系统超时.
//			if (json.state == 4) {
//				// console.log("系统超时！");
//				mask_login();
//			}
//			// 接口调用成功.
//			if (json.state == 0) {
//				// console.log("接口调用成功！");
//				// 邀请好友出借人数.
//				// $("#invitation_invest_friends").html("好友出借人数 " + json.data.totalCount + "人");
//			}
//		}
//	});
//}