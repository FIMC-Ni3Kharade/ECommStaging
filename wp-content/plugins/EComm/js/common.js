var baseUrl = "http://10.10.50.176/ServiceLayer/";
var addressUrl = "http://10.10.50.176:8082/";

function postRequest(method, jsondata, postfn, asyncCall, errorFn, apiUrl) {
	if (true) {//sessionStorage.getItem('ActiveSession') != 'false'
	    var cvvNumber = "";
	    if (apiUrl.indexOf("CVV:") > -1) {
	        cvvNumber = apiUrl.replace("CVV:", "");
	    }

	    if (baseUrl == "" || baseUrl == null || baseUrl == undefined) { return; }
		if (apiUrl == "" || apiUrl == null || apiUrl == undefined || apiUrl.indexOf("CVV:") > -1) {
		    apiUrl = baseUrl;
		}
		var vdata = JSON.stringify(jsondata);
		if (jsondata == null) {
			vdata = {};
		}
		//ShowLoader();
		jQuery.support.cors = true;
		jQuery.ajax({
			type: "POST",
			url: apiUrl + "" + method,
			contentType: "application/json; charset=utf-8",
			data: vdata,
			cache: false,
			dataType: "json",
			async: asyncCall,

			beforeSend: function setHeader(xhr) {
			    if (method == "Services/1001/OnlineEnrollment/CreateEnrollment") {
			        xhr.setRequestHeader('cvv', cvvNumber);
			    }
				xhr.setRequestHeader(sessionStorage.getItem('KeyName'), sessionStorage.getItem('KeyValue'));
			},
			success: function (data, textStatus, request) {
				if (postfn != null) {
					if (jQuery.isFunction(postfn)) {
						postfn(data);
					}
				}

			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				HideLoader();
				if (errorFn != null && errorFn != undefined && errorFn != "") {
					if (jQuery.isFunction(errorFn)) {
						errorFn(XMLHttpRequest, textStatus, errorThrown, jsondata);
					}
				}
				else {
					errorhandling(XMLHttpRequest, textStatus, errorThrown, jsondata);
				}
			}
		});
	}
}

function getRequest(method, postfn, asyncCall, errorFn, apiUrl) {
	try {
		if (true) { //sessionStorage.getItem('ActiveSession') != 'false'
			if (baseUrl == "" || baseUrl == null || baseUrl == undefined) { return; }
			if (apiUrl == "" || apiUrl == null || apiUrl == undefined) {
			    apiUrl = baseUrl;
			}
			var vdata = {};
			//ShowLoader();
			jQuery.support.cors = true;
			jQuery.ajax({
				type: "GET",
				url: apiUrl + "" + method,
				contentType: "application/json; charset=utf-8",
				data: vdata,
				cache: false,
				dataType: "json",
				async: asyncCall,
				beforeSend: function setHeader(xhr) {
					xhr.setRequestHeader(sessionStorage.getItem('KeyName'), sessionStorage.getItem('KeyValue'));
				},
				success: function (data, textStatus, request) {
					if (postfn != null) {
						if (jQuery.isFunction(postfn)) {
							postfn(data);
						}
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					HideLoader();
					if (errorFn != null && errorFn != undefined && errorFn != "") {
						if (jQuery.isFunction(errorFn)) {
							errorFn(data);
						}
					}
					else {
						errorhandling(XMLHttpRequest, textStatus, errorThrown);
					}
				}
			});
		}
	} catch (error) {

	}
}

function errorhandling(XMLHttpRequest, textStatus, errorThrown, inputData) {
	try {
		if (XMLHttpRequest.responseJSON == "Token is not valid!") { //&& sessionStorage.getItem('ActiveSession') != 'false'
			alert("Your session expired. Please login again to continue!");
		}
		if (XMLHttpRequest.responseJSON.errors != undefined && XMLHttpRequest.responseJSON.errors.length > 0) {
			var errorMsg = '';
			var errorCode = 0;
			var memberNumber = '';
			for (i = 0; i < XMLHttpRequest.responseJSON.errors.length; i++) {
				errorMsg += XMLHttpRequest.responseJSON.errors[i].errordesc + '\n';
				if (XMLHttpRequest.responseJSON.errors[i].errorcode == 3091) {
					errorCode = 3091;
					memberNumber = XMLHttpRequest.responseJSON.errors[i].errordesc.slice(-10)
				}
			}
			if (errorCode == 3091) {

				//  showProcessDuplicate(inputData, memberNumber);
			}
			else {
				alert(errorMsg);
			}
		}
	} catch (error) {

	}
}

function checkNull(controlValue) {
	var returnVal = '';
	if (controlValue != undefined) {
		returnVal = controlValue.trim();
	}
	return returnVal;
}

function getPOSNumber() {
	var digits = Math.floor(Math.random() * 9000000000) + 1000000000;
	return digits.toString().substring(0, 7);
}

function ShowLoader() {
	jQuery('#divLoading').modal('show');
}

function HideLoader() {
	jQuery('#divLoading').modal('hide');
}

jQuery(document).ready(function ($) {
	$.fn.usPhoneFormat = function (options) {
		var params = $.extend({
			format: 'xxx-xxx-xxxx',
			international: false,

		}, options);

		if (params.format === 'xxx-xxx-xxxx') {
			$(this).bind('paste', function (e) {
				e.preventDefault();
				var inputValue = e.originalEvent.clipboardData.getData('Text');
				if (!$.isNumeric(inputValue)) {
					return false;
				} else {
					inputValue = String(inputValue.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
					$(this).val(inputValue);
					$(this).val('');
					inputValue = inputValue.substring(0, 12);
					$(this).val(inputValue);
				}
			});
			$(this).on('keyup', function (e) {
				if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
					return false;
				}
				var curchr = this.value.length;
				var curval = $(this).val();
				if (curchr == 3 && e.which != 8 && e.which != 0) {
					$(this).val(curval + "-");
				} else if (curchr == 7 && e.which != 8 && e.which != 0) {
					$(this).val(curval + "-");
				}
				$(this).attr('maxlength', '12');
			});
			$(this).on('keypress', function (e) {
				if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
					return false;
				}
				var curchr = this.value.length;
				var curval = $(this).val();
				if (curchr == 3 && e.which != 8 && e.which != 0) {
					$(this).val(curval + "-");
				} else if (curchr == 7 && e.which != 8 && e.which != 0) {
					$(this).val(curval + "-");
				}
				$(this).attr('maxlength', '12');
			});

		} else if (params.format === '(xxx) xxx-xxxx') {
			$(this).on('keyup', function (e) {
				if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
					return false;
				}
				var curchr = this.value.length;
				var curval = $(this).val();
				if (curchr == 3 && e.which != 8 && e.which != 0) {
					$(this).val('(' + curval + ')' + " ");
				} else if (curchr == 9 && e.which != 8 && e.which != 0) {
					$(this).val(curval + "-");
				}
				$(this).attr('maxlength', '14');
			});
			$(this).bind('paste', function (e) {
				e.preventDefault();
				var inputValue = e.originalEvent.clipboardData.getData('Text');
				if (!$.isNumeric(inputValue)) {
					return false;
				} else {
					inputValue = String(inputValue.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"));
					$(this).val(inputValue);
					$(this).val('');
					inputValue = inputValue.substring(0, 14);
					$(this).val(inputValue);
				}
			});

		}
	}

	$('#txtPhone').usPhoneFormat();

});

