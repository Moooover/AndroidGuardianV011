function lnb_open(param,obj,btn,elem,dur,meth){
	var param = $(param);
	var obj = $(obj);
	var btn = $(btn);
	var elem = elem-1;
	var n = elem;
	var w = -$(window).width();
	var data = false;
//fds
	var _open = function(){
		$('.h_m_mn').addClass("on");
		$('#topmenu ul li ul').css({opacity:1});
		$('#topmenu ul li ul').css({"width":"auto"});
		$("#shadow_device, #m_close a").stop(true,true).fadeIn(dur/2);
		$("html,body").attr("style","overflow:hidden !important");
		param.height($(window).height());
		param.stop(true,true).show().animate({right:0,opacity:1,scrollTop:$(".menu1th").eq(elem).offset().top},dur/2,meth);
		data = true;
		
		mn_h = $('.g_link').outerHeight() + $('.site_btn').outerHeight()
		$("#lnb_device").css({"height":$(window).height()-mn_h});
	};

	var _close = function(){
		if(n != elem){
			param.find(".menu1th").not(elem).removeClass("on").next().stop(true,true).delay(300).slideUp(150);
			param.find(".menu1th").eq(elem).addClass("on").next().stop(true,true).slideDown(300);
		}
		$('.h_m_mn').removeClass("on");
		$("#shadow_device, #m_close a").stop(true,true).fadeOut(dur/2,function(){
			$("html,body").removeAttr("style");
			data = false;
		});
		param.stop(true,true).hide().delay(dur).animate({right:w,opacity:0,scrollTop:0},0,meth);
		
	};

	btn.unbind().bind("click touchend",function(event){
		if(data == false) obj.queue(_open).dequeue(); else obj.queue(_close).dequeue();
		$(window).resize(function(){
			$("#m_close a").click();
		});
		event.preventDefault();
		event.stopPropagation();
	});

	param.find("a").bind("click",function(event){
		if($("#topmenu:animated").size()) return false;
		event.stopPropagation();
	})

	$("#shadow_device, #m_close a").unbind().bind("click touchmove",function(event){
		obj.queue(_close).dequeue();
		event.preventDefault();
		event.stopPropagation();
	});

	$('#btn_search').unbind().bind("click touchmove",function(event){
		obj.queue(_close).dequeue();		
		$("#m_search").slideToggle(300);
		$(window).resize(function(){
			if ($(window).width() > 1024){
				$('#srch_close').click();
			}			
		});
		event.preventDefault();
		event.stopPropagation();
	});

	$('#srch_close').click(function(){
		$("#m_search").slideUp(300);
		event.preventDefault();
		event.stopPropagation();
	});

	$('#lnb_device div.top2m').hide();
	
	$( "#lnb_device > li > a" ).each(function( index ) {
	  if($(this).hasClass('on')==true){
		$(this).parent().siblings().find("div").stop().slideUp();
		$(this).parent().siblings().find("a").removeClass('on');
		$(this).siblings().slideDown();
		$(this).addClass('on');
	  }
	});
	$( "#lnb_device .top2m > ul > li " ).each(function( index ) {
	  if($(this).hasClass('on')==true){
		$(this).siblings().find("ul").stop().slideUp();
		$(this).siblings().find(" > a").removeClass('on');
		$(this).find('> ul').slideDown();
		$(this).addClass('on');
	  }
	});

	param.find(".menu1th").bind("click",function(event){
		n = $(this).parent().index();
		//alert (n);
		if($(this).next(".top2m").css("display") == "none"){
			param.find(".menu1th").not(n).removeClass("on").next(".top2m").stop(true,true).delay(300).slideUp(150);
			param.find(".menu1th").eq(n).addClass("on").next(".top2m").stop(true,true).slideDown(300);
		}else{
			param.find(".menu1th").removeClass("on").next(".top2m").stop(true,true).delay(300).slideUp(150);
		}
		var top1m_has = $(this).next().find('li').size();
		if(top1m_has > 0){
			event.preventDefault();
			event.stopPropagation();
		} else {
			$(this).unbind();
		}
	});

	$( "#lnb_device .top2m > ul > li > a ").on('click',function(event){
		var top2m_has=$(this).siblings("ul").size();
		if(top2m_has>0){
			event.preventDefault();
		}
		if($(this).hasClass('on')==true){
			$(this).siblings().slideUp();
			$(this).removeClass('on');
		}else{
			$( "#lnb_device" ).find(".top2m > ul > li > ul").stop().slideUp();
			$( "#lnb_device" ).find(".top2m > ul > li > a").removeClass('on');
			$(this).siblings().slideDown();
			$(this).addClass('on')
		}
	});
}
/* vxo0cH3mNs */
/* 32q8pP4P8Y */
/* 9c88HpRrpG */
/* D1MQxeVZvj */
/* b5AD2V2D82 */
/* RxgcZudFxA */
/* KQrVbFIcTV */
/* IpTX4KDCdY */
/* 5uV9OmC2Xy */
