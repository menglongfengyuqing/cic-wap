jQuery.support.cors = true;

/**
 * 描述: 根据参数名获取地址栏参数的值. <br>
 */
function getArgumentsByName(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

$(function(){
	var id = getArgumentsByName("id");
	if (id != null && id.toString().length > 1) {
		inverstReturnList(id);
	}
});
//回款计划
function inverstReturnList(bidId){
	$(".mui-content").empty();
	$.ajax({
		url : ctxpath + "/user/getMyBidsrepay",
		type : 'post',
		dataType : 'json',
		data : {
			from : '2',
			token : token,
			pageNo : '1',
			pageSize : '12',
			bidId : bidId
		},
		success : function(json) {
			var list = json.data.userRepayPlanList;
			if(json.state == 4){
				alert("当前会话超时，请重新登陆后操作！");
			}
			var common = "<div class='invest_tab invest_user_tab'>"
				    + "<ul>"
			        + "<li class='font_size2'>待收金额(元)</li>"	
			        + "<li class='font_size28'>状态</li>"	    	
			        + "<li class='font_size28'>待收时间</li>"	    	
			        + " </ul>"	   
			        + "</div>";
			var htm = "";
			if(json.state == 0){
				$.each(list, function(index, value) {
					
					var state = value.state;
					var stateName = "";
					if(state == 2){
						stateName = "正在还款";
					}else if(state == 3){
						stateName = "已经还款";
					}
					
					
                  htm = htm + "<div class='invest_user_group'>"
		              + "<ul class='invest_user_group_one'>"
		              + "<li class='font_size26'>"+value.amount+"</li>"
                      + "<li class='font_size26'>"+stateName+"</li>"	
                      + "<li class='font_size26'>"+value.dtime+"</li>"		
                      + "</ul>"		
                      + "</div>";	
				});
				htm = common + htm;
				$(".mui-content").html(htm);
			}
		}
	});
}	

 