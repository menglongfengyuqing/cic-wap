var pageNo = '1';
var pageSize = '15';
var type = '2';
var from = '2';
$(function(){
	
	getCmsNoticeList(pageNo, pageSize, type);
	$(window).bind("scroll", function () {
       	if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
       		pageNo = document.getElementById("pageNo").value;
       		var last = document.getElementById("last").value;
       		
       		if(parseInt(pageNo) > parseInt(last)){
       			$(".no_news_traders_wrap p").html("没有更多数据");
				$(".no_news_traders_wrap p").css("visibility", "visible");
       			setTimeout("getNoneMsg()",2000);
            } else {
            	getCmsNoticeList(pageNo, pageSize, type)
            }
        } 
	});
})


function getCmsNoticeList(pageNo, pageSize, type){
	$.ajax({
		url: ctxpath + "/cms/getCmsListByType",
		type:"post",
		dataType:"json",
		data:{
			from: from,
			pageNo: pageNo,
			pageSize: pageSize,
			type: type
		},
		success:function(result){
			
			if(result.state == "4"){
				window.location.href = "login.html";
			}
			
			if(result.state == "0"){
				var str = "";
				var cmsList = result.data.cmsList;
				console.log(result.data);
				document.getElementById("pageNo").value = parseInt(result.data.pageNo) + 1;
				document.getElementById("last").value 	= result.data.pageCount;
				if(cmsList.length>0){
					
				
				$.each(cmsList, function(index, item){
					str += "<div class='news_bar'></div><div class='news_group'>"+
					       "<div class='news_group_top news_icon_cur'>"+
						   "<a class='fl font_size30' href='account_announcement_details.html?noticeid="+item.id+"&app="+app+"'>&nbsp;&nbsp;" + item.title + "</a>"+
					       "<span class='font_size26 fr'>" + item.createDate.substr(0,10) + "</span></div>"+
						  "<div class='news_trades_con'>"+
						   "<p class='font_size20'>" + "</p></div></div>";
				})
				$('.news_traders_wrap').html($('.news_traders_wrap').html() + str);
				}
				else{
					getNoneMsg();
				}
			}
		}
	});
}


function getNoneMsg() {
	$(".news_null_wrap").show();
	$(".mui-content,html,body").css("background","#f8f8f8");
}