/*
* @Author: Fern
* @Date:   2017-07-18 16:26:52
* @Last Modified by:   timefiles
* @Last Modified time: 2017-08-02 17:58:24
*/

'use strict';
var pageSize = 10;
var pageNo = 1;
$(document).ready(function(){
	
	$(window).bind("scroll", function() {
		if($(document).scrollTop() + $(window).height() >= $(document).height()) {
			pageNo = document.getElementById("pageNo").value;
			var last = document.getElementById("last").value;
			//     		var span = document.getElementById("span").value;

			if(parseInt(pageNo) > parseInt(last)) {
				//     			$(".error_msg_wrap p").html("没有更多数据");
				//				$(".error_msg_wrap p").css("visibility", "visible");
				//     			setTimeout("getMsg()",2000);
			} else {
				getCmsList(pageNo, pageSize);
			}
		}
	});
    getCmsList(pageNo,pageSize);
})

function getCmsList(pageNo,pageSize){
	 	$.ajax({
		url: ctxpath + "/cms/getCmsListByType",
		type:"post", 
		dataType:"json",
		data:{
			pageNo:pageNo,
			pageSize:pageSize,
			type:'3',
			from:'1'
		},
		success:function(result){
			if(result.state == "0"){
				document.getElementById("pageNo").value = parseInt(result.data.pageNo) + 1;
				document.getElementById("last").value = parseInt(result.data.pageCount);
				var obj = result.data;
				var list = obj.cmsList;
				var htm = "";
				var valueId;
				$.each(list,function(index, value) {
					valueId = value.id;
				     htm = htm+'<div class="honor_media_group" onclick="window.location.href=\'more_honor_sub.html?id='+value.id+'&app='+app+'\'">'
				     	      +'<dl class="fl">'
				     	      +'<dt class="font_size30">'+value.title+'</dt>'
				     	      +'<dd class="font_size24"><span>'+value.sources+'</span> <span>'+value.sourcesDate+'</span> </dd>'
				     	      +'</dl>'
				     	      +'<div class="honor_img fr">'
				     	      +'<img src="'+value.imgPath+'" alt="" onerror="imgError(this);"/>'
				     	      +'</div>'
				     	      +'</div>';
				});
				$("#mediaReport_body").append(htm);
			}
		}
   });
}

function imgError(image) {
	image.src = "images/find/default_03.png";
}