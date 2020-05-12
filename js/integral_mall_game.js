// 每次抽奖消耗积分
var drawLotteryBouns = 10;

var endnum = 4;

var lottery = {

	index: -1, //当前转动到哪个位置，起点位置

	count: 0, //总共有多少个位置

	timer: 0, //setTimeout的ID，用clearTimeout清除

	speed: 100, //初始转动速度

	times: 0, //转动次数

	cycle: 30, //转动基本次数：即至少需要转动多少次再进入抽奖环节

	prize: -1, //中奖位置

	init: function(id) {

		if($("#" + id).find(".lottery-unit").length > 0) {

			$lottery = $("#" + id);

			$units = $lottery.find(".lottery-unit");

			this.obj = $lottery;

			this.count = $units.length;

			$lottery.find(".lottery-unit-" + this.index).addClass("active");

		};

	},

	roll: function() {

		var index = this.index;

		var count = this.count;

		var lottery = this.obj;

		$(lottery).find(".lottery-unit-" + index).removeClass("active");

		index += 1;

		if(index > count - 1) {

			index = 0;

		};

		$(lottery).find(".lottery-unit-" + index).addClass("active");
		$(lottery).find(".lottery-unit-" + index).addClass("active2");

		this.index = index;

		return false;

	},

	stop: function(index) {

		this.prize = index;

		return false;

	}

};

var click = false;
var clickTimer = null;
window.onload = function() {

	// $("#lottery li").height($(".lottery-unit-0").height());

	if(token != null && token.trim().length > 0) {
		// 获得用户积分值
		getUserBouns();

		// 奖品列表
		getAwardList();

		//获奖名单
		getAwardUserList();
		//抽奖剩余次数
		userDrawLotteryNum();

	} else {
		mask_login();
	}

	lottery.init('lottery');

	$("#lottery .start_btn").click(function() {
		if(clickTimer) {
			window.clearTimeout(clickTimer);
			clickTimer = null;
		}

		clickTimer = window.setTimeout(function() {

			var userBouns = $("#userbouns").val();
			if(parseInt(userBouns) < drawLotteryBouns) {
				/*alert("积分不足");*/
				$(".mask_investNo_tip").show().html("您的积分不足，无法参与抽奖");
				setTimeout(function() {
					$(".mask_investNo_tip").hide().html("");
				}, 1000);

				return false;
			}

			// 抽奖方法
			$.ajax({
				url: ctxpath + "/userDrawLottery/drawLottery",
				type: 'post',
				dataType: 'json',
				data: {
					from: "2",
					token: token
				},
				success: function(result) {

					if(result.state == '0') {
						$("#userbouns").val(result.data.score);
						$(".lottery_game_tit h3").html("我的积分 : " + result.data.score + "&nbsp;");
						var classId = $("#" + result.data.awardId).attr("class").trim().substr(-1, 1);
						var src = $("#" + result.data.awardId).children("img").attr("src");
						var isDrawnPrize = result.data.isDrawnPrize;
						var awardName = result.data.awardName;
						var drawLotteryNum = result.data.drawLotteryNum;
						$("#drawLotteryNum").html(drawLotteryNum);
						$("#myscore").html(result.data.score);
						// 判断是否是谢谢惠顾
						if(isDrawnPrize == 0) { //中奖
							$("#prizePic").children("img").attr("src", src);
							$("#prizePic").children("p").html(awardName);
							var isTrue = result.data.isTrue;
							var deadline = result.data.deadline;
							deadline = deadline * 24;
							if(isTrue == 0) {
								$(".get_msg").show();
								$("#deadline").html(deadline);
							} else {

							}
						} else {
							//谢谢惠顾

						}
						$("#isDrawnPrize").val(isDrawnPrize);
						endnum = parseInt(classId);
						lottery.speed = 100;
						roll();
						click = true;
						return false;
					} else if(result.state == '3') { //抽奖次数用完

						$(".mask_investNo_tip").show().html(result.message);
						setTimeout(function() {
							$(".mask_investNo_tip").hide().html("");
						}, 1000);
						return false;
					}

				}

			});

		}, 500);

	});

};

