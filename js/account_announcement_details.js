
var from = '2';

$(function() {
	var noticeid = getArgumentsByName("noticeid");
    detail(noticeid);
});

function detail(noticeid){
	var type = getArgumentsByName("type");
		//媒体,公告详情
		$.ajax({
		url: ctxpath + "/cms/getCmsNoticeById",
		type:"post",
		dataType:"json",
		data:{
			from: from,
			noticeId: noticeid		
		},
		success:function(result){
			if(result.state == "0"){
				var obj = result.data;
				var str = obj.text;
				var htm = ""
                $("#titleName").html(obj.title);
                
                htm += "<div class='news_group'>"
					 + "<div class='news_group_top'>"
					 + "<b class='font_size30'>" + obj.title + "</b></br>"
                	 + "</div>"
					 + "<div class='news_trades_con'>"
					 + "<div class='font_size30'>" + str + "</div></div></div>";
				$(".news_traders_wrap"). html(htm);
				
				 $(".news_trades_con p").addClass("font_size30");
			}
		}
	});
}

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
