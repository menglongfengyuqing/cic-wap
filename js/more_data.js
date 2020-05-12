jQuery.support.cors = true;

$(function() {

	// 借款标的情况.
	queryLoanProjectInfo();

	// 借款人情况.
	queryLoanPeopletInfo();

	// 查询逾期情况.
	queryLoanOverdueInfo();

	// 代偿情况.
	queryLoanReplaceRepayInfo();

	// 出借人情况.
	queryLoanUserInfo();

	// 自中投摩根成立至今，过去的天数.
	queryOnlineDateByDays();
});

/**
 * FN：queryOnlineDateByDays. DESC：自中投摩根成立至今，过去的天数.
 */
function queryOnlineDateByDays() {
	$.ajax({
		url : ctxpath + "/cicmorgan/information/disclosure/queryOnlineDateByDays",
		type : "post",
		dataType : "json",
		data : {},
		success : function(result) {
			if (result.state == '0') {
				$("#pastDay_a").html(result.data.pastDay_a);
				$("#pastDay_b").html(result.data.pastDay_b);
				$("#pastDay_c").html(result.data.pastDay_c);
				$("#pastDay_d").html(result.data.pastDay_d);
			}
		}
	});
}

/**
 * FN：queryLoanUserInfo. DESC：出借人情况.
 */
function queryLoanUserInfo() {

	$.ajax({
		url : ctxpath + "/cicmorgan/information/disclosure/queryLoanUserInfo",
		type : "post",
		dataType : "json",
		data : {},
		success : function(result) {
			if (result.state == '0') {
				// 累计出借人出借总额.
				$("#investTotalAmount_id").html(result.data.investTotalAmount);
				$("#investSituationTotalAmount_id").html(result.data.investTotalAmount);
				// 累计为出借人赚钱的利息总额.
				$("#interestTotalAmount_id").html(result.data.interestTotalAmount);
				$("#interestSituationTotalAmount_id").html(result.data.interestTotalAmount);
				// 累计出借人数量.
				$("#loanUserInfoTotalNumbers_id").html(result.data.loanUserInfoTotalNumbers);
				$("#loanUserInfoSituationTotalNumbers_id").html(result.data.loanUserInfoTotalNumbers);
				// 当前出借人数量.
				// $("#nowLoanUserInfoNumbers_id").html(result.data.nowLoanUserInfoNumbers);
				$("#nowLoanUserInfoNumbers_id").html("198");
				// $("#nowLoanUserInfoSituationNumbers_id").html(result.data.nowLoanUserInfoNumbers);
				$("#nowLoanUserInfoSituationNumbers_id").html("198");
				// 人均累计出借总额.
				$("#investPerCapitaTotalAmount_id").html(result.data.investPerCapitaTotalAmount);
				// 最大单户出借余额占比(%).
				$("#theFirstInvestTotalAmountPercentage_id").html(result.data.theFirstInvestTotalAmountPercentage + "%");
				// 最大十户出借余额占比(%).
				$("#theTopTenInvestTotalAmountPercentage_id").html(result.data.theTopTenInvestTotalAmountPercentage + "%");
				
			}
		}
	});
}

/**
 * FN：queryLoanReplaceRepayInfo. DESC：代偿情况.
 */
function queryLoanReplaceRepayInfo() {
	$.ajax({
		url : ctxpath + "/cicmorgan/information/disclosure/queryLoanReplaceRepayInfo",
		type : "post",
		dataType : "json",
		data : {},
		success : function(result) {
			if (result.state == '0') {
				// 累计代偿金额.
				$("#theCumulativeReplaceRepayAmount_id").html(result.data.theCumulativeReplaceRepayAmount);
				// 累计代偿笔数.
				$("#theCumulativeReplaceRepayNumbers_id").html(result.data.theCumulativeReplaceRepayNumbers);
			}
		}
	});
}

/**
 * FN：queryLoanPeopletInfo. DESC：借款人情况.
 */
