jQuery.support.cors = true;
var re = /^1\d{10}$/;

$("#leaveMessage").click(function(){
	var name = $("#name").val().trim();
	var mobile = $("#mobile").val().trim();
	var bussinessName = $("#bussinessName").val().trim();
	var message = $("#message").val().trim();
	
	if(name==""){
		$(".mask").show();
		$("#submit_static_n").html("请填写姓名");
		$("#mask_static_n").show();
		return;
	}
	if(mobile==""){
		$(".mask").show();
		$("#submit_static_n").html("请填写手机号");
		$("#mask_static_n").show();
		return;
	}
	if(!re.test(mobile)){
		$(".mask").show();
		$("#submit_static_n").html("手机号格式有误");
		$("#mask_static_n").show();
		return;
	}
	if(bussinessName==""){
		$(".mask").show();
		$("#submit_static_n").html("请填写公司名称");
		$("#mask_static_n").show();
		return;
	}
	if(message==""){
		$(".mask").show();
		$("#submit_static_n").html("请填写留言");
		$("#mask_static_n").show();
		return;
	}
		//向后台发送处理数据
	 $.ajax({
		url: ctxpath+"/cms/leaveMessage",
		type:"post",
		dataType:"json",
		data:{
			from:'2',
			name:name,
			mobile:mobile,
			bussinessName:bussinessName,
			message:message
		},
		success:function(result){
			//console.log(result.data);
			if(result.state == "2"){
				$(".mask").show();
				$("#submit_static").html("留言失败");
				$("#mask_static").show();
			}
			if(result.state == "1"){
				$(".mask").show();
				$("#submit_static").html("留言成功");
				$("#mask_static").show();
			}
			if(result.state == "3"){
				$(".mask").show();
				$("#submit_static").html("留言失败");
				$("#mask_static").show();
			}
		}
	});
	
	
	
});

$(".close_mask_static").click(function(){
	window.location.reload();
});

$(".close_mask_static_n").click(function(){
	$(".mask").hide();
	$("#mask_static_n").hide();
});

