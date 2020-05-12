jQuery.support.cors = true;
var pageNo = parseInt(1);
var pageSize = parseInt(8);

$(function(){


	userAwardList(pageNo,pageSize);

	$(window).bind("scroll", function () {
       	if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
       		pageNo = document.getElementById("pageNo").value;
       		var last = document.getElementById("last").value;
       		if(parseInt(pageNo) > parseInt(last)){
       			$(".error_msg_wrap p").html("没有更多数据");
				$(".error_msg_wrap p").css("visibility", "visible");
            } else {
            	userAwardList(pageNo, pageSize);
            }
        }
	});
});


//我的奖品
function userAwardList(pageNo,pageSize){
	$.ajax({
		url: ctxpath + "/awardInfo/userAwardList",
		type:"post",
		dataType:"json",
		data:{
			from: '2',
			token: token,
			pageNo: pageNo,
			pageSize: pageSize
		},
		success : function(json) {
			console.log(json)
			if(json.state != 0){
				window.location = "login.html";
			}

			document.getElementById("last").value = json.data.pageCount;
			document.getElementById("pageNo").value = json.data.pageNo + 1;
			var htm = "";
			if(json.state == 0){
				$.each(json.data.awardlist, function(index, value) {

                    htm += "<div class='prize_win_one'>"
                         + "<div class='prize_win_img fl'>"
						 + "<img src='"+value.awardimgWeb+"' height='258' width='258' alt='' />"
						 + "</div>"
						 + "<div class='prize_win_detalis fl'>"
						 + "<h4 class='font_size30'>"+value.awardName+"</h4>"
						 + "<p  class='font_size24'><span>"+value.awardDate+"</span></p>"
						 + "</div>";

					if( value.state == 3 && value.isTrue == 0){
						htm += "<a href='account_points_order.html?userAwardId=" + value.myAwardId + "'  class='font_size24'>立即领取</a>"
							 + "</div>";
					} else if(value.isTrue == 1){
						htm += "<a href='invest_home.html' class='font_size24'>立即出借</a>"
							 + "</div>";
					}
					else if(value.state == 4){
						htm += "<a href='javascript:;' class='font_size24'>已结束</a>"
							 + "</div>";
					}
					else {
						htm += "<a href='account_points_order.html?userAwardId=" + value.myAwardId + "'  class='font_size24'>查看详情</a>"
							 + "</div>";
					}

				});
				$('#myAwardList').html($('#myAwardList').html() + htm);
			}
		}
	});
}

