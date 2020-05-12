var projectId = getArgumentsByName("id");
var balanceAmount; //项目剩余金额
var minAmount; //项目起投金额
var bidId = getArgumentsByName("bidId");
/*项目详情*/
$(function() {
	if(token != null && token.trim().length > 0) {
		getProjectInfoWap();
		plans();
	} else {
		mask_login();
	}
});
//切换tab
$(".item_details_tab li").click(function() {

	$(this).addClass("cur").siblings().removeClass("cur");
	$(".item_details_con .item_tab_con").eq($(this).index()).show().siblings(".item_tab_con").hide();
	var element = $("#proPage02");
	var eleTop = element.scrollTop();
	if(eleTop > 0) {
		$("#proPage02").scrollTop(0);
	}
});
$(".item_details_tab li:eq(2)").click(function() {
	windControl();
});
$("#LoanBasicInfo").click(function() {
	window.location.href = "invest_shareholder.html?projectId=" + projectId;
});
/*回款计划*/
function plans() {
	$.ajax({
		url: ctxpath + "/user/getUserInterestList",
		type: 'post',
		dataType: 'json',
		data: {
			from: '2',
			token: token,
			investId: bidId
		},
		success: function(json) {
			if(json.state == 0) {
				var plans = json.data.userPlanList;
				var content = '';
				if(plans != null && plans.length > 0) {
					var str = "";

					$.each(plans, function(index, item) {

						if(item.state == "2") { //state 2未还款 3正常还款
							str += '<li><span class="font_size26">未还款</span><span class="font_size26">' + item.repaymentDate + '</span><div class="fr"><em class="font_size26">' + formatCurrency(item.amount) + '</em> ';
						} else if(item.state == "3") {
							str += '<li class="cur"><span class="font_size26">正常还款</span><span class="font_size26">' + item.repaymentDate + '</span> <div class="fr"><em class="font_size26">' + formatCurrency(item.amount) + '</em>';
						}
						if(item.principal == "1") { //principal 1本金 2 利息
							str += '<b class="font_size26">本金</b></div></li>';
						} else if(item.principal == "2") {
							str += '<b class="font_size26">利息</b></div></li>';
						}

					});
					$(".reimbursement_wrap").append(str);

				} else {

					$(".reimbursement_wrap").hide();

				}
			} else {
				mask_login();
			}

		}
	});
}
$("#plans").click(function() {
	$(this).toggleClass("cur");
	$(".reimbursement_plan").toggle();
});

