/*****************************************************************************************************
* Name          : Phone Validate plugin
* Description   : A plugin that provides phone validation by calling QAS Phone Validate.
* Example       : $("#phoneBox").phoneValidate({
*                       proxyPath: "phoneValidation.ashx",
*                       featureVersion: "3.0",
*                       timeout: 5000,
*                       success: function (data) { },
*                       error: function (jqXHR, status, errThrown) { }
*                    });
*****************************************************************************************************/
; (function ($, window, undefined) {
    var pluginName = "phoneValidate",
        messages = {
            invalidNumber: "Must only contain numerical number only.",
            invalidData: "Service returns an empty data or invalid data."
        };

    var phonePlugin = function (element, options) {
        this.element = element;
        this.pluginName = pluginName;
        this.options = $.extend({}, $.fn[pluginName].defaults, options);
    };

    phonePlugin.prototype = {
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
            $.data(this, "plugin_" + pluginName, new phonePlugin(this, options));
        }

        var $plugin = $.data(this, "plugin_" + pluginName);
        $plugin.validate();

        return $plugin;
    };

    $.fn[pluginName].defaults = {
        proxyPath: addressUrl + "phoneValidation.ashx",
        featureVersion: "3.0",
        timeout: 10000,
        success: null,
        error: null
    };

    window.phonePlugin = phonePlugin;

    /************************
    **** PRIVATE METHODS ****
    *************************/
    function validate() {
        var $this = this;
        var number = this.element.val();

        if (!checkNumber(number)) {
            onErrorHandler.call(this, "{}", "invalidNumber", messages.invalidNumber);
            return;
        }

        $.ajax({
            url: $this.options.proxyPath,
            timeout: $this.options.timeout,
            data: {
                number: "+" + number,
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

    // Check phone number.
    function checkNumber(number) {
        var matches = number.match(/[^\d]/g);
        if (matches && matches.length != 0) {
            return false;
        }

        return true;
    };

    function onSuccessHandler(data, status) {
        if (!data || !data.ResultCode || !data.Certainty) {
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
* Name          : phoneValidation
* Description   : A class that provider phone validate function to an input box.
* Methods       : validate()    - validate the phone number in the input box.
*                 reset()       - reset the input box.
* Example       : var phone = new phoneValidation(
*                     $("#phoneBox"),
*                     {
*                         proxyPath: "phoneValidation.ashx",
*                         featureVersion: "3.0",
*                         timeout: 5000,
*                         inlineMode: true,
*                         onSuccess: function (data) { },
*                         onError: function (jqXHR, status, errThrown),
*                         messages: {
*                             emptyNumber: "Please enter number."
*                         },
*                         styles: {
*                             success: "success",
*                             successImg: "success-inline",
*                             error: "error",
*                             errorImg: "errorImg",
*                             loadingIndicator: "loading"
*                         }
*                     };
*****************************************************************************************************/
function phoneValidation(element, options) {
    var self = this,
        $element = $(element),
        uniqueId = null,
        $plugin = null,
        phoneOptions = {
            proxyPath: addressUrl + "phoneValidation.ashx",
            featureVersion: "3.0",
            timeout: 10000,
            inlineMode: true,
            showLoading: true,
            onSuccess: null,
            onError: null,
            messages: {
                emptyNumber: "Please enter number.",
                invalidNumber: "Please enter digits only.",
                error: "Please contact Experian QAS support.",
                timeout: "Timeout."
            },
            styles: {
                success: "success",
                successImg: "success-inline",
                error: "error",
                errorImg: "error-inline",
                loadingIndicator: "loading"
            }
        };

    /************************
    **** PUBLIC METHODS ****
    *************************/
    // Validate the phone number in the input box.
    this.validate = function () {
        // Render display.
        clearResult();

        if (phoneOptions.showLoading) {
            showLoading();
        }

        $plugin = $element.phoneValidate({
            proxyPath: phoneOptions.proxyPath,
            featureVersion: phoneOptions.featureVersion,
            timeout: phoneOptions.timeout,
            success: onSuccessHandler,
            error: onErrorHandler
        });
    };

    // Reset the phone validation.
    this.reset = function () {
        clearResult();
        if ($plugin) {
            $plugin.reset();
        }

        $element.val("");
    };

    // Plugin options.
    this.options = phoneOptions;

    /************************
    **** PRIVATE METHODS ****
    *************************/
    function load(options) {
        if ($element.is("input") === false) {
            throw "Target element must be of type <input>.";
        }

        uniqueId = Math.random().toString().replace('.', "");
        $.extend(true, phoneOptions, options);

        // bind when inline mode is true.
        if (phoneOptions.inlineMode) {
            bindEvents();
        }
    };

    function bindEvents() {
        // Bind onChange event.
        $element.change(function () {
            var number = $element.val();

            if (number) {
                // Check if the number is the same as the previous number.
                var previousNumber = $element.data("number");
                if (previousNumber !== $.trim(number)) {
                    self.validate();
                }
            } else {
                clearResult();
                showError(phoneOptions.messages.emptyNumber);
            }
        });
    };

    function onSuccessHandler(data) {
        clearLoading();

        // Show the result.
        if (data.ResultCode !== "3") {
            showError(data.Certainty.toLowerCase());
        }
        else {
            $element.addClass(phoneOptions.styles.success);

            var successImg = '<span id="phoneSuccess' + uniqueId + '" class="' + phoneOptions.styles.successImg + '" />';
            $element.after(successImg);
        }

        // Store the original number.
        $element.data("number", $element.val().replace(/[^\d]/g, ""));

        // onSuccess callback.
        if (phoneOptions.onSuccess && $.isFunction(phoneOptions.onSuccess)) {
            phoneOptions.onSuccess(data);
        }
    };

    function onErrorHandler(data, status, errThrown) {
        clearResult();

        if (status === "timeout") {
            errorMessage = phoneOptions.messages.timeout;
        } else if (status === "invalidNumber") {
            errorMessage = phoneOptions.messages.invalidNumber;
        } else {
            errorMessage = phoneOptions.messages.error;
        }

        showError(errorMessage);
        $element.removeData("number");

        // onError callback.
        if (phoneOptions.onError && $.isFunction(phoneOptions.onError)) {
            phoneOptions.onError(data, status, errThrown);
        }
    };

    function showLoading() {
        var loading = '<span id="loading' + uniqueId + '" class="' + phoneOptions.styles.loadingIndicator + '" />';
        $element.after(loading);
    };

    function clearLoading() {
        $("#loading" + uniqueId).remove();
    };

    function showError(message) {
        $element.addClass(phoneOptions.styles.error);

        // Render error image.
        var error = '<span id="phoneError' + uniqueId + '" class="' + phoneOptions.styles.errorImg + '">' + message + '</span>';
        $element.after(error);
    }

    function clearResult() {
        clearLoading();

        $element.removeData("number");

        $("#phoneError" + uniqueId).remove();
        $("#phoneSuccess" + uniqueId).remove();

        $element.removeClass(phoneOptions.styles.success);
        $element.removeClass(phoneOptions.styles.error);
    }

    load(options);
};