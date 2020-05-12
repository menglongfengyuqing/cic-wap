var score;
var awardScore;
$(function() {
	var awardId = getArgumentsByName("id");
	detail(awardId);

});

/**
 * 奖品详情
 * @param {Object} awardId
 */
function detail(awardId) {

	//奖品详情
	$.ajax({
		url: ctxpath + "/awardInfo/getAwardInfo",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			awardId: awardId
		},
		success: function(result) {
			if(result.state == "0") {
				var obj = result.data;
				awardScore = obj.needAmount;
				var htm = ""
				var awardStandard = obj.awardStandard;
				var isTrue = obj.isTrue;
				if(awardStandard == null) {
					awardStandard = "";
				}
				htm += '<div class="imp_img">' +
					'<img src="' + obj.imgWap + '" alt="" onerror="imgError(this);">' +
					'<p class="font_size26"><span class="font_size40">' + obj.needAmount + '</span>积分</p>';
				if(isTrue == "0") {
					htm += '<div class="imp_introduce font_size30"><i class="font_size24">商品</i><span>' + obj.name + '</span>' + obj.docs + '' + awardStandard + '</div>';

				} else {
					htm += '<div class="imp_introduce font_size30"><i class="font_size24">红包</i><span>' + obj.name + '</span>' + obj.docs + '' + awardStandard + '</div>';

				}
				htm += '</div>' +
					'<div class="lmp_info_group lmp_info_group_nolimit">' +
					'<h4 class="font_size30">[兑换说明]</h4>' +
					'<p class="font_size30">1.积分商城所有上架商品，用户获取形式分别为抽奖（10积分/次），和用商品所标注相应积分进行兑换。</p>' +
					'<p class="font_size30">2.用户在积分商城所抽取商品不允许做任何形式变更，均以抽到奖品为准。</p>' +
					'<p class="font_size30">3.用户抽到或者兑换奖品之后，切记认真填写收货地址，若地址没有或不明，平台不予采购寄送。</p>' +
					'<p class="font_size30">4.如您在积分商城的体验中所遇到任何疑问，请咨询平台客服，最终说明以平台微信客服为准。</p>' +
					'</div>' +
					'</div>';

				$("#write_message").attr("onclick", "conversion(" + obj.needAmount + ");");
			
				$("#write_message").attr("ondblclick", "copyText();");
				$(".integrall_mall_product_wrap").html(htm);

				$("#mall_name").html(obj.name);
				$("#mall_integral").html("积分:" + obj.needAmount);

				if(obj.isTrue == "1") { //虚拟
					$("#product_type").html("出借红包")

				} else {
					$("#product_type").html("热门商品")

				}
				$("#imgWap").html('<img src="' + obj.imgWap + '" alt="" onerror="imgError(this);">');

			} else {
				mask_login();
			}
		}
	});
}

function imgError(image) {
	image.src = "images/integral_mall/default_02.png";
}

// 获得用户积分值
function getUserBouns() {
	$.ajax({
		url: ctxpath + "/bouns/userBouns",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token
		},
		success: function(result) {
			if(result.state == '0') {
				// 				$("#userbouns").val(result.data.score);
				score = result.data.score;
				$("#my_integral").html(result.data.score);
			} else {
				//去登录
				$.cookie("token", "null");
				mask_login();
			}
		}
	});
}

/**
 * 奖品兑换
 * @param {Object} needAmount
 */
var clickTimer = null;
function conversion(needAmount) {
if(clickTimer) {
			window.clearTimeout(clickTimer);
			clickTimer = null;
		}

		clickTimer = window.setTimeout(function() {
	// 校验token 是否存在，不存在去登录页面
	if(token == null || token.trim().length <= 0) {
		mask_login();
		return false;
	}

	var Id = getArgumentsByName("id");
	$.ajax({
		url: ctxpath + "/awardInfo/awardToUser",
		type: "post",
		dataType: "json",
		data: {
			awardId: Id,
			from: '1',
			token: token,
			needAmount: needAmount
		},
		success: function(result) {
			if(result.state == "0") {
				var obj = result.data;
				if(obj.awardIsTrue == "1") { // 虚拟商品
					$(".exchange_mask_wrap").hide();
					$(".mask_backdrop").hide();
					getMsg("兑换成功");
                     setTimeout(function(){
                     	window.location = "integral_mall_win.html";
                     },2000);
					

				} else {
					$(".exchange_mask_wrap").hide();
					$(".mask_backdrop").hide();
					getMsg("兑换成功");
                     setTimeout(function(){
                      window.location = "integral_mall_order.html?userAwardId=" + obj.userAwardId;
                     },2000);
				}
			} else if(result.state == "3") {
				//积分不足
				$(".exchange_mask_wrap").removeClass("active");
				$(".mask_backdrop").hide();
				getMsg("您的积分不足，无法兑换");

			}
		}
	});
},500);
}
//错误提示
function getMsg(str) {

	$(".mask_investNo_tip").show().html(str);
	setTimeout(function() {
		$(".mask_investNo_tip").hide();
	}, 2000);
}
$(".lmp_btn").click(function() {
	$(".exchange_mask_wrap").addClass("active");
	$(".mask_backdrop").show();
		getUserBouns();
})
$(".close_mask").click(function() {
	$(".exchange_mask_wrap").removeClass("active");
	$(".mask_backdrop").hide();
});//二次点击，提示消息.
function copyText() {
  
	if (clickTimer) {
		window.clearTimeout(clickTimer);
		clickTimer = null;
	}
}