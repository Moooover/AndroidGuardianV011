// 달력설정 :fsd 2018.08.07 ~ 2019.01.10 Updates
$(document).ready(function(){
	$.datepicker.setDefaults({
	    monthNames: ['년 1월','년 2월','년 3월','년 4월','년 5월','년 6월','년 7월','년 8월','년 9월','년 10월','년 11월','년 12월'],
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
	    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
	    showMonthAfterYear:true,
	    dateFormat: 'yy-mm-dd',
		yearRange: 'c-20:c+3',
		changeMonth: true,
        changeYear: true,
		numberOfMonths: [1,2],
		showButtonPanel: true,
		currentText: '오늘 날짜',
		closeText: '닫기',
	    buttonImageOnly: true,
	    buttonText: "달력",
	    buttonImage: "static/imageaa/btn_calendar.gif"
	});
	
	if ( $("#cms_sdate").length > 0 ) {
		$("#cms_sdate").datepicker({
	        defaultDate: new Date(),
	        showOn: "both", // focus, button, both
	        showAnim: "blind", // blind, clip, drop, explode, fold, puff, slide, scale, size, pulsate, bounce, highlight, shake, transfer
	        showOptions: {direction: 'horizontal'},
	        duration: 200
	    });
	}
	if ( $("#cms_edate").length > 0 ) {
		$("#cms_edate").datepicker({
	        defaultDate: new Date(),
	        showOn: "both", // focus, button, both
	        showAnim: "blind", // blind, clip, drop, explode, fold, puff, slide, scale, size, pulsate, bounce, highlight, shake, transfer
	        showOptions: {direction: 'horizontal'},
	        duration: 200
	    });
	}

	$(".tabBtn").click(function(){
		var _parent = $(this).parent().parent().parent();
		var _tabBtn = $(this).parent().parent().find('.tabBtn');
		var _currentBtn = $(this).parent().find('.tabBtn');

		$(_parent).find(".tabContent").hide();
		$(_parent).find(".tabContent").eq($(this).parent().index()).fadeIn();
		$(_parent).find(".tabMore").hide();
		$(_parent).find(".tabMore").eq($(this).parent().index()).fadeIn();			
		
		if($(_tabBtn).find('img').length) {
			$(_tabBtn).each(function(){
				$(this).find('img').attr({src:$(this).find('img').attr('src').replace('on','off')});
			});
			$(_currentBtn).find('img').attr('src', $(_currentBtn).find('img').attr('src').replace('off','on'));
		} else {
			$(this).parent().parent().find("li").removeClass("on");
			$(this).parent().addClass("on");
			$(this).parent().parent().find("a").removeAttr('title');
			$(this).attr('title','선택됨');
		}
	});
	
	// 슬라이드탭
	var list_length = $('.listTerm').find('.list_term').length;
	if(list_length < 2){
		$('.termListBtn').addClass('on').attr('title','확장됨');
		$('.termListfir').show();
	} else {		
		$('.termListBtn').attr('title','축소됨');
		$('.termListBtn.on').attr('title','확장됨');
	}
	
	$('.termListBtn').click(function(){		
		var i = $(this).parent().index();
		if($('.listTerm').find('.termListfir').css('display','none')){
			var scroll = $('.listTerm').find('.list_term').eq(i).offset();
		}
		$('html, body').stop().animate({scrollTop : scroll.top});
		
		if($(this).hasClass('on')){
			$(this).removeClass('on').attr('title','축소됨').parent().find('.termListfir').slideUp();
		}else{
			$('.termListBtn').removeClass('on').attr('title','축소됨');
			$('.termListfir').slideUp();						
			$(this).addClass('on').attr('title','확장됨').parent().find('.termListfir').slideDown();
		}					
	});
	
	// 셀렉트유형 버튼 - 푸터 사이트버튼
	$(".selectBtn").click(function(){
		var _site = $(this).parent().parent();

		if($(_site).hasClass("open")){
			$(_site).find("dd").fadeOut();
			$(_site).removeClass("open");				
		} else {				
			$('.sitea').fadeOut();
			$(".sitea").parent().removeClass("open");
			$(_site).find("dd").fadeIn();
			$(_site).addClass("open");
		}		
	});
	
	$("div.close").click(function(){
		$(this).parent().parent().find("dd").fadeOut();
		$(this).parent().parent().removeClass("open").find('.selectBtn').focus();
	});
	
	$('body').click(function(e){
		if($('.family_site').find('dl').hasClass('open')){
			if(!$('.family_site').has(e.target).length){
				$('.family_site').find('dl').removeClass('open');
				$('.family_site').find('dd').fadeOut();
			}
		}		
	});
	
	// maxlength input check of number type made by 2018076 on 2022.04.26.
	$('input[type=number]').keyup(function(e){
		if(e.target.maxLength > 0) {
			if(e.target.value.length > e.target.maxLength) {
				e.target.value = e.target.value.slice(0, e.target.maxLength);
			}
		}
	});
	
	// 카피라이터 수정
	$(".copyBtn").click(function(){
		window.open($(".copyBtn").attr("href"), 'copyrightEditor', 'width=800, height=320, resizable=no, scrollbars=yes, status=no');
	});
	// 사이트정보 수정
	$(".siteBtn").click(function(){
		window.open($(".siteBtn").attr("href"), 'siteManager', 'width=800, height=600, resizable=no, scrollbars=yes, status=no');
	});
	
	//PC버전, 모바일 버전 설정
	 var t = $("#viewpc");
	 var m = $("#viewmo");

	  t.on("click",function(event){
		   $("[name='viewport']").attr('content','width=1280,user-scaleable=1');
		   event.preventDefault(); 
	  });

	  m.on("click",function(event){
		   $("[name='viewport']").attr('content','width=device-width,user-scalable=no');
		   event.preventDefault(); 
	  });

	//pc버전일 경우, 전화걸기(a태그) 동작 막기
	var isMobile = /iPhone|Android|Opera Mini|SymbianOS|WindowsCE|BlackBerry|Nokia|SonyEricsson|webOS|PalmOS/i.test(navigator.userAgent)? true : false;
	if(!isMobile){
		$('a[href^=tel]').click(function() { 
			return false; 
		}); 
	}

	// pc로 접속했을때 mobile버전 보기 버튼 안보이게 하기
	var isie=(/msie/i).test(navigator.userAgent); //ie
	var isie6=(/msie 6/i).test(navigator.userAgent); //ie 6
	var isie7=(/msie 7/i).test(navigator.userAgent); //ie 7
	var isie8=(/msie 8/i).test(navigator.userAgent); //ie 8
	var isie9=(/msie 9/i).test(navigator.userAgent); //ie 9
	var isfirefox=(/firefox/i).test(navigator.userAgent); //firefox
	var isapple=(/applewebkit/i).test(navigator.userAgent); //safari,chrome
	var isopera=(/opera/i).test(navigator.userAgent); //opera
	var isios=(/(ipod|iphone|ipad)/i).test(navigator.userAgent);//ios
	var isipad=(/(ipad)/i).test(navigator.userAgent);//ipad
	var isandroid=(/android/i).test(navigator.userAgent);//android
	var device;

	if(isie7 || isie8 || isie9){
		isie6=false;
	}

	if(isie9 || isfirefox || isapple || isopera){
		isie=false;
		isfirefox=false;
		isapple=false;
		isopera=false;
	}

	if(isapple || isios || isipad || isandroid){
		$("#viewmo").css('display','block');
	}else{
		$("#viewmo").css('display','none');
	}

	// 2017.03.10 ~ 2018.08.07 Updates : 공통유형 폼 체크
	$.frmValidation = function() {
		if($('#cms_title').is(this) && $.trim($('#cms_title').val()) == '') {
			alert("제목을 입력하세요.");
			$('#cms_title').focus();
			return false;
		} else {
			return true;
		}
	};
	
	// 2019.12.03 Updates : 기간무제한 체크
	$.datebtn = function(vars) {
		if($("#datechk").prop("checked") == true) {
			$("#tempEdate").val(vars);
			$("#cms_edate").val("");
			$("#cms_icd_ehour").val("");
			$("#cms_icd_eminute").val("");
			
			$("#cms_edate").next("img").hide();
			$("#cms_edate").attr("disabled", true);
			$("#cms_icd_ehour").attr("disabled", true);
			$("#cms_icd_eminute").attr("disabled", true);
		} else if($("#datechk").prop("checked") == false) {
			$("#cms_edate").val($("#tempEdate").val());
			
			$("#cms_edate").next("img").show();
			$("#cms_edate").attr("disabled", false);
			$("#cms_icd_ehour").attr("disabled", false);
			$("#cms_icd_ehour").val("00").prop("selected", true);
			$("#cms_icd_eminute").attr("disabled", false);
			$("#cms_icd_eminute").val("00").prop("selected", true);
		}
	}
	
	// 2018.09.10 Updates : 사이트 전체선택 체크/해제
	$.checkbtn = function() {
		if($("#scode1").prop("checked") == true) {
			$("input:checkbox[name='scodevars[]']").not(":first").prop("checked", false);
		}
	}
	$.uncheckbtn = function() {
		if($("input:checkbox[name='scodevars[]']:first").prop("checked") == true) {
			$("input:checkbox[name='scodevars[]']:first").prop("checked", false);
		}
	}
	
	// 2017.03.10 Updates : 메일주소 체크
	$.memberChangeMail = function(obj) {
		if (!obj.value) {
			document.getElementById('memberEmail2').value = "";
			document.getElementById('memberEmail2').readOnly = false;
		} else {
			document.getElementById('memberEmail2').readOnly = true;
			document.getElementById('memberEmail2').value = obj.value;
		}
	}

	// addFavorite
	$('.addFavorite').click(function() {
		var title = document.title;
		var url = location.href;
		if(window.sidebar && window.sidebar.addPanel){
			window.sidebar.addPanel(title, url,"");
		} else if(window.opera && window.print) {
			var elem = document.createElement('a'); 
			elem.setAttribute('href',url); 
			elem.setAttribute('title',title); 
			elem.setAttribute('rel','sidebar'); 
			elem.click();
		} else if(document.all) {
			window.external.AddFavorite( url, title);
		} else {
			alert("해당브라우저는 즐겨찾기 추가기능이 지원되지 않습니다.");
			return true;
		}
	});
	
	// 확대/축소/출력 스크립트
	var zoomIn = function() {alert("표준 브라우저에서의 확대/축소는 브라우저의 기능을 이용합니다.\n\n화면 확대: 키보드의 control키와 '+'를 동시에 누릅니다.\n화면 축소: 키보드의 control키와 '-'를 동시에 누릅니다.\n화면 초기화: 키보드의 control키와 '0'을 동시에 누릅니다.");};
	var zoomReset = function() {alert("표준 브라우저에서의 확대/축소는 브라우저의 기능을 이용합니다.\n\n화면 확대: 키보드의 control키와 '+'를 동시에 누릅니다.\n화면 축소: 키보드의 control키와 '-'를 동시에 누릅니다.\n화면 초기화: 키보드의 control키와 '0'을 동시에 누릅니다.");};
	var zoomOut = function() {alert("표준 브라우저에서의 확대/축소는 브라우저의 기능을 이용합니다.\n\n화면 확대: 키보드의 control키와 '+'를 동시에 누릅니다.\n화면 축소: 키보드의 control키와 '-'를 동시에 누릅니다.\n화면 초기화: 키보드의 control키와 '0'을 동시에 누릅니다.");};
	$(".zoomIn").click(zoomIn);
	$(".zoomOut").click(zoomOut);
	$(".zoomReset").click(zoomReset);
	
	// 2016.08.05 Updates : 즐겨찾기 등록
	$.myScrap = function(subject, level, menukey) {
		if(level < 10){
			var url = location.href;
			$.ajax({
				type : "post",
				url : "myScrapInsert.do",
				data : {
					url : url,
					subject : subject,
					menukey : menukey
				},
				success : function(data) {
					if (data == "200") {
						alert("현재 페이지를 즐겨찾기 하였습니다.\n우측 상단 즐겨찾기 메뉴에서 나의 즐겨찾기 목록을 확인할 수 있습니다.");
					} else if (data == "100") {
						alert("이미 즐겨찾기 한 페이지 입니다.");
					} else if (data == "500") {
						alert("[서버오류]-관리자에게 문의해주세요.");
					}
				},
				error : function(error) {
					alert("[서버오류]-관리자에게 문의해주세요.\n[Error]-[" + error + "]");
				}
			})
		} else {
			alert("로그인 후 즐겨찾기를 하실 수 있습니다.");
			var sitescode = "${isVar.site_scode}";
			if(sitescode == "00000004") {
				location.href = "sub.do?menukey=4132&rtnChk=Y";
			} else if(sitescode == "00000005") {
				location.href = "sub.do?menukey=5331&rtnChk=Y";
			}
		}
	}

	// 2016.08.05 Updates : 즐겨찾기 삭제
	$.myScrapDel = function(seqno) {
		if (confirm("해당 즐겨찾기를 삭제하시겠습니까?")) {
			$.ajax({
				type : "post",
				url : "myScrapDelete.do",
				data : {
					seqno : seqno
				},
				success : function(data) {
					if (data == "200") {
						alert("해당 즐겨찾기를 삭제했습니다.");

						window.location.reload(true);
					} else if (data == "500") {
						alert("[서버오류]-관리자에게 문의해주세요.");
					}
				},
				error : function(error) {
					alert("[서버오류]-관리자에게 문의해주세요.\n[Error]-[" + error + "]");
				}
			})
		}
	}
});