function windControl() {
	var proType = $("#projectProductType").val();
	console.log(proType);
	$.ajax({
		url: ctxpath + "/project/getProjectInfoAnnex",
		type: 'post',
		dataType: 'json',
		data: {
			from: '2',
			projectid: projectId
		},
		success: function(json) {
			if(json.state == 0) {
				var data = json.data;
				var creditUrl = data.creditUrl;
				if(creditUrl == "null" || creditUrl == null || creditUrl == "暂无") {
					creditUrl = "javascript:;";
				}
				$("#paymentName2").attr("href", creditUrl);
				$("#paymentName2").html(data.creditName); //付款方
				$("#borrowerName2").html(data.borrowerCompanyName); //借款方
				//				var businessLicenses = data.businessLicenses;
				//				var bankPermitCerts = data.bankPermitCerts;
				//
				//				var str = "";
				//				var htm = "";
				//				$.each(businessLicenses, function(index, item) { //三证合一
				//					str += '<li class="fl">' +
				//						'<img src="' + item.url + '" data-preview-src="" data-preview-group="1">' +
				//						'<u class="font_size26">三证合一</u>'
				//					'</li>';
				//				});
				//				$("#businessLicenses").html(str);
				//
				//				$.each(bankPermitCerts, function(index, item) { //开户许可证
				//					htm += '<li class="fl">' +
				//						'<img src="' + item.url + '" data-preview-src="" data-preview-group="1">' +
				//						'<u class="font_size26">开户许可证</u>'
				//					'</li>';
				//				});
				//				$("#bankPermitCerts").html(htm);
				$("#risk_item_msg").html("<p class='font_size26'>" + data.guaranteescheme + "</p>"); /*风控措施*/
				if(proType == 1) { //安心投
					var proDocimgs = data.proimg;
					var wgimglist = data.wgimglist;
					var docimgs = data.docimgs;
					var filePro = "",
						fileTb = "",
						fileRisk = "";

					$.each(proDocimgs, function(index, item) {

						filePro += '<li class="fl">' +
							'<img src="' + item.url + '" data-preview-src="" data-preview-group="2">' +
							'<u class="font_size26">项目文件</u>' +
							'</li>';
					});
					$.each(wgimglist, function(index, item) {

						fileTb += '<li class="fl">' +
							'<img src="' + item.url + '" data-preview-src="" data-preview-group="2">' +
							'<u class="font_size26">贸易背景</u>' +
							'</li>';
					});
					$.each(docimgs, function(index, item) {
						fileRisk += '<li class="fl">' +
							'<img src="' + item.url + '" data-preview-src="" data-preview-group="2">' +
							'<u class="font_size26">风控文件</u>' +
							'</li>';
					});

					$("#filePro").html(filePro);
					$("#fileTb").html(fileTb);
					$("#fileRisk").html(fileRisk);
					var lis = $("#fileList li");
					if(lis.length > 6) {
						$(".more_pic").show();
						lis.hide();
						lis.slice(0, 6).show();
					} else {
						$(".more_pic").hide();
					}
				} else if(proType == 2) { //供应链

					var fileList = data.commitments;
					var filePro = "",
						fileTb = "",
						fileRisk = "";
					$.each(fileList, function(index, item) {
						if(item.type == "5") {
							filePro += '<li class="fl">' +
								'<img src="' + item.url + '" data-preview-src="" data-preview-group="2">' +
								'<u class="font_size26">项目文件</u>' +
								'</li>';

						}
						if(item.type == "1" || item.type == "2" || item.type == "3" || item.type == "4" || item.type == "6") {
							fileTb += '<li class="fl">' +
								'<img src="' + item.url + '" data-preview-src="" data-preview-group="2">' +
								'<u class="font_size26">贸易背景</u>' +
								'</li>';
						}
						if(item.type == "7") {
							fileRisk += '<li class="fl">' +
								'<img src="' + item.url + '" data-preview-src="" data-preview-group="2">' +
								'<u class="font_size26">风控文件</u>' +
								'</li>';
						}

					});

					$("#filePro").html(filePro);
					$("#fileTb").html(fileTb);
					$("#fileRisk").html(fileRisk);
					var lis = $("#fileList li");
					if(lis.length > 6) {
						$(".more_pic").show();
						lis.hide();
						lis.slice(0, 6).show();
					} else {
						$(".more_pic").hide();
					}
				}
			} else {
				console.log(json.data);
			}

		}
	});
}

