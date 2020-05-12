$(function(){
	
	// 页面载入列出用户收货地址
	getUserAddress();	
	 
});




// 获得用户地址列表信息
function getUserAddress(){
	var address_default = "";
	var address_other = "";
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
						address_default += "<div class='adress_list_one'>"
										+ "<h4><b class='font_size34'>" + item.name + "</b><b class='font_size34'>" + item.mobile + "</b></h4>"
										+ "<p class='font_size28'>" + item.province + "&nbsp;&nbsp;" + item.city + "&nbsp;&nbsp;" + item.address+ "</p>"
										+ "<ul class='address_points_icon'>"
										+ "<li class='fl'><span class='font_size28 current'>默认地址</span>"
										+ "<input type='hidden' value='" + item.id + "'/></li>"
										+ "<li class='fl'><a href='account_points_address.html?id=" + item.id + "' class='font_size28'>编辑</a></li>"
										+ "<li class='fl address_remove_btn'><em class='font_size28'>删除</em></li>"
										+ "</ul></div>";
					} else {
						address_other += "<div class='adress_list_one'>"
										+ "<h4><b class='font_size34'>" + item.name + "</b><b class='font_size34'>" + item.mobile + "</b></h4>"
										+ "<p class='font_size28'>" + item.province + "&nbsp;&nbsp;" + item.city + "&nbsp;&nbsp;" + item.address+ "</p>"
										+ "<ul class='address_points_icon'>"
										+ "<li class='fl'><span class='font_size28'>设为默认地址</span>"
										+ "<input type='hidden' value='" + item.id + "'/></li>"
										+ "<li class='fl'><a href='account_points_address.html?id=" + item.id + "' class='font_size28'>编辑</a></li>"
										+ "<li class='fl address_remove_btn'><em class='font_size28'>删除</em></li>"
										+ "</ul></div>";
					}
				});
				
				$("#address_list").html(address_default + address_other);
				
				// 设置默认地址事件
				$(".address_points_icon li span").click(function(){
					var id = $(this).next().val();
					setAddressToDefault(id);
					$(this).addClass("current").parent().parent().parent().siblings().find("span").removeClass("current");
					$(this).html("默认地址").parent().parent().parent().siblings().find("span").html("设为默认地址");
				});
				
				/*删除地址 弹框*/
				var mask = mui.createMask(function(){
					$(".mask_points_adress_remove").hide();
				});
	
	
				// 点击删除button
				$(".address_remove_btn").click(function(){
					var flag_this = $(this);
					var id = flag_this.siblings().find("span").next().val();
					mask.show();
					$(".mask_points_adress_remove").show();
					
					$(".ad_remove_yes p").click(function(){
						flag_this.parent().parent().remove();
						mask.close();
						$(".mask_points_adress_remove").hide();
						
						// 删除方法
						deleteOneAddressInfo(id);
					});
				});
				
				$(".ad_remove_no").click(function(){
					mask.close();
					$(".mask_points_adress_remove").hide();
				});
				
				// 点击地址默认选中，返回id给订单页面
				$(".adress_list_one b").click(function(){
					var addressId = $(this).parent().parent().find("input").val();
					$.cookie('addressId', addressId);
					console.log($.cookie('addressId'));
					history.go(-1);
				});
        
			}
		}
	});
}


// 删除地址
function deleteOneAddressInfo(id){
	if(id != null && id != ""){
		$.ajax({
			url : ctxpath+"/userConsignee/deleteOneAddress",
			type : 'post',
			dataType : 'json',
			data : {
				from : "1",
				token : token,
				id: id
			},
			success : function(result) {
				if(result.state == '0'){
					location.reload();
				}
			}
		});
	}
}

// 设置默认地址
function setAddressToDefault(id){
	if(id != null && id != ""){
		$.ajax({
			url : ctxpath+"/userConsignee/setOneAddressDefault",
			type : 'post',
			dataType : 'json',
			data : {
				from : "1",
				token : token,
				id: id
			},
			success : function(result) {
				if(result.state == '0'){
					console.log(result.message);
				}
			}
		});
	}
	
}
