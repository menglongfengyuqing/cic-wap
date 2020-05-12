jQuery.support.cors = true;
var pageNo = parseInt(1);
var pageSize = parseInt(4);

var projectType = 2; //安心投1 供应链2
//var projectState = 4; //回款中6 已结束 7 投标中4
var state = 1;//1 ---持有中  2 ---30天内到期  3 ---已结束

$(function() {

	//获取账户出借信息(安心投)   回款中
	getUserInvestDetail(projectType,state, pageNo, pageSize);

	var startX = startY = endX = endY = 0;
	$(window).bind('touchstart', function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//滑动起点的坐标
		startX = touch.pageX;
		startY = touch.pageY;
		// console.log("startX:"+startX+","+"startY:"+startY);
	});
	$(window).bind("touchmove", function(event) {
		var touch = event.originalEvent.changedTouches[0];
		//手势滑动时，手势坐标不断变化，取最后一点的坐标为最终的终点坐标
		endX = touch.pageX;
		endY = touch.pageY;
		// console.log("endX:"+endX+","+"endY:"+endY);
	})
	$(window).bind("touchend", function(event) {
		var distanceX = endX - startX,
			distanceY = endY - startY;
		// console.log("distanceX:"+distanceX+","+"distanceY:"+distanceY);
		//移动端设备的屏幕宽度
		var clientHeight = document.documentElement.clientHeight;
		// console.log(clientHeight;*0.2);
		//判断是否滑动了，而不是屏幕上单击了
		if(startY != Math.abs(distanceY)) {
			if(Math.abs(distanceY) > $(window).width() * 0.2) {
				distanceY > 0 ? someAction1() : someAction2();
			}

		}
		startX = startY = endX = endY = 0;
	})

	$("#item_on").click(function(){
		pageNo = parseInt(1);
		state = 1;
		$(this).siblings().removeClass("cur");
		$(this).addClass("cur");
		clsNoneMsg();
		getUserInvestDetail(projectType,state, pageNo, pageSize);
	})
	$("#item_30").click(function(){
		pageNo = parseInt(1);
		state = 2;
		$(this).siblings().removeClass("cur");
		$(this).addClass("cur");
		clsNoneMsg();
		getUserInvestDetail(projectType,state, pageNo, pageSize);
	})
	$("#item_end").click(function(){
		pageNo = parseInt(1);
		state = 3;
		$(this).siblings().removeClass("cur");
		$(this).addClass("cur");
				clsNoneMsg();
		
		getUserInvestDetail(projectType,state, pageNo, pageSize);
	})
	$("#scf").click(function(){
		pageNo = parseInt(1);
		projectType = 2;
		state = 1;
		$("#item_on").siblings().removeClass("cur");
		$("#item_on").addClass("cur");
		$(this).parent().addClass("cur").siblings().removeClass("cur");
			clsNoneMsg();
		getUserInvestDetail(projectType,state, pageNo, pageSize);
	})
	$("#axt").click(function(){
		pageNo = parseInt(1);
		projectType = 1;
		state = 1;
		$("#item_on").siblings().removeClass("cur");
		$("#item_on").addClass("cur");
			clsNoneMsg();
	    $(this).parent().addClass("cur").siblings().removeClass("cur");
		
		getUserInvestDetail(projectType,state, pageNo, pageSize);
	})
});

function someAction1(){
	return;
}
function someAction2(){
	pageNo = document.getElementById("pageNo").value;
    var last = document.getElementById("last").value;
       		
	if(parseInt(pageNo) > parseInt(last)){
		
    } else {
    	getUserInvestDetail(projectType,state, pageNo, pageSize);
    }
}

function getUserInvestDetail(projectType,state, pageNo, pageSize) {
	$.ajax({
		url: ctxpath + "/user/getNewMyBidsdetailH5",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			token: token,
			projectProductType: projectType,
			pageNo: pageNo,
			pageSize: pageSize,
			state:state
		},
		success: function(json) {
			if(json.state == 4) {
				logout();
			}
			if(json.state == 0) {
				document.getElementById("pageNo").value = parseInt(json.data.pageNo) + 1;
				document.getElementById("last").value 	= json.data.pageCount;
				var $str = $(".invest_mine_wrap");
//				$str.html("");
				var str = "";
				if(json.data.userBidHistoryList.length > 0) {
					
					$.each(json.data.userBidHistoryList, function(index, item) {
						
						var projectType2 = item.projectProductType;
						var projectState = item.state;
						if(projectType2==1){//安心投
							str+='<div class="invest_record_one" onclick="window.location.href=\'account_invest_details.html?id='+item.projectId+'&bidId='+item.bidId+'\'">'
								+'<h4 class="font_size30"><a href="javascript:;" class="font_size30">'+item.projectName+'</a></h4>';
						}else{//供应链
							str+='<div class="invest_record_one" onclick="window.location.href=\'account_invest_details.html?id='+item.projectId+'&bidId='+item.bidId+'\'">'
								+'<h4 class="font_size30"><a href="javascript:;" class="font_size30">'+item.projectName+'('+item.sn+')</a></h4>'
						}
						str+='<div class="invest_record_msg">'
							+'<dl class="fl">'
							+'<dt class="font_size40">'+item.amount+'</dt>'
							+'<dd class="font_size26">出借金额</dd>'
							+'</dl>'
							+'<dl class="fl">'
							+'<dt class="font_size40">'+item.interest+'</dt>'
				    		+'<dd class="font_size26">预期出借利息</dd>'
				    		+'</dl>'
				    		+'<dl class="fl">';
				    	if(projectState==4){//募集中
				    		str+='<dt class="font_size26">募集中</dt>';
				    	}else if(projectState==5){//已满标
				    		str+='<dt class="font_size26">回款中</dt>';
				    	}else if(projectState==6){//回款中
				    		str+='<dt class="font_size26">回款中</dt>';
				    	}else if(projectState==7){//已结束
				    		str+='<dt class="font_size26">已结束</dt>';
				    	}
				    	str+='<dd class="font_size26">'+item.endDate.substr(0,10)+'到期</dd>'
				    		+'</dl>'
				    		+'</div></div>'
					});
					$str.append(str);

				} else {
					$str.html("");
					getNoneMsg();
				}

			}
		}
	});
}

/*没有出借项目*/
function getNoneMsg() {
	$(".news_null_wrap").show();
	$(".item_kind_wrap").css("paddingBottom","0");
	$("html,body,.item_kind_wrap").css("background","#f8f8f8")
}
function clsNoneMsg() {
	$(".news_null_wrap").hide();
		$(".invest_mine_wrap").removeClass("default active").html("");
	$("html,body,.item_kind_wrap").css("background","#fff");
}