jQuery.support.cors = true;

/*banner scroll*/
$(function() {
	var middlemenId = getArgumentsByName("middlemenId");
	$.ajax({
		url: ctxpath + "/project/getMTHData",
		type: 'post',
		dataType: 'json',
		data: {
			from: '2',
			middlemenId:middlemenId
		},
		success: function(result) {

			if(result.state == "0") {
				$("#totalNum").html(result.totalNum+"个");
				$("#onlineNum").html(result.onlineNum+"个");
				$("#finishNum").html(result.finishNum+"个");
			}
		}
	});

});