/**
 * 2019.11.26 Updates
 * 정규식 검사 함수(박재희)
 * PARAMETER : val (정규식 체크할 값 - String), type (1: 휴대폰, 2: 일반전화번호, 3: 주민등록번호, 4: 이메일, 5: 사업자등록번호 - Integer, 6: 대표전화번호(1588), 7: 날짜(yyyy-mm-dd))
 * RETURN : 올바른 패턴인 경우 TRUE, 아닌 경우 FALSE 반환
 * EX) if(regExpCheck("010-1234-5678", 1))... if(regExpCheck("test@test.com", 4))...
 */
function regExpCheck(val, type) {
	var regExp;
	
	if(type == 1) regExp = /^01[016789]-\d{3,4}-\d{4}$/; 
	else if(type == 2) regExp = /^0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4]|50|70|80|505|506|507)-\d{3,4}-\d{4}$/;
	else if(type == 3) regExp = /^[0-9]{2}(0[1-9]|1[0-2])([012][0-9]|[3][01])-[1-4]\d{6}$/;
	else if(type == 4) regExp = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/;
	else if(type == 5) regExp = /([0-9]{3})-?([0-9]{2})-?([0-9]{5})/;
	else if(type == 6) regExp = /^(1422|1466|1522|1533|1544|1566|1577|1588|1599|1600|1611|1644|1660|1661|1666|1668|1670|1688|1800|1811|1833|1855|1877|1899)-?([0-9]{4})$/;
	else regExp = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
	
	if(regExp.test(val)) return true;
	else return false;
}


