/*****************************************************************************************************
* Name          : Email Validate plugin
* Description   : A plugin that provides email validation by calling QAS Email Validate.
* Example       : $("#emailBox").emailValidate({
*                       proxyPath: "emailValidation.ashx",
*                       featureVersion: "1.0",
*                       timeout: 5000,
*                       success: function (data) { },
*                       error: function (jqXHR, status, errThrown) { }  
*                    });
*****************************************************************************************************/
; (function ($, window, undefined) {
    var pluginName = "emailValidate",
        messages = {
            unhandledServiceException: "Unhandled exception encountered in service response.",
            invalidData: "Service returns an empty data or invalid data."
        };


    var emailPlugin = function (element, options) {
        this.element = element;
        this.pluginName = pluginName;
        this.options = $.extend(this, {}, $.fn[pluginName].defaults, options);
    };

    emailPlugin.prototype = {
        validate: function () {
            validate.call(this);
        },
        reset: function () {
            this.element.val("");
        }
    };

    $.fn[pluginName] = function (options) {
        if ($(this).is("input") === false) {
            throw "Target element must be of type <input>.";
        }

        if (!$.data(this, "plugin_" + pluginName)) {
            $.data(this, "plugin_" + pluginName, new emailPlugin(this, options));
        }

        var $plugin = $.data(this, "plugin_" + pluginName);
        $plugin.validate();

        return $plugin;
    };

    $.fn[pluginName].defaults = {
        proxyPath: addressUrl + "emailValidation.ashx",
        featureVersion: "1.0",
        timeout: 10000,
        success: null,
        error: null
    };

    /************************
    **** PRIVATE METHODS ****
    *************************/
    function validate() {
        var $this = this;
        var email = $.trim(this.element.val());

        $.ajax({
            url: $this.options.proxyPath,
            timeout: $this.options.timeout,
            data: {
                email: email,
                version: $this.options.featureVersion
            },
            dataType: "json",
            success: function (data, status, jqXHR) {
                onSuccessHandler.call($this, data, status, jqXHR);
            },
            error: function (jqXHR, status, errThrown) {
                onErrorHandler.call($this, jqXHR, status, errThrown);
            }
        });
    };

    function onSuccessHandler(data, status) {
        if (!data) {
            onErrorHandler.call(this, data, "error", messages.invalidData);
            return;
        }

        if (this.options.success && $.isFunction(this.options.success)) {
            this.options.success(data);
        }
    };

    function onErrorHandler(jqXHR, status, errThrown) {
        if (this.options.error && $.isFunction(this.options.error)) {
            this.options.error(jqXHR, status, errThrown);
        }
    };

})(jQuery, window);

