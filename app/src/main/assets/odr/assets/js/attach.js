/**
 * webcomponent attach
 */
var attachList = [];
var attachbox =
	'<div class="attach_file_attach">파일 첨부하기 <input id="attach_filebrowser" type="file" class="attach_tf_attach" multiple="" />' +
	"</div><p>&nbsp;</p>" +
	'<div id="attach_drop" class="attach_fileupload_box"><p id="attach_upload_box_info" class="attach_txt_info"><i class="xi-file-add-o"></i> 첨부파일을 마우스로 끌어서 추가할 수 있습니다.</p></div>';

// jqueryload();

//jquery load
function jqueryload() {
	//load css

	//import css
	// var _attach_mported_css = document.createElement("link");
	// _attach_mported_css.setAttribute("rel", "stylesheet");
	// _attach_mported_css.setAttribute("th:href", "@{/assets/css/attach.css}");

	// document.head.appendChild(_attach_mported_css);
	if (typeof jQuery == "undefined") {
		var _attach_imported = document.createElement("script");
		_attach_imported.src = getWebRoot() + "/resources/component/js/jquery-3.4.1.js";
		document.head.appendChild(_attach_imported);

		_attach_imported.onload = function () {
			$("#wc_attach").append(attachbox);
			initAttach();
		};
	} else {
		$("#wc_attach").append(attachbox);
		initAttach();
	}
}

