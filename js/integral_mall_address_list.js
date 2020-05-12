$(function(){
	
	var userAwardId=$.cookie("userAwardId");
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
				if(result.data.length>7){
					$("#newUserAddress").click(function(){
						getMsg("地址已超过8条,请手动删除后可再次新增地址");
					});
				}
				else if(result.data.length>0){
				 $("#newUserAddress").attr("href","integral_mall_address.html");
					
				}
				
				else{
					$("#newUserAddress").attr("href","integral_mall_address.html?addressList=no");
					getNoneMsg();
				}
				
				$.each(result.data, function(index, item) {
					var phone=item.mobile.substr(0, 3) + '****' +item.mobile.substr(7);
					if(item.isDefault == "是"){
						
						address_default += "<div class='adress_list_one'>"
										+ "<div class='adress_list_one_l fl'><h4><b class='font_size30'>" + item.name + "</b><b class='font_size26'>" + phone+ "</b></h4>"
										+ "<p class='font_size26'><span>[默认]</span>" + item.province + item.city + item.address+ "</p>"
										+ "<input type='hidden' value='" + item.id + "'/></div>"
										+ "<a href='integral_mall_address.html?id=" + item.id + "' class='font_size26 fr'>编辑</a>"
										+ "</div>";
					} else {
						address_other += "<div class='adress_list_one'>"
										+ "<div class='adress_list_one_l fl'><h4><b class='font_size30'>" + item.name + "</b><b class='font_size30'>" + phone + "</b></h4>"
										+ "<p class='font_size26'>" + item.province + item.city + item.address+ "</p>"
										+ "<input type='hidden' value='" + item.id + "'/></div>"
										+ "<a href='integral_mall_address.html?id=" + item.id + "' class='font_size26 fr'>编辑</a>"
										+"</div>";
					}
				});
				
				$("#address_list").html(address_default + address_other);
				
			
				// 点击地址默认选中，返回id给订单页面
				$(".adress_list_one_l").each(function(){
					$(this).click(function(){
				
					var addressId=$(this).children("input").val();
					var userAwardId=$.cookie("userAwardId");
					window.location.href="integral_mall_order.html?userAwardId="+userAwardId+"&addressId="+addressId;
				});
				})
				
        
			}
		}
	});
}


//错误提示
function getMsg(str) {

	$(".mask_investNo_tip").show().html(str);
	setTimeout(function() {
		$(".mask_investNo_tip").hide();
	}, 2000);
}
/*暂无地址*/
function getNoneMsg() {
	$(".news_null_wrap").show();
}