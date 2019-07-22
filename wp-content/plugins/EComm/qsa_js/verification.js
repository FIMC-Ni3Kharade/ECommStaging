/************************************************************************************************
* Name          : verificationSearch
* Description   : A Verification Address Search plugin used to search address based on
*                 specific country.
* Example       : $("#searchContainer").verificationSearch({
*                       proxyPath: "addressValidation.ashx",
*                       timeout: 5000,
*                       inputAddress: "inputAddress",
*                       inputCountry: "inputCountry",
*                       onSuccess: function (data) {},
*                       onError: function (data, status) {},
*                       styles: {
*                           resultContainer: "resultContainer",
*                           picklist: "picklist",
*                           refineContainer: "refineContainer",
*                           statusIndicator: "statusIndicator",
*                           picklistItem: "picklistItem",
*                           error: "error",
*                           loading: "loading",
*                           refineError: "refineError",
*                           refineButton: "refineButton",
*                           refineHeader: "refineHeader",
*                           refineText: "refineText",
*                           refineBox: "refineBox"
*                       }
*                   });
************************************************************************************************/
var Country = "USA";
; (function ($, window, undefined) {
    var pluginName = "verificationSearch",
        xhr = null,
        elementIds = {
            resultContainerId: "resultContainer",
            picklistId: "picklist",
            statusIndicatorId: "statusIndicator",
            refineContainerId: "refineContainer",
            refineErrorId: "refineError",
            refineButtonId: "refineButton",
            refineHeaderId: "refineHeader",
            refineTextId: "refineText",
            refineBoxId: "refineBox",
            loadingId: "loading",
            errorIndicatorId: "errorIndicator"
        },
        styles = {
            resultContainer: "resultContainer",
            picklist: "picklist",
            picklistItem: "picklistItem",
            picklistItemText: "picklistItemText",
            refineContainer: "refineContainer",
            refineHeader: "refineHeader",
            refineText: "refineText",
            refineBox: "refineBox",
            refineButton: "refineButton",
            refineError: "refineError",
            errorIndicator: "errorImg",
            loadingIndicator: "loading"
        },
        messages = {
            interactionRequired: {
                header: "We think that your address may be incorrect or incomplete.",
                text: "We recommend:",
                button: "Use suggested address"
            },
            premisePartial: {
                header: "Sorry, we think your apartment/suite/unit is missing or wrong.",
                text: "Confirm your Apartment/Suite/Unit number:",
                button: "Confirm number",
                error: "Secondary information not within valid range"
            },
            streetPartial: {
                header: "Sorry, we do not recognize your house or building number.",
                text: "Confirm your House/Building number:",
                button: "Confirm number",
                error: "Primary information not within valid range"
            },
            multiple: {
                header: "We found more than one match for your address.",
                text: "Our suggested matches:"
            },
            verify: {
                notVerified: "Address could not be verified."
            },
            error: {
                error: "",
                timeout: "Timeout."
            }
        },
        ajaxErrorMessages = {
            invalidData: "Service returns an empty data or invalid data.",
            resultMissingId: "Result is missing 'id' property.",
            serverNotFound: "Server not found!!!"
        };

    // verification plugin.
    var verificationPlugin = function (element, options) {
        this.element = element;
        this.options = $.extend(true, {}, $.fn[pluginName].defaults, options);
    };

    $.fn[pluginName] = function (options) {
        if ($(this).is("div") == false) {
            throw "Target element must be of type <div>";
        }

        if (!$.data(this, "plugin_" + pluginName)) {
            $.data(this, "plugin_" + pluginName, new verificationPlugin(this, options));
        }

        var $plugin = $.data(this, "plugin_" + pluginName);

        return $plugin;
    };

    $.fn[pluginName].defaults = {
        proxyPath: addressUrl + "addressValidation.ashx",
        timeout: 10000,
        inputAddress: "inputAddress",
        inputCountry: "inputCountry",
        styles: styles,
        messages: messages,
        onSuccess: null,
        onError: null
    };

    // Address plugin prototype methods.
    verificationPlugin.prototype = {
        getAddresses: function () {
            return getAddresses.call(this);
        },
        getCountry: function () {
            return getCountry.call(this);
        },
        renderPicklist: function (items, verifyLevel) {
            renderPicklistElements.call(this, items, verifyLevel);
            bindPicklistElementEvents.call(this, items);
        },
        renderRefineBox: function (data, verifyLevel) {
            renderRefineElements.call(this, data, verifyLevel);
        },
        renderError: function (jqXHR, status, errorThrown) {
            renderErrorElements.call(this, jqXHR, status, errorThrown);
        },
        verify: function () {
            reset();

            // Render result container.
            renderResultContainerElements.call(this);
            renderLoadingElements.call(this, this.resultContainer.children("div"), false, "Loading...");

            // Get the address to verify.
            var address = this.getAddresses();
            var country = this.getCountry();
            this.options.country = country;

            ajaxCall.call(this, "verify", address, undefined, onVerifySuccess, onError);
        },
        refine: function (query, moniker) {
            ajaxCall.call(this, "refine", query, moniker, onRefineSuccess, onError);
        },
        final: function (moniker) {
            ajaxCall.call(this, "final", undefined, moniker, onFinalSuccess, onError);
        },
        reset: function () {
            reset();
        }
    };

    /************************
    **** PRIVATE METHODS ****
    *************************/

    // Ajax call to proxy.
    function ajaxCall(action, query, moniker, onSuccess, onError) {
        var $this = this;

        // Abort the previous call if there is any.
        if (xhr) {
            xhr.abort();
        }

        xhr = $.ajax({
            url: $this.options.proxyPath,
            timeout: $this.options.timeout,
            type: 'GET',
            data: {
                action: action,
                query: query,
                id: moniker,
                country: $this.options.country
            },
            dataType: "json",
            success: function (data, status, jqXHR) {
                onSuccess.call($this, data, status, jqXHR);
            },
            error: function (jqXHR, status, errThrown) {
                onError.call($this, jqXHR, status, errThrown);
            }
        });
    };

    // Get addresses.
    function getAddresses() {
        var $address = $("." + this.options.inputAddress);

        if ($address.length === 0) {
            throw "No inputAddress found.";
        }

        if ($address.is("input") == false) {
            throw "inputAddress must be a type of <input />";
        }

        var searchAddress = "";
        $address.each(function (index, value) {
            if (index == 2)
                searchAddress += ",";
            else
                searchAddress += $(this).val();
            searchAddress += ",";
            searchAddress = searchAddress.replace("UN", "");
            searchAddress = searchAddress.replace("_____-____", "");
        });

        return searchAddress.substring(0, searchAddress.length - 1);
    };

    // Get countries.
    function getCountry() {
        //        var $country = $("." + this.options.inputCountry);
        //        if ($country.length === 0) {
        //            throw "No inputCountry found.";
        //        }
        var State = $("#selState option:selected").val();
      //  GetCountryByState(State);
        var countryValue = Country;//$('.optContry:checked').val().toUpperCase();//Country;//"USA";//$country.val();
        if (!countryValue) {
            throw "inputCountry's value cannot be empty or null.";
        }

        return countryValue;
    };

    // Verify success handler.
    function onVerifySuccess(data, status) {
        clearLoading();

        if (!data || !data.verifylevel) {
            onError.call(this, data, "error", ajaxErrorMessages.invalidData);
            return;
        }

        var verifyLevel = data.verifylevel.toLowerCase();

        // Render workflow based on verify level.
        switch (verifyLevel) {
            case "verified":
                if (!data.fields || data.fields.length < 1) {
                    onError.call(this, data, "error", ajaxErrorMessages.invalidData);
                    return;
                }
                onFinalSuccess.call(this, data, status);
                $('#btnCheckAdress').hide();
                
                $('#txtAddressLine').removeClass('txtErr');
                $('#txtAddressLine').addClass('txtSuccess');
                $('#divPermenetAddrMessage').html(" <img src='../wp-content/plugins/EComm/Images/true.png' /><span style='color:green;'>Address Validated</span>");
                // $('#modalAddressValidation').modal('hide');
                break;

            case "interactionrequired":
                if (!data.fields || data.fields.length < 1) {
                    onError.call(this, data, "error", ajaxErrorMessages.invalidData);
                    return;
                }

                this.renderRefineBox(data.fields, verifyLevel);

                break;

            case "premisespartial":
            case "streetpartial":
            case "multiple":
                if (!data.results || !$.isArray(data.results) || data.results.length < 1) {
                    onError.call(this, data, "error", ajaxErrorMessages.invalidData);
                    return;
                }

                // Check if there is a refine action in the results.
                var hasRefine = false;
                $.each(data.results, function (index, value) {
                    if (value.action && value.action.toLowerCase() === "refine") {
                        hasRefine = true;
                        return false;
                    }
                });

                if (!hasRefine) {
                    verifyLevel = "noRefine";
                }

                this.renderRefineBox(data.results, verifyLevel);
                this.renderPicklist(data.results, verifyLevel);
                //
                //$('#txtAddressLine').removeClass('txtErr');
                //$('#txtAddressLine').addClass('txtSuccess');
                //$('#divPermenetAddrMessage').html(" <img src='Images/true.png' /><span style='color:green;'>Address Validated </span>");
                //$('#btnCheckAdress').show();

                break;

            case "none":
                onError.call(this, data, "notFound", this.options.messages.verify.notVerified);
                break;

            default:
                onError.call(this, data, "serverNotFound", ajaxErrorMessages.serverNotFound);
                break;
        };
    };

    // Refine success handler.
    function onRefineSuccess(data, status, jqXHR) {
        clearLoading();

        if (!data || !data.results || !$.isArray(data.results)) {
            onError.call(this, data, "error", ajaxErrorMessages.invalidData);
            return;
        }

        if (data.results.length == 1) {
            if (!data.results[0].id) {
                onError.call(this, data, "error", ajaxErrorMessages.resultMissingId);
                return;
            }

            this.final(data.results[0].id);
        } else {
            // Render picklist.
            this.renderPicklist(data.results);
        }
    };

    // Final success handler.
    function onFinalSuccess(data, status) {
        reset();

        if (!data) {
            onError.call(this, data, "error", ajaxErrorMessages.invalidData);
            return;
        }

        // onSuccess callback.
        if ($.isFunction(this.options.onSuccess)) {
            this.options.onSuccess(data);
        }
    };

    // Error handler.
    function onError(jqXHR, status, errorThrown) {
        clearLoading();

        // Render error.
        this.renderError(jqXHR, status, errorThrown);

        // onError callback.
        if ($.isFunction(this.options.onError)) {
            this.options.onError(jqXHR, status, errorThrown);
        }
    };

    // Get refined associated picklist item.
    function getRefinedAssociatedPicklistItem(refineVal, results) {
        var selected = null;
        var rValue = refineVal.toUpperCase();

        if (rValue) {
            var $addresses = results || [];
            var alphaRefineValMatches = rValue.match(/[a-zA-Z]+/);
            var numRefineValMatches = rValue.match(/[0-9]+/);
            var alphaRefineVal = alphaRefineValMatches ? alphaRefineValMatches[0].toUpperCase().charCodeAt(0) : null;
            var numericRefineVal = numRefineValMatches ? Number(numRefineValMatches[0]) : null;

            $.each($addresses, function (i, v) {
                var decodedAdd = decodeURIComponent(v.text);
                var alphanumeric = decodedAdd.match(/([a-zA-Z0-9]+) \.\.\. ([a-zA-Z0-9]+)/g);
                var hasOddEven = decodedAdd.match(/(\[odd\]|\[even\])/g) || false;
                var isOdd = decodedAdd.match(/\[odd\]/g) || false;
                var isMatch = false;

                if (!hasOddEven || ((!isOdd && (numericRefineVal % 2 === 0)) || (isOdd && (numericRefineVal % 2 !== 0)))) {
                    $(alphanumeric).each(function () {
                        var range = this.split(" ... ");
                        var bottomNumber = range[0].match(/([0-9]+)/g);
                        var topNumber = range[1].match(/([0-9]+)/g);
                        var bottomAlpha = range[0].match(/([a-zA-Z]+)/g);
                        var topAlpha = range[1].match(/([a-zA-Z]+)/g);

                        if (topNumber && bottomNumber) {
                            if (numericRefineVal >= Number(bottomNumber[0]) &&
                                numericRefineVal <= Number(topNumber[0])) {
                                isMatch = true;
                            }
                        } else if (bottomNumber) {
                            if (numericRefineVal === Number(bottomNumber[0])) {
                                isMatch = true;
                            }
                        }

                        if (topAlpha && bottomAlpha && isMatch) {
                            isMatch = false;

                            if (Number(bottomAlpha[0].toUpperCase().charCodeAt(0) !== Number(topAlpha[0].toUpperCase().charCodeAt(0)))) {
                                if (alphaRefineVal >= Number(bottomAlpha[0].toUpperCase().charCodeAt(0)) &&
                                    alphaRefineVal <= Number(topAlpha[0].toUpperCase().charCodeAt(0))) {
                                    isMatch = true;
                                }
                            } else if (Number(topAlpha[0].toUpperCase().charCodeAt(0)) === alphaRefineVal) {
                                isMatch = true;
                            }
                        } else if (topAlpha && alphaRefineVal && isMatch) {
                            if (Number(topNumber[0]) === numericRefineVal &&
                                alphaRefineVal > Number(topAlpha[0].toUpperCase().charCodeAt(0))) {
                                isMatch = false;
                            }
                        }
                    });
                }

                if (!isMatch) {
                    var strippedAdd = decodedAdd.replace(/([a-zA-Z0-9]+) \.\.\. ([a-zA-Z0-9]+)/g, "");
                    var numericalMatches = strippedAdd.match(/\b([0-9]+)\b/g);

                    $(numericalMatches).each(function () {
                        if (numericRefineVal === Number(this)) {
                            isMatch = true;
                        }
                    });
                }

                if (isMatch) {
                    selected = {
                        action: v.action,
                        query: refineVal,
                        moniker: decodeURIComponent(v.id)
                    };

                    return false;
                }
            });
        }

        return selected;
    };

    /************************
    *** RENDERING METHODS ***
    *************************/
    // Clear result container.
    function clearResult() {
        $("#" + elementIds.resultContainerId).empty();
    };

    // Clear loading indicator.
    function clearLoading() {
        $("#" + elementIds.loadingId).remove();
    };

    // Reset the result.
    function reset() {
        $("#" + elementIds.resultContainerId).remove();
    };

    // Render Result Container.
    function renderResultContainerElements() {
        // Don't render resultContainer when it already exists.
        if ($("#" + elementIds.resultContainerId).length != 0) {
            return;
        }

        // Render html.
        var html = '<div id="' + elementIds.resultContainerId + '" class="' + this.options.styles.resultContainer + '" ><div/></div>';
        this.element.append(html);

        this.resultContainer = $("#" + elementIds.resultContainerId);
    };

    // Render picklist.
    function renderPicklistElements(items, verifyLevel) {
        var $this = this;

        // Remove existing picklist.
        $("#picklist").remove();

        // Render html.
        var html = '<ul id="' + elementIds.picklistId + '" class="' + this.options.styles.picklist + '" >';
        var isClickable = (verifyLevel && verifyLevel === "multiple") || false;
        var idPrefix = "picklistItem";

        $.each(items, function (index, value) {
            html += '<li class="' + $this.options.styles.picklistItem + '" >';

            if (value.action === "final" || value.action === "verify" || (value.action === "refine" && isClickable)) {
                html += '<a id="' + idPrefix + '_' + index + '" href="javascript:void(0);" class="' + $this.options.styles.picklistItemText + '" >';
                html += value.text;
                html += '</a>';
            } else if (value.action === "refine") {
                html += '<a id="' + idPrefix + '_' + index + '" class="' + $this.options.styles.picklistItemText + '" >';
                html += value.text;
                html += '</a>';
            }

            html += '</li>';
        });

        html += '</ul>';

        this.resultContainer.append(html);
    };

    // Bind picklist element events.
    function bindPicklistElementEvents(items) {
        var $this = this;

        if (!items || items.length < 1) {
            return;
        }

        // Cycle through every picklist item and bind the click event.
        $.each(items, function (index, value) {
            var $picklistItem = $("#picklistItem_" + index);

            if ($picklistItem.attr("href")) {
                // Store data in the element.
                $picklistItem.data({
                    id: value.id,
                    action: value.action,
                    query: value.text
                });

                // Bind click event.
                $picklistItem.click(function () {
                    var $item = $(this);
                    var action = $item.data("action");

                    // Unbind all click event on the picklist.
                    $("#" + elementIds.picklistId + " > li > a").off("click");

                    // Render loading element.
                    renderLoadingElements.call($this, this, true);

                    switch (action) {
                        case "verify":
                            $this.verify($item.text());

                            break;

                        case "refine":
                            var verifyLevel = "premisespartial",
                                results = [{
                                    id: $item.data("id"),
                                    text: $item.data("query"),
                                    action: action
                                }];

                            // Clear loading and result.
                            clearLoading();
                            clearResult();

                            $this.renderRefineBox(results, verifyLevel);
                            $this.renderPicklist(results, verifyLevel);
                            break;

                        case "final":
                            $this.final($item.data("id"));
                            break;

                    }
                    
                    $('#txtAddressLine').removeClass('txtErr');
                    $('#txtAddressLine').addClass('txtSuccess');
                    $('#divPermenetAddrMessage').html(" <img src='../wp-content/plugins/EComm/Images/true.png' /><span style='color:green;'>Address Validated </span>");
                    $('#btnCheckAdress').hide();
                });
            }
        });
    };

    // Render refine container.
    function renderRefineElements(results, verifyLevel) {
        var $this = this;
        var messages = null;

        // Get the display messages.
        switch (verifyLevel) {
            case "interactionrequired":
                messages = $this.options.messages.interactionRequired;
                break;
            case "premisespartial":
                messages = $this.options.messages.premisePartial;
                break;
            case "streetpartial":
                messages = $this.options.messages.streetPartial;
                break;
            case "noRefine":
            case "multiple":
                messages = $this.options.messages.multiple;
                break;
        };

        // Get refine container html.
        var html = getRefineContainerHtml(messages, this.options.styles, verifyLevel, results);

        // Render html.
        this.resultContainer.prepend(html);

        var $refineButton = $("#" + elementIds.refineButtonId);

        // Premises and Street Partial.
        if (verifyLevel === "premisespartial" || verifyLevel === "streetpartial") {
            // Bind click event.
            $refineButton.click(function () {
                var $refineError = $("#" + elementIds.refineErrorId)

                // Clear existing error message.
                $refineError.text("");

                // Get the associated picklist item based on the refine value.
                var item = getRefinedAssociatedPicklistItem($("#" + elementIds.refineBoxId).val(), results)

                if (!item) {
                    $refineError.text(messages.error);
                } else {
                    // Unbind click event from refine button.
                    $refineButton.off("click");
                    
                    $('#txtAddressLine').removeClass('txtErr');
                    $('#txtAddressLine').addClass('txtSuccess');
                    $('#divPermenetAddrMessage').html(" <img src='../wp-content/plugins/EComm/Images/true.png' /><span style='color:green;'>Address Validated</span>");

                    // Unbind picklist click events.
                    $("#" + elementIds.picklistId + " > li > a").off("click");

                    // Render loading.
                    renderLoadingElements.call($this, this);

                    // Refine.
                    $this.refine(item.query, item.moniker);
                }
            });
        }
            // Interaction required.
        else if (verifyLevel === "interactionrequired") {
            $refineButton.click(function () {
                var data = {
                    verifyLevel: "InteractionRquired",
                    fields: results
                };
                $('#btnCheckAdress').hide();
                
                $('#txtAddressLine').removeClass('txtErr');
                $('#txtAddressLine').addClass('txtSuccess');
                $('#divPermenetAddrMessage').html(" <img src='../wp-content/plugins/EComm/Images/true.png' /><span style='color:green;'>Address Validated</span>");

                onFinalSuccess.call($this, data);
            });
        }
    };

    // Get refine container html.
    function getRefineContainerHtml(messages, styles, verifyLevel, fields) {
        // Default: multiple.
        var html = '';
        //if (verifyLevel === "interactionrequired") {
        html += '<div style="float:right; padding-left:20px">';
        html += '<span class="refineHeader"> &nbsp;</span><span class="refineText" >You Entered: [<a style="cursor:pointer" data-dismiss="modal">edit</a>]</span>';
        html += '<input class="refineButton" id="btnAcceptChang" data-dismiss="modal"  type="button" value="Use Address As Entered">';

        $('.inputAddress').each(function (index, value) {
            html += '<div>' + $(value).val() + '</div>';
        });
        html += '<div>' + Country + '</div>';

        html += '</div>';
        //}
        html += '<div id="' + elementIds.refineContainerId + '" class="' + styles.refineContainer + '" >';
        html += '<span id="' + elementIds.refineHeaderId + '" class="' + styles.refineHeader + '" >' + messages.header + '</span>';
        html += '<span id="' + elementIds.refineTextId + '" class="' + styles.refineText + '" >' + messages.text + '</span>';


        // Premises and Street Partials.
        if (verifyLevel === "premisespartial" || verifyLevel === "streetpartial") {
            html += '<input id="' + elementIds.refineBoxId + '" class="' + styles.refineBox + '" type="text" />';
            html += '<input id="' + elementIds.refineButtonId + '" class="' + styles.refineButton + '" type="button" value="' + messages.button + '" />';
            html += '<br />';
            html += '<span id="' + elementIds.refineErrorId + '" class="refineError"></span>';
        }
            // Interaction required.
        else if (verifyLevel === "interactionrequired" && fields && $.isArray(fields)) {

            html += '<input id="' + elementIds.refineButtonId + '" class="' + styles.refineButton + '" type="button" value="' + messages.button + '" />';

            $.each(fields, function (index, value) {
                html += '<div>' + value.content + '</div>';
            });

        }

        html += '</div>';


        return html;
    };

    // Render loading indicator.
    function renderLoadingElements(element, isBefore, message) {
        var msg = message || "";
        var loadingHtml = '<span id="' + elementIds.loadingId + '" class="' + this.options.styles.loadingIndicator + '">' + msg + '</span>';

        if (isBefore) {
            $(element).before(loadingHtml);
        } else {
            $(element).after(loadingHtml);
        }
    };

    // Render error elements.
    function renderErrorElements(jqXHR, status, errorThrown) {
        // Remove any existing 'errorIndicator'.
        
        
        $('#txtAddressLine').addClass('txtErr');
        $('#divPermenetAddrMessage').html(" <img src='../wp-content/plugins/EComm/Images/warning.png' /><span style='color:red; padding-left:5px;'>Address is not validated, it will save invalid/following  address</span>");

        $("#" + elementIds.errorIndicatorId).remove();
        $("." + elementIds.errorIndicatorId).remove();
        // Render html.
        var html = '<span id="' + elementIds.errorIndicatorId + '" class="' + this.options.styles.errorIndicator + '" >';
        var htmlEntered = '';


        if (status === "timeout") {
            html += this.options.messages.error.timeout;
            htmlEntered += '<div style="padding-left:20px" class=' + elementIds.errorIndicatorId + '>';
            htmlEntered += '<span class="refineText" >You Entered: [<a style="cursor:pointer" data-dismiss="modal">edit</a>]</span>';
            htmlEntered += '<input class="refineButton" id="btnAcceptChang" data-dismiss="modal"  type="button" value="Use Address As Entered">';
            $('.inputAddress').each(function (index, value) {
                htmlEntered += '<div>' + $(value).val() + '</div>';
            });
            htmlEntered += '<div>' + Country + '</div>';
            htmlEntered += '</div>';

        } else if (status === "notFound" || status === "serverNotFound") {
            html += errorThrown;
            htmlEntered += '<div style="padding-left:20px" class=' + elementIds.errorIndicatorId + '>';
            htmlEntered += '<span class="refineText" >You Entered: [<a style="cursor:pointer" data-dismiss="modal">edit</a>]</span>';
            htmlEntered += '<input class="refineButton" id="btnAcceptChang" data-dismiss="modal"  type="button" value="Use Address As Entered">';
            $('.inputAddress').each(function (index, value) {
                htmlEntered += '<div>' + $(value).val() + '</div>';
            });
            htmlEntered += '<div>' + Country + '</div>';
            htmlEntered += '</div>';

        } else {
            //html += this.options.messages.error.error;
            html += errorThrown;
            htmlEntered += '<div style="padding-left:20px" class=' + elementIds.errorIndicatorId + '>';
            htmlEntered += '<span class="refineText" >You Entered: [<a style="cursor:pointer" data-dismiss="modal">edit</a>]</span>';
            htmlEntered += '<input class="refineButton" id="btnAcceptChang" data-dismiss="modal"  type="button" value="Use Address As Entered">';
            $('.inputAddress').each(function (index, value) {
                htmlEntered += '<div>' + $(value).val() + '</div>';
            });
            htmlEntered += '<div>' + Country + '</div>';
            htmlEntered += '</div>';
        }

        html += '</span>';
        html += htmlEntered;


        // Append the error in the result container.
        this.resultContainer.prepend(html);
    };

}(jQuery, window));


jQuery(document).ready(function ($) {
    $('.optContry').change(function () {
        CheckPermenetAddress();
    });
});
