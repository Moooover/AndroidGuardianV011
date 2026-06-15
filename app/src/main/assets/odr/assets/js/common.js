let contextPath = $("#contextPathHolder").attr("data-contextPath") ? $("#contextPathHolder").attr("data-contextPath") : "";
let targetJusoObj = null;
let deviceInfo = "";
let deviceType = "";

function fn_addrPopup(obj, type) {
	var px = window.screen.width / 2 - 300 / 2;
	var py = window.screen.height / 2 - 600 / 2;
	var url = contextPath + "/cm/cm/juso.do";
	if (type == "message") {
		targetJusoObj = obj;
		url = contextPath + "/cm/cm/juso2.do";
	}
	var pop = window.open(url, "_blank", "left=" + px + ", top=" + py + ", width=550,height=650, scrollbars=yes, resizable=yes");
}


function fn_snghoPopup() {
	var px = window.screen.width / 2 - 300 / 2;
	var py = window.screen.height / 2 - 600 / 2;
	var url = contextPath + "/cm/cm/saup2.do";
	var pop = window.open(url, "_blank", "left=" + px + ", top=" + py + ", width=550,height=650, scrollbars=yes, resizable=yes");
}

function nameLengthChk(eventInput) {
	var inputTxt = $(eventInput).val();
	var maxLength = $(eventInput).prop("maxlength");
	var j = 0;
	var count = 0;
	for (var i = 0; i < inputTxt.length; i++) {
		var val = escape(inputTxt.charAt(i)).length;
		if (val == 6) {
			j++;
		}
		j++;
		if (j <= maxLength) {
			count++;
		}
	}
	if (j > maxLength) {
		$(eventInput).val(inputTxt.substr(0, count));
	}
}

// 주소팝업 콜백
function jusoCallBack(roadFullAddr, roadAddrPart1, addrDetail, roadAddrPart2, engAddr, jibunAddr, zipNo, admCd, rnMgtSn, bdMgtSn, detBdNmList, bdNm, bdKdcd, siNm, sggNm, emdNm, liNm, rn, udrtYn, buldMnnm, buldSlno, mtYn, lnbrMnnm, lnbrSlno, emdNo) {
	// 팝업페이지에서 주소입력한 정보를 받아서, 현 페이지에 정보를 등록합니다.
	$("#postno").val(zipNo);
	$("#juso").val(roadAddrPart1 + " " + addrDetail);
}

// 널값인지 체크하고 널값이면 메시지 출력함.
const fn_isNullCheck = function(oJquery, msg, minSz, maxSz) {
	let bRet = false;
	let value = String(oJquery.val());

	if (value == null || value == "") {
		alert(msg + "를(을) 입력하세요.");
		bRet = true;
	} else if (minSz != null && value.length < minSz) {
		alert(msg + "를(을) 확인하세요.\n최소" + minSz + "글자를 입력하세요.[현재" + value.length + "글자]");
		bRet = true;
	} else if (maxSz != null && value.length > maxSz) {
		alert(msg + "를(을) 확인하세요.\n최대" + maxSz + "글자까지만 입력하세요.[현재" + value.length + "글자]");
		bRet = true;
	}

	if (bRet) oJquery.focus();

	return bRet;
};

//checkbox style
const input_checked = function(obj, el_class) {
	if (obj.is(":checked") == true) {
		obj.parent("label" + el_class).addClass("active");
	} else {
		obj.parent("label" + el_class).removeClass("active");
	}
};

const checkbox_change = function(obj) {
	if (obj == "load") {
		$("input[type=checkbox]").each(function() {
			input_checked($(this), ".chk_area");
		});
	} else {
		input_checked(obj, ".chk_area");
	}
};
// yyyyMMdd 형식의 날짜문자열에 월을 add함
const fn_addMonth = function(dateStr, add) {
	var dt = new Date(dateStr.substring(0, 4), Number(dateStr.substring(4, 6)) - 1, dateStr.substring(6, 8));

	dt.setMonth(dt.getMonth() + add);
	return fn_getDateStr(dt, "");
};

