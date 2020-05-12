var pageNo = parseInt(1);
var pageSize = parseInt(10);


$(function(){
	var topStr = "<div class='invest_tab invest_user_tab'><ul><li class='font_size28'>还款金额</li><li class='font_size28'>还款期数</li><li class='font_size28'>还款时间</li></ul></div>";
	$(".mui-content").html(topStr);
	getProjectPlanList(pageNo, pageSize);
	
	$(window).bind("scroll", function () {
       	if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
       		pageNo = document.getElementById("pageNo").value;
       		var last = document.getElementById("last").value;
       		if(parseInt(pageNo) > parseInt(last)){
       			$(".error_msg_wrap p").html("没有更多数据");
				$(".error_msg_wrap p").css("visibility", "visible");
       			setTimeout("getMsg()",2000);
            } else {
            	getProjectPlanList(pageNo, pageSize);
            }
        } 
	});
	
});


function getProjectPlanList(pageNo, pageSize){
	var projectId = getArgumentsByName("id");
	var str = "";
	if(projectId != null && projectId.trim().length > 0){
		$.ajax({
			url : ctxpath + "/project/getProjectRepayPlanList",
			type : 'post',
			dataType : 'json',
			data : {
				from : '2',
				projectid : projectId,
				pageNo: pageNo,
				pageSize: pageSize
			},
			success : function(json) {
				// 查找成功.
				if(json.state == 0){
					var data = json.data;
					var repayplanlist = data.repayplanlist;
					document.getElementById("last").value = data.last;
					document.getElementById("pageNo").value = data.pageNo + 1;
					if(repayplanlist != null){
						$.each(repayplanlist, function(index, plan) {
							str += "<div class='invest_user_group'><ul class='invest_user_group_one'>"
								 + "<li class='font_size26'>" + formatCurrency(plan.amount) + "</li>"
								 + "<li class='font_size26'>第" + plan.repaysort + "期</li>"
								 + "<li class='font_size26'>" + plan.repaydate + "</li>"
								 + "</ul></div>";
						});
					}
				}
				$(".mui-content").html($(".mui-content").html() + str);
			}
		});
	} else {
		$(".mui-content").html($(".mui-content").html() + str);
	}
}
