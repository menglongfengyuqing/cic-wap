var pageNo = '1';
var pageSize = '10';
var from = '2';
$(function() {

	getEducationList(pageNo, pageSize, null);
	$(window).bind("scroll", function() {
		if($(document).scrollTop() + $(window).height() >= $(document).height()) {
			pageNo = document.getElementById("pageNo").value;
			var last = document.getElementById("last").value;

			if(parseInt(pageNo) > parseInt(last)) {
				$(".no_news_traders_wrap").show();
				$(".no_news_traders_wrap p").show().html("没有更多数据");
				//				$(".no_news_traders_wrap p").css("visibility", "visible");
				setTimeout("getNoneMsg()", 2000);
			} else {
				getEducationList(pageNo, pageSize, null)
			}
		}
	});
})

function getEducationList(pageNo, pageSize, label) {
	$.ajax({
		url: ctxpath + "/cms/getEducationListByType",
		type: "post",
		dataType: "json",
		data: {
			from: from,
			pageNo: pageNo,
			pageSize: pageSize,
			label: label
		},
		success: function(result) {

			if(result.state == "0") {
				var str = "";
				var cmsList = result.data.cmsList;
				console.log(result.data);
				document.getElementById("pageNo").value = parseInt(result.data.pageNo) + 1;
				document.getElementById("last").value = result.data.pageCount;

				$.each(cmsList, function(index, item) {

					str += '<div class="honor_media_group education_group">' +
						'<a href="more_education_sub.html?noticeid=' + item.id + '"><dl>' +
						'<dt class="font_size28">' + item.title + '</dt>';
					if(item.sourcesDate == null || item.sourcesDate == "") {
						str +='<dd class="font_size24"></dd>' +
							'</dl></a>' +
							"</div>";
					}
					else{
						str += '<dd class="font_size24"><span>'+item.sources+'</span> <span>'+item.sourcesDate+'</span> </dd>'
					     + '</dl></a>'+
					   "</div>";
					}
					
				})
				$('#edu_List').html($('#edu_List').html() + str);
			}
		}
	});
}

function getNoneMsg() {
	$(".no_news_traders_wrap").hide();

	//	$(".no_news_traders_wrap p").css("visibility", "hidden");
}