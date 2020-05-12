$(function() {
     projectRepayPlan(1, 5);
});

 



/**
 * 描述: 根据参数名获取地址栏参数的值. <br>
 * 作者: Mr.云.李 <br>
 */
function getArgumentsByName(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}


/**
 * 描述: 项目还款计划. <br>
 * 作者: Mr.云.李 <br>
 */
function projectRepayPlan(pageNo, pageSize){
	
	// 项目还款计划数据表格.
	var project_repay_plan = $("#project_repay_plan");
	
	// 每次请求之前删除之前页面的缓存内容.
	project_repay_plan.empty();
	
	// 项目ID.
	var id = getArgumentsByName("id");
	if (id != null && id.toString().length > 1) {
		$.ajax({
			url : ctxpath + "/project/getProjectRepayPlanList",
			type : 'post',
			dataType : 'json',
			data : {
				from : '1',
				pageNo : pageNo,
				pageSize : pageSize,
				projectid : id
			},
			success : function(json) {
				// 查找成功.
				if(json.state == 0){
					// --
					var content = '<div class="invest_tab invest_user_tab"><ul><li class="font_size28">还款金额</li><li class="font_size28">还款期数</li><li class="font_size28">还款时间</li></ul></div>'
					if(json.data.repayplanlist != null && json.data.repayplanlist.length > 0){
						$.each(json.data.repayplanlist, function(index, item) {
							var planstate = '';
							// 还款状态，1：未还款，2：还款成功，3：还款失败.
							if(item.planstate == 1){
								planstate = '未还款';
							}
							if(item.planstate == 2){
								planstate = '还款成功';
							}
							if(item.planstate == 3){
								planstate = '还款失败';
							}
							content += '<div class="invest_user_group">'
									+'<ul class="invest_user_group_one">'
									+'<li class="font_size26">'+formatCurrency(item.amount)+'</li>'
									+'<li class="font_size26">'+item.repaysort+'</li>'
									+'<li class="font_size26">'
									+'<p class="font_size26">'+item.repaydate+'</p>'
									+'</li>'
									+'</ul>'
									+'</div>'
						});
						project_repay_plan.append(content);
				     
					} else {
						project_repay_plan.append(content);
					}
				}
				
			}
		});
	}
}




