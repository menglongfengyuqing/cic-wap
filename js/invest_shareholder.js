var projectId = getArgumentsByName("projectId");


/*项目详情*/
$(function() {
	if(token != null && token.trim().length > 0) {
		$.ajax({
			url: ctxpath + "/project/getZtmgLoanBasicInfo",
			type: 'post',
			dataType: 'json',
			data: {
				from: '2',
				projectid: projectId
			},
			success: function(json) {
				if(json.state==0){
					var data = json.data.shareholdersList;
					var htm="";
					if(data!= null&& data.length > 0){
						$.each(data, function(index, item) { 
						htm += '<ul class="invest_user_group_one">'+
						'<li class="font_size30 fl">'+item.shareholdersType+'</li>'+
						'<li class="font_size30 fl">'+item.shareholdersCertType+'</li>'+
						'<li class="font_size30 fl">'+item.shareholdersName+'</li>'+
						'</ul>';	
						});	
						$("#shareholdersList").html(htm);
					}
					else{
						$(".shareholder_con").hide();
						$(".news_null_wrap").show();
						$("html,body").css("background","#f2f2f2");
					}
	
				}
				else{
				 console.log(json);
				}
			}
		});
	}
	else{
		mask_login();
	}

});