function getProjectInfoWap() {
	$.ajax({
		url: ctxpath + "/project/getProjectInfoWap",
		type: 'post',
		dataType: 'json',
		data: {
			from: '2',
			projectid: projectId
		},
		success: function(json) {
			// 查找成功.
			if(json.state == 0) {
				var data = json.data;
				var creditUrl = data.creditUrl;
				if(creditUrl == "null" || creditUrl == null || creditUrl == "暂无") {
					creditUrl = "javascript:;";
				}
				$("#titleName").html(data.projectName);
				var interestRateIncrease = data.interestRateIncrease; //加息利率
				interestRateIncrease = toFixed2(interestRateIncrease);
				var rate = toFixed2(data.rate);
				var ratePI = parseInt(rate);
				var ratePF = rate.toString().split(".")[1];
				if(interestRateIncrease == 0) {
					$("#projectstate").html(ratePI + "<span class='font_size60'>." + ratePF + "%</span>"); // 利息

				} else {
					var rateBase = rate - interestRateIncrease;
					rateBase = toFixed2(rateBase);
					var rateBasePI = parseInt(rateBase);
					var rateBasePF = rateBase.toString().split(".")[1];
					$("#projectstate").html(rateBasePI + "<span class='font_size60'>." + rateBasePF + "%+" + interestRateIncrease + "%</span>"); // 利息

				}
				$("#projectspan").html(data.span + "天"); // 项目期限
				$("#projectsurplus").html(data.balanceamount); // 剩余金额
				$("#projectminamount").html(toFixed2(data.minamount)); // 出借最低金额
				$("#repaytype,#repaytype02").html(data.repaytype); //还款方式
				var currentamount = parseFloat(data.currentamount);
				var amount = parseFloat(data.amount);
				var percentage = currentamount / amount * 100;
				if(currentamount == amount) {
					percentage = 100;
				} else if(percentage >= 99.5) {
					percentage = 99;
				} else {
					percentage = Math.round(percentage);
				}
				$("#progress").html(percentage + "%");
				/*-------------------------------------------------------*/
				//项目介绍
				projectInfo(data, rate, interestRateIncrease, creditUrl);
				$("#repaymentPlan,.repaymentPlan").click(function() {
					window.location.href = "invest_repayment_plan.html?id=" + projectId;
				});
				//projectProductType==1 安心投 ==2供应链
				var projectProductType = data.projectProductType;
				$("#projectProductType").val(data.projectProductType);
				if(projectProductType == 1) {
					$("#protocolModel").click(function() {
						window.location.href = "invest_mine_agreement.html";
					});
					$("#questionCommon").click(function() {
						window.location.href = "invest_question.html?projectProductType=1";
					});
					$(".hidePaymentName").hide(); //无付款方
					$("#star").html("<i class='all'></i><i class='all'></i><i class='all'></i><i class='all'></i><i></i>");
//					$("#riskName").html("较低风险");

				} else if(projectProductType == 2) {
					$("#protocolModel").click(function() {
						window.location.href = "invest_mine_agreement_scf.html";
					});
					$("#questionCommon").click(function() {
						window.location.href = "invest_question.html?projectProductType=2";
					});
					var level = data.level;
					level = level * 10;
					var starAll = parseInt(level / 10);
					var starLevel = level % 10;
					$("#star").html("<i></i><i></i><i></i><i></i><i></i>");
					var starList = $("#star i");
					for(var i = 0; i < starAll; i++) {

						starList[i].className = "all";
					}
					if(starLevel > 0) {
						if(starAll == 0) {
							$("#star i:first").addClass("half");
						} else {

							$("#star i.all:last").next().addClass("half");
						}

					}

//					if(level == 50) {
//						$("#riskName").html("极低风险");
//					} else if(level == 45) {
//						$("#riskName").html("低风险");
//					} else if(level == 40) {
//						$("#riskName").html("较低风险");
//					} else if(level == 35) {
//						$("#riskName").html("中等风险");
//					} else if(level == 30) {
//						$("#riskName").html("较高风险");
//					} else {
//						$("#riskName").html("高风险");
//
//					}
				}
				$("#project_introduction").html(data.projectcase); // 项目简介
				//公司名称

				if(data.borrowerCompanyName == "" || data.borrowerCompanyName == null) {

					$("#borrowerCompanyName").html("---");
				} else {

					$("#borrowerCompanyName").html(data.borrowerCompanyName);
				}
				//注册资本
				if(data.ztmgLoanBasicInfoEntity.registeredCapital == "" || data.ztmgLoanBasicInfoEntity.registeredCapital  == null) {
					$("#borrowerRegisterAmount").html("---");
				} else {
					$("#borrowerRegisterAmount").html(data.ztmgLoanBasicInfoEntity.registeredCapital + "元");
				}
				//注册地址 
				if(data.ztmgLoanBasicInfoEntity.registeredAddress== "" || data.ztmgLoanBasicInfoEntity.registeredAddress == null) {
					$("#address").html("---");
				} else {
					$("#address").html(data.ztmgLoanBasicInfoEntity.registeredAddress);
				}
				/*办公地址*/
				if(data.address == "" || data.address == null) {
					$("#addressBS").html("---");
				} else {
					$("#addressBS").html(data.address);
				}
				//成立时间
				if(data.ztmgLoanBasicInfoEntity.setUpTime == "" || data.ztmgLoanBasicInfoEntity.setUpTime == null) {
					$("#borrowerRegisterDate").html("---");
				} else {
					var time=data.ztmgLoanBasicInfoEntity.setUpTime;
					time=time.substr(0, 10)
					$("#borrowerRegisterDate").html(time);
				}

				//法定代表人
		       if(data.ztmgLoanBasicInfoEntity.operName == "" || data.ztmgLoanBasicInfoEntity.operName == null) {
					$("#agentPersonName").html("---");
				} else {
					$("#agentPersonName").html(data.ztmgLoanBasicInfoEntity.operName);
				}
				//经营财务状况
				if(data.businessFinancialSituation == "" || data.businessFinancialSituation == null) {
					$("#businessFinancialSituation").html("---");
				} else {
					$("#businessFinancialSituation").html(data.businessFinancialSituation);
				}
				//还款能力变化
				if(data.abilityToRepaySituation == "" || data.abilityToRepaySituation == null) {
					$("#abilityToRepaySituation").html("---");
				} else {
					$("#abilityToRepaySituation").html(data.abilityToRepaySituation);
				}
				//是否涉诉
				if(data.litigationSituation == "" || data.litigationSituation == null) {
					$("#litigationSituation").html("---");
				} else {
					$("#litigationSituation").html(data.litigationSituation);
				}
				//是否行政处罚
				if(data.administrativePunishmentSituation == "" || data.administrativePunishmentSituation == null) {
					$("#administrativePunishmentSituation").html("---");
				} else {
					$("#administrativePunishmentSituation").html(data.administrativePunishmentSituation);
				}
				//在本平台逾期情况
				if(data.platformOverdueSituation == "" || data.platformOverdueSituation == null) {
					$("#platformOverdueSituation").html("---");
				} else {
					$("#platformOverdueSituation").html(data.platformOverdueSituation);
				}

				//实缴资本
				if(data.ztmgLoanBasicInfoEntity != null) {
					if(data.ztmgLoanBasicInfoEntity.contributedCapital == "" || data.ztmgLoanBasicInfoEntity.contributedCapital == null) {
						$("#contributedCapital").html("---");
					} else {
						$("#contributedCapital").html(formatCurrency(data.ztmgLoanBasicInfoEntity.contributedCapital) + "元");
					}
					//其他平台借款情况
					if(data.ztmgLoanBasicInfoEntity.otherCreditInformation == "" || data.ztmgLoanBasicInfoEntity.otherCreditInformation == null) {
						$("#otherCreditInformation").html("---");
					} else {
						$("#otherCreditInformation").html(formatCurrency(data.ztmgLoanBasicInfoEntity.otherCreditInformation) + "元");
					}
					//所属行业
					if(data.ztmgLoanBasicInfoEntity.industry == "" || data.ztmgLoanBasicInfoEntity.industry == null) {
						$("#industry").html("---");
					} else {
						$("#industry").html(data.ztmgLoanBasicInfoEntity.industry);
					}

					//经营区域
					if(data.ztmgLoanBasicInfoEntity.scope == ""||data.ztmgLoanBasicInfoEntity.scope ==null) {
							$("#operatingArea").html("---");
					} else {
							$("#operatingArea").html(data.ztmgLoanBasicInfoEntity.scope);
					}
					//年收入
					if(data.ztmgLoanBasicInfoEntity.annualRevenue == "" || data.ztmgLoanBasicInfoEntity.annualRevenue == null) {
						$("#annualRevenue").html("---");
					} else {
						$("#annualRevenue").html(toFixed2(data.ztmgLoanBasicInfoEntity.annualRevenue));
					}
					//负债
					if(data.ztmgLoanBasicInfoEntity.liabilities == "" || data.ztmgLoanBasicInfoEntity.liabilities == null) {
						$("#liabilities").html("---");
					} else {
						$("#liabilities").html(toFixed2(data.ztmgLoanBasicInfoEntity.liabilities));
					}
				} else {
					$("#otherCreditInformation").html("---");
					$("#contributedCapital").html("---");
					$("#industry").html("---");
					$("#operatingArea").html("---");
					$("#annualRevenue").html("---");
					$("#liabilities").html("---");
				}
				//	$("#otherCreditInformation").html(data.ztmgLoanBasicInfoEntity.otherCreditInformation);
				/*------------------------------------------*/
				//出借记录
				investList(data);
				/*还款计划 3、4不显示*/
				if(data.proState == 3 || data.proState == 4) {
					$(".repaymentPlan").remove();
					$("#plans").remove();
					$("#interestDate").html("满标当日计息"); //起息时间

				} else {
					$("#interestDate").html(data.loandate); //起息时间

				}
				/*----------------------*/
				$("#sourceofrepayment").html(data.sourceOfRepayment); //还款来源
				$("#repaymentGuaranteeMeasures").html(data.repaymentGuaranteeMeasures); //还款保障措施
				$("#back_icon").click(function() {
					window.location.href = "javascript:history.go(-1);";

				});
				$(".refresh_icon").click(function() {
					window.location.href = "javascript:window.location.reload()";
				});

			}
		}
	});
}
//项目介绍
function projectInfo(data, rate, interestRateIncrease, creditUrl) {
	$("#project_name2").html(data.projectName + "(" + data.sn + ")"); //项目名称
	$("#borrowerName").html(data.borrowerCompanyName); //借款方
	$("#paymentName").html(data.replaceRepayCompanyName); //付款方
	$("#paymentName").attr("href", creditUrl);
	$("#projectAmount").html(toFixed2(data.amount) + "元"); //项目金额
	$("#projectspan2").html(data.span); // 项目期限
	if(interestRateIncrease == 0) {
		$("#projectstate2").html(rate + "%"); //预期出借利率

	} else {
		var rateBase = rate - interestRateIncrease;
		rateBase = toFixed2(rateBase);
		var rateBasePI = parseInt(rateBase);
		var rateBasePF = rateBase.toString().split(".")[1];
		$("#projectstate2").html(rateBasePI + "." + rateBasePF + "%+" + interestRateIncrease + "%"); // 预期出借利率
	}
	$("#purpose").html(data.purpose); //项目用途
	$("#repaytype").html(data.repaytype); //还款方式

}
//借款方信息
function loanInfo(data) {

}
//出借记录
function investList(data) {

	var str = "";
	var investList = data.bidList;

	if(investList.length > 0) {
		$.each(investList, function(index, invest) {
			str += '<div class="invest_user_group">' +
				'<ul class="invest_user_group_one">' +
				'<li class="font_size30">' + invest.userPhone + '</li>' +
				'<li class="font_size30">' + formatCurrency(invest.investAmount) + '元</li>' +
				'<li class="font_size30">' + invest.investDate + '</li>' +
				'</ul>' +
				'</div>';

		});
		$('.invest_record_con').html(str);

	} else {
		$(".invest_record_wrap").addClass("null");
		$('.invest_record_con').html("<p class='font_size30 record_null'>暂无相关出借记录,赶紧去出借吧~</p>");

	}
}
/**
 * 描述: 计算出借日期与放款日期之间的天数. <br>
 */
