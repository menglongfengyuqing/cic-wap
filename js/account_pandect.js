$(function() {
	if(token != null || token != "") {
		// --
		accountPandect();
		// --
	} else {
		mask_login();
	}

});

// token.
var token = $.cookie('token');

/**
 * 描述: 客户账户信息. <br>
 * 作者: Mr.云.李 <br>
 */
function accountPandect() {

	// 调用客户账户接口.
	$.ajax({
		url: ctxpath + "/user/getcgbUserAccount",
		type: 'post',
		dataType: 'json',
		data: {
			token: token,
			from: '2'
		},
		success: function(json) {
			// 系统超时.
			if(json.state == 4) {
				// console.log("系统超时！");
				//				window.location.href = "login.html";
				mask_login();
			}
			// 接口调用成功.
			if(json.state == 0) {
				var data = json.data;
				var total_amount = formatCurrency(data.totalAmount);
				var available_amount = formatCurrency(data.availableAmount);
				var freeze_amount = formatCurrency(data.freezeAmount);
				var regular_due_interest = formatCurrency(data.regularDueInterest);
				// 账户总额.
				$("#total_amount").html(total_amount);
				// 可用余额.
				$("#available_amount").html(available_amount);
				// 冻结金额.
				$("#freeze_amount").html(freeze_amount);
				// 定期累计出借金额.
				var regularTotalAmount = data.regularTotalAmount;
				// 活期累计出借金额.
				var currentTotalAmount = data.currentTotalAmount;
				// 出借累计总额(定期+活期).
				var investTotalAmount = parseFloat(regularTotalAmount) + parseFloat(currentTotalAmount);
				$("#invest_total_amount").html(formatCurrency(investTotalAmount));
				// 出借累计总利息(定期+获取).
				$("#invest_total_interest").html(formatCurrency(json.data.regularTotalInterest));
				// 定期在投金额.
				var regularDuePrincipal = json.data.regularDuePrincipal;
				// 活期在投金额.
				var currentAmount = json.data.currentAmount;
				// 在投金额(定期+活期).
				var inTheInvestmentAmount = parseFloat(regularDuePrincipal) + parseFloat(currentAmount);
				var in_the_investment_amount = formatCurrency(inTheInvestmentAmount);
				$("#in_the_investment_amount").html(in_the_investment_amount);
				// 定期代利息.
				$("#regular_due_interest").html(regular_due_interest);
				// 累计取现金额.
				$("#cash_amount").html(formatCurrency(json.data.cashAmount));
				// 累计充值金额.
				$("#recharge_amount").html(formatCurrency(json.data.rechargeAmount));
				var a = data.availableAmount / data.totalAmount;
				var b = data.freezeAmount / data.totalAmount;
				var c = data.regularDueInterest / data.totalAmount;
				var d = inTheInvestmentAmount / data.totalAmount;
				assetsRate(a, b, c, d);
				if(data.totalAmount == "" || data.totalAmount == 0) {
					$(".tip_null").show();
				} else {
					$(".tip_null").hide();
				}
			}
		}
	});
}

function assetsRate(a, b, c, d) {
	// 路径配置

	require.config({

		paths: {

			'echarts': 'js/echarts',

			'echarts/chart/pie': 'js/echarts'

		}

	});

	// 使用

	require(

		[

			'echarts',

			'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载

		],

		function(ec) {

			// 基于准备好的dom，初始化echarts图表

			var myChart = ec.init(document.getElementById('main'));

			var option = {
				color: ['#ffb312', '#ff0000', '#00aeef', '#00cbbb'],
//				tooltip: {
//					trigger: 'item',
//					formatter: "{a} <br/>{b} : {c} ({d}%)"
//				},

				series: [{
					name: '访问来源',
					type: 'pie',
					radius: ['50%', '76.4705%'],
					startAngle: 90,
					clockWise: true,
					itemStyle: {
						normal: {
							label: {
								show: false
							},
							labelLine: {
								show: false
							}
						},
						emphasis: {
							label: {
								show: true,
								position: 'center',
								textStyle: {
									fontSize: '30',
									fontWeight: 'bold'
								}
							}
						}
					},
					data: [{
							value: a,
							name: '可用余额(元)'
						},
						{
							value: b,
							name: '冻结余额(元)'
						},
						{
							value: c,
							name: '待收利息(元)'
						},
						{
							value: d,
							name: '代收本金(元)'
						}
					]
				}]
			};

			myChart.setOption(option);

		}

	);
}