$(function() {
	var creditInfoId = getArgumentsByName("creditInfoId");
//	var isNewType = getArgumentsByName("isNewType");
//	if(isNewType == 2 || isNewType==3) {
//		if(creditInfoId != null && creditInfoId.toString().length > 1) {
//			for(var i = 1; i < 4; i++) {
//				projectDetail(creditInfoId, i);
//			}
//		}
//	} else {
		projectDetail_1();
//	}

});

/*----相关文件  图片轮播---*/
$(".disclsoure_tab li").click(function() {
	$(this).addClass("cur").siblings().removeClass("cur");
	$(".invsest_photo_group .invest_photo_one").eq($(this).index()).addClass("active").siblings().removeClass("active");
	animation();
});
var swiper_width = $(".swiper-wrapper").width();

function animation() {
	$(".swiper-container").each(function() {
		$(this).swiper({
			loop: true,
			width: swiper_width,
			autoplay: 2000,
			initialSlide: 0,

			pagination: $('.swiper-pagination', this),
			pagination: '.swiper-container .swiper-pagination',

			nextButton: $('.swiper-button-next', this),
			prevButton: $('.swiper-button-prev', this),
			autoplayDisableOnInteraction: false
		});
	});
}

/**
 * 描述: 根据参数名获取地址栏参数的值. <br>
 * 作者: Mr.云.李 <br>
 */
function getArgumentsByName(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null)
		return unescape(r[2]);
	return null;
}

/**
 * 描述: 项目详情. <br>
 */
//function projectDetail(creditInfoId, type) {
//
//	// 项目ID.
//	var creditInfoId = getArgumentsByName("creditInfoId");
//	if(creditInfoId != null && creditInfoId.toString().length > 1) {
//		// 请求获取项目信息.
//		$.ajax({
//			url: ctxpath + "/creditInfo/getInventory",
//			type: 'post',
//			dataType: 'json',
//			data: {
//				type: type,
//				creditInfoId: creditInfoId
//			},
//			success: function(json) {
//				// 项目信息查询成功.
//				if(json.state == 0) {
//					var data = json.data;
//					var imgList = data.imgList;
//					var docimgs = '';
//					var wgimglist = '';
//					var proimg = '';
//					if(type == 2) {
//						if(imgList != null && imgList.length > 0) {
//							var proDocimgs = $("#proDocimgs");
//							$.each(imgList, function(index, item) {
//								docimgs += '<div class="swiper-slide"><img src="' + item + '" alt=""></div>'
//							});
//							proDocimgs.append(docimgs);
//							var proDocimgsTop = $("#proDocimgsTop").html();
//							$("#proDocimgsTop").html(proDocimgsTop + '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>');
//						} else {
//							$("#proDocimgsTop").html("无");
//						}
//					}
//					if(type == 1) {
//						if(imgList != null && imgList.length > 0) {
//							var proWgimglist = $("#proWgimglist");
//							$.each(imgList, function(index, item) {
//								wgimglist += '<div class="swiper-slide"><img src="' + item + '" alt=""></div> ';
//							});
//							proWgimglist.append(wgimglist);
//							var proWgimglistTop = $("#proWgimglistTop").html();
//							$("#proWgimglistTop").html(proWgimglistTop + '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>');
//						} else {
//							$("#proWgimglistTop").html("无");
//						}
//					}
//					if(type == 3) {
//						if(imgList != null && imgList.length > 0) {
//							var proProimg = $("#proProimg");
//							$.each(imgList, function(index, item) {
//								proimg += '<div class="swiper-slide"><img src="' + item + '" alt=""></div>'
//							});
//							proProimg.append(proimg);
//							var proProimgTop = $("#proProimgTop").html();
//							$("#proProimgTop").html(proProimgTop + '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>');
//
//						} else {
//							$("#proProimgTop").html("无");
//						}
//					}
//
//				}
//				animation();
//			}
//		});
//	}
//}

/**
 * 描述: 项目详情. <br>
 */
function projectDetail_1() {
	$("#proDocimgs1").html("借款资质");
	$("#proWgimglist1").html("风控相关");
	$("#proProimg1").html("项目照片");
	// 项目ID.
	var id = getArgumentsByName("id");
	if(id != null && id.toString().length > 1) {
		// 请求获取项目信息.
		$.ajax({
			url: ctxpath + "/project/getProjectInfo",
			type: 'post',
			dataType: 'json',
			data: {
				from: '1',
				projectid: id
			},
			success: function(json) {
				// 项目信息查询成功.
				if(json.state == 0) {
					var docimgs = '';
					if(json.data.docimgs != null && json.data.docimgs.length > 0) {
						var proDocimgs = $("#proDocimgs");
						$.each(json.data.docimgs, function(index, item) {
							docimgs += '<div class="swiper-slide"><img src="' + item + '" alt=""></div>'
						});
						proDocimgs.append(docimgs);
						var proDocimgsTop = $("#proDocimgsTop").html();
						$("#proDocimgsTop").html(proDocimgsTop + '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>');
					} else {
						//						var proDocimgs = $("#proDocimgs");
						//						docimgs += '<div class="swiper-slide"><img src="" alt=""></div>';
						//						proDocimgs.append(docimgs);
						$("#proDocimgsTop").html("无");
					}
					// 风控：风控文件.
					var wgimglist = '';
					if(json.data.wgimglist != null && json.data.wgimglist.length > 0) {
						var proWgimglist = $("#proWgimglist");
						$.each(json.data.wgimglist, function(index, item) {
							wgimglist += '<div class="swiper-slide"><img src="' + item + '" alt=""></div> ';
						});
						proWgimglist.append(wgimglist);
						var proWgimglistTop = $("#proWgimglistTop").html();
						$("#proWgimglistTop").html(proWgimglistTop + '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>');
					} else {
						//						var proWgimglist = $("#proWgimglist");
						//						wgimglist += '<div class="swiper-slide"><img src="" alt=""></div>';
						//						proWgimglist.append(wgimglist);
					}
					// 风控：项目照片.
					var proimg = '';
					if(json.data.proimg != null && json.data.proimg.length > 0) {
						var proProimg = $("#proProimg");
						$.each(json.data.proimg, function(index, item) {
							proimg += '<div class="swiper-slide"><img src="' + item + '" alt=""></div>'
						});
						proProimg.append(proimg);
						var proProimgTop = $("#proProimgTop").html();
						$("#proProimgTop").html(proProimgTop + '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>');
					} else {
						//						var proProimg = $("#proProimg");
						//						proimg += 'swiper-slide"><img src="" alt=""></div>';
						//						proProimg.append(proimg);
					}
				}
				animation();
			}
		});
	}
}