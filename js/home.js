jQuery.support.cors = true;
var app = getArgumentsByName("app");
var pageNo = parseInt(1);
var pageSize = parseInt(10);
var projecttype = parseInt(2); //供应链
var orderBy = parseInt(0); //综合
$(function() {

	$.ajax({
		url: ctxpath + "/user/getUserInfo",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			token: token
		},
		success: function(result) {
			if(result.state == '0') {
				var signed = result.data.signed;
				if(signed == "3") {
					//$(".sign_btn").text("签到");
					$(".sign_btn").addClass("cur");
				} else if(signed == "2") {
					//$(".sign_btn").text("已签到");
					$(".sign_btn").removeClass("cur");
				}
			} else {
				$.cookie('token', null);
			}

		}

	});
	//guide 
	if(token != null && token.trim().length > 0) {
		$.ajax({
			url: ctxpath + "/activity/userGuidance",
			type: "post",
			dataType: "json",
			data: {
				from: '2',
				token: token,
				type: 0
			},
			success: function(result) {

				if(result.state == 0) {

					var data = result.data;

					if(data.step == 3) {
						$(".mask_backdrop,.mask_guide").show();
						$("#guide_tit").html("开通银行存管");
						$("#guide_con").html("开通银行存管，以便于帮您建立海口联合农商银行存管账户，您的资金会由海口联合农商银行负责存管。");
						$("#guide_btn").html("前往开通").attr("href", "account_setting_bankcard.html");
						$(".gudie_static li:nth-child(2)").removeClass("prev").addClass("cur");
						$(".gudie_static li:nth-child(3)").addClass("prev");
					} else if(data.step == 4) {
						$(".mask_backdrop,.mask_guide").show();
						$("#guide_tit").html("风险测评");
						$("#guide_con").html("请您进行风险测评，以便我们对您有更加全面的了解，为您推荐更加适合的产品。");
						$("#guide_btn").html("前往测评").attr("href", "zt_risk.html");
						$(".gudie_static li:nth-child(2),.gudie_static li:nth-child(3)").removeClass("prev").addClass("cur");
						$(".gudie_static li:nth-child(4)").addClass("prev");
					} else if(data.step == 5) {
						$(".guide_wrap").remove();
					} else if(data.step == 6) {
						$(".mask_backdrop,.mask_guide,.guide_wrap").hide();
					}
				} else if(result.state == 4) {
					$.cookie('token', null);
				}

			}

		});
	}
	//站内信是否未读
	$.ajax({
		url: ctxpath + "/station/letterState",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			token: token
		},
		success: function(result) {
			if(result.state == '0') {
				var letterState = result.data.letterState;
				if(letterState == "1") { //有未读消息
					$("#letterState").addClass("cur");
				} else if(letterState == "0") { //无未读消息
					$("#letterState").removeClass("cur");
				}
			} else {
				$.cookie('token', null);
			}

		}
	});

	//滚动banner
	$.ajax({
		url: ctxpath + "/cms/getCmsListByType",
		type: "post",
		dataType: "json",
		data: {
			pageNo: '1',
			pageSize: '10',
			type: '0',
			from: '1'
		},
		success: function(result) {
			if(result.state == "0") {
				var obj = result.data;
				var list = obj.cmsList;
				var str = '';
				var strli = '';
				$.each(list, function(index, value) {
					str += '<div>' +
						'<a href="' + value.text + '"><img src="' + value.imgPath + '" id="banner0" /></a>' +
						'</div>';
					strli += '<li class="' + index + '"></li>';

				});
				$(".swipe-wrap").html(str);
				$(".xiaoyuandian ul").html(strli);

				var haha = document.getElementById('huadonglunbo');
				window.mySwipe = Swipe(
					haha, {
						startSlide: 0,
						auto: 2000,
						continuous: true,
						disableScroll: true,
						stopPropagation: true,
						callback: function(index, element) {
							//circle
							$(".xiaoyuandian ul li").eq(index).addClass("cur").siblings().removeClass("cur");
						}
					}
				);

				$(".xiaoyuandian ul li").click(
					function() {
						mySwipe.slide($(this).index(), 1000);
					}
				);

			}
		}

	});
	getCmsListType();
	/*dd*/
	if(token != null && token.trim().length > 0) {
		$(".sign_btn").removeClass("cur");
	}

	getProjectListYX();
	getProjectListTJ();
});

