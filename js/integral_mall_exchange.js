$(function() {
	var userAwardId = getArgumentsByName("userAwardId");			// 用户奖品id


	if(token != null && token != ""){
		detail(userAwardId);
	} else {
		mask_login();
	}


});

/**
 * 奖品详情
 * @param {Object} userAwardId
 */
function detail(userAwardId){
	
	

	//奖品详情
	$.ajax({
		url: ctxpath + "/awardInfo/getUserAwardInfo",
		type:"post",
		dataType:"json",
		data:{
			from: '2',
			token: token,
			userAwardId: userAwardId
		},
		success:function(result){
			if(result.state == "0"){
				var obj = result.data;
                $("#exchange_mall_name").html(obj.awardName);
                $("#exchange_mall_integral").html(obj.realNeedAmount);
                
//				$("#availableBouns").html( obj.userAvailableBouns );
//				$(".points_prize_orderli h5").html( "实消积分:<span></span>" + obj.realNeedAmount );

				// 根据是否是虚拟商品来定义显示还是不显示地址信息
				if(obj.awardIsTrue == "0" && obj.state == "3"){		// 实物
					if($.cookie('addressId') != null && $.cookie('addressId') != ""){
						getDefaultAddressById( $.cookie('addressId'), obj.state );
						$.cookie('addressId', null);
					} else {
						getDefaultAddress( obj.state );
					}
				} 
				
				if(obj.addressId != null && obj.addressId != ""){
					getDefaultAddressById( obj.addressId, "0" );
				}


				// 按钮处理
				if(obj.state == "3"){
					$("#next_step").attr("onclick","conversion(" + obj.realNeedAmount + ", " + obj.userAvailableBouns + ");");
				} else {
//					$(".fr").css("background-color", "#e2dbdc");
					$("#next_step").html("奖品已兑换");
				}

				// 支付配送信息
//				if(obj.expressNo != null && obj.expressName != null){
//					$('#expressInfo').html( obj.expressName + "&nbsp;&nbsp;&nbsp;" + obj.expressNo )
//				}

			}else {
				mask_login();
			}
		}
	});
}

/**
 * 奖品兑换
 * @param {Object} needAmount
 */
function conversion(realNeedAmount, userAvailableBouns){

	// 校验token 是否存在，不存在去登录页面
	if(token == null || token.trim().length <= 0){
		mask_login();
		return false;
	}

	// 判断用户积分是否足够
	if(parseInt(userAvailableBouns) < parseInt(realNeedAmount)){
		alert("积分不足");
//	$(".mask_points_less").show();
//	mask.show();
		return false;
	}

	var Id = getArgumentsByName("userAwardId");
	var addressId = $('#defauleAddressId').val();

	if(addressId == null || addressId == ""){
		alert("请输入地址信息");
		return false;
	}

	$.ajax({
		url: ctxpath + "/awardInfo/myAwardInfo",
		type: "post",
		dataType: "json",
		data:{
			myAwardId: Id,
			from: '1',
			token:token,
			needAmount:parseInt(realNeedAmount),
			addressId: addressId
		},
		success:function(result){
			if(result.state == "0"){
				alert("奖品兑换成功");
               	window.location = "integral_mall_win.html";
			}
		}
	});

}



// 获取默认地址
function getDefaultAddress( state ){
	var value = null;
	$.ajax({
		url : ctxpath+"/userConsignee/addressList",
		type : 'post',
		dataType : 'json',
		data : {
			from : "1",
			token : token,
			pageNo: 1,
			pageSize: 10
		},
		success : function(result) {
			if(result.state == '0'){
				$.each(result.data, function(index, item) {
					if(item.isDefault == "是"){
						value = item;
					}
				});
				if(value == null){
					value = result.data[0];
				}
				var str = "";
				if(value != null){
					$('#defauleAddressId').val(value.id);
					$('#receive_name').val(value.name);
					$('#receive_mobile').val(value.mobile);
					$('#receive_address').val(value.province + ' ' + value.city + ' ' + value.address );
				} else {
//					str += '<div class="order_adreess_no"><a href="account_points_address.html"><img src="images/home/lottery/add_adress.png" height="76" width="334" alt=""/></a></div>';
				}


				if(state == "3"){
					// 设置点击地址去选择地址列表页面
					$("#receive_address").click(function(){
						window.location = "integral_mall_address_list.html"
					});
				}
			}
		}
	});
}


function getDefaultAddressById( addressId, state ){
	var value = null;
	$.ajax({
		url : ctxpath+"/userConsignee/getOneAddress",
		type : 'post',
		dataType : 'json',
		data : {
			from : "1",
			token : token,
			id: addressId
		},
		success : function(result) {
			console.log(addressId);
			console.log(result.data);
			if(result.state == '0'){
				value = result.data;
				var str = "";
				if(value != null){
					$('#defauleAddressId').val(value.id);
//					document.getElementById("receive_name").value=value.name;
					$("#receive_name").val(value.name);
					$('#receive_mobile').val(value.mobile);
					$('#receive_address').val(value.province + ' ' + value.city + ' ' + value.address );
				} else {
				}


				if(state == "3"){
					// 设置点击地址去选择地址列表页面
					$("#receive_address").click(function(){
						window.location = "integral_mall_address_list.html"
					});
				}
			}
		}
	});
}


//$(window).click(function(){
//	mask.close();
//	 $(".mask_points_less").hide();
//
//});
//
//var mask = mui.createMask(function(){
//	/*屏幕点击消失  回调函数*/
//
//	$(".mask_points_less").hide();
//
//});