/* 
 * 2019.10.24 ~ 2019.11.28 Updates
 * 담당자 조회 (소망DB) 
 */

/* 1. 공통 및 게시판 */
$(document).on('keydown', '#brdata_mng_empnm, #emp_nm, #cms_icd_fld2, #menu_manage_somangid', function(event) {
	if(event.keyCode == 8) { // backspace
		$(this).val('');
		$('#somang_emp').hide();
		$('.somang_emp_data').remove();
		$('.emp_mng_notice').show();
		emp_element_init();
		return;
	}
	if(event.keyCode == 38) { // 위 방향키 
		if(!$('#somang_emp > div').hasClass('checked')) { // 선택된게 없는 경우
			$('#somang_emp > div').removeClass('checked');
			$('#somang_emp > div:last').addClass('checked');
			$('#somang_emp').scrollTop($('#somang_emp > div.checked').index()*21);
		}
		else {
			if($('#somang_emp > div.checked').index()*21 < $('#somang_emp').scrollTop() + 21) {
				$('#somang_emp').scrollTop($('#somang_emp').scrollTop() - 21);
			}
			$('#somang_emp > div.checked').prev().addClass('checked');
			$('#somang_emp > div.checked').last().removeClass('checked');
		}
  	  	return;
	}
	if(event.keyCode == 40) { // 아래 방향키
		if(!$('#somang_emp > div').hasClass('checked') || $('#somang_emp > div').last().hasClass('checked')) { // 선택된게 없거나 마지막 데이터인 경우
			$('#somang_emp > div').removeClass('checked');
			$('#somang_emp > div:first').addClass('checked');
			$('#somang_emp').scrollTop(0);
		}
		else {
			if($('#somang_emp > div.checked').index()*21 > $('#somang_emp').scrollTop() + 147) {
				$('#somang_emp').scrollTop($('#somang_emp').scrollTop() + 21);
			}
			$('#somang_emp > div.checked').next().addClass('checked');
			$('#somang_emp > div.checked').first().removeClass('checked');
		}
		return;
	}
});

