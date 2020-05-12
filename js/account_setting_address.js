//mui初始化
mui.init();

var mask = mui.createMask(function(){
	$(".setting_success").hide();
});

$(".setting_submite").click(function(){
	updateUserAddress();
});

$(".setting_close").click(function(){
	$(".setting_success").hide();
	mask.close();//显示遮罩
});
	
	
$(function(){
	//-----------------------------省市二级联动-------------------------------------------------
	$.each(province, function (k, p) { 
	    var option = "<option class='font_size30' value='" + p.code + "'>" + p.name + "</option>";
	    $("#selProvince").append(option);
	});
	var selValue = $("#selProvince").val();
	$.each(city, function (k, p) { 
	    if (p.ProID == selValue) {
	        var option = "<option class='font_size30' value='" + p.code + "'>" + p.name + "</option>";
	        $("#selCity").append(option);
	    }
	});
	$("#selProvince").change(function () {
	    var selValue = $(this).val(); 
	    $("#selCity option").remove();         
	    $.each(city, function (k, p) { 
	        if (p.ProID == selValue) {
	            var option = "<option class='font_size30' value='" + p.code + "'>" + p.name + "</option>";
	            $("#selCity").append(option);
	        }
	    });         
	});  
	//-----------------------------省市二级联动结束------------------------------------------------
	
	if( token != null && token.trim().length > 0 ){
		$.ajax({
			url : ctxpath + "/user/getUserInfo",
			type : 'post',
			dataType : 'json',
			data : {
				from : '2',
				token: token
			},
			success : function(json) {
				if(json.state == "0"){
					var address = json.data.address
					if(address != ""){
						address = address.split("--");
						var provice = address[0];
						var city1	= address[1];
						var street	= address[2];
						var door	= address[3];
						$("#selProvince").val(provice);
						$("#selCity option").remove();         
			    		$.each(city, function (k, p) { 
		        			if (p.ProID == provice) {
		        				if(city1 == p.code){
		        					var option = "<option value='" + p.code + "' selected='selected'>" + p.name + "</option>";
		        				} else {
		        					var option = "<option value='" + p.code + "'>" + p.name + "</option>";
		        				}
			            		$("#selCity").append(option);
				        	}
			    		});
						$("#street").val(street);
						$("#door").val(door);
					}
				}
				else{
					$.cookie("token",null);
					mask_login();
				}
			}
		});
	} else {
		window.location.href = "login.html";
	}
	
});


function updateUserAddress(){
	$(".error_msg_wrap p").css("visibility", "hidden");
	var provice = $("#selProvince").val();
	var city = $("#selCity").val();
	var street = $('#street').val();
	if(street == "" || street == null){
		$('.error_msg_wrap p').html("请输入小区名");
		$('.error_msg_wrap p').css("visibility", "visible");
		return false;
	}
	
	var door = $('#door').val();
	if(door == "" || door == null){
		$('.error_msg_wrap p').html("请输入详细地址");
		$('.error_msg_wrap p').css("visibility", "visible");
		return false;
	}
	
	
	var address = provice + "--" + city + "--" + street + "--" + door;
	if( token != null && token.trim().length > 0 ){
		$.ajax({
			url : ctxpath + "/user/updateAddress",
			type : 'post',
			dataType : 'json',
			data : {
				from : '2',
				token: token,
				address: address
			},
			success : function(json) {
				if(json.state == "0"){
					$(".setting_success").show();
					mask.show();
				}
			}
		});
	} else {
		window.location.href = "login.html";
	}
}