function queryLoanPeopletInfo() {

	// 前十大借款人待还金额占比（%）.
	var Q = 0;
	// 其它占比（%）.
	var W = 0;

	// 最大单一借款人待还金额占比（%）.
	var E = 0;
	// 其它占比（%）.
	var R = 0;

	$.ajax({
		url : ctxpath + "/cicmorgan/information/disclosure/queryLoanPeopletInfo",
		type : "post",
		dataType : "json",
		data : {},
		success : function(result) {
			if (result.state == '0') {
				// 累计借款人数量（融资主体为借款人）.
				$("#loanUserTotalNumbers_id").html(result.data.loanUserTotalNumbers);
				// 全部借款人人均借款总额.
//				$("#loanAllUserPerCapitaTotalAmount_id").html("967,422.18");
				$("#loanAllUserPerCapitaTotalAmount_id").html(result.data.loanAllUserPerCapitaTotalAmount);
				// 当前借款人数量.
				$("#nowLoanUserTotalNumbers_id").html(result.data.nowLoanUserTotalNumbers);
				// 前十大借款人待还金额占比（%）.
				Q = result.data.theTopTenStayStillTotalAmountPercentage;
				Q = parseFloat(Q);
				$("#theTopTenStayStillTotalAmountPercentage_div_id").html(result.data.theTopTenStayStillTotalAmountPercentage + "%");
				
				// 最大单一借款人待还金额占比（%）.
				E = result.data.theBiggestStayStillTotalAmountPercentage;
				E = parseFloat(E);

				$("#theBiggestStayStillTotalAmountPercentage_span_id").html(result.data.theBiggestStayStillTotalAmountPercentage + "%");
			}
		}
	});
}

/**
 * FN：queryLoanProjectInfo. DESC：借款标的情况.
 */
function queryLoanProjectInfo() {
	$.ajax({
		url : ctxpath + "/cicmorgan/information/disclosure/queryLoanProjectInfo",
		type : "post",
		dataType : "json",
		data : {},
		success : function(result) {
			if (result.state == '0') {
				// 累计借款金额.
				$("#loanTotalAmount_id").html(result.data.investTotalAmount);
				// 累计借款笔数.
				$("#loanTotalNumbers_id").html(result.data.loanTotalNumbers);
				// 借贷本金余额.
				$("#loanTotalAvailableAmount_id").html(result.data.loanTotalAvailableAmount);
				// 借贷利息余额.
				$("#loanUserTotalInterestAmount_id").html(result.data.loanUserTotalInterestAmount);
				// 借款余额笔数.
				$("#loanTotalAvailableNumbers_id").html(result.data.loanTotalAvailableNumbers);
				// 关联关系借款金额.
				$("#loanRelationalTotalAmount_id").html(result.data.loanRelationalTotalAmount);
				// 关联关系借款笔数.
				$("#loanRelationalTotalNumbers_id").html(result.data.loanRelationalTotalNumbers);
			}
		}
	});
}

/**
 * FN：queryLoanOverdueInfo. DESC：逾期情况.
 */
function queryLoanOverdueInfo() {
	$.ajax({
		url : ctxpath + "/cicmorgan/information/disclosure/queryLoanOverdueInfo",
		type : "post",
		dataType : "json",
		data : {},
		success : function(result) {
			if (result.state == '0') {
				// 逾期金额.
				$("#overdueAmount_id").html(result.data.overdueAmount);
				// 逾期笔数.
				$("#overdueNumbers_id").html(result.data.overdueNumbers);
				// 逾期90天以上金额.
				$("#overdue90DaysAmount_id").html(result.data.overdue90DaysAmount);
				// 逾期90天以上笔数.
				$("#overdue90DaysNumbers_id").html(result.data.overdue90DaysNumbers);
				// 金额逾期率.
				$("#amountOverdueRate_id").html(result.data.amountOverdueRate + "%");
				// 项目逾期率.
				$("#projectOverdueRate_id").html(result.data.projectOverdueRate + "%");
				// 项目分级90逾期率.
				$("#projectClassificationOverdueRate90_id").html(result.data.projectClassificationOverdueRate90 + "%");
				// 项目分级180逾期率.
				$("#projectClassificationOverdueRate180_id").html(result.data.projectClassificationOverdueRate180 + "%");
				// 项目分级360逾期率.
				$("#projectClassificationOverdueRate360_id").html(result.data.projectClassificationOverdueRate360 + "%");
				// 金额分级90逾期率.
				$("#amountClassificationOverdueRate90_id").html(result.data.amountClassificationOverdueRate90 + "%");
				// 金额分级180逾期率.
				$("#amountClassificationOverdueRate180_id").html(result.data.amountClassificationOverdueRate180 + "%");
				// 金额分级360逾期率.
				$("#amountClassificationOverdueRate360_id").html(result.data.amountClassificationOverdueRate360 + "%");
			}
		}
	});
}