// 생성된 담당자 리스트 click event (2019.10.24)
$(document).on('click', '#somang_emp > div', function(event) {
	$('#somang_emp').hide();
	// 담당자 컬럼에 데이터 삽입
	$('#brdata_mng_empnm').val($(this).data('emp').brdata_mng_empnm);
	$('#brdata_mng_empno').val($(this).data('emp').brdata_mng_empno);
	$('#brdata_mng_deptnm').val($(this).data('emp').brdata_mng_deptnm);
	$('#brdata_mng_phone').val($(this).data('emp').brdata_mng_phone);
	$('#brdata_mng_email').val($(this).data('emp').brdata_mng_email);
	$('#emp_nm').val($(this).data('emp').brdata_mng_empnm);
	$('#user_id').val($(this).data('emp').brdata_mng_empno);
	$('#cms_icd_fld2').val($(this).data('emp').brdata_mng_empnm);
	$('#cms_icd_fld3').val($(this).data('emp').brdata_mng_empno);
	$('#cms_icd_fld4').val($(this).data('emp').brdata_mng_deptnm);
	$('#cms_icd_fld5').val($(this).data('emp').brdata_mng_phone);
  	$('#cms_icd_fld6').val($(this).data('emp').brdata_mng_email);
	$('#user_id2').val($(this).data('emp').brdata_mng_empno);
	$('#menu_manage_somangid').val($(this).data('emp').brdata_mng_empno);
});

