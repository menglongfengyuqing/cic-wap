
var from = '2';

$(function() {
	var noticeid = getArgumentsByName("noticeid");
    detail(noticeid);
});

function detail(noticeid){
		//教育详情
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
                htm += '<div class="top font_size30">'+obj.title+'</div>'
                    +  '<div class="db font_size24">媒体来源：'+obj.sources+'&nbsp;&nbsp;'+obj.sourcesDate+'</div>'
                    +  '<div class="down">'
                    +  '<p>'+str+'</p>'
                    +  '</div>';
				$("#edu_sub"). html(htm);
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