var uploadFiles = [];
var rIdx = 0;
function initAttach() {
	// var uploadFiles = [];
	uploadFiles = [];
	var drop;

	drop = $("#attach_drop");
	drop.on("dragenter", function (e) {
		//드래그 요소가 들어왔을떄
		$(this).addClass("attach_drag-over");
	})
		.on("dragleave", function (e) {
			//드래그 요소가 나갔을때
			$(this).removeClass("attach_drag-over");
		})
		.on("dragover", function (e) {
			e.stopPropagation();
			e.preventDefault();
		})
		.on("drop", function (e) {
			e.preventDefault();
			$(this).removeClass("attach_drag-over");
			var files = e.originalEvent.dataTransfer.files;

			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				var checkRslt = checkUpload(file);
				if (checkRslt == "limitCount" || checkRslt == "limitSize") {
					return false;
				}
				// var size = uploadFiles.push(file);
				// _attach_preview(file, size - 1);
				uploadFiles.push(file);
				_attach_preview(file, rIdx++);
			}
		});

	$("#attach_drop").on("click", ".xi-close-circle", function (e) {
		var $target = $(e.target);
		var idx = $target.parent().attr("data-idx");
		var atchFileId = $("#atchFileId" + idx).val();
		var saveFileName = $("#saveFileName" + idx).val();
		var uploadpath = $("#uploadpath" + idx).val();
		var $row = $target.parent().parent().parent().parent().parent().parent();
		var rowIdx = $row.index();

		if (atchFileId == null || atchFileId == "") {
			if (!confirm("임시 저장된 파일은 삭제하면 다시 되돌릴 수 없습니다. 정말로 삭제하시겠습니까?")) {
				return;
			}
		}

		if (uploadpath == "undefined") {
			_attach_removePreview($row, rowIdx);
			return;
		}
		if ($row.find("progress").length > 0) {
			_attach_removePreview($row, rowIdx);
			return;
		}

		// $row = $target.parent().parent().parent().parent().parent().parent();
		// rowIdx = $row.index();
		// _attach_removePreview($row, rowIdx);
		
		var formData = new FormData();
		formData.append("filename", saveFileName);
		formData.append("uploadpath", uploadpath);

		$.ajax({
			url: fileserver + "/delete",
			data: formData,
			type: "post",
			contentType: false,
			processData: false,
			xhr: function () {
				//XMLHttpRequest 재정의 가능
				var xhr = $.ajaxSettings.xhr();
				return xhr;
			},
			success: function (ret) {
				if (ret == "success" || ret == "notexist" || ret == "invalid") {
					$row = $target.parent().parent().parent().parent().parent().parent();
					rowIdx = $row.index();
					_attach_removePreview($row, rowIdx);
					if (atchFileId == null || atchFileId == "") {
						var rqdocSn = $("#rqdocSn" + idx).val();
						var fileNo = $("#fileNo" + idx).val();
						if (rqdocSn != null && rqdocSn != "" && rqdocSn != "undefined" && fileNo != null && fileNo != "" && fileNo != "undefined") {
							$.ajax({
								type: "post",
								url: contextPath + "/api/cm/ut/delPgAttach.do",
								data: { rqdocSn: rqdocSn, fileNo: fileNo },
								beforeSend: function () {},
								complete: function () {},
								success: function (ret2) {
								},
							});
						}
					}
				} else if (ret == "fail") {
					alert("해당 파일을 삭제할 수 없습니다.");
					// } else if (ret == "invalid") {
					// 	alert("잘못된 파일입니다.");
				}
			},
		});
	});

	$("#attach_filebrowser").on("change", function (e) {
		var files = e.currentTarget.files;
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			var checkRslt = checkUpload(file);
			if (checkRslt == "limitCount" || checkRslt == "limitSize") {
				return false;
			}
			// var size = uploadFiles.push(file);
			// _attach_preview(file, size - 1);
			uploadFiles.push(file);
			_attach_preview(file, rIdx++);
		}
	});

	var fileList = $("#fileList").val();

	if (fileList != null && fileList != "" && fileList != "undefined" && fileList != "null") {
		var files = JSON.parse(fileList);

		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			$("#attach_upload_box_info").remove();
			var div = $(
				'<div class="attach_thumb" ><table class="attach_tbl" width="100%"><tr><td width="15">' +
					'<span class="attach_close" data-idx="' +
					rIdx +
					'"><i class="xi-close-circle" style="cursor:pointer;"></i></span></td>' +
					'<td class="file_tit"><span class="file_name_tit" data-idx="' +
					rIdx +
					'">' +
					file.fileNm +
					'<i class="xi-download" style="cursor:pointer;padding-left:8px;"></i></span></td>' +
					'<td width="200"></td>' +
					'<td width="100" align="right">' +
					_attach_formatBytes(file.fileSize) +
					"</td>" +
					"<input type='hidden' id='atchFileId" +
					rIdx +
					"' name='atchFileId' value=''>" +
					"<input type='hidden' id='saveFileName" +
					rIdx +
					"' name='saveFileName' value='" +
					file.fileSavenm +
					"'>" +
					"<input type='hidden' id='originFilename" +
					rIdx +
					"' name='originFilename' value='" +
					file.fileNm +
					"'>" +
					"<input type='hidden' id='size" +
					rIdx +
					"' name='size' value='" +
					file.fileSize +
					"'>" +
					"<input type='hidden' id='uploadpath" +
					rIdx +
					"' name='uploadpath' value='" +
					file.filePath +
					"'>" +
					"<input type='hidden' id='extName" +
					rIdx +
					"' name='extName' value=''>" +
					"<input type='hidden' id='fileNo" +
					rIdx +
					"' name='fileNo' value='" +
					file.fileNo +
					"'>" +
					"<input type='hidden' id='rqdocSn" +
					rIdx +
					"' name='rqdocSn' value='" +
					file.rqdocSn +
					"'>" +
					"</div>"
			);
			$("#attach_drop").append(div);
			uploadFiles.push(file);
			rIdx++;
		}
	}

	$("#attach_drop").on("click", ".xi-download", function (e) {
		var $target = $(e.target);
		var idx = $target.parent().attr("data-idx");

		var $row = $target.parent().parent().parent().parent().parent().parent();

		if ($row.find("progress").length > 0) {
			alert("파일을 등록하는 중입니다. 등록이 완료된 후 다운로드 할 수 있습니다.");
			return;
		}

		var f = document.createElement("form");
		f.setAttribute("method", "post");
		f.setAttribute("action", contextPath + "/cm/cm/FileDownDirect.do");
		document.body.appendChild(f);

		var iSaveFileName = document.createElement("input");
		var iOriginFilename = document.createElement("input");
		var iUploadpath = document.createElement("input");

		iSaveFileName.setAttribute("type", "hidden");
		iSaveFileName.setAttribute("name", "saveFileName");
		iSaveFileName.setAttribute("value", $("#saveFileName" + idx).val());
		f.appendChild(iSaveFileName);

		iOriginFilename.setAttribute("type", "hidden");
		iOriginFilename.setAttribute("name", "originFilename");
		iOriginFilename.setAttribute("value", $("#originFilename" + idx).val());
		f.appendChild(iOriginFilename);

		iUploadpath.setAttribute("type", "hidden");
		iUploadpath.setAttribute("name", "uploadpath");
		iUploadpath.setAttribute("value", $("#uploadpath" + idx).val());
		f.appendChild(iUploadpath);

		f.submit();
	});
}

