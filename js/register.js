/*获取验证码倒计时*/
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数

function sendMessage() {

	　
	curCount = count;　　 //设置button效果，开始计时
	$("#btnSendCode ,#btnSendCode02 ,#btnSendCode03").attr("disabled", "true");
	$("#btnSendCode ,#btnSendCode02 ,#btnSendCode03").html("倒计时" + curCount + "S");
	InterValObj = window.setInterval(SetRemainTime, 1000);
}

//timer处理函数
function SetRemainTime() {
	if(curCount == 0) {
		window.clearInterval(InterValObj); //停止计时器
		$("#btnSendCode ,#btnSendCode02 ,#btnSendCode03").removeAttr("disabled"); //启用按钮
		$("#btnSendCode ,#btnSendCode02 ,#btnSendCode03").html("重新发送验证码");
	} else {
		curCount--;
		$("#btnSendCode , #btnSendCode02 ,#btnSendCode03").html("倒计时" + curCount + "S");
	}
}
/*注册流程*/
$(".login_next").click(function() {
	$(".login_next_con").show();
	$(this).hide();
	$(".login_btn").css({
		"visibility": "visible"
	})
});