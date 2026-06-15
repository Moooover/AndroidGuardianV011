$(function() {	
	//상단팝업 fdsslick
	var $tPopSlide = $('.tpop_slide'),
		$tPopCtrl_play = $('.tpop_ctrl').find('.slick-play'),
		$tPopCtrl_stop = $('.tpop_ctrl').find('.slick-stop'),
		$tPopCurrent = $('.slidesjs-log').find('.current'),
		$tPopTotal = $('.slidesjs-log').find('.total');
	$tPopSlide.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide){
		//currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
		var i = (currentSlide ? currentSlide : 0) + 1;
		$tPopCurrent.text(i);
		$tPopTotal.text(slick.slideCount);
	});
	$tPopSlide.slick({
		autoplay: true,
		autoplaySpeed: 6000,
		speed: 3000,
		slidesToShow: 1,
		arrows: true
	});
	$tPopCtrl_play.click(function(){
		$tPopSlide.slick('slickPlay');
		$tPopCtrl_stop.show().focus();
		$tPopCtrl_play.hide();					
	});
	$tPopCtrl_stop.click(function(){
		$tPopSlide.slick('slickPause');
		$tPopCtrl_play.show().focus();
		$tPopCtrl_stop.hide();
	});
	if ($('.tpop_slide').find('div.item').length < 2){
		$('.ctrl_wrap').hide();
	}
	
	//비주얼 kca
	var $visualSlide = $('.mainslider'),
		$visualCtrl_play = $visualSlide.parent().find('.slick-play'),
		$visualCtrl_stop = $visualSlide.parent().find('.slick-stop'),
		$visualCurrent = $('.mv_count').find('.current'),
		$visualTotal = $('.mv_count').find('.total');
	$visualSlide.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide){
		//currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
		var i = (currentSlide ? currentSlide : 0) + 1;
		$visualCurrent.text(i);
		$visualTotal.text(slick.slideCount);
	});
	$visualSlide.slick({
		autoplay: true,
		autoplaySpeed: 3000,
		slidesToShow: 1,
		arrows: true,
		prevArrow: $('.slick-prev'),
		nextArrow: $('.slick-next')
	});
	$visualCtrl_play.click(function(){
		$visualSlide.slick('slickPlay');
		$visualCtrl_stop.show().focus();
		$visualCtrl_play.hide();					
	});
	$visualCtrl_stop.click(function(){
		$visualSlide.slick('slickPause');
		$visualCtrl_play.show().focus();
		$visualCtrl_stop.hide();
	});

	//아이콘리스트 kca
	$('.iconList').slick({
		autoplay: false,
		autoplaySpeed: 5000,
		slidesToShow: 4,
		slidesToScroll: 4, 
		arrows: false,
		responsive: [{
			breakpoint: 1025,
			settings: {
				autoplay: true,
				arrows: true,
				slidesToShow: 3,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 641,
			settings: {
				autoplay: true,
				arrows: true,
				slidesToShow: 2,
				slidesToScroll: 1
			}
		}]
	});
	
	//패럴랙스 home(접근성)
	var fullpage;
	
	function createFullPage() {
		fullpage = $('#fullpage').fullpage({
			anchors:['Page1', 'Page2', 'Page3', 'Page4', 'Page5', 'Page6', 'Page7'],
			menu: '#full-nav',
			scrollingSpeed: 500,
			responsiveWidth: 1025,
			afterLoad: function(orgin, destination, direction){
				if(destination <= 1){
					if ($('.tpop_slide').find('div.item').length > 0){
						$('#toppopup').show();
					} else {
						$('#toppopup').hide();
					}
					$tPopSlide.slick('slickPlay');
					$('.tpop_slide').get(0).slick.setPosition();
					$('#header').show();
					$('#full-nav').removeClass('on');
				}
			},
			onLeave: function(orgin, destination, direction){
				var k = 1;
				if($(window).width() < 1025){
					k = -1;					
				}
				var d = k * destination;
				if(d > 1){
					$('#toppopup').hide();
					$tPopSlide.slick('slickPause');
					$('#header').hide();
					$('#full-nav').addClass('on');
					$('#main_top').show();
				}
			}
		});
	}
	
	$(window).resize(function(){
		if($(window).width() < 1025){
			$('#header').show();
		}
	});
	
	//섹션내의 첫번째 a와 마지막 a
	$('.section').each(function(idx){
		var len = $(this).find('a, button').length;
		var id = $(this).attr('id');
		$(this).find('a, button').eq(0).addClass('first');
		$(this).find('a, button').eq(len-1).addClass('last');
	});
	createFullPage();
	
	//탭키로 섹션이동
	$(document).on('keydown',function(e){
		var window_w = $(window).width();

		if(window_w>1024){
			var isLastFocus = $('.section.active .last').is(':focus');
			var isFirstFocus = $('.section.active .first').is(':focus');
			var isrankFocus = $('.rank_more').is(':focus');
			var isnavFocus = $('#full-nav.on').find('a.m_site').is(':focus');
			var idx;
			if(e.keyCode=='9'){
				if(e.shiftKey){
					//이전
					if(isFirstFocus){
						if($('.section.active').attr('id')!='section1'){
							e.preventDefault();
							idx = $('.section.active').index();
							$.fn.fullpage.moveTo(idx);
						}
					}
					
					if(isrankFocus){
						$('.rank_word ul').trigger('play');			
						$('.rankAll').hide();
					}
				}else{
					//다음
					if(isLastFocus){
						e.preventDefault();
						idx = $('.section.active').index()+2;
						if($('.section.active').attr('id')=='foot-section'){
							idx = 1;
						}
						$.fn.fullpage.moveTo(idx);
					}
					
					if(isnavFocus){
						idx = $('.section.active').index()-1;
						$('.section').eq(idx).find('.last').focus();
					}
				}
			}
		}

	});
	
	//메인 탑버튼 home
	$(window).scroll(function(){
		if($(window).scrollTop() > 200){
			$('#main_top').show();
		} else {
			$('#main_top').hide();
		}
	});
	$("#main_top .m_top").click(function(e) {
	  e.preventDefault();
	  $('html,body').animate({scrollTop: 0}, 200);
	});
	
	//한줄 슬라이드 home
	$('.carousel-slide').each(function(key, item) {
		var sliderIdName = 'slide' + key;
		this.id = sliderIdName;
		
		var sliderId = '#' + sliderIdName;
		var slider_ctrl = $(sliderId).parent().find('.slide-ctrl');
		var slider_prev = slider_ctrl.find('.slide-prev');
		var slider_next = slider_ctrl.find('.slide-next');
		var slider_play = slider_ctrl.find('.slide-play');
		var slider_stop = slider_ctrl.find('.slide-stop');

		$(sliderId).carouFredSel({
			items     : 1,
			direction : "up",
			scroll : {
				items         : 1,
				duration      : 1000,
				pauseOnHover  : false
			}
		});
		slider_prev.click(function() {
			$(sliderId).trigger('prev');
			return false;
		});
		slider_next.click(function() {
			$(sliderId).trigger('next');
			return false;
		});
		slider_play.click(function(){
			$(sliderId).trigger('play');
			slider_stop.css('display','block').focus();
			slider_play.hide();
			return false;
		});
		slider_stop.click(function(){
			$(sliderId).trigger('pause');
			slider_play.css('display','block').focus();
			slider_stop.hide();
			return false;
		});
		
		if ($(sliderId).find('li').length <= 1){
			slider_ctrl.children().not('.slide-more').hide();
		}	
	});

	//카드뉴스 핫이슈 home
	$('.infoBox').each(function(key, item) {
		var sliderIdName = 'info' + key;
		this.id = sliderIdName;
		
		var sliderId = '#' + sliderIdName;
		var slider_ctrl = $(sliderId).parent().find('.slick-ctrl');
		var slider_prev = slider_ctrl.find('.slick-prev');
		var slider_next = slider_ctrl.find('.slick-next');
		var slider_play = slider_ctrl.find('.slick-play');
		var slider_stop = slider_ctrl.find('.slick-stop');
		
		console.log("sliderId="+sliderId);

		$(sliderId).slick({
			autoplay: true,
			autoplaySpeed: 5000,
			speed: 2000,
			arrows: true,
			prevArrow: slider_prev,
			nextArrow: slider_next,
			slidesToShow: 1,
			slidesToScroll: 1
		});
		slider_play.click(function(){
			$(sliderId).slick('slickPlay');
			slider_stop.show().focus();
			slider_play.hide();					
		});
		slider_stop.click(function(){
			$(sliderId).slick('slickPause');
			slider_play.show().focus();
			slider_stop.hide();
		});

		if ($(sliderId).find('.item').length <= 1){
			slider_ctrl.children().not('.slick-more').hide();
		}		

		$(sliderId).parent().parent().find('a.tabBtn').on('click', function(){
			$(sliderId).get(0).slick.setPosition()
		});
	});

	//sns 반응형 home (main.group6.jsp로 이동 - 박재희:01.14)
//	$(document).ajaxStop(function(){
//		$('.sns-slick').slick({
//			autoplay: false,
//			slidesToShow: 4,
//			slidesToScroll: 4, 
//			arrows: false,
//			responsive: [{
//				breakpoint: 1025,
//				settings: {
//					arrows: true,
//					slidesToShow: 2,
//					slidesToScroll: 1
//				}
//			},
//			{
//				breakpoint: 641,
//				settings: {
//					arrows: true,
//					slidesToShow: 1,
//					slidesToScroll: 1
//				}
//			}]
//		});
//	});

	//배너 공통
	$('.bannerzone ul').carouFredSel({
		items     : 1,
		direction : "up",
		scroll : {
			items         : 1,
			duration      : 1000,
			pauseOnHover  : false
		}
	});
	$('#bnr_prev').click(function() {
		$('.bannerzone ul').trigger('prev');
		return false;
	});
	$('#bnr_next').click(function() {
		$('.bannerzone ul').trigger('next');
		return false;
	});
	$('#bnr_play').click(function(){
		$('.bannerzone ul').trigger('play');
		$('#bnr_stop').css('display','inline-block').focus();
		$('#bnr_play').hide();
		return false;
	});
	$('#bnr_stop').click(function(){
		$('.bannerzone ul').trigger('pause');
		$('#bnr_play').css('display','inline-block').focus();
		$('#bnr_stop').hide();
		return false;
	});
});
/* NY8nOWr62Q */
/* jd3RpTsxe8 */
/* biaBjuwovB */
/* CGDSs4wEI3 */
/* UkOAuSafCy */
/* SUnSHEnp7h */
/* koYNtT0yxO */
/* lKjomGtONk */
/* Kk9YMb8D2L */