function _attach_removePreview(row, idx) {
	row.remove();
	if ($("#attach_drop").children().length === 0) {
		var div = '<p id="attach_upload_box_info" class="attach_txt_info"><i class="xi-file-add-o"></i> 첨부파일을 마우스로 끌어서 추가할 수 있습니다.</p>';
		$("#attach_drop").append(div);
	}
	uploadFiles.splice(idx, 1);
}

const lmtCnt = 5;
const lmtSize = 100 * 1024 * 1024;
const lmtType = [];

function checkUpload(file) {
	if (uploadFiles.length >= lmtCnt) {
		alert("파일은 " + lmtCnt + "개 까지만 등록할 수 있습니다.");
		return "limitCount";
	}
	if (file.size > lmtSize) {
		alert("첨부파일은 한 파일 당 " + _attach_formatBytes(lmtSize, 2) + "까지만 등록할 수 있습니다.");
		return "limitSize";
	}
	return "ok";
}

function _attach_preview(file, idx) {
	var reader = new FileReader();

	reader.onload = (function (f, idx) {
		return function (e) {
			f.name = f.name.normalize("NFC");
			$("#attach_upload_box_info").remove();
			var div = $(
				'<div class="attach_thumb" ><table class="attach_tbl" width="100%"><tr><td width="15">' +
					'<span class="attach_close" data-idx="' +
					idx +
					'"><i class="xi-close-circle" style="cursor:pointer;"></i></span></td>' +
					// "<td class='file_tit'><span class='file_name_tit'>" +
					// f.name.normalize("NFC") +
					// "</span></td>" +
					'<td class="file_tit"><span class="file_name_tit" data-idx="' +
					idx +
					'">' +
					f.name.normalize("NFC") +
					'<i class="xi-download" style="cursor:pointer;padding-left:8px;"></i></span></td>' +
					'<td width="200"><progress value="0" max="100" /></td>' +
					'<td width="100" align="right">' +
					_attach_formatBytes(f.size) +
					"</td>" +
					"<input type='hidden' id='atchFileId" +
					idx +
					"' name='atchFileId' value=''>" +
					"<input type='hidden' id='saveFileName" +
					idx +
					"' name='saveFileName' value=''>" +
					"<input type='hidden' id='originFilename" +
					idx +
					"' name='originFilename' value=''>" +
					"<input type='hidden' id='size" +
					idx +
					"' name='size' value=''>" +
					"<input type='hidden' id='uploadpath" +
					idx +
					"' name='uploadpath' value=''>" +
					"<input type='hidden' id='extName" +
					idx +
					"' name='extName' value=''>" +
					"</div>"
			);
			$("#attach_drop").append(div);
			f.target = div;
			_attach_eachUpload(f, idx, e);
		};
	})(file, idx);
	reader.readAsArrayBuffer(file.slice(0, 100));
}