function calcDateDiff(currentDate, loanDate) {
	var type1 = typeof currentDate,
		type2 = typeof loanDate;
	if(type1 == 'string')
		currentDate = stringToTime(currentDate);
	else if(currentDate.getTime)
		currentDate = currentDate.getTime();
	if(type2 == 'string')
		loanDate = stringToTime(loanDate);
	else if(loanDate.getTime)
		loanDate = loanDate.getTime();
	if(currentDate > loanDate) {
		return 0;
	}
	return(loanDate - currentDate) / (1000 * 60 * 60 * 24); // 结果是秒
}

/**
 * 描述: 当前系统日期字符串. <br>
 */
function nowDate() {
	var nowDate = new Date();
	// 日.
	var day = nowDate.getDate();
	// 月(0-11，0代表1月份).
	var month = nowDate.getMonth();
	//年(完整的年份4位).
	var year = nowDate.getFullYear();
	return year + '-' + (month + 1) + '-' + day;
}

/**
 * 描述: 出借日期距离放款日期的天数. <br>
 */
function calcDays() {
	// 放款日期.
	var loanDate = $("#loan_date").val();
	// 当前系统日期.
	var currentDate = nowDate();
	// 出借日期距离放款日期的天数.
	var days = calcDateDiff(currentDate, loanDate);
	return days;
}