/** 签到点击事件*/
$(".sign_btn").click(function() {
	$.ajax({
		url: ctxpath + "/signed/userSigned",
		type: "post",
		dataType: "json",
		data: {
			from: '1',
			token: token
		},
		success: function(result) {
			if(result.state == "4") {
				$.cookie('token', null);
				mask_login();
				return false;
			}
			if(result.state == "0") {
				if(result.data.signed == "1") {
					$(".mask_backdrop").show();

					$("#sign_grade").html("恭喜您获得<span>" + result.data.integral + "</span>个积分");
					$("#sign_total").html("累计签到<span>" + result.data.continuousTime + "</span>天");

					$(".mask_sign").show();
					$(".sign_btn ").removeClass("cur");
					// 弹框提示.
				} else if(result.data.signed == "2") {
					$(".mask_backdrop").show();
					// 弹框内容.
					$(".mask_sign").show().addClass("cur");
					$("#sign_grade").hide();
					$("#sign_integral_count").html("当前积分<span>" + result.data.integralCount + "</span>分");
					$("#sign_total").html("累计签到<span>" + result.data.continuousTime + "</span>天");
					$(".sign_btn ").removeClass("cur");
				} else if(result.data.signed == "5") {

				}
			}
		}
	});
});
$(".mask_backdrop").click(function() {
	$(this).hide();
	$(".mask_sign").hide();
});

/*小铃铛 页面跳转*/
$(".messgae_sign_wrap a").click(function() {
	window.location = "account_news.html";
});
/*邀请好友*/
$("#invite_user").click(function() {
	if(token != null && token.trim().length > 0) {
		window.location.href = "account_invite_friends.html";

	} else {
		mask_login();
	}
});

//回到旧版
$("#oldVersion").click(function() {
	window.location.href = "https://v1.cicmorgan.com/index.html?token=" + token;
});
//系统消息
function getCmsListType() {
	$.ajax({
		url: ctxpath + "/cms/getCmsListByType",
		type: "post",
		dataType: "json",
		data: {
			pageNo: '1',
			pageSize: '15',
			type: '2',
			from: '2'

		},
		success: function(result) {

			if(result.state == "0") {
				var obj = result.data;
				var list = obj.cmsList;
				var html = "";
				$.each(list, function(index, value) {
					html += "<li><a class='font_size30' href='account_announcement_details.html?noticeid=" + value.id + "&app=" + app + "'>&nbsp;&nbsp;" + value.title + "</a></li>";
				});
				$(".m_ammunce ul").html(html);
				$(".smarticker1").smarticker({
					title: "公告",
					speed: 400,
					animation: "fade",
					rounded: true,
					top: -30
				});
			}
		}
	})
}

//滑动固定导航栏
window.onscroll = function() {

	var t = document.documentElement.scrollTop || document.body.scrollTop;
	var head_fixed = document.getElementById("head_fixed");
	$("#head_fixed").addClass("head_fixed_bl");
	var height = $("#huadonglunbo").height();
	var rate = t / height;
	if(rate > 0) {
		head_fixed.style.opacity = rate;
	} else {
		//恢复正常      
		head_fixed.style.opacity = "1";
		$("#head_fixed").removeClass("head_fixed_bl");
	}

}