$(document).on('click', '#somang_emp2 > div', function(event) {
	$('#somang_emp2').hide();
	// 담당자 컬럼에 데이터 삽입
	$('#emp_nm2').val($(this).data('emp').brdata_mng_empnm);
});  

// 담당자 input focus out event
$(document).on('blur', '#brdata_mng_empnm, #emp_nm, #cms_icd_fld2, #menu_manage_somangid', function(event) {
	setTimeout(function() {
		$('#somang_emp').hide();
		$('#somang_emp').empty();
		$('#somang_emp').scrollTop(0);
  	}, 200);
});

// 담당자 컬럼 관련 엘리먼트 초기화
function emp_element_init() {
	$('#somang_emp').empty();
	$('#somang_emp').scrollTop(0);
}

//담당자 input focus out event
$(document).on('blur', '#emp_nm2', function(event) {
	setTimeout(function() {
		$('#somang_emp2').hide();
		$('#somang_emp2').empty();
		$('#somang_emp2').scrollTop(0);
	}, 200);
});

// 담당자 컬럼 관련 엘리먼트 초기화
function emp_element_init2() {
	$('#somang_emp2').empty();
	$('#somang_emp2').scrollTop(0);
}  

$(document).on('keyup', '#brdata_mng_empnm', function(event) {
	// 엔터키 입력하는 경우 return (formCheck 함수에서 처리)
	// 위, 아래 방향키 입력하는 경우 return(keydown 이벤트 함수에서 처리)
	if(event.keyCode == 8 || event.keyCode == 13 || event.keyCode == 38 || event.keyCode == 40) return;
	// input 값 없는 경우 return
	if($(this).val()!=null&&$(this).val().length == 0) {
		$('#somang_emp').hide();
		$('.somang_emp_data').remove();
		$('.emp_mng_notice').show();
		emp_element_init();
		return;
	}
	// 담당자 정보를 담은 테이블 컬럼 생성
	if($('.somang_emp_data').length < 1) {
		$('.emp_mng_notice').hide();
		$('.board_insert > tbody > tr:nth-child(5)').after(
			'<tr class="somang_emp_data">' +
        	'<th scope="row"><label for="brdata_mng_empno">담당자 사원번호</label></th>' +
        	'<td><input type="text" id="brdata_mng_empno" name="brdata_mng_empno" class="inpline" style="width: 160px; background-color: #ddd;" maxlength="10" readonly/></td>' +
        	'</tr>' +
        	'<tr class="somang_emp_data">' +
        	'<th scope="row"><label for="brdata_mng_deptnm">담당자 부서</label></th>' +
        	'<td><input type="text" id="brdata_mng_deptnm" name="brdata_mng_deptnm" class="inpline" style="width: 160px; background-color: #ddd;" maxlength="10" readonly/></td>' +
        	'</tr>' +
        	'<tr class="somang_emp_data">' +
        	'<th scope="row"><label for="brdata_mng_phone">담당자 전화번호</label></th>' +
        	'<td><input type="text" id="brdata_mng_phone" name="brdata_mng_phone" class="inpline" style="width: 160px; background-color: #ddd;" maxlength="20" readonly/></td>' +
        	'</tr>' +
        	'<tr class="somang_emp_data">' +
        	'<th scope="row"><label for="brdata_mng_email">담당자 이메일</label></th>' +
        	'<td><input type="text" id="brdata_mng_email" name="brdata_mng_email" class="inpline" style="width: 160px; background-color: #ddd;" maxlength="30" readonly/></td>' +
        	'</tr>'
		);
	}
	// 소망 DB 조회하여 데이터 가져오기
	var obj = { search : $('#brdata_mng_empnm').val() };
	$.ajax({
		type : "get",
		url : "/selectEmpNo.do",
		data : obj,
		dataType : "text",
		contentType : "application/json; charset=UTF-8",
		success : function(data) {
			var list = new Array();
			list[0] = JSON.parse(data);
			
			// 데이터 있는 경우
			if(list[0].result.length > 0)  {
				$("#somang_emp").css("width", $("#somang_emp").siblings("input").css("width"));
				$('#somang_emp').show();
				emp_element_init();
				// 리스트 생성
				for(var i=0; i<list[0].result.length; i++) $('#somang_emp').append('<div>' + list[0].result[i].brdata_mng_empnm + '(' + list[0].result[i].brdata_mng_empno + ')</div>').find('div').last().data('emp', list[0].result[i]);
			}
			// 데이터 없는 경우
			else {
				$('#somang_emp').hide();
				emp_element_init();
			}
		},
		error : function(error) { console.log(error); }
	});
});
  