/**
 * 描述: 日期字符串转换成Time. <br>
 */
function stringToTime(str) {
	var f = str.split(' ', 2);
	var d = (f[0] ? f[0] : '').split('-', 3);
	var t = (f[1] ? f[1] : '').split(':', 3);
	return(new Date(parseInt(d[0], 10) || null, (parseInt(d[1], 10) || 1) - 1, parseInt(d[2], 10) || null, parseInt(t[0], 10) || null, parseInt(t[1], 10) || null, parseInt(t[2], 10) || null)).getTime();
}

/*ie8 、兼容模式下 trim方法*/
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, '');
}

var mySwiper = new Swiper('.swiper-container', {
	direction: 'vertical',
	observer: true,
	on: {
		slideChangeTransitionStart: function() {
			if(this.activeIndex == 0) {
				$(".item_details_tab").hide().addClass("fixed");

			} else {
				$(".item_details_tab").show().addClass("fixed");
			}
		},
		touchStart: function() {

			console.log(this.activeIndex);
			if(this.activeIndex == 0) {
				$(".item_details_tab").hide().removeClass("fixed");
				$.ajax({
					url: ctxpath + "/user/getUserInfo",
					type: "post",
					dataType: "json",
					data: {
						from: '2',
						token: token
					},
					success: function(result) {
						if(result.state == 0) {
							$(".mask_login_tip,.mask_backdrop").hide();
						} else if(result.state == 4) {
							$.cookie('token', null);
							$(".mask_login_tip,.mask_backdrop").show();
							$("#proPage02").remove();
							return;

						}

					}

				});
			} else if(this.activeIndex == 1) {
				$.ajax({
					url: ctxpath + "/user/getUserInfo",
					type: "post",
					dataType: "json",
					data: {
						from: '2',
						token: token
					},
					success: function(result) {
						if(result.state == 0) {
							$(".mask_login_tip,.mask_backdrop").hide();

						} else if(result.state == 4) {
							$.cookie('token', null);

							$(".mask_login_tip,.mask_backdrop").show();

						}

					}
				});
			}
		},
		touchEnd: function() {

		}
	}

});