/*kefu info*/
$(".account_kufu").click(function() {
	$(".kefu_mask_wrap").addClass("active");
	$(".mask_backdrop").show();
})
$(".kefu_mask_wrap span").click(function() {
	$(".kefu_mask_wrap").removeClass("active");
	$(".mask_backdrop").hide();
});
/*推荐标*/
function getProjectListTJ() {
	$.ajax({
		url: ctxpath + "/project/getProjectListWap",
		type: 'post',
		dataType: 'json',
		data: {
			from: '2',
			pageNo: pageNo,
			pageSize: pageSize
		},
		success: function(json) {
			if(json.state == 0) {
				var htm = ""; //推荐标
				var numYX = 0; //判断是否有供应链
				var currentSpan = $(".recommended_wrap");
				var data = json.data;
				var listTJ = data.listTJ;
				var projectNow;
				if(listTJ.length == 0) {
					//没有推荐标
					$(".product_recommended").remove();
				} else {
					$.each(listTJ, function(index, project) {
						if(numYX == 0) {

							if(project.projectProductType == 2) { //有供应链
								if(project.state == 4 || project.state == 3) {
									projectNow = project;
									numYX += 1;
									return false;
								}
							}

						}

					});

					if(numYX == 0) { //安心投
						$.each(listTJ, function(index, project) {

							if(project.state == 4 || project.state == 3) {
								projectNow = project;
								return false;
							}

						});

					}

					if(projectNow != null) {
						var interestRateIncrease = projectNow.interestRateIncrease; //加息利率
						interestRateIncrease = toFixed2(interestRateIncrease);
						var rate = toFixed2(projectNow.annualRate);
						var ratePI = parseInt(rate);
						var ratePF = rate.toString().split(".")[1];

						htm = '<dl>' +
							'<dt><a href="javascript:;" class="font_size34">' + projectNow.name + '(' + projectNow.sn + ')' + '</a></dt>' +
							'<dd>';
						if(interestRateIncrease == 0) {
							htm += '<div class="fl"><span><em class="font_size70">' + ratePI + '</em><i class="font_size30">.' + ratePF + '%</i></span>';
						} else {
							var rateBase = rate - interestRateIncrease;
							rateBase = toFixed2(rateBase);
							var rateBasePI = parseInt(rateBase);
							var rateBasePF = rateBase.toString().split(".")[1];

							htm += '<div class="fl"><span><em class="font_size70">' + rateBasePI + '</em><i class="font_size30">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span>';
						}
						htm += '<b class="font_size26">年化利率</b>' +
							'</div>' +
							'<div class="fl">' +
							'<span><em class="font_size50">' + projectNow.span + '</em><i class="font_size30">天</i></span>' +
							'<b class="font_size26">借款期限</b>' +
							'</div>' +
							'</dd>' +
							'</dl>';
						if(numYX == 0) {
							if(projectNow.state == 3) {
								htm += '<div class="invest_btn font_size34">' +
									'<a href=invest_details.html?id=' + projectNow.id + '&projectLoandate=' + projectNow.loanDate + '>即将上线</a>';
							} else if(projectNow.state == 4 && checkDate(timeStamp2String(), projectNow.loanDate)) {
								htm += '<div class="invest_btn font_size34 ovedue_item">' +
									'<a href=invest_details.html?id=' + projectNow.id + '&projectLoandate=' + projectNow.loanDate + '>已过期</a>';
							} else if(projectNow.state == 4) {
								htm += '<div class="invest_btn font_size34">' +
									'<a href=invest_details.html?id=' + projectNow.id + '&projectLoandate=' + projectNow.loanDate + '>立即加入</a>';
							}

						} else {
							if(projectNow.state == 3) {
								htm += '<div class="invest_btn font_size34">' +
									'<a href=invest_details.html?id=' + projectNow.id + '>即将上线</a>';
							} else if(projectNow.state == 4 && checkDate(timeStamp2String(), projectNow.loanDate)) {
								htm += '<div class="invest_btn font_size34 ovedue_item">' +
									'<a href=invest_details.html?id=' + projectNow.id + '>已过期</a>';
							} else if(projectNow.state == 4) {
								htm += '<div class="invest_btn font_size34">' +
									'<a href=invest_details.html?id=' + projectNow.id + '>立即加入</a>';
							}

						}
						htm += '</div>';
					}

					currentSpan.html(htm);
				}

			}
		}
	});
}

function jsUrl(id) {
	window.location.href = "invest_details.html?id=" + id;
}

