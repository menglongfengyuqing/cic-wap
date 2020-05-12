
// 每次抽奖消耗积分
var drawLotteryBouns = 10;

var endnum = 4;

var lottery = {

	index:-1,	//当前转动到哪个位置，起点位置

	count:0,	//总共有多少个位置

	timer:0,	//setTimeout的ID，用clearTimeout清除

	speed:100,	//初始转动速度

	times:0,	//转动次数

	cycle: 30,	//转动基本次数：即至少需要转动多少次再进入抽奖环节

	prize:-1,	//中奖位置

	init:function(id){

		if ($("#"+id).find(".lottery-unit").length>0) {

			$lottery = $("#"+id);

			$units = $lottery.find(".lottery-unit");

			this.obj = $lottery;

			this.count = $units.length;

			$lottery.find(".lottery-unit-" + this.index).addClass("active");

		};

	},

	roll:function(){

		var index = this.index;

		var count = this.count;

		var lottery = this.obj;

		$(lottery).find(".lottery-unit-"+index).removeClass("active");

		index += 1;

		if (index>count-1) {

			index = 0;

		};

		$(lottery).find(".lottery-unit-"+index).addClass("active");
		$(lottery).find(".lottery-unit-"+index).addClass("active2");

		this.index=index;

		return false;

	},

	stop:function(index){

		this.prize=index;

		return false;

	}

};




var click=false;

window.onload = function(){
	// mask.show();
	// $(".mask_win_prize").show();
	$("#lottery li").height($(".lottery-unit-0").height());

	if( token != null && token.trim().length > 0 ){
		// 获得用户积分值
		getUserBouns();

		// 奖品列表
		getAwardList();
	} else {
		window.location.href = "index.html";
	}


	lottery.init('lottery');

	$("#lottery .start_btn").click(function(){
			$(".mask_investNo_tip").show();
		setTimeout(function() {
			$(".mask_investNo_tip").hide();
		}, 2000);
//		if (click) {
//			return false;
//		} else {
//			var userBouns = $("#userbouns").val();
//			if(parseInt(userBouns) < drawLotteryBouns){
//				/*alert("积分不足");*/
//				$(".mask_points_less").show();
//				mask.show();
//				return false;
//			}
//
//			// 抽奖方法
//			$.ajax({
//				url : ctxpath+"/userDrawLottery/drawLottery",
//				type : 'post',
//				dataType : 'json',
//				data : {
//					from : "1",
//					token : token
//				},
//				success : function(result) {
//
//					if(result.state == '3'){
//						alert("积分不足");
//						return false;
//					}
//
//					if(result.state == '0'){
//						$("#userbouns").val( result.data.score );
//						$(".lottery_game_tit h3").html("我的积分 : " + result.data.score + "&nbsp;");
//						var classId = $("#" + result.data.awardId).attr("class").trim().substr(-1, 1);
//
//						// 判断是否是谢谢惠顾
//						if(result.data.isDrawnPrize == '1'){
//							$(".mask_win_prize h4").html("您本次没有中奖，再接再厉呦");
//						} else {
//							$(".mask_win_prize h4").html("恭喜您抽中" + result.data.awardName);
//						}
//
//
//						 endnum = parseInt( classId );
//						lottery.speed = 100;
//						roll();
//						click = true;
//						return false;
//					}
//				}
//			});
//
//		}

	});


};

function roll(){
	lottery.times += 1;
	lottery.roll();
	if (lottery.times > lottery.cycle+10 && lottery.prize==lottery.index) {
		clearTimeout(lottery.timer);
		lottery.prize = -1;
		lottery.times = 0;
		click=false;
	    /*抽中奖品*/
        mask.show();
        $(".mask_win_prize").show();
	}else{
		if (lottery.times<lottery.cycle) {
			lottery.speed -= 10;
		}else if(lottery.times==lottery.cycle) {
			lottery.prize = endnum;
		}else{
			if (lottery.times > lottery.cycle+10 && ((lottery.prize==0 && lottery.index==7) || lottery.prize==lottery.index+1)) {
				lottery.speed += 110;
			}else{
				lottery.speed += 20;
			}
		}
		if (lottery.speed<40) {
			lottery.speed=40;
		};
		lottery.timer = setTimeout(roll,lottery.speed);
	}
	return false;
}

// 获得用户积分值
function getUserBouns(){
 	$.ajax({
 		url : ctxpath+"/bouns/userBouns",
 		type : 'post',
 		dataType : 'json',
 		data : {
 			from : "1",
 			token : token
 		},
 		success : function(result) {
 			if(result.state == '0'){
 				$("#userbouns").val(result.data.score);
 				$(".lottery_game_tit h3").html("我的积分 : " + result.data.score + "&nbsp;");
 			} else {
 				window.location.href = "login.html";
 			}
 		}
 	});
}



// 获得抽奖商品列表
function getAwardList(){
	var str = "";
	var first = "";
	var awards = new Array();
	$.ajax({
		url : ctxpath+"/awardInfo/getAwardInfoList",
		type : 'post',
		dataType : 'json',
		data : {
			from : "1",
			pageNo: 1,
			pageSize: 8,
			isLottery: '1'
		},
		success : function(result) {
			if(result.state == '0'){
				var i = 0;

				$.each(result.data.awardlist, function(index, item) {
					str = "<img src='" + item.imgWap + "'/>"
							+ "<p class='font_size20'>" + item.docs + "</p>"
							+ "<p class='font_size20'><span  class='font_size20'>" + item.name + "</span></p>";

					$(".lottery-unit-" + index).attr('id', item.awardId);
					$(".lottery-unit-" + index).html(str);

					if(item.name != "谢谢惠顾" && i < 3){
						awards[i] = item;
						i++;
					}
				});
				
				// 去前四个奖品放置于下排
				$.each(awards, function(index, item) {
					if(index == 0){
						first += '<li class="fl no_lmargin_l"><dl>';
					} else {
						first += '<li class="fl"><dl>'
					}

					first += '<dt><a href="account_points_prize_detalis.html?id=' + item.awardId + '" ><img src="' + item.imgWap + '"></a></dt>'
						+ '<dd><a href="account_points_prize_detalis.html?id=' + item.awardId + '" class="font_size20">' + item.name + '</a></dd>'
						+ '<dd><span class="font_size22">积分' + item.needAmount + '</span></dd></dl></li>';
				});

				$(".lpl_points_list ul").html(first);
			}
		}
	});
}


$(window).click(function(){
	mask.close();
	 $(".mask_win_prize").hide();
	 $("#lottery td").removeClass("active2").removeClass("active");
});

var mask = mui.createMask(function(){
	/*屏幕点击消失  回调函数*/
	$(".mask_win_prize").hide();
	$(".mask_points_less").hide();
	$("#lottery li").removeClass("active2").removeClass("active");
});

$(".mask_win_prize").click(function(){
	$(".mask_win_prize").hide();
	mask.close();
	$("#lottery li").removeClass("active2").removeClass("active");
});

