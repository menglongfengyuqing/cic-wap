jQuery.support.cors = true;
var Eq;
/*banner scroll*/
$(function() {

	if(token != null && token.trim().length > 0) {
		//优惠券状态展示
		getWorldCupVouAmountList();
	}
	
	var date = new Date();
	var year = date.getFullYear(); //获取当前年份   
	var mon = date.getMonth() + 1; //获取当前月份   
	var da = date.getDate(); //获取当前日   
	var day = date.getDay(); //获取当前星期几   
	var h = date.getHours(); //获取小时   
	var m = date.getMinutes(); //获取分钟   
	var s = date.getSeconds(); //获取秒   
	console.log('当前时间:' + year + '-' + mon + '-' + da);
	$(".ranking_tab li").each(function(index, item) {
		var dataS =da + "日";
		var str = item.innerHTML;
		if(str == dataS) {
			$(this).addClass("cur").siblings().removeClass("cur");
			 Eq=index;
			console.log(Eq);
		}
	});

	//用户排行榜
	worldCupInvest(year + '-' + mon + '-' + da);
	var swiper = new Swiper('.swiper-container', {
		slidesPerView: 3,
		spaceBetween: 0,
		slidesPerGroup: 1,
		loop: false,
		initialSlide :Eq,
		loopFillGroupWithBlank: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		}
	});
});
$(".ranking_tab li").click(function() {
	$(this).addClass("cur").siblings().removeClass("cur");
});
$("#vou10").one("click",function(){
   getWorldCupVouAmount(10);
});

$("#vou20").one("click",function(){
    getWorldCupVouAmount(20);
});

$("#vou30").one("click",function(){
    getWorldCupVouAmount(30);
});

$("#vou50").one("click",function(){
    getWorldCupVouAmount(50);
});

$("#vou100").one("click",function(){
    getWorldCupVouAmount(100);
});

$("#vou200").one("click",function(){
    getWorldCupVouAmount(200);
});

//优惠券状态
function getWorldCupVouAmountList() {
	$.ajax({
		url: ctxpath + "/activity/getWorldCupVouAmountList",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			token: token
		},
		success: function(result) {
			if(result.state == 0) {
				var list = result.list;

				$.each(list, function(index, item) {
					var amount = item.amount;
					amount = parseInt(amount);
					if(amount == 10) {
						$(".wc_coupon_li01").addClass("cur");
						$(".wc_coupon_li01").children("em").html("已领取");
					} else if(amount == 20) {
						$(".wc_coupon_li02").addClass("cur");
						$(".wc_coupon_li02").children("em").html("已领取");
					} else if(amount == 30) {
						$(".wc_coupon_li03").addClass("cur");
						$(".wc_coupon_li03").children("em").html("已领取");
					} else if(amount == 50) {
						$(".wc_coupon_li04").addClass("cur");
						$(".wc_coupon_li04").children("em").html("已领取");
					} else if(amount == 100) {
						$(".wc_coupon_li05").addClass("cur");
						$(".wc_coupon_li05").children("em").html("已领取");
					} else if(amount == 200) {
						$(".wc_coupon_li06").addClass("cur");
						$(".wc_coupon_li06").children("em").html("已领取");
					} else {
						console.log(error);
					}

				});
			} else {
				$.cookie('token', null);
			}
		}

	});
}

//优惠券领取
function getWorldCupVouAmount(vouAmount) {
	if(token != null && token.trim().length > 0) {
		$.ajax({
			url: ctxpath + "/activity/getWorldCupVouAmount",
			type: 'post',
			dataType: 'json',
			data: {
				from: '1',
				token: token,
				vouAmount: vouAmount

			},
			success: function(result) {
				if(result.state == 0) {

					getMsg("您已领取" + vouAmount + "元抵用券,请在个人中心-优惠券中查看");
					if(vouAmount == 10) {
						
						$(".wc_coupon_li01").addClass("cur");
						$(".wc_coupon_li01").children("em").html("已领取");
					} else if(vouAmount == 20) {
						$(".wc_coupon_li02").addClass("cur");
						$(".wc_coupon_li02").children("em").html("已领取");
					} else if(vouAmount == 30) {
						$(".wc_coupon_li03").addClass("cur");
						$(".wc_coupon_li03").children("em").html("已领取");
					} else if(vouAmount == 50) {
						$(".wc_coupon_li04").addClass("cur");
						$(".wc_coupon_li04").children("em").html("已领取");
					} else if(vouAmount == 100) {
						$(".wc_coupon_li05").addClass("cur");
						$(".wc_coupon_li05").children("em").html("已领取");
					} else if(vouAmount == 200) {
						$(".wc_coupon_li06").addClass("cur");
						$(".wc_coupon_li06").children("em").html("已领取");
					} else {
						console.log(error);
					}

				} else if(result.state == 3) {
					console.log("您已领取过此抵用券");
//					$(".mask_drop,.mask_coupon").show();
//					getMsg("您已领取" + vouAmount + "元抵用券,请在个人中心-优惠券中查看");

				} else {
					$.cookie('token', null);
					mask_login();
				}
			}
		});
	} else {
		mask_login();
	}
}

//用户排行榜
function worldCupInvest(date) {
	$.ajax({
		url: ctxpath + "/app/worldCupInvest",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			date: date
		},
		success: function(result) {
			if(result.state == 0) {
				var data = result.data.investList;
				var str = '<div class="table_tab">' +
					'<ul>' +
					'<li class="font_size26">排名</li>' +
					'<li class="font_size26">用户名</li>' +
					'<li class="font_size26">当日出借金额</li>' +
					'<li class="font_size26">首投时间</li>' +
					'</ul>'+
				'</div>';
				if(data == "" || data == null) {
					str += '<div class="ranking_noenough">暂无数据</div>';

				} else {
					$.each(data, function(index, item) {

						str +='<div class="table_con">' +
							'<ul>' +
							'<li class="font_size22">' + (index + 1) + '</li>' +
							'<li class="font_size22">' + item.phone + '</li>' +
							'<li class="font_size22">' + item.amount + '</li>' +
							'<li class="font_size22">' + item.investDate + '</li>' +
							'</ul>' +
							'</div>';
					});
				}

				$("#worldCupInvest .ranking_con_tab .table_wrap").html(str);

			} else {
				console.log(result.message);
			}

		}

	});
}

function getMsg(msg) {
	$(".mask_investNo_tip").show().html(msg);
	setTimeout(function() {
		$(".mask_investNo_tip").hide();
	}, 2000);
}
//关闭弹窗
$(".mask_drop").click(function() {
	$(this).hide();
	$(".mask_coupon").hide();
});