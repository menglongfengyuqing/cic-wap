$(function() {
	var userAwardId = getArgumentsByName("userAwardId"); // 用户奖品id
	$.cookie("userAwardId", userAwardId);

	if(token != null && token != "") {

		detail(userAwardId);

	} else {
		mask_login();
	}

});

/**
 * 奖品详情
 * @param {Object} userAwardId
 */
function detail(userAwardId) {

	//奖品详情
	$.ajax({
		url: ctxpath + "/awardInfo/getUserAwardInfo",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			token: token,
			userAwardId: userAwardId
		},
		success: function(result) {
			if(result.state == "0") {
				var obj = result.data;
				var htm = ""
				htm = htm + "<div class='points_orderm_img fl'>" +
					"<img src='" + obj.awardImgWap + "' alt='' onerror='imgError(this);'/>" +
					"</div>" +
					"<div class='points_orderm_detalis fl'>" +
					"<h4 class='font_size30'>" + obj.awardName + "</h4>" +
					"<p class='font_size26'>" + obj.awardDocs + "</p>" +
					"<h5 class='font_size30'>" + obj.awardNeedAmount + "积分</h5>" +
					"</div>";
				$("#awardInfoDetail").html(htm);
				$("#availableBouns").html(obj.userAvailableBouns);
				var realNeedAmount = obj.realNeedAmount;

				if(realNeedAmount == 0) {
					$(".points_prize_orderli h5").html("实消积分:10(抽奖)");
				} else {
					$(".points_prize_orderli h5").html("实消积分:" + obj.realNeedAmount);
				}
				if(obj.state == 0) { //待下单
					$("#stateBtn").html("确认下单").css("background", "#d40f42");;
					$("#deadline").addClass("cur");
					$("#stateBtn").click(function() {
						conversion(obj.realNeedAmount, obj.userAvailableBouns);
					});
					$(".noHidden").remove();
				} else if(obj.state == 1) {
					$("#stateBtn").html("已下单").css("background", "#ccc");

				} else if(obj.state == 2) { //已发单
					$("#stateBtn").html("已发货").css("background", "#ccc");

				} else if(obj.state == 3) {
					$("#stateBtn").html("已结束").css("background", "#ccc");

				} else if(obj.state == 4) {
					$("#stateBtn").html("已兑现").css("background", "#ccc");

				} else if(obj.state == 5) {
					$("#stateBtn").html("已失效").css("background", "#ccc");

				}

				$("#deadline").html(obj.deadline);
				// 支付配送信息
				if(obj.expressNo != null) {
					$('#expressNo').html(obj.expressNo);
				}
				if(obj.expressName != null) {
					$('#expressName').html(obj.expressName);
				}
				var obAddress = obj.addressId;
				var addressId = getArgumentsByName("addressId");
				if(addressId == null || addressId == "") {
					if(obAddress == null || obAddress == "") {

						getDefaultAddress();

					} else {
						getDefaultAddressById(obj.addressId, "0");

					}

				} else {

					getDefaultAddressById(addressId, "2");
				}

			} else {
				mask_login();
			}
		}
	});
}

/**
 * 奖品兑换
 * @param {Object} needAmount
 */
function conversion(realNeedAmount, userAvailableBouns) {

	// 校验token 是否存在，不存在去登录页面
	if(token == null || token.trim().length <= 0) {
		mask_login();
		return false;
	}
	var adreess_have = $(".order_adreess_have").html();
	if(adreess_have == null || adreess_have == "") {
		getMsg("地址不能为空");
		return false;
	}
	// 判断用户积分是否足够
	if(parseInt(userAvailableBouns) < parseInt(realNeedAmount)) {
		getMsg("积分不足")
		return false;
	}

	var Id = getArgumentsByName("userAwardId");
	var addressId = $('#defauleAddressId').val();
	if(addressId == "") {
		getMsg("请输入地址");
		return false;
	}
	$.ajax({
		url: ctxpath + "/awardInfo/myAwardInfo",
		type: "post",
		dataType: "json",
		data: {
			myAwardId: Id,
			from: '1',
			token: token,
			needAmount: parseInt(realNeedAmount),
			addressId: addressId
		},
		success: function(result) {
			if(result.state == "0") {
				console.log("奖品兑换成功");
				window.location = "integral_mall_win.html";
			} else if(result.state == "3") {
				getMsg(result.message);
				setInterval(function() {
					window.location.href = "integral_mall_home.html";
				}, 2000)
			}
		}
	});

}

// 获取默认地址
function getDefaultAddress(state) {
	var value = null;
	$.ajax({
		url: ctxpath + "/userConsignee/addressList",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token,
			pageNo: 1,
			pageSize: 10
		},
		success: function(result) {
			if(result.state == '0') {
				$.each(result.data, function(index, item) {
					if(item.isDefault == "是") {
						value = item;
					}
				});

				var str = "";
				if(result.data == "" || result.data == null) {
					str += '<div class="order_adreess_no"><a href="integral_mall_address.html?addressList=no" class="font_size30">新增收货地址</a></div>';

				} else {

					
					value = result.data[0];
				   $('#defauleAddressId').val(value.id);
					var phone=value.mobile.substr(0, 3) + '****' +value.mobile.substr(7);
					var userAwardId = getArgumentsByName("userAwardId"); // 用户奖品id
					str += '<div class="order_adreess_have"><a href="integral_mall_address_list.html?userAwardId=' + userAwardId + '"><h4><span class="font_size30">收货人:' +
						value.name + '</span class="font_size30 fl"><span class="fr font_size30">' + phone+ '</span></h4>' +
						'<p class="font_size26 clear">收货地址:' + value.province + value.city + value.address + '</p></a></div>';
				}

				$('.points_order_adress').html(str);

			}
		}
	});
}

function getDefaultAddressById(addressId, state) {

	$.ajax({
		url: ctxpath + "/userConsignee/getOneAddress",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token,
			id: addressId
		},
		success: function(result) {
			console.log(result.data);
			if(result.state == '0') {
				value = result.data;
				var str = "";
				$('#defauleAddressId').val(value.id);
				str += '<div class="order_adreess_have">';
				if(state == "2") {
					var phone=value.mobile.substr(0, 3) + '****' +value.mobile.substr(7);
					var userAwardId = getArgumentsByName("userAwardId"); // 用户奖品id
					str += '<a href="integral_mall_address_list.html?userAwardId=' + userAwardId + '" ><h4><span class="font_size30">收货人:' +
						value.name + '</span class="font_size30 fl"><span class="fr font_size30">' + phone + '</span></h4>' +
						'<p class="font_size26">收货地址:' + value.province + value.city + value.address + '</p></a></div>';

				} else {
					var phone=value.mobile.substr(0, 3) + '****' +value.mobile.substr(7);
					str += '<a href="javascript:;" ><h4><span class="font_size30">收货人:' +
						value.name + '</span class="font_size30 fl"><span class="fr font_size30">' + phone + '</span></h4>' +
						'<p class="font_size26 default">收货地址:' + value.province + value.city + value.address + '</p></a></div>';

				}

				$('.points_order_adress').html(str);

			}
		}
	});
}

function imgError(image) {
	image.src = "images/integral_mall/default_02.png";
}
$(window).click(function() {
	$(".mask_backdrop").hide();
	$(".mask_points_less").hide();

});
$(".mask_backdrop").click(function() {
	$(this).hide();
	$(".mask_points_less").hide();

}); //错误提示
function getMsg(str) {

	$(".mask_investNo_tip").show().html(str);
	setTimeout(function() {
		$(".mask_investNo_tip").hide();
	}, 2000);
}