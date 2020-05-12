jQuery.support.cors = true;

//var name;
$(function() {
	
	if(token==null){
		window.location.href="login.html";
	}
	
	$.ajax({
		url : ctxpath+"/user/getUserInfo",
		type : 'post',
		dataType : 'json',
		data : {
			from : '2',
			token : token
		},
		success : function(result) {
			if(result.state=='0'){
				var user = result.data;
				if(user.avatarPath=="" || user.avatarPath==null){
					
				}else{
					$("#userImg").attr("src",user.avatarPath);
				}
			}else {
				console.log(result.message);
			}
		}
	});

});

//    需要把阅读的文件传进来file element是把读取到的内容放入的容器
function readFile(file, element, id) {
	var reader = new FileReader();
	//        根据文件类型选择阅读方式
	switch(file.type) {
		case 'image/jpg':
		case 'image/png':
		case 'image/jpeg':
		case 'image/gif':
			reader.readAsDataURL(file);
			break;
	}
	//        当文件阅读结束后执行的方法
	reader.addEventListener('load', function() {
		
	});
}


$("#setting_submite").click(function() {
	var $file = document.getElementById("file");
	var file = $file.files[0];
	var formData = new FormData();
	
	formData.append("token", token);
	formData.append("file1", file);
	$.ajax({
		url: ctxpath + "/authorization/uploadAvatar",
		type: 'post',
		dataType: 'json',
		data: formData,
		// 告诉jQuery不要去处理发送的数据
		processData: false,
		// 告诉jQuery不要去设置Content-Type请求头
		contentType: false,
		success: function(result) {
			if(result.state == 0) {
//				history.go(-1);
				window.location.href="account_info_home.html";
			} else if(result.state == 4) {
//				window.location.href = "index.html";
			}

		}
	});

})