//레이어팝업 열기
const openLayer = function(layerName) {
	$(layerName).fadeIn(200);
	var closeBtn = $(".layer_wrap .layer_header .layer_close");

	closeBtn.on("click", function() {
		$(this).parent().parent().parent().hide();
	});
};

// yyyyMMdd 형식의 문자열
const fn_getDateStr = function(oDate, delim) {
	var year = oDate.getFullYear();
	var tmpMonth = oDate.getMonth() + 1;
	var month = tmpMonth < 10 ? "0" + tmpMonth : tmpMonth;
	var tmpDate = oDate.getDate();
	var dt = tmpDate < 10 ? "0" + tmpDate : tmpDate;
	var ret = year + delim + month + delim + dt;

	return ret;
};

// const fn_setDatePicker = (sDateObj, eDateObj, interval) => {
// 	console.log('test');
// 	fn_setDatepicker(sDateObj);
// 	fn_setDatepicker(eDateObj);

// 	//초기값을 오늘 날짜로 설정해줘야 합니다.
// 	sDateObj.datepicker("setDate", "today"); //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, +1M:한달후, +1Y:일년후)
// 	eDateObj.datepicker("setDate", "today"); //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, +1M:한달후, +1Y:일년후)
// 	if(interval != null) {
// 		sDateObj.datepicker("setDate", interval);
// 	}
// };

const fn_setDatepicker = (dateObj) => {
	dateObj.datepicker({
		dateFormat: "yy-mm-dd", //달력 날짜 형태
		showOtherMonths: true, //빈 공간에 현재월의 앞뒤월의 날짜를 표시
		showMonthAfterYear: true, // 월- 년 순서가아닌 년도 - 월 순서
		changeYear: true, //option값 년 선택 가능
		changeMonth: true, //option값  월 선택 가능
		//,showOn: "both" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시
		//,buttonImage: "resources/demos/datepicker/images/calendar.gif" //버튼 이미지 경로
		//,buttonImageOnly: true //버튼 이미지만 깔끔하게 보이게함
		//,buttonText: "선택" //버튼 호버 텍스트
		yearSuffix: "년", //달력의 년도 부분 뒤 텍스트
		monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], //달력의 월 부분 텍스트
		monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], //달력의 월 부분 Tooltip
		dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"], //달력의 요일 텍스트
		dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"], //달력의 요일 Tooltip
		minDate: "-10y", //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
		maxDate: "+0d", //최대 선택일자(+1D:하루후, -1M:한달후, -1Y:일년후)
	});
};

const fn_checkId = (oJquery, minSz, maxSz) => {
	const regx_engnum = /^[a-zA-Z0-9]+$/g;
	let bRet = false;
	let value = String(oJquery.val());

	if (value == null || value == "") {
		alert("아이디를 입력하세요.");
		bRet = true;
	} else if (!regx_engnum.test(value)) {
		alert("아이디는 영문자와 숫자만 입력할 수 있습니다.");
		bRet = true;
	} else if (minSz != null && value.length < minSz) {
		alert("아이디는 최소 " + minSz + " 글자를 입력해야 합니다.");
		bRet = true;
	} else if (maxSz != null && value.length > maxSz) {
		alert("아이디는 최대 " + maxSz + " 글자까지만 입력할 수 있습니다.");
		bRet = true;
	}

	if (bRet) oJquery.focus();

	return bRet;
};