//优选  只有供应链
function getProjectListYX() {
	// 出借项目列表.
	$.ajax({
		url: ctxpath + "/project/getNewProjectListWap",
		type: 'post',
		dataType: 'json',
		data: {
			from: '2',
			pageNo: pageNo,
			pageSize: pageSize
		},
		success: function(json) {
			if(json.state == 0) {
				var data = json.data;
				var listZC = data.listYX;
				var str = "";
				var perferredItem = $(".perferred_item_wrap"); //优选
				for(var i = 0; i < 2; i++) {
					var project = listZC[i];
					var interestRateIncrease = project.interestRateIncrease; //加息利率
					interestRateIncrease = toFixed2(interestRateIncrease);
					var rate = toFixed2(project.annualRate);
					var ratePI = parseInt(rate);
					var ratePF = rate.toString().split(".")[1];

					str += '<div class="preferred_item" onclick="jsUrl(\'' + project.id + '\');">' +
						'<dl>' +
						'<dt><a href="javascript:;" class="font_size30">' + project.name + '(' + project.sn + ')' + '</a></dt>' +
						'<dd>';

					if(interestRateIncrease == 0) {
						str += '<div class="fl">' +
							'<span><em class="font_size50">' + ratePI + '</em><i class="font_size26">.' + ratePF + '%</i></span>' +
							'<b class="font_size26">年化利率</b>' +
							'</div>';
					} else {
						var rateBase = rate - interestRateIncrease;
						rateBase = toFixed2(rateBase);
						var rateBasePI = parseInt(rateBase);
						var rateBasePF = rateBase.toString().split(".")[1];
						str += '<div class="fl">' +
							'<span><em class="font_size50">' + rateBasePI + '</em><i class="font_size26">.' + rateBasePF + '%+' + interestRateIncrease + '%</i></span>' +
							'<b class="font_size26">年化利率</b>' +
							'</div>';
					}
					str += '<div class="fl">' +
						'<span><em class="font_size40">' + project.span + '</em><i class="font_size26">天</i></span>' +
						'<b class="font_size26">借款期限</b>' +
						'</div>' +
						'</dd>' +
						'</dl>' +
						'</div>';
				}
				perferredItem.html(str);

			}

		}
	});
}
/*guide mask **/
$(".guide_wrap").click(function() {
	if(token != null && token.trim().length > 0) {
		//login_in
		$.ajax({
			url: ctxpath + "/activity/userGuidance",
			type: "post",
			dataType: "json",
			data: {
				from: '2',
				token: token,
				type: 1
			},
			success: function(result) {

				if(result.state == 0) {

					var data = result.data;
					if(data.step == 3) {
						$(".mask_backdrop,.mask_guide").show();
						$("#guide_tit").html("开通银行存管");
						$("#guide_con").html("开通银行存管，以便于帮您建立海口联合农商银行存管账户，您的资金会由海口联合农商银行负责存管。");
						$("#guide_btn").html("前往开通").attr("href", "account_setting_bankcard.html");
						$(".gudie_static li:nth-child(2)").removeClass("prev").addClass("cur");
						$(".gudie_static li:nth-child(3)").addClass("prev");
					} else if(data.step == 4) {
						$(".mask_backdrop,.mask_guide").show();
						$("#guide_tit").html("风险测评");
						$("#guide_con").html("请您进行风险测评，以便我们对您有更加全面的了解，为您推荐更加适合的产品。");
						$("#guide_btn").html("前往测评").attr("href", "zt_risk.html");
						$(".gudie_static li:nth-child(2),.gudie_static li:nth-child(3)").removeClass("prev").addClass("cur");
						$(".gudie_static li:nth-child(4)").addClass("prev");
					} else if(data.step == 5) {
						$(".guide_wrap").remove();
					} else if(data.step == 6) {
						$(".mask_backdrop,.mask_guide").hide();
					} else {
						$(".mask_backdrop,.mask_guide").hide();
					}
				} else {
					$(".mask_backdrop,.mask_guide").show();
				}

			}

		});
	} else {
		//login_no
		$(".mask_backdrop,.mask_guide").show();
		$("#guide_tit").html("注册账号");
		$("#guide_con").html("欢迎来到中投摩根，用您的手机号注册中投摩根个人账号，领取600元红包，开启您的财富之旅！");
		$("#guide_btn").html("前往注册").attr("href", "regist.html");
	}
});
/*关闭按钮*/
$(".guide_close,.mask_backdrop").click(function() {
	$(".mask_backdrop,.mask_guide").hide();
});

function toDecimal2(x) {
	var f = parseFloat(x);
	if(isNaN(f)) {
		return false;
	}
	var f = Math.round(x * 100) / 100;
	var s = f.toString();
	var rs = s.indexOf('.');
	if(rs < 0) {
		rs = s.length;
		s += '.';
	}
	while(s.length <= rs + 2) {
		s += '0';
	}
	return s;
}

function toFixed2(num) {
	num = toDecimal2(num);
	num = num.toString();
	num = num.substring(0, num.lastIndexOf('.') + 3);
	return num;
}