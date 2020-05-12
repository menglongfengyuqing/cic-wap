$(function() {
	var awardId = getArgumentsByName("id");
    detail(awardId);
});

/**
 * 奖品详情
 * @param {Object} awardId
 */
function detail(awardId){

		//奖品详情
		$.ajax({
		url: ctxpath + "/awardInfo/getAwardInfo",
		type:"post",
		dataType:"json",
		data:{
			from: '2',
			awardId: awardId
		},
		success:function(result){
			if(result.state == "0"){
				var obj = result.data;
				var htm = ""
                htm = htm + "<div class='points_prized_img'><img src='"+obj.imgWap+"' /></div>"
                          + "<div class='prized_msg'>"
                          + "<h3 class='font_size30'>"+obj.name+"</h3>"
                          + "<p class='font_size28'> 中投摩根献福利      积分兑换豪礼火热进行中！</p>"
                          + "<h4 class='font_size40'><b class='font_size40'>积分</b> <b class='font_size40'>"+obj.needAmount+"</b></h4>"
                          + "<dl>"
                          + "<dt class='fl font_size28'>商品介绍：</dt>"
                          + "<dd class='fl font_size28'>"+obj.docs+"</dd>"
                          + "</dl>"
                          + "</div>";
                $(".points_prize_footer a").attr("onclick","conversion("+obj.needAmount+");");
				$(".prized_msg").html(htm);
			}else {
				window.location.href = "login.html";
			}
		}
	});
}

/**
 * 奖品兑换
 * @param {Object} needAmount
 */
function conversion(needAmount){

	// 校验token 是否存在，不存在去登录页面
	if(token == null || token.trim().length <= 0){
		window.location.href = "login.html";
		return;
	}

	var Id = getArgumentsByName("id");
	$.ajax({
		url: ctxpath + "/awardInfo/awardToUser",
		type: "post",
		dataType: "json",
		//async: false,
		data:{
			awardId: Id,
			from: '1',
			token:token,
			needAmount:needAmount
		},
		success:function(result){
			if(result.state == "0"){
				var obj = result.data;
				if(obj.awardIsTrue == "1"){		// 虚拟商品
					alert("奖品兑换成功");
					window.location = "account_points_win.html";
				} else {
					window.location = "account_points_order.html?userAwardId=" + obj.userAwardId;
				}
			}
              else if(result.state == "3"){
                mask.show();
                $(".mask_points_less_d").show();
        //        console.log("积分不足");
              }
		}
	});

}

/**
 * 描述: 根据参数名获取地址栏参数的值. <br>
 */
function getArgumentsByName(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

$(window).click(function(){
  mask.close();
   $(".mask_points_less_d").hide();

});

var mask = mui.createMask(function(){
  /*屏幕点击消失  回调函数*/
  $(".mask_points_less_d").hide();
});