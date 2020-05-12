jQuery.support.cors = true;

$(function() {
	var Id = getArgumentsByName("id");
    detail(Id);
});

function detail(Id){
	var type = getArgumentsByName("type");
		//媒体,公告详情
		$.ajax({
		url: ctxpath + "/cms/getCmsListById",
		type:"post",
		dataType:"json",
		data:{
			Id:Id,
			from:'1'
		},
		success:function(result){
			if(result.state == "0"){
				var obj = result.data;
				var htm = ""
                console.log(obj);
                if(type==1){
                htm = "<div style='color:#100205;padding-top:0.4rem;text-align:center;line-height: 0.56rem;'>"+obj.title+"</div>"
                    + "<div style='color:#c1c1c1;line-height:0.8rem;text-align: center;font-size: 1px;'>创建时间：&nbsp;&nbsp;"+obj.sourcesDate+"</div>"
                    + "<div>"+obj.text+"</div>";
                }else{
                htm = "<div class='top'>"+obj.title+"</div>"
                    + "<div class='db'>媒体来源："+obj.sources+"&nbsp;&nbsp;"+obj.sourcesDate+"</div>"
                    + "<div class='down'>"+obj.text+"</div>";
                }

                 $(".mui-content"). html(htm);
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