/*****************************************************************************************************
* Name          : emailValidation
* Description   : A class that provider email validate function to an input box.
* Methods       : validate()    - validate the email in the input box.
*                 reset()       - reset the input box.
* Example       : var email = new emailValidation(
*                     $("#emailBox"), 
*                     {
*                         proxyPath: "emailValidation.ashx",
*                         featureVersion: "1.0",
*                         timeout: 5000,
*                         inlineMode: true,
*                         onSuccess: function (data) { },
*                         onError: function (jqXHR, status, errThrown),
*                         messages: {
*                               emptyEmail: "Please enter email.",
*                               error: "Please contact Experian QAS support.",
*                               timeout: "Timeout."
*                         },
*                         styles: {
*                               success: "success",
*                               successInline: "success-inline",
*                               error: "error",
*                               errorInline: "error-inline",
*                               loading: "loading",
*                               correctionEmail: "correctionEmail",
*                               emailPicklistHeader: "emailPicklistHeader",
*                               emailPicklist: "emailPicklist",
*                               picklistItem: "picklistItem",
*                               picklistItemText: "picklistItemText",
*                               closeButton: "closeButton"
*                         }
*                     };
*****************************************************************************************************/
function emailValidation(element, options) {
    var self = this,
        $element = $(element),
        uniqueId = null,
        $plugin = null,
        emailOptions = {
            proxyPath: addressUrl + "emailValidation.ashx",
            featureVersion: "1.0",
            timeout: 10000,
            inlineMode: true,
            showLoading: true,
            onSuccess: null,
            onError: null,
            messages: {
                emptyEmail: "",
                error: "",
                timeout: "Timeout."
            },
            styles: {
                success: "success",
                successInline: "success-inline",
                error: "error",
                errorInline: "error-inline",
                loading: "loading",
                correctionEmail: "correctionEmail",
                emailPicklistHeader: "emailPicklistHeader",
                emailPicklist: "emailPicklist",
                picklistItem: "picklistItem",
                picklistItemText: "picklistItemText",
                closeButton: "closeButton"
            }
        };

    /************************
    **** PUBLIC METHODS ****
    *************************/
    // Validate the email in the input box.
    this.validate = function () {
        // Render display.
        resetStatusElement();

        if (emailOptions.showLoading) {
            //renderLoadingIndicator();
        }

        $plugin = $element.emailValidate({
            proxyPath: emailOptions.proxyPath,
            featureVersion: emailOptions.featureVersion,
            timeout: emailOptions.timeout,
            success: onSuccessHandler,
            error: onErrorHandler
        });
    };

    // Reset the email validation.
    this.reset = function () {
        resetStatusElement();
        if ($plugin) {
            $plugin.reset();
        }
        $element.val("");
    };

    // Plugin options.
    this.options = emailOptions;

    /************************
    **** PRIVATE METHODS ****
    *************************/
    function resetStatusElement() {
        $element.removeClass(emailOptions.styles.success);
        $element.removeClass(emailOptions.styles.error);
        $("#emailStatus" + uniqueId).remove();
        $("#correctionEmail" + uniqueId).remove();
    };

    function load(options) {
        //if ($element.is("input") === false) {
        //    throw "Target element must be of type <input>.";
        //}

        uniqueId = Math.random().toString().replace('.', "");
        $.extend(true, emailOptions, options);

        // bind when inline mode is true.
        if (emailOptions.inlineMode === true) {
            bindEvents();
        };
    };

    function bindEvents() {
        // Bind onChange event.
        $element.change(function () {
            if (isNullOrWhiteSpace($element.val())) {
                resetStatusElement();
                showError(emailOptions.messages.emptyEmail);
            } else {
                self.validate();
            }

        });
    };

    function isNullOrWhiteSpace(str) {
        return str == null || str.replace(/\s/g, '').length < 1;
    };

    function onSuccessHandler(data) {

        resetStatusElement();

        var certainty = data.Certainty.toLowerCase();


        if (certainty === 'verified') {
            validateEmail = true;
            renderVerifiedStatus();

        } else {
            validateEmail = true;
            renderUnverifiedStatus(certainty);

        }
        if (data.Corrections !== undefined) {
            renderCorrectionEmail(data.Corrections);
        }

        if (emailOptions.onSuccess && $.isFunction(emailOptions.onSuccess)) {
            emailOptions.onSuccess(data);
        }
    };

    function renderLoadingIndicator() {
        if ($("#emailStatus" + uniqueId).length === 1) {
            $("#emailStatus" + uniqueId).toggleClass(emailOptions.styles.loading);
        }
        else {
            var html = [];
            html.push("<span id=\"emailStatus", uniqueId, "\" class=\"", emailOptions.styles.loading, "\"></span>");

            $element.after(html.join(""));
        };
    };

    function renderCorrectionEmail(Correction) {
        var html = [];
        //html.push("<div id=\"correctionEmail", uniqueId, "\"  class=\"" , emailOptions.styles.correctionEmail, "\">");
        //html.push("<span id=\"emailPicklistHeader", uniqueId, "\" class=\"", emailOptions.styles.emailPicklistHeader, "\">Suggestions:</span>");
        //html.push("<a id=\"correctionEmailHeaderClosed", uniqueId, "\" href=\"javascript:void(0)\" class=\"", emailOptions.styles.closeButton, "\">X</a>");
        //html.push("<hr/>");

        //html.push("<ul id=\"emailPicklist", uniqueId,"\" class=\"", emailOptions.styles.emailPicklist, "\">");

        //$.each(Correction, function (index, value) {
        //    html.push("<li id=\"", "emailItem_", index, "_", uniqueId, "\" class=\"", emailOptions.styles.picklistItem, "\">");
        //    html.push("<a href=\"javascript:void(0);\" class=\"", emailOptions.styles.picklistItemText, "\">", Correction[index], "</a>");
        //    html.push("</li>");
        //});
        //html.push("</ul>");
        //html.push("</div>");
        //$("#emailStatus" + uniqueId).after(html.join(""));

        //var $picklistItem = $("#emailPicklist" + uniqueId).find("a");
        //$picklistItem.click(function () {
        //    var content = $(this).text();
        //    resetStatusElement();
        //    $("#correctionEmail" + uniqueId).remove();
        //    $element.val(content);
        //    renderVerifiedStatus();
        //});

        //$("#correctionEmailHeaderClosed" + uniqueId).bind("click", function () {
        //    $("#correctionEmail" + uniqueId).remove();
        //});
    };

    function renderVerifiedStatus() {
        validateEmail = true;
        renderStatus(emailOptions.styles.successInline, emailOptions.styles.success, "Valid");
    };

    function renderUnverifiedStatus(status) {
        renderStatus(emailOptions.styles.errorInline, emailOptions.styles.error, status);

    };

    function renderStatus(spanClassName, elementClassName, message) {
        var html = [];
        //        html.push("<span id=\"emailStatus", uniqueId, "\" class=\"", spanClassName, "\">", message, "</span>");
        if (message == "Valid") {
            html.push("<span id=\"emailStatus", uniqueId, "\" style='color:green;'><img src='Images/true.png' />Email Validated</span>");
        }
        else if (message.toLowerCase() == "unknown") {
            html.push("<span id=\"emailStatus", uniqueId, "\" style=\"color:red\">", "", "</span>");
        }
        else if (message.toLowerCase() == "undeliverable") {
            html.push("<span id=\"emailStatus", uniqueId, "\" style=\"color:red\">", "Email Not Validated", "</span>");
        }
        else if (message.toLowerCase() == "unreachable") {
            html.push("<span id=\"emailStatus", uniqueId, "\" style=\"color:red\">", "Email Not Validated", "</span>");
        }
        else if (message.toLowerCase() == "illegitimate") {
            html.push("<span id=\"emailStatus", uniqueId, "\" style=\"color:red\">", "Email Not Validated", "</span>");
        }
        //else {
        //    html.push("<span id=\"emailStatus", uniqueId, "\" style=\"color:red\">", "Email Not Validated", "</span>");
        //}

        // $element.addClass(elementClassName);
        $element.after(html.join(""));
    };


  


    function onErrorHandler(data, status, errThrown) {

        resetStatusElement();

        if (status === "timeout") {
            message = emailOptions.messages.timeout;
        } else {
            message = emailOptions.messages.error;
        }

        showError(message);
    };

    function showError(message) {
        renderStatus(emailOptions.styles.errorInline, emailOptions.styles.error, message);

        if (emailOptions.onError && $.isFunction(emailOptions.onError)) {
            emailOptions.onError(message);
        }
    };

    function ValidateMail() {
        if (isNullOrWhiteSpace($element.val())) {
            resetStatusElement();
            showError(emailOptions.messages.emptyEmail);
        } else {
            self.validate();
        }
    }
    setTimeout(function () {
        ValidateMail();
    }, 1500);
    load(options);
};