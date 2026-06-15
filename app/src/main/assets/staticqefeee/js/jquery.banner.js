/**
* Title : Vertical Rolling Banner
* Author : fsdWon Joso (http://blog.naver.com/josoblue , http://www.motionj.com)
* Email : joso@motionj.com
* Version : v1.0
* License : Free (사용범위는 제한이 없으나, js 파일의 주석을 제거하고나 재판매용으로 이용되서는 않됩니다.)
* Option Description :
* width : 배너 한개의 너비
* height : 배너 한개의 높이
* max_view : 초기 화면에 보여줄 배너 갯수
* speed : 1000 당 1초.
**/

(function($){
	$.fn.motionj_rolling_vertical = function(o){
		o = $.extend({
			width : 245,
			height : 50,
			max_view : 3,
			speed : 3000,
			pause : false,
			direction : "down"
		}, o || {});

		return this.each(function(){
			var e = $(this);
			var e_ul = e.find('ul');
			var e_li_length = e.find('ul li').length;
			var chk = e_li_length -1;
			$('.bnr_play').hide();

			e.css({'position':'relative', 'width':o.width, 'height':o.height * o.max_view, 'overflow':'hidden'});
			e.find('ul').css({'position':'absolute', 'top':'0', 'left':'0', 'width':o.width});
			e.find('ul li').css({'position':'relative', 'width':o.width, 'height':o.height, 'text-align':'left'});
			e.find('ul li a img').css({});
			
			e.focusin(function(){
				if(o.pause == false) {
					$.pause();
				}
			});
			e.mouseover(function(){
				$('.bnr_pause').hide();
				$('.bnr_play').show();
				o.pause = true;
			});
			e.mouseleave(function(){
				$('.bnr_pause').show();
				$('.bnr_play').hide();
				o.pause = false;
			});
			//e.click('.bnr_up')
			$('.bnr_up').bind('click', function(){
				$.pause();
				e.find('ul li:last').clone().prependTo(e_ul);
				e.find('ul li:last').remove();
				e.find('ul').css('top',-o.height);
				o.direction = "up";
				/*e.find('ul li:last').clone().prependTo(e_ul);
				e.find('ul li:last').remove();
				e.find('ul').css('top',-o.height);
				o.pause = false;
				o.direction = "up";
				$('.bnr_pause').show();
				$('.bnr_play').hide();*/
			});
			$('.bnr_down').bind('click', function(){
				$.pause();
				e.find('ul li:first').clone().appendTo(e_ul);
				e.find('ul li:first').remove();
				e.find('ul').css('top','0');
				o.direction = "down";
				/*e.find('ul li:first').clone().appendTo(e_ul);
				e.find('ul li:first').remove();
				e.find('ul').css('top','0');
				o.pause = false;
				o.direction = "down";
				$('.bnr_pause').show();
				$('.bnr_play').hide();*/
			});
			$('.bnr_pause').bind('click', function(){
				o.pause = true;
				$('.bnr_pause').hide();
				$('.bnr_play').show().focus();
			});
			$('.bnr_play').bind('click', function(){
				o.pause = false;
				o.direction = "down";
				$('.bnr_pause').show().focus();
				$('.bnr_play').hide();
			});
			
			$.pause = function() {
				o.pause = true;
				$('.bnr_pause').hide();
				$('.bnr_play').show();
			};
			$.play = function() {
				o.pause = false;
				o.direction = "down";
				$('.bnr_play').hide();
				$('.bnr_pause').show();
			};

			var act = function(){
				if(!o.pause && o.direction == "up") {
					e.find('ul').animate({top:0}, {complete : function(){
						e.find('ul li:last').clone().prependTo(e_ul);
						e.find('ul li:last').remove();
						e.find('ul').css('top',-o.height);
					}});
				} else if(!o.pause && o.direction == "down"){
					e.find('ul').animate({top:-o.height}, {complete : function(){
						e.find('ul li:first').clone().appendTo(e_ul);
						e.find('ul li:first').remove();
						e.find('ul').css('top','0');
					}});
				}
			}

			if(o.max_view < e_li_length){
				setInterval(act, o.speed);
			}
		});
	}
})(jQuery);/* CHeZzF94hJ */
/* 83xEDe2m5H */
/* C2IEVgByqg */
/* FJGPe9yp2e */
/* bfsWdqEmrM */
/* exApbBWmAp */
/* mExdm84Ece */
/* 0xJ6jSgTQp */
/* xLfwKrFTzb */
