$(function(){

	$(".save_ad").click(function(){
        $(this).find("span").toggleClass("save");
		var isDefault = $("#setDefault").val();
        if( isDefault == "0" ){
        	$("#setDefault").val("1");
        	return false;
        }

        if( isDefault == "1" ){
        	$("#setDefault").val("0");
        	return false;
        }

    });


	//-----------------------------省市二级联动-------------------------------------------------
	$.each(province, function (k, p) {
	    var option = "<option value='" + p.code + "'>" + p.name + "</option>";
	    $("#selProvince").append(option);
	});
	var selValue = $("#selProvince").val();
	$.each(city, function (k, p) {
	    if (p.ProID == selValue) {
	        var option = "<option value='" + p.code + "'>" + p.name + "</option>";
	        $("#selCity").append(option);
	    }
	});
	$("#selProvince").change(function () {
	    var selValue = $(this).val();
	    $("#selCity option").remove();
	    $.each(city, function (k, p) {
	        if (p.ProID == selValue) {
	            var option = "<option value='" + p.code + "'>" + p.name + "</option>";
	            $("#selCity").append(option);
	        }
	    });
	});
	//-----------------------------省市二级联动结束------------------------------------------------

	var id = getArgumentsByName("id");

	if(id != null && id != ""){
		// 根据id 获取地址信息
		getOneAddressInfoByID(id);
	}

	// 修改或者添加地址信息
	$(".adress_save_btn").click(function(){
		saveUserAddressInfo(id);
	});

})


function saveUserAddressInfo(id){
	var name = $("#name").val();
	var province = $("#selProvince").val();
	var city = $("#selCity").val();
	var address = $("#address").val();
	var mobile = $("#mobile").val();
	var isDefault = $("#setDefault").val();
	console.log("isDefault == " + isDefault);

	if(name == null || name == ""){
		$("#errorMsg").show().html("请输入收货人姓名");
		return false;
	}

	if(mobile == null || mobile == ""){
		$("#errorMsg").show().html("请输入收货人手机号");
		return false;
	}

	if(address == null || address == ""){
		$("#errorMsg").show().html("请输入收货人详细地址");
		return false;
	}

	$.ajax({
		url : ctxpath+"/userConsignee/addNewAddress",
		type : 'post',
		dataType : 'json',
		data : {
			from : "1",
			token : token,
			name: name,
			mobile: mobile,
			provinceCode: province,
			cityCode: city,
			address: address,
			isDefault: isDefault,
			id: id
		},
		success : function(result) {
			if(result.state == '0'){
				$(".adress_save_btn").addClass("active");
//				window.location.href="integral_mall_order.html";
				history.go(-1);
			}
		}
	});
}


function getOneAddressInfoByID(id){
	$.ajax({
		url : ctxpath+"/userConsignee/getOneAddress",
		type : 'post',
		dataType : 'json',
		data : {
			from : "1",
			token : token,
			id: id
		},
		success : function(result) {
			if(result.state == '0'){
				var name = $("#name").val(result.data.name);
				var address = $("#address").val(result.data.address);
				var mobile = $("#mobile").val(result.data.mobile);
				if(result.data.isDefault == '是'){
					$(".save_ad").find("span").toggleClass("save");
					$("#setDefault").val("1");
				}

				$("#selProvince").val(result.data.provinceCode);
				$("#selCity option").remove();
	    		$.each(city, function (k, p) {
        			if (p.ProID == result.data.provinceCode) {
        				if(result.data.cityCode == p.code){
        					var option = "<option value='" + p.code + "' selected='selected'>" + p.name + "</option>";
        				} else {
        					var option = "<option value='" + p.code + "'>" + p.name + "</option>";
        				}
	            		$("#selCity").append(option);
		        	}
	    		});
			}
		}
	});
}
