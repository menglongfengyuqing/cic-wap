mui.init({
	swipeBack: true //启用右滑关闭功能
});
var mask = mui.createMask(function(){
	$(".setting_success").hide();
});
 $(".setting_submite").click(function(){
 	toSubmit();
 });
 $(".setting_close").click(function(){
 	$(".setting_success").hide();
    mask.close();//显示遮罩
 });


function toSubmit(){
	var name = document.getElementById("mobile").value;
	var textInfo = document.getElementById("suggestion").value;
	
	var re = /^1\d{10}$/;		// 校验手机号是否注册成功
	
	if (!re.test(name)) {
		getMsg("请输入正确的手机号");
		return;
	}
	
	if (textInfo == null || textInfo == '') {
		getMsg("请输入建议内容");
		return;
	}
	
	if(textInfo.length < 20 || textInfo.length > 1000){
		getMsg("请输入20-1000个汉字");
		return;
	}
	
	$.ajax({
		url: ctxpath + "/more/saveSuggestion",
		type:"post",
		dataType:"json",
		data:{
			from: '2',
			name: name,
			remarks: textInfo
		},
		success:function(result){
			if(result.state == "0"){
				getMsg("意见提交成功");
			}
		}
	});
}
 

function getMsg(str){
	$(".setting_success p").html(str);
	$(".setting_success img").attr("src", "../images/home/setting_error.png")
	$(".setting_success").show();
	mask.show();
}