var startScroll, touchStart, touchCurrent;
mySwiper.slides.on('touchstart', function(e) {
	startScroll = this.scrollTop;
	touchStart = e.targetTouches[0].pageY;
}, true);
mySwiper.slides.on('touchmove', function(e) {
	touchCurrent = e.targetTouches[0].pageY;
	var touchesDiff = touchCurrent - touchStart;
	var slide = this;
	var onlyScrolling =
		(slide.scrollHeight > slide.offsetHeight) &&
		(
			(touchesDiff < 0 && startScroll === 0) ||
			(touchesDiff > 0 && startScroll === (slide.scrollHeight - slide.offsetHeight)) ||
			(startScroll > 0 && startScroll < (slide.scrollHeight - slide.offsetHeight))
		);
	if(onlyScrolling) {
		e.stopPropagation();
	}
}, true);

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
var numPic = 6;
var numDuce = 0;
$(".more_pic").click(function() {

	var lis = $("#fileList li");
	numPic = numPic + 6;
	if(numDuce % 6 > 0) {
		$(".more_pic").hide();
	}
	numDuce = lis.length - numPic;
	lis = $("#fileList li").slice(0, numPic);

	lis.show();

});

//$("#close_pic").click(function() {
//
//	var lis = $("#fileList li");
//
//	if(lis.length > 6) {
//
//		lis.hide();
//		lis.slice(0, 6).show();
//		$("#close_pic").hide();
//		$(".more_pic").show();
//	} else {
//		$(".more_pic").hide();
//	}
//});

$(".repaytype").click(function(){
$(".mask_backdrop_rep,.repaytype_wrap").show();	
});

$(".mask_backdrop_rep").click(function(){
	$(".mask_backdrop_rep,.repaytype_wrap,.star_wrap").hide();	
});
$(".rate_star").click(function(){
	$(".mask_backdrop_rep,.star_wrap").show();	
})
