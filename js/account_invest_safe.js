jQuery.support.cors = true;
var pageNo = parseInt(1);
var pageSize = parseInt(4);

$(function() {

	//我的出借列表
//	newInvest(pageNo, pageSize);
	inverstList(pageNo, pageSize);

	$(window).bind("scroll", function() {
		if($(document).scrollTop() + $(window).height() >= $(document).height()) {
			pageNo = document.getElementById("pageNo").value;
			var last = document.getElementById("last").value;
			//     		var bidHisState = document.getElementById("bidHisState").value;
			if(parseInt(pageNo) > parseInt(last)) {
				//     			$(".error_msg_wrap p").html("没有更多数据");
				//				$(".error_msg_wrap p").css("visibility", "visible");
				//     			setTimeout("getMsg()",2000);
			} else {
				inverstList(pageNo, pageSize);
			}
		}
	});
});

//我的新手标
//function newInvest(pageNo, pageSize) {
//	$.ajax({
//		url: ctxpath + "/user/getMyBidsdetailH5",
//		type: 'post',
//		dataType: 'json',
//		data: {
//			from: '1',
//			token: token,
//			projecttype: '2',
//			pageNo: pageNo,
//			pageSize: pageSize
//		},
//		success: function(json) {
//			if(json.state == 4) {
//				mask_login();
//			}
//			var htm = $(".account_invest_new").html();
//			//console.log(json.data);
//			if(json.state == 0) {
//				$.each(json.data.userBidHistoryList, function(index, value) {
//					var projectState = value.state;
//					var stateName = "";
//					if(projectState == 4) {
//						stateName = "投标中";
//					}
//					if(projectState == 6 || projectState == 5) {
//						stateName = "还款中";
//					}
//					if(projectState == 7) {
//						stateName = "已结束";
//					}
//					htm += '<div class="item_one_wrap  ">' +
//						'<div class="item_info_wrap">' +
//						'<h4 class="font_size30">' + value.projectName + '</h4>' +
//						'<div class="item_info_l fl">' +
//						'<em class="font_size46">' + value.rate + '<sub class="font_size28">%</sub></em>' +
//						'<span class="font-size26">预期出借利率</span>' +
//						'</div>' +
//						'<div class="item_info_c fl">' +
//						'<em class="font_size42">' + value.span + '天</em>' +
//						'<span class="font_size26">出借期限</span>' +
//						'</div>' +
//						'<div class="item_info_r fr">' +
//						'<a href="javaceript:;" class="font_size38">' + stateName + '</a>' +
//						'</div>' +
//						'</div>' +
//						'</div>'
//
//				});
//				$(".account_invest_new").html(htm);
//			}
//		}
//	});
//}

//我的出借
function inverstList(pageNo, pageSize) {
	$.ajax({
		url: ctxpath + "/user/getMyBidsdetailH5",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			token: token,
			projectProductType: '1',
			pageNo: pageNo,
			pageSize: pageSize
		},
		success: function(json) {
			if(json.state == 4) {
				mask_login();
			}
			document.getElementById("last").value = json.data.pageCount;
			document.getElementById("pageNo").value = json.data.pageNo + 1;
			//			document.getElementById("bidHisState").value = json.data.bidHisState;
			var htm = $(".account_invest_safe_wrap").html();
			//console.log(json.data);
			if(json.state == 0) {
				if(json.data.userBidHistoryList.length > 0) {
					$.each(json.data.userBidHistoryList, function(index, value) {
						var projectState = value.state;
						var stateName = "";
						if(projectState == 4) {
							stateName = "投标中";
						}
						if(projectState == 6) {
							stateName = "回款中";
						}
						if(projectState == 7) {
							stateName = "已结束";
						}
						htm += '<div class="item_one_wrap  ">' +
							'<div class="item_info_wrap">' +
							'<h4 class="font_size30">' + value.projectName+'('+value.sn + ')</h4>' +
							'<div class="item_info_l fl">' +
							'<em class="font_size46">' + value.rate + '<sub class="font_size28">%</sub></em>' +
							'<span class="font-size26">预期出借利率</span>' +
							'</div>' +
							'<div class="item_info_c fl">' +
							'<em class="font_size42">' + value.span + '天</em>' +
							'<span class="font_size26">出借期限</span>' +
							'</div>' +
							'<div class="item_info_r fr">' +
							'<a href="javaceript:;" class="font_size38">' + stateName + '</a>' +
							'</div>' +
							'</div>' +
							'</div>';

					});
					//				htm+='<div class="font_size26  tip_msg_p">* 市场有风险，出借需谨慎</div>';
					$(".account_invest_safe_wrap").html(htm);
				} 
				else {
					getNoneMsg();
				}
			}
		}
	});
}
/*没有出借项目*/
function getNoneMsg() {
	$(".news_null_wrap").show();
}