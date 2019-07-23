/************************************************************************************************
* Name          : intuitiveSearch
* Description   : An Intuitive Address Search plugin used to search and verify address based on
*                 specific country.
* Example       : $("#searchContainer").intuitiveSearch({
*                       proxyPath: "addressValidation.ashx",
*                       onPreSearch: function (value) {},
*                       onSuccess: function (data) {},
*                       onError: function (jqXHR, status, errThrown) {},
*                       country: "USA",
*                       timeout: 5000,
*                       messages: {
*                           interactionRequired: {
*                               header: "We think that your address may be incorrect or incomplete.",
*                               text: "We recommend:",
*                               button: "Use suggested address"
*                           },
*                           premisePartial: {
*                               header: "Sorry, we think your apartment/suite/unit is missing or wrong.",
*                               text: "Confirm your Apartment/Suite/Unit number:",
*                               button: "Confirm number",
*                               error: "Secondary information not within valid range"
*                           },
*                           streetPartial: {
*                               header: "Sorry, we do not recognize your house or building number.",
*                               text: "Confirm your House/Building number:",
*                               button: "Confirm number",
*                               error: "Primary information not within valid range"
*                           },
*                           multiple: {
*                               header: "We found more than one match for your address.",
*                               text: "Our suggested matches:"
*                           },
*                           error: {
*                               error: "Please contact Experian QAS support.",
*                               timeout: "Timeout."
*                           },
*                       styles: {
*                           searchBox: "searchBox",
*                           resultContainer: "resultContainer",
*                           picklist: "picklist",
*                           picklistItem: "picklistItem",
*                           picklistItemText: "picklistItemText",
*                           refineContainer: "refineContainer",
*                           refineHeader: "refineHeader",
*                           refineText: "refineText",
*                           refineBox: "refineBox",
*                           refineButton: "refineButton",
*                           loadingIndicator: "loading",
*                           errorIndicator: "errorImg"
*                       }
*                   });
************************************************************************************************/
; (function ($, window, undefined) {
    var pluginName = "intuitiveSearch",
        xhr = null,
        styles = {
            searchBox: "searchBox",
            searchBoxLabel: "searchBoxLabel",
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
            loadingIndicator: "loading",
            errorIndicator: "errorImg"
        },
        messages = {
            search: {
                continueTyping: "Continue Typing..."
            },
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
            error: {
                error: "Please contact Experian QAS support.",
                timeout: "Timeout."
            }
        },
        ajaxErrorMessages = {
            invalidData: "Service returns an empty data or invalid data.",
            resultMissingId: "Result is missing 'id' property."
        };

    // Address plugin.
    var addressPlugin = function (element, options) {
        this.element = element;
        this.pluginName = pluginName;
        this.uniqueId = Math.random().toString().replace('.', "");
        this.options = $.extend(true, {}, $.fn[pluginName].defaults, options);
    };

    $.fn[pluginName] = function (options) {
        if ($(this).is("div") === false) {
            throw "Target element must be of type <div>";
        }

        if (!$.data(this, "plugin_" + pluginName)) {
            $.data(this, "plugin_" + pluginName, new addressPlugin(this, options));
        }

        var $plugin = $.data(this, "plugin_" + pluginName);
        $plugin.render();

        return $plugin;
    };

    $.fn[pluginName].defaults = {
        proxyPath: addressUrl + "addressValidation.ashx",
        country: "USA",
        timeout: 10000,
        styles: styles,
        messages: messages,
        onPreSearch: null,
        onSuccess: null,
        onError: null
    };

    // Address plugin prototype methods.
    addressPlugin.prototype = {
        render: function () {
            renderElements.call(this);
            bindEvents.call(this);
        },
        renderPicklist: function (items, verifyLevel) {
            renderPicklistElements.call(this, items, verifyLevel);
            bindPicklistElementEvents.call(this, items);
        },
        renderRefineBox: function (data, verifyLevel) {
            renderRefineElements.call(this, data, verifyLevel);
        },
        renderError: function (jqXHR, status, errThrown) {
            renderErrorElements.call(this, jqXHR, status, errThrown);
        },
        search: function (query) {
            // Clear existing search results.
            reset.call(this); 

            renderLoadingElements.call(this, this.searchBox);
            this.renderPicklist();

            ajaxCall.call(this, "search", query, undefined, onSearchSuccess, onError);
        },
        verify: function (query) {
            ajaxCall.call(this, "verify", query, undefined, onVerifySuccess, onError);
        },
        refine: function (query, moniker) {
            ajaxCall.call(this, "refine", query, moniker, onRefineSuccess, onError);
        },
        final: function (moniker) {
            ajaxCall.call(this, "final", undefined, moniker, onFinalSuccess, onError);
        },
        reset: function () {
            this.searchBox.val("");
            reset.call(this);
        },
        dispose: function () {
            /* disposes all created elements and release memory i.e. jQuery.data */
            this.element.empty();
        }
    };

    /************************
    **** PRIVATE METHODS ****
    *************************/

    // Ajax call to proxy.
    function ajaxCall(action, query, moniker, onSuccess, onError) {
        var $this = this;

        // Abort previous call if there is any.
        if (xhr) {
            xhr.abort();
        }

        xhr = $.ajax({
            url: $this.options.proxyPath,
            timeout: $this.options.timeout,
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

    // Search success handler.
    function onSearchSuccess(data, status) {
        clearLoading(this.uniqueId);

        if (!data || !data.results || !$.isArray(data.results)) {
            onError.call(this, data, "error", ajaxErrorMessages.invalidData);
            return;
        }

        // Render picklist.
        this.renderPicklist(data.results);
    };

    // Verify success handler.
    function onVerifySuccess(data, status) {
        clearLoading(this.uniqueId);
        clearResult(this.uniqueId);

        if (!data || !data.verifylevel) {
            onError.call(this, data, "error", ajaxErrorMessages.invalidData);
            return;
        }

        var verifyLevel = data.verifylevel.toLowerCase();

        // Render workflow based on verify level.
        switch (verifyLevel) {
            case 'verified': 
                if (!data.fields || data.fields.length < 1) {
                    onError.call(this, data, "error", ajaxErrorMessages.invalidData);
                    return;
                }

                onFinalSuccess.call(this, data, status);
                break;

            case 'interactionrequired':
                if (!data.fields || data.fields.length < 1) {
                    onError.call(this, data, "error", ajaxErrorMessages.invalidData);
                    return;
                }

                this.renderRefineBox(data.fields, verifyLevel);
                break;

            case 'premisespartial':
            case 'streetpartial':
            case 'multiple':
                if (!data.results || data.results.length < 1) {
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
                break;

            case 'none':
                onFinalSuccess.call(this, data, status);
                break;
        };
    };

    // Refine success handler.
    function onRefineSuccess(data, status) {
        clearLoading(this.uniqueId);

        if (!data || !data.results || !$.isArray(data.results)) {
            onError.call(this, data, "error", ajaxErrorMessages.invalidData);
            return;
        }

        // Call final when there is only 1 result.
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
        clearResult(this.uniqueId);

        if (!data) {
            onError.call(this, data, "error", ajaxErrorMessages.invalidData);
            return;
        }

        // onSuccess Callback.
        if ($.isFunction(this.options.onSuccess)) {
            this.options.onSuccess(data);
        }
    }

    // Error handler.
    function onError(jqXHR, status, errThrown) {
        // Remove loading indicator.
        clearLoading(this.uniqueId);

        // Render error.
        this.renderError(jqXHR, status, errThrown);

        // onError Callback.
        if ($.isFunction(this.options.onError)) {
            this.options.onError(jqXHR, status, errThrown);
        }
    };

    // Clear result container.
    function clearResult(uniqueId) {
        $("#resultContainer" + uniqueId).empty();
    };

    // Clear the error indicator.
    function clearError(uniqueId) {
        $("#errorIndicator" + uniqueId).remove();
    }

    // Clear the loading indicator.
    function clearLoading(uniqueId) {
        $("#loading" + uniqueId).remove();
    }

    // Reset elements for new search.
    function reset() {
        if (xhr) {
            xhr.abort();
        };

        clearResult(this.uniqueId);
        clearLoading(this.uniqueId);
        clearError(this.uniqueId);
    };

    // Render initial elements.
    function renderElements() {
        // Render html.
        var html = '<label for="searchBox' + this.uniqueId + '" class="' + this.options.styles.searchBoxLabel + '" >Enter Search</label>';
        html += '<input id="searchBox' + this.uniqueId + '" name="searchBox' + this.uniqueId + '" type="text" class="' + this.options.styles.searchBox + '" />';
        html += '<div id="resultContainer' + this.uniqueId + '" class="' + this.options.styles.resultContainer + '" ></div>';

        this.element.prepend(html);

        // Assign searchBox to plugin property.
        this.searchBox = $("#searchBox" + this.uniqueId);
        this.resultContainer = $("#resultContainer" + this.uniqueId);
    };

    // Render loading indicator.
    function renderLoadingElements(element, isBefore) {
        var loadingHtml = '<span id="loading' + this.uniqueId + '" class="' + this.options.styles.loadingIndicator + '"> </span>';

        if (isBefore) {
            $(element).before(loadingHtml);
        } else {
            $(element).after(loadingHtml);
        }
    };

    // Render error elements.
    function renderErrorElements(jqXHR, status, errThrown) {
        // Remove any existing 'errorIndicator'.
        $("#errorIndicator" + this.uniqueId).remove();

        // Render html.
        var html = '<span id="errorIndicator' + this.uniqueId + '" class="' + this.options.styles.errorIndicator + '" >';

        if (status === "timeout") {
            html += this.options.messages.error.timeout;
        } else {
            html += this.options.messages.error.error;
        }

        html += '</span>';

        // Append the error after the search box.
        $("#resultContainer" + this.uniqueId).prepend(html);
    };

    // Render picklist.
    function renderPicklistElements(items, verifyLevel) {
        var $this = this;
        var builder = new Array();

        // Remove existing picklist.
        $("#picklist" + this.uniqueId).remove();

        // Render Html.
        var html = '<ul id="picklist' + this.uniqueId + '" class="' + this.options.styles.picklist + '" >';
        var idPrefix = "picklistItem" + this.uniqueId;

        if (!items || items.length < 1) {
            html += '<li class="' + this.options.styles.picklistItem + '" >';
            html += '<a id="' + idPrefix + '_0" class="' + this.options.styles.picklistItemText + '" >' + this.options.messages.search.continueTyping + '</a>';
            html += '</li>';
        } else {
            var isClickable = (verifyLevel && verifyLevel === 'multiple') || false;

            // Populate picklist items.
            $.each(items, function (index, value) {
                html += '<li class="' + $this.options.styles.picklistItem + '" >';

                if (value.action === "final" || value.action === "verify" || (value.action === "refine" && isClickable)) {
                    html += '<a id="' + idPrefix + '_' + index + '" href="javascript:void(0)" class="' + $this.options.styles.picklistItemText + '" >';
                    html += value.text;
                    html += '</a>';
                } else if (value.action === "refine") {
                    html += '<a id="' + idPrefix + '_' + index + '" class="' + $this.options.styles.picklistItemText + '" >';
                    html += value.text;
                    html += '</a>';
                }

                html += '</li>';
            });
        }

        html += '</ul>';
        this.resultContainer.append(html);
    };

    // Bind picklist elements events
    function bindPicklistElementEvents(items) {
        var $this = this;

        if (!items || items.length < 1) {
            return;
        }

        // Cycle through every picklist item and bind the click event.
        $.each(items, function (index, value) {
            var $picklistItem = $("#picklistItem" + $this.uniqueId + '_' + index);

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
                    $("#picklist" + $this.uniqueId + " > li > a").off("click");

                    // Render loading element.
                    renderLoadingElements.call($this, $item, true); 

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

                            // clear loading and result.
                            clearLoading($this.uniqueId);
                            clearResult($this.uniqueId);

                            $this.renderRefineBox(results, verifyLevel);
                            $this.renderPicklist(results, verifyLevel);
                            break;

                        case "final":
                            $this.final($item.data("id"));
                            break;
                    }
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
        var html = getRefineContainerHtml(this.uniqueId, messages, this.options.styles, verifyLevel, results);

        // Render Html.
        this.resultContainer.prepend(html);

        var $refineButton = $("#refineButton" + this.uniqueId);

        // Premises and Street Partial.
        if (verifyLevel === "premisespartial" || verifyLevel === "streetpartial") {
            // Bind click event.
            $refineButton.click(function () {
                var $refineError = $("#refineError" + $this.uniqueId)

                // Clear existing error message.
                $refineError.text("");

                // Get the associated picklist item based on the refine value.
                var item = getRefinedAssociatedPicklistItem($("#refineBox" + $this.uniqueId).val(), results)

                if (!item) {
                    $refineError.text(messages.error);
                } else {
                    // Unbind click event from refine button.
                    $refineButton.off("click");

                    // Unbind picklist click events.
                    $("#picklist" + $this.uniqueId + " > li > a").off("click");

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

                onFinalSuccess.call($this, data);
            });
        }
    };

    // Get refine container html.
    function getRefineContainerHtml(uniqueId, messages, styles, verifyLevel, fields) {
        // Default: multiple.
        var html = '<div id="refineContainer' + uniqueId + '" class="' + styles.refineContainer + '" >';
        html += '<span id="refineHeader' + uniqueId + '" class="' + styles.refineHeader + '" >' + messages.header + '</span>';
        html += '<span id="refineText' + uniqueId + '" class="' + styles.refineText + '" >' + messages.text + '</span>';

        // Premises and Street Partials.
        if (verifyLevel === "premisespartial" || verifyLevel === "streetpartial") {
            html += '<input id="refineBox' + uniqueId + '" class="' + styles.refineBox + '" type="text" />';
            html += '<input id="refineButton' + uniqueId + '" class="' + styles.refineButton + '" type="button" value="' + messages.button + '" />';
            html += '<br />';
            html += '<span id="refineError' + uniqueId + '" class="' + styles.refineError + '"></span>';
        }
        // Interaction required.
        else if (verifyLevel === "interactionrequired" && fields && $.isArray(fields)) {
            html += '<input id="refineButton' + uniqueId + '" class="' + styles.refineButton + '" type="button" value="' + messages.button + '" />';

            $.each(fields, function (index, value) {
                html += '<div>' + value.content + '</div>';
            });
        }

        html += '</div>';

        return html;
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

    // Bind events for the search box.
    function bindEvents() {
        var $this = this;
        var timer = null;
        var previousValue = "";

        $("#searchBox" + this.uniqueId).on("change keyup paste input", function () {
            var $searchBox = $(this);
            var value = $searchBox.val();

            if (value !== "" && value !== previousValue) {
                previousValue = value;
                if (timer) {
                    clearTimeout(timer);
                }

                timer = setTimeout(function () {
                    // Trigger onPreSearch function to intercept action before search is called.
                    if ($this.options.onPreSearch && $.isFunction($this.options.onPreSearch)) {
                        $this.options.onPreSearch(value);
                    }

                    $this.search(value);
                }, 250);
            } else if ($searchBox.val() === "") {
                if (timer) {
                    clearTimeout(timer);
                }

                // Reset for new search.
                reset.call($this);
                previousValue = "";
            }
        });
    };

})(jQuery, window);