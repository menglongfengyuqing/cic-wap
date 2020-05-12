$(function() {

	$(".save_ad").click(function() {
		$(this).find("span").toggleClass("save");
		var isDefault = $("#setDefault").val();
		if(isDefault == "0") {
			$("#setDefault").val("1");
			return false;
		}
		if(isDefault == "1") {
			$("#setDefault").val("0");
			return false;
		}

	});
	var addressList = getArgumentsByName("addressList");
	if(addressList == "no") {
		$("#setDefault").val("1");
		$(".save_ad").find('span').addClass("save");
	}

	//-----------------------------省市二级联动-------------------------------------------------
	$.each(province, function(k, p) {
		var option = "<option value='" + p.code + "'>" + p.name + "</option>";
		$("#selProvince").append(option);
	});
	var selValue = $("#selProvince").val();
	$.each(city, function(k, p) {
		if(p.ProID == selValue) {
			var option = "<option value='" + p.code + "'>" + p.name + "</option>";
			$("#selCity").append(option);
		}
	});
	$("#selProvince").change(function() {
		var selValue = $(this).val();
		$("#selCity option").remove();
		$.each(city, function(k, p) {
			if(p.ProID == selValue) {
				var option = "<option value='" + p.code + "'>" + p.name + "</option>";
				$("#selCity").append(option);
			}
		});
	});
	//-----------------------------省市二级联动结束------------------------------------------------

	var id = getArgumentsByName("id");

	if(id != null && id != "") {
		// 根据id 获取地址信息

		getOneAddressInfoByID(id);
		$("#title").html("编辑收货地址");
		$("input,select,textarea").css("color", "#ccc");

		$("input,textarea").focus(function() {
			$(this).css("color", "#34393c");
		});
		$("select").change(function() {
			$("select").css("color", "#34393c");
		});
		$("#mobile").focus(function(){
			$(this).val("");
			$(this).attr("type","number");
		});

	} else {
		$("#title").html("新建收货地址");
		$("select").css("color", "#ccc");
		$("select").change(function() {
			$("select").css("color", "#34393c");
		});
	}

	// 修改或者添加地址信息 
	$(".adress_save_btn").click(function() {
		saveUserAddressInfo(id);
	});

})

function saveUserAddressInfo(id) {
	var name = $("#name").val();
	var province = $("#selProvince").val();
	var city = $("#selCity").val();
	var address = $("#address").val();
	var mobile = $("#phoneNum").val();
	var isDefault = $("#setDefault").val();
	var selProvince = $("#selProvince").val();
	var selCity = $("#selCity").val();
	console.log("isDefault == " + isDefault);

	if(name == null || name == "") {

		getMsg("请输入收货人姓名");
		return false;
	}

	if(mobile == null || mobile == "") {

		getMsg("请输入收货人手机号");
		return false;
	} else if(checkMobile(mobile) == "false") {

		getMsg("请填写11位手机号码");
		return false;
	}
	if(selProvince == "请选择所在省份") {
		getMsg("请选择所在省份");
		return false;
	}
	if(address == null || address == "") {

		getMsg("请填写详细地址");
		return false;
	} else if(address.length > 40) {
		getMsg("详细地址做多不超过40字符");
		return false;
	}

	$.ajax({
		url: ctxpath + "/userConsignee/addNewAddress",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token,
			name: name,
			mobile: mobile,
			provinceCode: province,
			cityCode: city,
			address: address,
			isDefault: isDefault,
			id: id
		},
		success: function(result) {
			if(result.state == '0') {
				$(".adress_save_btn").addClass("active");
				window.location.href = "integral_mall_address_list.html";
			}
		}
	});
}

function getOneAddressInfoByID(id) {
	$("#selCity option").remove();
	$.ajax({
		url: ctxpath + "/userConsignee/getOneAddress",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token,
			id: id
		},
		success: function(result) {
			if(result.state == '0') {
			   $("#name").val(result.data.name);
               $("#address").val(result.data.address);
                var phone = result.data.mobile.substr(0, 3) + '****' +result.data.mobile.substr(7);
                console.log(phone);
                $("#mobile").val(phone);
                $("#phoneNum").val(result.data.mobile);
				$("#addressID").val(result.data.id);
				if(result.data.isDefault == '是') {
					$(".save_ad").find("span").toggleClass("save");
					$("#setDefault").val("1");
				}

				$("#selProvince").val(result.data.provinceCode);
				
				$.each(city, function(k, p) {
					if(p.ProID == result.data.provinceCode) {
						if(result.data.cityCode == p.code) {
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
$("#deleteOne").click(function() {
	$(".mask_backdrop,.mask_points_adress_remove").show();

});
$("#deleteNo").click(function() {
	$(".mask_backdrop,.mask_points_adress_remove").hide();
});
$("#deleteYes").click(function() {
	var addId = $("#addressID").val();
	deleteOneAddressInfo(addId);
});
// 删除地址
function deleteOneAddressInfo(id) {
	if(id != null && id != "") {
		$.ajax({
			url: ctxpath + "/userConsignee/deleteOneAddress",
			type: 'post',
			dataType: 'json',
			data: {
				from: "1",
				token: token,
				id: id
			},
			success: function(result) {
				if(result.state == '0') {
					window.location.href = "integral_mall_address_list.html";
				}
			}
		});
	}
}

// 设置默认地址
function setAddressToDefault(id) {
	if(id != null && id != "") {
		$.ajax({
			url: ctxpath + "/userConsignee/setOneAddressDefault",
			type: 'post',
			dataType: 'json',
			data: {
				from: "1",
				token: token,
				id: id
			},
			success: function(result) {
				if(result.state == '0') {
					console.log(result.message);
				}
			}
		});
	}

}
//错误提示
function getMsg(str) {

	$(".mask_investNo_tip").show().html(str);
	setTimeout(function() {
		$(".mask_investNo_tip").hide();
	}, 2000);
} //手机号验证
function checkMobile(str) {
	var re = /^1\d{10}$/;
	if(re.test(str)) {

		return "true";

	} else {
		return "false";
	}
}

$("#address").keyup(function() {
	var len = $(this).val().length;
	if(len > 40) {
		getMsg("详细地址做多不超过40字符");
		$(this).val($(this).val().toString().slice(0, 40));
		return false;
	}
});
$("#mobile").keyup(function() {
	$("#phoneNum").val($(this).val());
});
