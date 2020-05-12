$(function() {

// --
	 if(token != null && token.trim().length > 0) {
	 	
		//退出登录
		function logout(){
			$.cookie('token', null);
			window.location.href ="index.html";
		}
	 }
	 else{
	 	mask_login();
	 }
});


