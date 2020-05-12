/**
 * 2016年9月份加息团活动.
 */
$(function() {

	// --
	myRateIncreasesTeamMembers();
	// --
	superiorRateIncreasesTeamMembers();

});

var urlToken = getArgumentsByName("token");
if(urlToken !='' &&urlToken !=null){
	token=urlToken;
}
/**
 * 描述: 我的加息团成员. <br>
 * 作者: Mr.云.李 <br>
 */
function superiorRateIncreasesTeamMembers() {

	$.ajax({
		url : ctxpath + "/activity/superiorRateIncreasesTeamMembers",
		type : 'post',
		dataType : 'json',
		data : {
			token : token,
			from : 'wap'
		},
		success : function(json) {
			// 系统超时.
			/*if (json.state == 4) {
				// console.log("系统超时！");
				window.location.href = "login.html";
			}*/
			// 接口调用成功.
			if (json.state == 0) {
				$("#superiorMembers").html("成员数：" + json.data.superiorMembers  + "人");
				$("#superiorInvestTotalMembers").html("出借总人数：" + json.data.superiorInvestTotalMembers  + "人");
				$("#superiorInvestTotalAmount").html("出借总额：" + json.data.superiorInvestTotalAmount  + "人");
				$("#sept_bg_04").hide();
				$("#sept_bg_03").show();
			}else{
				$("#sept_bg_04").show();
				$("#sept_bg_03").hide();	
				$(".static_yes").hide();
				$(".static_no").show();
			}
			
			var app = getArgumentsByName("app");
			if (app == 1 || app == "1") {
				$(".wap_tit").hide();
				$("#sept_bg_04").hide();
				$("#sept_bg_03").hide();

			}
		}
	});

}

/**
 * 描述: 我邀请的加息团成员. <br>
 * 作者: Mr.云.李 <br>
 */
function myRateIncreasesTeamMembers() {

	$.ajax({
		url : ctxpath + "/activity/myRateIncreasesTeamMembers",
		type : 'post',
		dataType : 'json',
		data : {
			token : token,
			from : 'wap'
		},
		success : function(json) {
			// 系统超时.
			/*if (json.state == 4) {
				// console.log("系统超时！");
				window.location.href = "login.html";
			}*/
			// 接口调用成功.
			if (json.state == 0) {
				$("#members").html("成员数：" + json.data.members  + "人");
				$("#investTotalMembers").html("出借总人数：" + json.data.investTotalMembers  + "人");
				$("#investTotalAmount").html("出借总额：" + json.data.investTotalAmount  + "人");
				$("#sept_bg_04").hide();
				$("#sept_bg_03").show();
			}else{
				$("#sept_bg_04").show();
				$("#sept_bg_03").hide();	
				$(".static_yes").hide();
				$(".static_no").show();
			}
			
			var app = getArgumentsByName("app");
			if (app == 1 || app == "1") {
				$(".wap_tit").hide();
				$("#sept_bg_04").hide();
				$("#sept_bg_03").hide();

			}
		}
	});

}