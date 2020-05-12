jQuery.support.cors = true;

var app =  getArgumentsByName("app");
$(function() {
	
	if(app == 1 || app == "1"){
		$(".wap_tit").hide();
	}
    mediacoverageList();
    
});

function mediacoverageList(){
		//媒体公告
		$.ajax({
		url: ctxpath + "/volunteer/getVolunteerOfferList",
		type:"post",
		dataType:"json",
		data:{
			from:'1'
		},
		success:function(result){
			if(result.state == "0"){
				var obj = result.data;
				var list = obj.list;
				var htm = "";
				console.log(obj);
				$("#count").html("目前共累计捐款总额"+obj.totalAmount+"元");
				$.each(list,function(index, value) {
				     htm = htm + "<li class='odd'>"
				               + "<span class='active_span01 font_size28'>"+value.name+"</span>"
				               + "</span><span class='active_span03 font_size28'>完成了1元捐款</span></li>";
				});
				console.log(htm);
				$("#mayList").html(htm);
			}
		}
	});
}