/* 2. VOC */
$(document).on('keyup', '#emp_nm', function(event) {
	// 엔터키 입력하는 경우 return (formCheck 함수에서 처리)
	// 위, 아래 방향키 입력하는 경우 return(keydown 이벤트 함수에서 처리)
	if(event.keyCode == 8 || event.keyCode == 13 || event.keyCode == 38 || event.keyCode == 40) return;
		// input 값 없는 경우 return
		if($(this).val()!=null&&$(this).val().length == 0) {
			$('#somang_emp').hide();
			$('.somang_emp_data').remove();
			emp_element_init();
			return;
		}
	  var url = "/selectEmpNo.do";
	  var type = null;
	  if($(this).hasClass('assign')) {
		  url = "/selectAssignList.do";
		  if($(this).hasClass('approve')) type = "1";
		  else type = "2";
	  }
	  var obj = { search : $('#emp_nm').val(), type : type, seq : $("#seq").val() };
	  // 소망 DB 조회하여 데이터 가져오기
	  $.ajax({
		  	type : "get",
			url : url,
			data : obj,
			dataType : "text",
			contentType : "application/json; charset=UTF-8",
			success : function(data) {
				var list = new Array();
				list[0] = JSON.parse(data);
				
				// 데이터 있는 경우
				if(list[0].result.length > 0) {
					$("#somang_emp").css("width", $("#somang_emp").siblings("input").css("width"));
					$('#somang_emp').show();
					emp_element_init();
					// 리스트 생성
					for(var i=0; i<list[0].result.length; i++) {
						var dept_nm = list[0].result[i].brdata_mng_deptnm==null?"":'(' + list[0].result[i].brdata_mng_deptnm + ')';
						$('#somang_emp').append('<div>' + list[0].result[i].brdata_mng_empnm + dept_nm + '</div>').find('div').last().data('emp', list[0].result[i]);	
					}
				}
				// 데이터 없는 경우
				else {
					$('#somang_emp').hide();
					emp_element_init();
				}
			},
			error : function(error) {
				console.log(error);
			}
	  });
});