function userDrawLotteryNum() {
	$.ajax({
		url: ctxpath + "/userDrawLottery/userDrawLotteryNum",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token
		},
		success: function(result) {
			if(result.state == 0) {
				if(result.num < 0) {
					$("#drawLotteryNum").html("0");
				} else {
					$("#drawLotteryNum").html(result.num);

				}

			} else {
				mask_login();
				return false;
			}
		}
	});
}

function getAwardUserList() {
	var str = "";
	$.ajax({
		url: ctxpath + "/awardInfo/userBounsList",
		type: 'post',
		dataType: 'json',
		data: {
			from: "2",
			pageNo: 1,
			pageSize: 5

		},
		success: function(result) {
			console.log(result.state);
			console.log(result.message);
			if(result.state == '0') {
				if(result.data.awardlist.length > 0) {
					$.each(result.data.awardlist, function(index, item) {
						str += '<div class="swiper-slide">' +

							'<span class="font_size30 fl">*恭喜<b>' + item.userPhone + '</b>获得<b>' + item.awardName + '</b></span>' +
							'</div>';
					});
					$("#awardsUserList").html(str);
				}

			}
			/*中奖列表*/
			var mySwiper = new Swiper('.swiper-container', {
				direction: 'vertical',
				loop: true,
				pagination: '.swiper-pagination',
				slidesPerView: 4,
				spaceBetween: 20,
				autoplay: 1000,
				autoplayDisableOnInteraction:false
			})
		}
	});
}

function imgError(image) {
	image.src = "images/integral_mall/default.png";
}

function roll() {

	lottery.times += 1;
	lottery.roll();
	if(lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
		clearTimeout(lottery.timer);

		lottery.prize = -1;
		lottery.times = 0;
		click = false;
		var isDrawnPrize = $("#isDrawnPrize").val();
		console.log(isDrawnPrize);

		if(isDrawnPrize == 1) {
			$(".mask_backdrop").show();
			$(".mask_win_no").show();
		} else { /*抽中奖品*/
			$(".mask_backdrop").show();
			$(".mask_win_prize").show();
			getAwardUserList();
		}

	} else {
		if(lottery.times < lottery.cycle) {
			lottery.speed -= 10;
		} else if(lottery.times == lottery.cycle) {
			lottery.prize = endnum;
		} else {
			if(lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
				lottery.speed += 110;
			} else {
				lottery.speed += 20;
			}
		}
		if(lottery.speed < 40) {
			lottery.speed = 40;
		};
		lottery.timer = setTimeout(roll, lottery.speed);

	}
	return false;
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
				$("#userbouns").val(result.data.score);
				$("#myscore").html(result.data.score);
			} else {
				//去登录
				mask_login();
			}
		}
	});
}

// 获得抽奖商品列表
function getAwardList() {
	var str = "";
	var first = "";
	var awards = new Array();
	$.ajax({
		url: ctxpath + "/awardInfo/getAwardInfoList",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			pageNo: 1,
			pageSize: 8,
			isLottery: '1'
		},
		success: function(result) {
			if(result.state == '0') {
				var i = 0;

				$.each(result.data.awardlist, function(index, item) {
					str = "<img src='" + item.imgWap + "'/ onerror='imgError(this);'>" +
						"<p class='font_size26'><span  class='font_size26'>" + item.name + "</span></p>";

					$(".lottery-unit-" + index).attr('id', item.awardId);
					$(".lottery-unit-" + index).html(str);

					if(item.name != "谢谢惠顾" && i < 3) {
						awards[i] = item;
						i++;
					}
				});
			}
		}
	});
}

$(".mask_backdrop").click(function() {
	$(".mask_backdrop").hide();
	$(".mask_win_prize").hide();
	$(".mask_points_less").hide();
	$(".mask_win_no").hide();
	$("#lottery li").removeClass("active2").removeClass("active");
});
$(".mask_win_no,.mask_win_prize").click(function() {
	$(this).hide();
	$(".mask_backdrop").hide();
	$("#lottery li").removeClass("active2").removeClass("active");
});
//二次点击，提示消息.
function copyText() {

	if(clickTimer) {
		window.clearTimeout(clickTimer);
		clickTimer = null;
	}
}