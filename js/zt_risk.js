jQuery.support.cors = true;

$(function() {
	question_list();

});

// 总题数
var questionNum = 0;

//测试题列表
function question_list() {
	$.ajax({
		url: ctxpath + "/question/getQuestionList",
		type: "post",
		dataType: "json",
		data: {
			token: token
		},
		success: function(result) {
			if(result.state == "0") {
				var obj = result.data;
				var list = obj.topicList;
				var htm = "";
				var endNum;
				$.each(list, function(index, value) {
					var answerList = value.answerList;

					questionNum = questionNum + 1;
					var num = index + 1;
					var name = value.name.substring(2);
					if(num == obj.topicList.length) {
						name = name.substring(1);
					}
					htm = htm + "<div class='swiper-slide'>" +
						"<div class='question'>" +

						"<div class='ques_title font_size34'><div class='font_size34 tit_num'><span class='font_size60'>" + num + "</span>/"+list.length+"</div>" + name + "</div><div class='ques_area_wrap'>";
					$.each(answerList, function(index, answer) {
						htm = htm + "<div class='ques_con_one font_size34 clear'>";
						if(index == 0) {
							htm = htm + "<input type='radio'  value='" + value.id + "--" + answer.id + "' name='question" + num + "' />";
						} else {
							htm = htm + "<input type='radio'  value='" + value.id + "--" + answer.id + "' name='question" + num + "' />";
						}
						htm = htm + "<label  class='font_size34' for='' class='fl'>" + answer.name + "</label>" +
							"</div>";
					});

					htm = htm + "</div></div>";

					if(list.length == num) {
						htm = htm + "<div class='invest_btn clear' id='testLast'>" +
							"<a class='font_size34' onclick='saveUserAnswer()'>完成测评</a>" +
							"</div>" +
							"<div class='swiper-btn-prev font_size34'><span>返回上一题</span></div>";

					} else if(num > 1) {
						htm = htm + "<div class='swiper-btn-prev font_size34'><span>返回上一题</span></div>";
					}
					htm = htm + "</div>";
				});
				$("#risk-question").html(htm);
				var swiper = new Swiper('.swiper-container', {
					prevButton: '.swiper-btn-prev',
					slidesPerView: 1,
					paginationClickable: true,
					spaceBetween: 100,
					loop: false
				});

				$(".ques_con_one").click(function() {

					$(this).addClass("cur");
					$(this).siblings().removeClass("cur");
					$(this).children("input").attr("checked", true);
					$(this).siblings().children("input").attr("checked", false);

					setTimeout(function() {
						var List = $(".swiper-slide input[checked=checked]").length;
						if(List == questionNum) {
							$(".invest_btn").addClass("cur");
							swiper.slideNext();

						} else {
							$(".invest_btn").removeClass("cur");
							swiper.slideNext();
						}
					}, 200);

				});

			}
		}
	});
}

/**
 * 提交测评
 */
function saveUserAnswer() {
	//判断每个问题是否已经选择
	var answer = "";
	for(i = 1; i <= questionNum; i++) {
		var val = $("input[name='question" + i + "'][checked=checked]").val();
		console.log(val);
		if(val == null) {
			getMsg("第" + i + "道题为必答题,请选择")
			return false;
		} else {
			answer = answer + val + ",";

		}

	}
	//提交测评
	$.ajax({
		url: ctxpath + "/question/saveUserAnswer",
		type: "post",
		dataType: "json",
		data: {
			token: token,
			answer: answer
		},
		success: function(result) {
			if(result.state == "0") {
				$("#score").html(result.score)
				$(".mask_risk").show().css("display", "block");
				$(".swiper-container").show().css("display", "none");
			}
		}
	});

}
$(".risk_selet .sure").click(function() {
	window.location.href = document.referrer;
});
$(".risk_selet .restart").click(function() {
	window.location.reload();
});
//错误提示
function getMsg(str) {

	$(".mask_investNo_tip").show().html(str);
	setTimeout(function() {
		$(".mask_investNo_tip").hide();
	}, 2000);
}