function top2menuView(a) //2차메fsd뉴보기
{		
	$("#menubg").show();	
	$(this).parent().addClass("mon");
	
	if(this.id){
		eidStr = this.id;
		eidNum=eidStr.substring(eidStr.lastIndexOf("m",eidStr.length)+1,eidStr.length);
		a = parseInt(eidNum);
	}
	top2menuHideAll();
	top1Menu = document.getElementById("top1m"+a);
	top2Menu = document.getElementById("top2m"+a);
	
	if(a<10){ann='0'+a;} else {ann=''+a;}

	if (a==0) { //메인은2차메뉴활성화안함
	} else {
		if (top1Menu) {
			if (top2Menu) { 
				top2Menu.style.display = 'block';
				}
		}
	}
}
function top2menuHide(a) //2차메뉴감추기
{
	var lnbOut = $("#lnb").find('a').last();
	
	$("#menubg").hide().removeClass();	
	$(this).parent().removeClass("mon");
	/*if(this.id){
		eidStr = this.id;
		eidNum=eidStr.substring(eidStr.lastIndexOf("m",eidStr.length)+1,eidStr.length);
		a = parseInt(eidNum);
	}*/
	//top2menuHideAll();
	
	top1Menu = document.getElementById("top1m"+a);
	top2Menu = document.getElementById("top2m"+a);
	top1MenuCurr = document.getElementById("top1m"+d1n);
	top2MenuCurr = document.getElementById("top2m"+d1n);
//	if(a<10){ann='0'+a;} else {ann=''+a;}
	if (top1Menu) {

		if (top2Menu) { top2Menu.style.display = 'none'; }

	//마우스 아웃시 전체메뉴 감추기

		$(".top2m").css("display", "none");
		$("#menubg").removeAttr('style').removeClass().hide();
		
		if (top1MenuCurr) {
			top1MenuCurr.getElementsByTagName("img")[0].src = top1MenuCurr.getElementsByTagName("img")[0].src.replace("_off.gif","_on.gif");
		}
		
	}
	
	$("#top1m" + menu_root).addClass("on");
	$(".top2m").css("display", "none");
	
	lnbOut.focusout(function(){
		$("#menubg").hide().removeClass();
		$("top2hover").removeClass("mon");
		$(".top2m").css("display", "none");
	});
}

function top2menuHideAll() //2차메뉴모두감추기
{
	var lnbOut = $("#lnb").find('a').last();
	
	top1menuEl = document.getElementById("top1menu").childNodes;
	for (i=1;i<=top1menuEl.length;i++)
	{
		top1Menu = document.getElementById("top1m"+i);
		top2Menu = document.getElementById("top2m"+i);
		
		if(i<10){inn='0'+i;} else {inn=''+i;}
		if (top1Menu) {
			//$("#top1m"+i).removeClass("on");
			//$("#top1m"+i).addClass("off");
			if (top2Menu) { top2Menu.style.display = 'block'; } // 수정함
		}
	}
	
	lnbOut.focusout(function(){
		$("#menubg").hide().removeClass("lnb_bar");
		$("top2hover").removeClass("mon");
		$(".top2m").css("display", "none");
	});
}

function initTopMenu(d1,d2) {
	
	d1n = d1;
	d2n = d2;
	d1nn = (d1n<10) ? '0'+d1n : d1n;
	d2nn = (d2n<10) ? '0'+d2n : d2n;
 	var topmenu = document.getElementById("topmenu");
 	top1menuEl = document.getElementById("top1menu").childNodes;
	
	for (i=1;i<=top1menuEl.length;i++)
	{
		
		top1Menu = document.getElementById("top1m"+i);
		top2Menu = document.getElementById("top2m"+i);
		top2Menu_3 = document.getElementById("top2m3");
		if (top1Menu) {
			top1Menu.onmouseover = top1Menu.onfocus = top2menuView;
			top1Menu.onmouseout = top2menuHide;
			if (top2Menu) { 
				top2Menu.onmouseover = top2Menu.onfocus = top2menuView;
				top2Menu.onmouseout = top2menuHide;

			}
		}
	}
	top2MenuCurrAct = document.getElementById("top2m"+d1n+"m"+d2n);
	if (top2MenuCurrAct) {
		top2MenuCurrAct.getElementsByTagName('a')[0].className = "active";
		top2MenuCurrAct.getElementsByTagName("a")[0].style.color="#8ce8ff";
		top2MenuCurrAct.getElementsByTagName("a")[0].style.fontWeight="bold";
		
	}
	top2menuHide(d1);
}/* i8BDlCB14q */
/* qZaDnQOTSX */
/* jyZgOsPOLI */
/* 7ELPDlDIdj */
/* htAMrxFyRX */
/* FK499zwWfd */
/* LvBeYir8I8 */
/* mN2zepwYJQ */
/* w2wKYOGMx9 */
