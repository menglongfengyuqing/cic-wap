jQuery.support.cors = true;
var pageNo = parseInt(1);
var pageSize = parseInt(8);

$(function() {
	
    mediacoverageList(pageNo,pageSize);
    
    $(window).bind("scroll", function () {
       	if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
       		pageNo = document.getElementById("pageNo").value;
       		var last = document.getElementById("last").value;
       		if(parseInt(pageNo) > parseInt(last)){
       			$(".error_msg_wrap p").html("没有更多数据");
				$(".error_msg_wrap p").css("visibility", "visible");
       			setTimeout("getMsg()",2000);
            } else {
            	mediacoverageList(pageNo, pageSize);
            }
        } 
	});
});

function mediacoverageList(pageNo,pageSize){
		//媒体公告
		$.ajax({
		url: ctxpath + "/cms/getCmsListByType",
		type:"post",
		dataType:"json",
		data:{
			pageNo:pageNo,
			pageSize:pageSize,
			type:'2',
			from:'1'
		},
		success:function(result){
			
			document.getElementById("last").value = result.data.pageCount;
			document.getElementById("pageNo").value = result.data.pageNo + 1;
			if(result.state == "0"){
				var obj = result.data;
				console.log(obj);
				var list = obj.cmsList;
				var htm = "";
				$.each(list,function(index, value) {
				    
				    htm = htm + "<dl class='report_group'>"
				              + "<dd>"
				              + "<h5 style='width: 8rem;' class='font_size30'>"+value.title+"</h5>"
				              + "<p class='font_size20'>创建时间：&nbsp;&nbsp;"+value.sourcesDate+"</p>"
				              + "</dd>"
				              + "<dt>"
				              + "<a style='color: #b7b5b5;line-height:0.666667rem;margin-left:2rem;' href='more_media_detail.html?id="+value.id+"&type=1'>详情</a>"
				              //+ "<img src='"+value.imgPath+"' />"
				              + "</dt>"
				              + "</dl>";
				               
				});
				$(".mui-content").html($(".mui-content").html()+htm);
			}
		}
	});
}