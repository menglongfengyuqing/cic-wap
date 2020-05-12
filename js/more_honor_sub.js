//jQuery.support.cors = true;

$(function() {
	var Id = getArgumentsByName("id");
    detail(Id);
});

function detail(Id){
//	var type = getArgumentsByName("type");
		//媒体,公告详情
		$.ajax({
		url: ctxpath + "/cms/getCmsNoticeById",
		type: "post",
		dataType: "json",
		data:{
			noticeId: Id,
			from: '1'
		},
		success:function(result){
			if(result.state == "0"){
				var obj = result.data;
				var htm = "";
				$("#titleName").html(obj.title);
				htm+='<div class="top font_size30">'+obj.title+'</div>'
					+'<div class="db font_size26">媒体来源：'+obj.sources+"&nbsp;&nbsp;"+obj.createDate+'</div>'
					+'<div class="down font_size28">'
		       		+'<div class="font_size28 wrap">'+obj.text+'</div>'
		       		+'</div>';
//				
//				
//              if(type==1){
//	                htm = "<div class='top'>"+obj.title+"</div>"
//	                    + "<div class='db'>创建时间：&nbsp;&nbsp;"+obj.createDate+"</div>"
//	                    + "<div class='down'>"+obj.text+"</div>";
//
//              }else{
//	                htm = "<div class='top'>"+obj.title+"</div>"
//	                    + "<div class='db'>媒体来源："+obj.sources+"&nbsp;&nbsp;"+obj.createDate+"</div>"
//	                    + "<div class='down'>"+obj.text+"</div>";
//
//	                    
//              }
//	            document.title = obj.title+"——中投摩根";

                
                $(".more_honor_sub").html(htm);
                 $(".down p,.down span").addClass("ftim");

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
