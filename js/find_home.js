/*
 * @Author: Fern
 * @Date:   2017-07-15 13:43:47
 * @Last Modified by:   timefiles
 * @Last Modified time: 2017-08-01 14:48:19
 */

'use strict';
var pageNo = '1';
var pageSize = '8';
var from = '2';

$(function() {

	getListForActivity();
		getCoreCompany();

});
function imgError(image){  
 image.src="images/find/default.png";    
} 
function coreError(image){  
 image.src="images/find/default_core.png";    
} 					
//热门活动
function getListForActivity() {
	$.ajax({
		url: ctxpath + "/cms/getCmsList",
		type: "post",
		dataType: "json",
		data: {
			from: from,
			pageNo: pageNo,
			pageSize: pageSize,
			type: "1"
		},
		success: function(result) {

			if(result.state == "0") {
				var data = result.data.cmsList;
				var str = '';
				$.each(data, function(index, item) {
					if(item.state == 0) {
						str += '<div class="swiper-slide activity_finish">';
					} else if(item.state == 1) {
						str += '<div class="swiper-slide activity_ing">';
					}
					str += '<a href="' + item.text + '"><img src="' + item.imgPath + '" onerror="imgError(this);"/></a>' +
						'</div>';
				});
							
				$('#activityList').html(str);
			} else {
				mask_login();
			}

			var swiper = new Swiper('.swiper-container', {
				slidesPerView: 'auto',
				spaceBetween: 20,
				pagination: {

					clickable: true,
				},
			});
		}
	});
}

function getCoreCompany(){
	$.ajax({
		url: ctxpath + "/cms/getMiddlemenList",
		type: "post",
		dataType: "json",
		data: {
			from: from,
			pageNo: pageNo,
			pageSize: pageSize
		},
		success: function(result) {

			

			if(result.state == "0") {
				var str = '';
				var middlemenList = result.data.middlemenList;
				var item;
				var itemAnnexFileUrl;
				//				console.log(result.data);
				for(var i = 0; i<middlemenList.length ; i++) {
					item = middlemenList[i];
					itemAnnexFileUrl = item.annexFile.url;
					if(itemAnnexFileUrl.length > 24){
						str+='<li class="fl"><a href="'+item.annexFile.remark+'"><img src="'+item.annexFile.url+'" onerror="coreError(this);"/></a></li>';
					}
				}
	
					str+='<li class="fl"><a href="javascript:;"><img src="images/find/more.png"/></a></li>';
					

				$('#coreCompany').html(str);


			}
			
			if(result.state == "4") {
				mask_login();
			}
			    var swiper = new Swiper('.swiper-container', {
      slidesPerView: 'auto',
      spaceBetween: 30,
      pagination: {
      
        clickable: true,
      },
    });
		}
	});
}