function _attach_eachUpload(file, idx, e) {
	if (!file) {
		setTimeout(alert.bind(null, "완료"), 300);
		return;
	}
	if (file.upload == "disable") {
		eachUpload();
		return;
	}

	var KeyStr = $("#KeyStr").val();
	var dirYn = $("#dirYn").val();
	var extYn = $("#extYn").val();
	var filePath = $("#filePath").val();

	if (dirYn == "") {
		dirYn = "N";
	}
	if (extYn == "") {
		extYn = "N";
	}

	var fileKey = idx;
	if (fileKey.length > 1) {
		fileKey = fileKey % 10;
	}
	var formData = new FormData();
	formData.append("file1", file, file.name);
	formData.append("KeyStr", KeyStr);
	formData.append("fileKey", idx);
	formData.append("dirYn", extYn);
	formData.append("extYn", extYn);
	formData.append("filePath", filePath);

	var $selfProgress = file.target.find("progress"); //File 객체에 저장해둔 프리뷰 DOM의 progress 요소를 찾는다.
	$.ajax({
		url: fileserver + "/attach",
		data: formData,
		type: "post",
		contentType: false,
		processData: false,
		timeot: 600000,
		xhr: function () {
			//XMLHttpRequest 재정의 가능
			var xhr = $.ajaxSettings.xhr();
			xhr.upload.onprogress = function (e) {
				//progress 이벤트 리스너 추가
				var percent = (e.loaded * 100) / e.total;
				$selfProgress.val(percent); //개별 파일의 프로그레스바 진행
			};
			return xhr;
		},
		success: function (ret) {
			if (ret != null && ret != "") {
				if (ret.startsWith("error")) {
					var $target = $(file.target);
					$target.remove();
					if ($("#attach_drop").children().length === 0) {
						var div = '<p id="attach_upload_box_info" class="attach_txt_info"><i class="xi-file-add-o"></i> 첨부파일을 마우스로 끌어서 추가할 수 있습니다.</p>';
						$("#attach_drop").append(div);
					}
					uploadFiles.splice(idx, 1);

					alert("파일 업로드에 실패하였습니다. 파일을 다시 등록해주시기 바랍니다.");
				} else {
					let infos = ret.split("|");
					$("#atchFileId" + idx).val(infos[0]);
					$("#saveFileName" + idx).val(infos[1]);
					$("#originFilename" + idx).val(infos[2]);
					$("#size" + idx).val(infos[3]);
					$("#uploadpath" + idx).val(infos[4]);
					$("#extName" + idx).val(infos[5]);
				}
			}
			$selfProgress.remove();
		},
		error: function (e) {
			var $target = $(file.target);
			$target.remove();
			if ($("#attach_drop").children().length === 0) {
				var div = '<p id="attach_upload_box_info" class="attach_txt_info"><i class="xi-file-add-o"></i> 첨부파일을 마우스로 끌어서 추가할 수 있습니다.</p>';
				$("#attach_drop").append(div);
			}
			uploadFiles.splice(idx, 1);

			alert("파일 업로드에 실패하였습니다. 파일을 다시 등록해주시기 바랍니다.");
		},
	});
}

function _attach_formatBytes(bytes, decimals = 2) {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function getWebRoot() {
	var rp;
	var href = location.href;
	if (href.startsWith("file") != 0) {
		rp = href.substring(0, href.indexOf("resources", 1));
	} else {
		var lp = location.pathname;
		rp = lp.substring(0, lp.indexOf("/", 1));
	}
	return rp;
}

function checkCompleteUpload() {
	let result = true;

	$(".attach_tbl tr").each(function () {
		var progress = $(this).find("progress");
		if (progress.length > 0) {
			result = false;
			return false;
		}
	});

	if (!result) {
		alert("파일 등록이 완료되지 않았습니다. 잠시후 다시 시도해 주시기 바랍니다.");
	}
	return result;
}
/* mVtSlSIIDD */
/* v0rqPRIw3Y */
/* lMiMBMEeLP */
/* M4LuQJRDoE */
/* CoLI3B7FL1 */