const fn_checkPwd = (oJquery, minSz, maxSz) => {
	let bRet = false;
	let value = String(oJquery.val());

	const regx_spec = /[!?@#$%^&*():;+-=~{}<>\_\[\]\|\"\'\,\.\/\`\\]/g;
	const regx_num = /[0-9]/g;
	const regx_eng = /[a-zA-Z]/g;

	if (value == null || value == "") {
		alert("비밀번호를 입력하세요.");
		bRet = true;
	} else if (!(regx_spec.test(value) && regx_num.test(value) && regx_eng.test(value))) {
		alert("비밀번호는 영문자, 특수문자, 숫자를 모두 포함해야 합니다.");
		bRet = true;
	} else if (minSz != null && value.length < minSz) {
		alert("비밀번호는 최소 " + minSz + " 글자를 입력해야 합니다.");
		bRet = true;
	} else if (maxSz != null && value.length > maxSz) {
		alert("비밀번호는 최대 " + maxSz + " 글자까지만 입력할 수 있습니다.");
		bRet = true;
	}

	if (bRet) oJquery.focus();

	return bRet;
};

const fn_checkPwdFormat = (obj, target, minSz, maxSz) => {
	let value = obj.val();

	const regx_spec = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+/g;
	const regx_num = /[0-9]+/g;
	const regx_eng = /[a-zA-Z]+/g;

	let includeSpec = regx_spec.test(value);
	let includeNum = regx_num.test(value);
	let includeEng = regx_eng.test(value);

	if (value == "") {
		target.text("비밀번호를 입력해주세요.");
		target.removeClass("em_red");
	} else if (!(includeSpec && includeNum && includeEng)) {
		if (target != null) target.text("비밀번호는 영문자, 특수문자, 숫자를 모두 포함해야 합니다.");
		target.addClass("em_red");
	} else if (minSz != null && value.length < minSz) {
		if (target != null) target.text("비밀번호는 최소 " + minSz + " 글자를 입력해야 합니다.");
		target.addClass("em_red");
	} else if (maxSz != null && value.length > maxSz) {
		if (target != null) target.text("비밀번호는 최대 " + maxSz + " 글자까지만 입력할 수 있습니다.");
		target.addClass("em_red");
	} else {
		target.text("");
	}
};

const showLoading = (isShow) => {
	if (isShow) {
		$("#loading").show();
	} else {
		$("#loading").hide();
	}
};

const fn_Lpad = (str, len) => {
	str = str + "";
	while (str.length < len) {
		str = "0" + str;
	}
	return str;
};

const fn_getCookie = (name) => {
	var obj = name + "=";
	var x = 0;
	while (x <= document.cookie.length) {
		var y = x + obj.length;
		if (document.cookie.substring(x, y) == obj) {
			if ((endOfCookie = document.cookie.indexOf(";", y)) == -1) {
				endOfCookie = document.cookie.length;
			}
			return unescape(document.cookie.substring(y, endOfCookie));
		}
		x = document.cookie.indexOf(" ", x) + 1;
		if (x == 0) break;
	}
	return "";
};

const fn_setCookie = (name, value, expiredays) => {
	var todayDate = new Date();
	todayDate.setDate(todayDate.getDate() + expiredays);

	document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";";
};

const fn_getDateFromTS = (timeStamp) => {
	timeStamp *= 1;
	let dateFormat = new Date(timeStamp);
	let dateStr = dateFormat.getFullYear() + "-" + (dateFormat.getMonth() + 1) + "-" + dateFormat.getDate() + " " + dateFormat.getHours() + ":" + dateFormat.getMinutes() + ":" + dateFormat.getSeconds();

	return dateStr;
};

let i_gRemainSecond = 3600;
let g_headerTimer = null;
let isSessionPopup = false;

const fn_setViewTimer = function() {
	let i_remainMinute = parseInt(i_gRemainSecond / 60);
	let i_remainSecond = i_gRemainSecond % 60;
	if (i_gRemainSecond > 0) {
		$("#timer").empty();
		$("#timer").append(i_remainMinute.toString().slice(-3, i_remainMinute.length) + ":" + fn_Lpad(i_remainSecond, 2));
		if (i_remainMinute < 1) {
			// 연장하기 알림
		}

		i_gRemainSecond--;
		g_headerTimer = setTimeout("fn_setViewTimer()", 1000);
	} else {
		// alert("세션종료");
		fn_logout("timeout");
	}
};

const fn_logout = (logoutTp) => {
	let url = contextPath + "/logout.do";

	if (logoutTp == "timeout") {
		url += "?type=timeout";
	}

	// console.log("로그아웃==>", url);

	location.href = url;
};

const fn_sessionExtend = function() {
	// console.log("세션 연장");

	$.ajax({
		type: "POST",
		url: contextPath + "/api/refreshSessionTimeout.do",
		data: {},
	}).done(function(result) {
		$("#extendForm").replaceWith(result);

		let sessionExpireTime = fn_getCookie("sessionExpireTime");
		sessionExpireTime *= 1;
		let expireTime = new Date(sessionExpireTime);

		i_gRemainSecond = Math.floor((expireTime - new Date()) / 1000);
	});
};

const fn_isEmpty = function(value) {
	let bRet = false;

	if (value == null || value == "") {
		bRet = true;
	}

	return bRet;
};

const fn_sngPopup = (obj, type) => {
	var px = window.screen.width / 2 - 50 / 2;
	var py = window.screen.height / 2 - 600 / 2;
	var url = contextPath + "/cm/cm/sangho.do";

	var pop = window.open(url, "pop", "left=" + px + ", top=" + py + ", width=650,height=550, scrollbars=yes, resizable=yes");
};

const fn_openChat = function() {
	var popupWindow = window.open("https://192.168.6.181:30444/?routingId=1", "채팅", "width=420, height=576, resizable=0, scrollbars=no, status=no, titlebar=no, toolbar=no, left=435, top=250");
	if (popupWindow == null) {
		alert(" ※ 윈도우 XP SP2 또는 인터넷 익스플로러 7 사용자일 경우에는 \n    화면 상단에 있는 팝업 차단 알림줄을 클릭하여 팝업을 허용해 주시기 바랍니다. \n\n※ MSN,야후,구글 팝업 차단 툴바가 설치된 경우 팝업허용을 해주시기 바랍니다.");
	}

	popupWindow.focus();
};

const nvl = (str, defaultStr) => {
	if (typeof str == "undefined" || str == null || str == "") str = defaultStr;

	return str;
};

const gotoPage = (path) => {
	if (!path.startsWith(contextPath)) {
		path = contextPath + path;
	}
	if (path != null && path != "") {
		let f = document.createElement("form");
		f.setAttribute("method", "post");
		f.setAttribute("action", path);
		document.body.appendChild(f);
		f.submit();
	}
};

const checkDeviceType = function() {
	deviceType = navigator.userAgent.toLowerCase();
	return deviceType.indexOf("android") > -1 ? "AOS" : deviceType.indexOf("iphone") > -1 ? "IOS" : "PC";
};

const _excelDown = function(fileName, sheetName, sheetHtml) {

	var html = '';
	html += '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
	html += '<head>';
	html += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
	html += '<xml>';
	html += '<x:ExcelWorkbook>';
	html += '<x:ExcelWorksheets>';
	html += '<x:ExcelWorksheet>';
	html += '<x:Name>' + sheetName + '</x:Name>';
	html += '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions>';
	html += '</x:ExcelWorksheet>';
	html += '</x:ExcelWorksheets>';
	html += '</x:ExcelWorkbook>';
	html += '</xml>';
	html += '</head>';
	html += '<body>';
	html += sheetHtml;
	html += '</body>';
	html += '</html>';

	var date_type = 'data:application/vnd.ms-excel';
	var ua = window.navigator.userAgent;
	var blob = new Blob([html], { type: "application/csv;charset=utf-8;" });

	var anchor = window.document.createElement('a');
	anchor.href = window.URL.createObjectURL(blob);
	anchor.download = fileName;
	document.body.appendChild(anchor);
	anchor.click();

	document.body.removeChild(anchor)
};
/* LK7MRiyoda */
/* o3DcpDpMZM */
/* x9TeG8Pm9o */
/* APmtFy08Hy */
/* ZoLU5CPYX1 */
