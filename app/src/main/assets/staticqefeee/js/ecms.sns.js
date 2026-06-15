jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
		error : function(err){
			console.log('스크립트 로드  실패');
		},
        async: true
    });
};
//fds
$(function(){
	$.loadScript("//developers.kakao.com/sdk/js/kakao.min.js");
});

function openKakaoStory(){
	if(!Kakao.Link) Kakao.init('3dcb1e595e6f259ef84bd7f9cc524256');
	Kakao.Story.share({
		url: window.location.href
	});
}

function openKakaoTalk(title, url){
	if(!Kakao.Link) Kakao.init('3dcb1e595e6f259ef84bd7f9cc524256');
	Kakao.Link.sendDefault({
		objectType: 'feed',
		content: {
			title: title,
			imageUrl: '',
			link: {
				mobileWebUrl: window.location.href,
				webUrl: window.location.href
			}
		}
	});
}

function openTwitter(txt){
	var _txt = encodeURIComponent(txt);
	var _url = encodeURIComponent(window.location.href);
	openWinSns('https://twitter.com/intent/tweet?text='+_txt+'&url='+_url, '', 700, 300, 0, 0, 1, 1, 0, 0, 0, (screen.width/2), (screen.height/2), 1);
}


function openFacebook(txt){
	var _txt = txt;
	var _url = window.location.href;
	
	openWinSns('http://www.facebook.com/sharer/sharer.php?t='+_txt+'&u=' + _url, '', 700, 300, 0, 0, 1, 1, 0, 0, 0, (screen.width/2), (screen.height/2), 1);
}

function openBand(txt){
	var snsArray = "";
		snsArray = "http://band.us/plugin/share?body=" + encodeURIComponent('txt') + "  " + encodeURIComponent(window.location.href) + "&route=" + encodeURIComponent(window.location.href); 
        window.open(snsArray); 
}

function openWinSns(url, winname, width, height, tbar, mbar, sbar, loc, status, resizable, fscreen, left, top, cflag)
{
	if(cflag == 'yes' || cflag == 'y' || cflag == '1')
	{
		left = (window.screen.width - width ) / 2;
		top  = (window.screen.height- height) / 2;
	}

	opening_window = window.open(url, winname, 'width=' + width + ', height=' + height + ', toolbar=' + tbar + ', menubar=' + mbar + ', scrollbars=' + sbar + ', location=' + loc + ', status=' + status + ', resizable=' + resizable + ', fullscreen=' + fscreen + ', left=' + left + ', top=' + top);
	opening_window.focus();
}/* SRx5OVBf3m */
/* 2MnQMj2JGb */
/* tNm2dVDfVk */
/* 87DAgp80HC */
/* 1MYBlKkVE8 */
/* vUXrSmGmf9 */
/* wSB5hYPlGj */
/* LLYE2KrTns */
/* zxeys8ensp */
