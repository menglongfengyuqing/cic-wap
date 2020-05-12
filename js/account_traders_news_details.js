
var from = '2';
$(function() {
	var newsid = getArgumentsByName("newsid");
    
    if( token != null && token.trim().length > 0 ){
		detail(newsid);
	} else {
		window.location.href = "login.html";
	}
});

function detail(newsid){
	$.ajax({
		url: ctxpath + "/station/letterInfo",
		type:"post",
		dataType:"json",
		data:{
			from: from,
			token: token,
			letterId: newsid		
		},
		success:function(result){
			console.log(result);
			if(result.state == "4"){
				window.location.href = "login.html";
			}
			if(result.state == "0"){
				var obj = result.data;
				var htm = ""
                console.log(obj);
                htm += "<div class='news_group'>"
					 + "<div class='news_group_top'>";
					 
				if(obj.letterType == '1'){                                                                                                                
					htm += "<b class='font_size30'>出借消息</b>";    
				} else if(obj.letterType == '2'){                                                                                                         
					htm += "<b class='font_size30'>还款消息</b>";    
				} else if(obj.letterType == '3'){                                                                                                         
					htm += "<b class='font_size30'>充值消息</b>";    
				} else if(obj.letterType == '4'){                                                                                                         
				    htm += "<b class='font_size30'>提现消息</b>";    
				} else {                                                                                                                                   
					htm += "<b class='font_size30'>其他消息</b>";    
				}                                                                                                                                          

                htm += "<span class='font_size18'></span></div>"
					 + "<div class='news_trades_con'>"
					 + "<p class='font_size20'>&nbsp;&nbsp;&nbsp;&nbsp;" + obj.title + obj.body + "</p></div></div>";
					 
				$(".news_traders_wrap"). html(htm);
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
