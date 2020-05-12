var pageNo = '1';
var pageSize = '5';
var state = '0';
var from = '2';

$(function() {
	if(token != null && token.trim().length > 0) {
		getMessage(state, pageNo, pageSize);
	} else {
		mask_login();
	}

	$(window).bind("scroll", function() {
		if($(document).scrollTop() + $(window).height() >= $(document).height()) {
			pageNo = document.getElementById("pageNo").value;
			var last = document.getElementById("last").value;

			if(parseInt(pageNo) > parseInt(last)) {
				setTimeout("getNoneMsg()", 2000);
			} else {
				getMessage(state, pageNo, pageSize);
			}
		}
	});
});

function getMessage(state, pageNo, pageSize) {
	$.ajax({
		url: ctxpath + "/station/stationList",
		type: 'post',
		dataType: 'json',
		data: {
			from: from,
			token: token,
			state: state,
			pageNo: pageNo,
			pageSize: pageSize
		},
		success: function(json) {
			if(json.state == "4") {
				mask_login();
			}
			if(json.state == "0") {
				var str = "";
				var messages = json.data.letters;
				document.getElementById("pageNo").value = parseInt(json.data.pageNo) + 1;
				document.getElementById("last").value = json.data.lastPage;
				if(messages.length > 0) {

					$.each(messages, function(index, item) {
						str += "</div><div class='news_group'>";
						if(item.state == '1') { //未读
							str += "<div class='news_group_top'>";
						} else { //已读
							str += "<div class='news_group_top news_icon_cur'>";
						}
						if(item.letterType == '1') {
							str += "<a class='font_size30 fl' href='account_traders_news_details.html?newsid=" + item.id + "'><span class='fl'>出借消息</span>";
						} else if(item.letterType == '2') {
							str += "<a class='font_size30 fl' href='account_traders_news_details.html?newsid=" + item.id + "'><span class='fl'>还款消息</span>";
						} else if(item.letterType == '3') {
							str += "<a class='font_size30 fl' href='account_traders_news_details.html?newsid=" + item.id + "'><span class='fl'>充值消息</span>";
						} else if(item.letterType == '4') {
							str += "<a class='font_size30 fl' href='account_traders_news_details.html?newsid=" + item.id + "'><span class='fl'>提现消息</span>";
						} else {
							str += "<a class='font_size30 fl' href='account_traders_news_details.html?newsid=" + item.id + "'><span class='fl'>消息消息</span>";
						}
						str += "<p class='font_size30 fl'>" + item.title + item.body + "</p>" +
							"<span class='font_size26 fr'>" + item.sendTime + "</span>" +
							"</a></div>" +
							"</div>";
					});

					$('.news_traders_wrap').html($('.news_traders_wrap').html() + str);
				} else {
					getNoneMsg();
				}
			}
		}
	});
}

function getNoneMsg() {
	$(".news_null_wrap").show();
	$(".mui-content,html,body").css("background","#f8f8f8");
}

// 一键已读
function changeLetterState() {
	if(token != null && token.trim().length > 0) {
		$.ajax({
			url: ctxpath + "/station/changeLetterState",
			type: 'post',
			dataType: 'json',
			data: {
				from: from,
				token: token
			},
			success: function(json) {
				if(json.state == "0") {
					window.location.reload();
				} else {
					mask_login();
				}
			}
		});
	} else {
		mask_login();
	}
}