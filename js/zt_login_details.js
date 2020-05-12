/**
 * 邀请好友详情.
 */
var pageNo = parseInt(1);
var pageSize = parseInt(10);
$(function() {

	// --
	findListForBrokerage(pageNo, pageSize);

});

// token.
var mobile = $.cookie('mobile');

/**
 * 描述:邀请好友列表页. <br>
 * 作者: Mr.云.李 <br>
 */
function findListForBrokerage(pageNo, pageSize) {

	$.ajax({
		url : ctxpath + "/sm/findListForBrokerage",
		type : 'post',
		dataType : 'json',
		data : {
			mobile : mobile,
			pageNo : pageNo,
			pageSize : pageSize,
			from : 'wap'
		},
		success : function(json) {
			var muiContent = $('.zt_login_con');
			// 每次请求之前删除之前页面的缓存内容.
			 muiContent.empty();
			// --
//			document.getElementById("last").value = json.data.last;
//			document.getElementById("pageNo").value = json.data.pageNo + 1;
			
//			console.log("pageNo:" + pageNo + "pageSize:" + pageSize);
			
			// 系统超时.
			if (json.state == 4) {
				// console.log("系统超时！");
				window.location.href = "zt_login.html";
			}
			
			// 接口调用成功.
			if (json.state == 0) {
				var content = '';
				if (json.data.list != null && json.data.list.length > 0) {
					$.each(json.data.list, function(index, item) {
						content += '<div class="zt_login_li"><ul>';
						content += '<li class="font_size24 fl">' + item.userInfoName + '</li>';
						content += '<li class="font_size24 fl">' + item.transDate + '</li>';
						content += '<li class="font_size24 fl">' + item.moneyToOne + '</li>';
						content += '<li class="font_size24 fl">' +  item.amount+ '</li>';
						content += '</ul></div>';
						// 最后最后一次DIV不进行拼接.
//						if((json.data.list.length - 1) == index){
//						} else{
//							content += '<div></div>';
//						}
					});
					muiContent.append(content);
				} else {
					// --
				}
			}
		}
	});
}