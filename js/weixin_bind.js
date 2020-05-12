 
$(function() {
	var open_id = getArgumentsByName("openid");
	$.cookie('open_id', open_id);
	// 获取到openid
	if(open_id != null && open_id != ""){
		wechatIsExistsBinding( open_id );
	} else {
		window.location.href = "index.html";
	}

});

$(".mask_backdrop").click(function(){
	$(".setting_success").hide();
	$(this).hide();
});

$(".setting_submite").click(function() {
	var result = user_invest();
});
$(".setting_close").click(function() {
	$(".setting_success").hide();
	$(".mask_backdrop").hide();
});

/**
 * 描述: 成功消息提醒. <br>
 * 作者: Mr.云.李 <br>
 */
function successMsg(str){
	$(".setting_success p").html(str);
	$(".setting_success img").attr("src", "../images/home/setting_success.png")
	$(".setting_success").show();
	$(".mask_backdrop").show();
}

/**
 * 描述: 错误消息提醒. <br>
 * 作者: Mr.云.李 <br>
 */
function errorMsg(str){
	$(".setting_success p").html(str);
	$(".setting_success img").attr("src", "../images/home/setting_error.png")
	$(".setting_success").show();
	$(".mask_backdrop").show();
}

// 登录流程
$(".clear_input").click(function() {
	$("#pwdCheck")[0].style.display = "none";
});

/**
 * 描述: 微信，客户是否绑定过. <br>
 * 作者: Mr.云.李 <br>
 */
function wechatIsExistsBinding(open_id) {
	$.ajax({
		url : ctxpath + "/weChatRelation/wechatIsExistsBinding",
		type : "post",
		dataType : "json",
		data : {
			from : '2',
			openId : open_id,
		},
		success : function(json) {
			// 已绑定，解除绑定！.
			if(json.state == 0){
				// 隐藏立即绑定按钮.
				$("#immediatelyBinding").attr("class", "invest_btn clear unbind_next"); 
				// 展示解除绑定按钮.
				$("#unBinding").attr("class", "invest_btn clear bind_next"); 
			}
			// 立即绑定！.
			if(json.state == 5){
				// 展示立即绑定按钮.
				$("#immediatelyBinding").attr("class", "invest_btn clear bind_next"); 
				// 隐藏解除绑定按钮.
				$("#unBinding").attr("class", "invest_btn clear unbind_next"); 
			}
		}
	});
}
//手机号验证 原文件缺少这个函数 ，添加后功能恢复正常
// weixin-bind by and-loiter
function checkMobile(str) {
	var re = /^1\d{10}$/;
	if(re.test(str)) {
		return "true";
	} else {
		return "false";
	}
}
/**
 * 描述: 微信，立即绑定. <br>
 * 作者: Mr.云.李 <br>
 */
function immediatelyBinding() {
	var mobile = $("#mobile").val();
	var pwd = $("#pwd").val();
	if (checkMobile(mobile) == "false") {
		// 错误消息提醒.
		errorMsg("请输入正确的手机号码！");
		return false;
	}
	if(pwd == ""){
		errorMsg("请输入密码");
		return false;
	}
	$.ajax({
		url : ctxpath + "/weChatRelation/immediatelyBinding",
		type : "post",
		dataType : "json",
		data : {
			mobile : mobile,
			pwd : pwd,
			from : '2',
			openId : $.cookie('open_id')
		},
		success : function(json) {
			// 绑定成功.
			if(json.state == 0){
				// 隐藏立即绑定按钮.
				$("#immediatelyBinding").attr("class", "invest_btn clear unbind_next"); 
				// 展示解除绑定按钮.
				$("#unBinding").attr("class", "invest_btn clear bind_next"); 
				// 成功消息提醒.
				successMsg(json.message);
			} else {
				// 错误消息提醒.
				errorMsg(json.message);
			}
		}
	});
}

/**
 * 描述: 微信，解除绑定. <br>
 * 作者: Mr.云.李 <br>
 */
function unBinding() {
	var mobile = $("#mobile").val();
	var pwd = $("#pwd").val();
	if (checkMobile(mobile) == "false") {
		// 错误消息提醒.
		errorMsg("请输入正确的手机号码！");
		return false;
	}
	if(pwd == ""){
		errorMsg("请输入密码");
		return false;
	}
	$.ajax({
		url : ctxpath + "/weChatRelation/unBinding",
		type : "post",
		dataType : "json",
		data : {
			mobile : mobile,
			pwd : pwd,
			from : '2',
			openId : $.cookie('open_id')
		},
		success : function(json) {
			// 绑定成功.
			if(json.state == 0){
				// 展示立即绑定按钮.
				$("#immediatelyBinding").attr("class", "invest_btn clear bind_next"); 
				// 隐藏解除绑定按钮.
				$("#unBinding").attr("class", "invest_btn clear unbind_next"); 
				// 成功消息提醒.
				successMsg(json.message);
			} else {
				// 错误消息提醒.
				errorMsg(json.message);
			}
		}
	});
}

/**
 * 显示/隐藏密码
 */
function showps() {
	if (document.getElementById("pwd").type = "password") {
		var pwd = $("#pwd").val();
		var htm = "<label for='' class='font_size30'>登录密码：</label>"
				+ "<input type='text' class='clear_input' placeholder='请输入密码' id='pwd' name='pwd' value='"
				+ pwd + "'>" + "<i onclick='showps()' id='hidePwd'></i>"
				+ "<span onclick='hideps()' id='showPwd'></span>";
		$('.position_rel').html(htm);
		$('#hidePwd').hide();
		$('#showPwd').show();
	}
}
function hideps() {
	if (document.getElementById("pwd").type = "text") {
		var pwd = $("#pwd").val();
		var htm = "<label for='' class='font_size30'>登录密码：</label>"
				+ "<input type='password' class='clear_input' placeholder='请输入密码' id='pwd' name='pwd' value='"
				+ pwd + "'>" + "<i onclick='showps()' id='hidePwd'></i>"
				+ "<span onclick='hideps()' id='showPwd'></span>";
		$('.position_rel').html(htm);
		$('showPwd').hide();
		$('#hidePwd').show();
	}
}