/* 3. VOC (대체 담당자) */
$(document).on('keydown', '#emp_nm2', function(event) {
	if(event.keyCode == 8) { // backspace
		$(this).val('');
		$('#somang_emp2').hide();
		emp_element_init2();
		return;
	}
	if(event.keyCode == 38) { // 위 방향키 
		if(!$('#somang_emp2 > div').hasClass('checked')) { // 선택된게 없는 경우
			$('#somang_emp2 > div').removeClass('checked');
			$('#somang_emp2 > div:last').addClass('checked');
			$('#somang_emp2').scrollTop($('#somang_emp2 > div.checked').index()*21);
		}
		else {
			if($('#somang_emp2 > div.checked').index()*21 < $('#somang_emp2').scrollTop() + 21) {
				$('#somang_emp2').scrollTop($('#somang_emp2').scrollTop() - 21);
			}
			$('#somang_emp2 > div.checked').prev().addClass('checked');
			$('#somang_emp2 > div.checked').last().removeClass('checked');
		}
		return;
	}
	if(event.keyCode == 40) { // 아래 방향키
		if(!$('#somang_emp2 > div').hasClass('checked') || $('#somang_emp2 > div').last().hasClass('checked')) { // 선택된게 없거나 마지막 데이터인 경우
			$('#somang_emp2 > div').removeClass('checked');
			$('#somang_emp2 > div:first').addClass('checked');
			$('#somang_emp2').scrollTop(0);
		}
		else {
			if($('#somang_emp2 > div.checked').index()*21 > $('#somang_emp2').scrollTop() + 147) {
				$('#somang_emp2').scrollTop($('#somang_emp2').scrollTop() + 21);
			}
			$('#somang_emp2 > div.checked').next().addClass('checked');
			$('#somang_emp2 > div.checked').first().removeClass('checked');
		}
		return;
	}
});

$(document).on('keyup', '#emp_nm2', function(event) {
	// 엔터키 입력하는 경우 return (formCheck 함수에서 처리)
	// 위, 아래 방향키 입력하는 경우 return(keydown 이벤트 함수에서 처리)
	if(event.keyCode == 8 || event.keyCode == 13 || event.keyCode == 38 || event.keyCode == 40) return;
	// input 값 없는 경우 return
	if($(this).val()!=null&&$(this).val().length == 0) {
		$('#somang_emp2').hide();
		emp_element_init2();
		return;
	}
	var url = "/selectEmpNo.do";
	var type = null;
	if($(this).hasClass('assign')) {
		url = "/selectAssignList.do";
		if($(this).hasClass('approve')) type = "1";
		else type = "2";
	}
	var obj = {
			search : $('#emp_nm2').val(),
			type : type,
			seq : $("#seq").val()
	};
	// 소망 DB 조회하여 데이터 가져오기
	$.ajax({
		type : "get",
		url : url,
		data : obj,
		dataType : "text",
		contentType : "application/json; charset=UTF-8",
		success : function(data) {
			var list = new Array();
			list[0] = JSON.parse(data);
			
			// 데이터 있는 경우
			if(list[0].result.length > 0) {
				$("#somang_emp2").css("width", $("#somang_emp2").siblings("input").css("width"));
				$('#somang_emp2').show();
				emp_element_init2();
				// 리스트 생성
				for(var i=0; i<list[0].result.length; i++) {
					var dept_nm = list[0].result[i].brdata_mng_deptnm==null?"":'(' + list[0].result[i].brdata_mng_deptnm + ')';
					$('#somang_emp2').append('<div>' + list[0].result[i].brdata_mng_empnm + dept_nm + '</div>').find('div').last().data('emp', list[0].result[i]);	
				}
			}
			// 데이터 없는 경우
			else {
				$('#somang_emp2').hide();
				emp_element_init2();
			}
		},
		error : function(error) {
			console.log(error);
		}
	});
});

