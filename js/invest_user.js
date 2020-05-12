var pageNo = parseInt(1);
var pageSize = parseInt(10);


$(function(){
	var topStr = "<div class='invest_tab invest_user_tab'><ul><li class='font_size28'>出借人</li><li class='font_size28'>出借金额</li><li class='font_size28'>出借时间</li></ul></div>";
	$(".mui-content").html(topStr);
	getUserInvestList(pageNo, pageSize);
	
	$(window).bind("scroll", function () {
       	if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
       		pageNo = document.getElementById("pageNo").value;
       		var last = document.getElementById("last").value;
       		if(parseInt(pageNo) > parseInt(last)){
       			$(".error_msg_wrap p").html("没有更多数据");
				$(".error_msg_wrap p").css("visibility", "visible");
       			setTimeout("getMsg()",2000);
            } else {
            	getUserInvestList(pageNo, pageSize);
            }
        } 
	});
});


function getUserInvestList(pageNo, pageSize){
	var str="";
	var projectId = getArgumentsByName("id");
	if(projectId != null && projectId.trim().length > 0){
		$.ajax({
			url : ctxpath + "/project/getProjectBidList",
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
					var investList = data.bidlist;
					document.getElementById("last").value = data.last;
					document.getElementById("pageNo").value = data.pageNo + 1;
					if(investList != null){
						$.each(investList, function(index, invest) {
							str += "<div class='invest_user_group'><ul class='invest_user_group_one'>"
								 + "<li class='font_size26'>" + invest.name + "</li>"
								 + "<li class='font_size26'>" + formatCurrency(invest.amount) + "元</li>"
								 + "<li class='font_size26'><p class='font_size26'>" + invest.createdate + "</p></li>"
								 + "</ul></div>";
						});
					}
				}
				$('.mui-content').html($('.mui-content').html()+str);
			}
		});
	} else {
		$('.mui-content').html($('.mui-content').html()+str);
	} 
}