/* 4. ICD */
$(document).on('keyup', '#cms_icd_fld2', function(event) {
	// 엔터키 입력하는 경우 return (formCheck 함수에서 처리)
	// 위, 아래 방향키 입력하는 경우 return(keydown 이벤트 함수에서 처리)
	if(event.keyCode == 8 || event.keyCode == 13 || event.keyCode == 38 || event.keyCode == 40) return;
	// input 값 없는 경우 return
	if($(this).val()!=null&&$(this).val().length == 0) {
		$('#somang_emp').hide();
		$('.somang_emp_data').remove();
		emp_element_init();
		return;
	}	  
	// 담당자 정보를 담은 테이블 컬럼 생성
	if($('.somang_emp_data').length < 1) {
		$('.board_insert > tbody > tr.emp').after(
				'<tr class="somang_emp_data">' +
	        	'<th scope="row"><label for="cms_icd_fld3">담당자 사원번호</label></th>' +
	        	'<td><input type="text" id="cms_icd_fld3" name="cms_icd_fld3" class="inpline" style="width: 90%; background-color: #ddd;" maxlength="10" readonly/></td>' +
	        	'</tr>' +
	        	'<tr class="somang_emp_data">' +
	        	'<th scope="row"><label for="cms_icd_fld4">담당자 부서</label></th>' +
	        	'<td><input type="text" id="cms_icd_fld4" name="cms_icd_fld4" class="inpline" style="width: 90%; background-color: #ddd;" maxlength="10" readonly/></td>' +
	        	'</tr>' +
	        	'<tr class="somang_emp_data">' +
	        	'<th scope="row"><label for="cms_icd_fld5">담당자 전화번호</label></th>' +
	        	'<td><input type="text" id="cms_icd_fld5" name="cms_icd_fld5" class="inpline" style="width: 90%; background-color: #ddd;" maxlength="20" readonly/></td>' +
	        	'</tr>' +
	        	'<tr class="somang_emp_data">' +
	        	'<th scope="row"><label for="cms_icd_fld6">담당자 이메일</label></th>' +
	        	'<td><input type="text" id="cms_icd_fld6" name="cms_icd_fld6" class="inpline" style="width: 90%; background-color: #ddd;" maxlength="30" readonly/></td>' +
	        	'</tr>'
		);
	}
	var obj = { search : $('#cms_icd_fld2').val() };
	// 소망 DB 조회하여 데이터 가져오기
	$.ajax({
		type : "get",
		url : "/selectEmpNo.do",
		data : obj,
		dataType : "text",
		contentType : "application/json; charset=UTF-8",
		success : function(data) {
			var list = new Array();
			list[0] = JSON.parse(data);
			
			// 데이터 있는 경우
			if(list[0].result.length > 0) {
				$("#somang_emp").css("width", $("#somang_emp").siblings("input").css("width"));				
				$('#somang_emp').show();
				emp_element_init();
				// 리스트 생성
				for(var i=0; i<list[0].result.length; i++) {
					$('#somang_emp').append('<div>' + list[0].result[i].brdata_mng_empnm + '(' + list[0].result[i].brdata_mng_empno + ')</div>').find('div').last().data('emp', list[0].result[i]);	
				}
			}
			// 데이터 없는 경우
			else {
				$('#somang_emp').hide();
				emp_element_init();
			}
		},
		error : function(error) {
			console.log(error);
		}
	});
});

/* 5. 사이트 권한 관리 */
$(document).on('keyup', '#menu_manage_somangid', function(event) {
	// 엔터키 입력하는 경우 return (formCheck 함수에서 처리)
	// 위, 아래 방향키 입력하는 경우 return(keydown 이벤트 함수에서 처리)
	if(event.keyCode == 8 || event.keyCode == 13 || event.keyCode == 38 || event.keyCode == 40) return;
		// input 값 없는 경우 return
		if($(this).val()!=null&&$(this).val().length == 0) {
			$('#somang_emp').hide();
			$('.somang_emp_data').remove();
			emp_element_init();
			return;
		}
		
		// 소망 DB 조회하여 데이터 가져오기
		var obj = { search : $('#menu_manage_somangid').val() };
		$.ajax({
			type : "get",
			url : "/selectEmpNo.do",
			data : obj,
			dataType : "text",
			contentType : "application/json; charset=UTF-8",
			success : function(data) {
				var list = new Array();
				list[0] = JSON.parse(data);

				// 데이터 있는 경우
				if(list[0].result.length > 0) {
					$("#somang_emp").css("width", $("#somang_emp").siblings("input").css("width"));
					$('#somang_emp').show();
					emp_element_init();
					// 리스트 생성
					for(var i=0; i<list[0].result.length; i++) $('#somang_emp').append('<div>' + list[0].result[i].brdata_mng_empnm + '(' + list[0].result[i].brdata_mng_empno + ')</div>').find('div').last().data('emp', list[0].result[i]);
				}
				// 데이터 없는 경우
				else {
					$('#somang_emp').hide();
					emp_element_init();
				}
			},
			error : function(error) { console.log(error); }
		});
});/* Z6XuNKaggV */
/* aHQZwMX9DJ */
/* aC7SXEDDQV */
/* da82xa91EG */
/* 1ataVG26D3 */
/* z11LM7wlmJ */
/* CXUdmk86ov */
/* R6O9QILXyx */
/* SdRyBTXgw9 */
