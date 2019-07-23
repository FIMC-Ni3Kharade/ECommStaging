/************************************************************************************************
* Name          : singlelineSearch
* Description   : A Singleline Address Search plugin used to search address based on
*                 specific country.
* Example       : $("#searchContainer").singlelineSearch({
*                       proxyPath: "addressValidation.ashx",
*                       timeout: 5000,
*                       country: "GBR",
*                       onSuccess: function (data) {},
*                       onError: function (jqXHR, status, errorThrown) {},
*                       timeout: 5000,
*                       styles: {
*                           searchBoxLabel: "searchBoxLabel",
*                           searchBox: "searchBox",
*                           searchButton: "searchButton",
*                           resultContainer: "resultContainer",
*                           picklist: "picklist",
*                           picklistItem: "picklistItem",
*                           picklistItemText: "picklistItemText",
*                           loadingIndicator: "loading",
*                           errorIndicator: "errorImg"
*                       },
*                       messages: {
*                           label: {
*                               searchBox: "Enter Search"
*                           },
*                           button: {
*                               searchBox: "Search"
*                           },
*                           search: {
*                               noAddressEntered: "Please enter address to begin searching.",
*                               notFound: "Address not found."
*                           },
*                           error: {
*                               error: "Please contact Experian QAS support.",
*                               timeout: "Timeout."
*                           }
*                       }
*                   });
************************************************************************************************/
; (function ($, window, undefined) {
    var pluginName = "singlelineSearch",
        xhr = null,
        elementIds = {
            searchBox: "searchBox",
            searchButton: "searchButton",
            resultContainer: "resultContainer",
            picklist: "picklist",
            loadingIndicator: "loading",
            errorIndicator: "errorIndicator"
        },
        styles = {
            searchBoxLabel: "searchBoxLabel",
            searchBox: "searchBox",
            searchButton: "searchButton",
            resultContainer: "resultContainer",
            picklist: "picklist",
            picklistItem: "picklistItem",
            picklistItemText: "picklistItemText",
            loadingIndicator: "loading",
            errorIndicator: "errorImg"
        },
        messages = {
            label: {
                searchBox: "Enter Search"
            },
            button: {
                searchBox: "Search"
            },
            search: {
                noAddressEntered: "Please enter address to begin searching.",
                notFound: "Address not found."
            },
            error: {
                error: "Please contact Experian QAS support.",
                timeout: "Timeout."
            }
        },
        ajaxErrorMessages = {
            invalidData: "Service returns an empty data or invalid data."
        };

    // Address plugin.
    function addressPlugin(element, options) {
        this.element = element;
        this.pluginName = pluginName;
        this.uniqueId = Math.random().toString().replace('.', "");
        this.options = $.extend(true, {}, $.fn[pluginName].defaults, options);
    };

    addressPlugin.prototype = {
        render: function () {
            renderElements.call(this);
            bindEvents.call(this);
        },
        renderPicklist: function (items) {
            renderPicklistElements.call(this, items);
            bindPicklistElementEvents.call(this, items);
        },
        renderError: function (jqXHR, status, errorThrown) {
            renderErrorElements.call(this, jqXHR, status, errorThrown);
        },
        search: function (query) {
            ajaxCall.call(this, "search", query, undefined, onSearchSuccess, onError);
        },
        final: function (moniker) {
            ajaxCall.call(this, "final", undefined, moniker, onFinalSuccess, onError);
        },
        reset: function () {
            this.searchBox.val("");
            reset.call(this);
        },
        dispose: function () {
            this.element.empty();
        }
    };

    $.fn[pluginName] = function (options) {
        if ($(this).is("div") == false) {
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
        timeout: 10000,
        country: "GBR",
        styles: styles,
        messages: messages,
        onSuccess: null,
        onError: null
    };

    /************************
    **** PRIVATE METHODS ****
    *************************/
    // Ajax call to proxy.
    function ajaxCall(action, query, moniker, onSuccess, onError) {
        var $this = this;

        // Abort previous ajax call.
        if (xhr) {
            xhr.abort();
        }

        xhr = $.ajax({
            url: $this.options.proxyPath,
            type: 'GET',
            data: {
                action: action,
                query: query,
                id: moniker,
                country: $this.options.country
            },
            timeout: $this.options.timeout,
            success: function (data, status, jqXHR) {
                onSuccess.call($this, data);
            },
            error: function (req, status, errThrown) {
                onError.call($this, req, status, errThrown);
            }
        });
    };

    // Search success handler.
    function onSearchSuccess(data) {
        clearLoading(this.uniqueId);

        if (!data || !data.count || data.count <= 0) {
            onError.call(this, data, "notFound", this.options.messages.search.notFound);
            return;
        }

        if (!data.results || data.results.length <= 0) {
            onError.call(this, data, "error", ajaxErrorMessages.invalidData);
        } else {
            this.renderPicklist(data.results);
        }
    };

    // Final success handler.
    function onFinalSuccess(data) {
        reset.call(this);

        if (!data) {
            onError.call(this, data, "error", ajaxErrorMessages.invalidData);
            return;
        }

        if (this.options.onSuccess && $.isFunction(this.options.onSuccess)) {
            this.options.onSuccess(data);
        }
    };

    // Search error handler.
    function onError(jqXHR, status, errorThrown) {
        // Remove loading indicator.
        clearLoading(this.uniqueId);

        // Render error.
        this.renderError(jqXHR, status, errorThrown);

        // onError Callback.
        if (this.options.onError && $.isFunction(this.options.onError)) {
            this.options.onError(jqXHR, status, errorThrown);
        }
    };

    // Render singleline elements.
    function renderElements() {
        var html = '<label for="' + elementIds.searchBox + this.uniqueId + '" class="' + this.options.styles.searchBoxLabel + '" >' + this.options.messages.label.searchBox + '</label>';
        html += '<input id="' + elementIds.searchBox + this.uniqueId + '" class="' + this.options.styles.searchBox + '" type="text" />';
        html += '<input id="' + elementIds.searchButton + this.uniqueId + '" class="' + this.options.styles.searchButton + '" value="' + this.options.messages.button.searchBox + '" type="button" />';

        this.element.append(html);
        this.searchBox = $("#" + elementIds.searchBox + this.uniqueId);
        this.searchButton = $("#" + elementIds.searchButton + this.uniqueId);
    };

    // Render returned picklist.
    function renderPicklistElements(items) {
        var html = '<div id="' + elementIds.resultContainer + this.uniqueId + '" class="' + this.options.styles.resultContainer + '" >';
        html += '<ul id="' + elementIds.picklist + this.uniqueId + '" class="' + this.options.styles.picklist + '" >';

        for (var x = 0; x < items.length; x++) {
            var itemId = "picklistItem" + this.uniqueId + "_" + (x + 1);

            html += '<li id="' + itemId + '" class="' + this.options.styles.picklistItem + '" >';
            html += '<a href="javascript:void(0);" class="' + this.options.styles.picklistItemText + '" >' + items[x].text + '</a>';
            html += '</li>';
        }

        html += '</ul></div>';
        this.element.append(html);
    };

    // Render loading indicator.
    function renderLoading(element, isBefore) {
        var loadingHtml = '<span id="' + elementIds.loadingIndicator + this.uniqueId + '" class="' + this.options.styles.loadingIndicator + '" > </span>';

        if (isBefore) {
            $(element).before(loadingHtml);
        } else {
            $(element).after(loadingHtml);
        }
    }

    // Render error message.
    function renderErrorElements(jqXHR, status, errThrown) {
        // Remove any existing 'resultContainer'.
        $("#" + elementIds.resultContainer + this.uniqueId).remove();

        // Render html.
        var html = '<div id="' + elementIds.resultContainer + this.uniqueId + '" class="' + this.options.styles.resultContainer + '" >';
        html += '<span id="' + elementIds.errorIndicator + this.uniqueId + '" class="' + this.options.styles.errorIndicator + '" >';

        if (status === "timeout") {
            html += this.options.messages.error.timeout;
        } else if (status === "noAddress") {
            html += this.options.messages.search.noAddressEntered;
        } else if (status === "notFound") {
            html += this.options.messages.search.notFound;
        } else {
            html += this.options.messages.error.error;
        }

        html += '</span></div>';
        this.element.append(html);
    };

    // Clear loading indicator.
    function clearLoading(uniqueId) {
        $("#" + elementIds.loadingIndicator + uniqueId).remove();
    };

    // Clear result container.
    function clearResult(uniqueId) {
        $("#" + elementIds.resultContainer + uniqueId).remove();
    };

    // Reset the elements.
    function reset() {
        clearLoading(this.uniqueId);
        clearResult(this.uniqueId);
    };

    // Bind events to singleline search elements.
    function bindEvents() {
        var $this = this;
        var $searchButton = $("#" + elementIds.searchButton + this.uniqueId);
        var $searchBox = $("#" + elementIds.searchBox + this.uniqueId);
        var $loadingIndicator = $("#" + elementIds.loadingIndicator + this.uniqueId);

        $searchButton.click(function () {
            if ($loadingIndicator.length === 0) {
                performSearch.call($this, $searchBox.val());
            }
        });

        $searchBox.keypress(function (event) {
            if (event.keyCode == 13 && $loadingIndicator.length === 0) {
                performSearch.call($this, $searchBox.val());
            }
        });
    };

    // Perform address searching.
    function performSearch(query) {
        // Clear existing search results.
        reset.call(this);

        if (!query) {
            onError.call(this, {}, "noAddress", this.options.messages.search.noAddressEntered);
            return;
        }

        renderLoading.call(this, $("#" + elementIds.searchButton + this.uniqueId));

        this.search(query);
    };

    // Bind events to generated picklist items.
    function bindPicklistElementEvents(items) {
        var $this = this;
        var $picklistItem = $("#" + elementIds.picklist + this.uniqueId).find("a");

        // Store data.
        for (var x = 0; x < items.length; x++) {
            $($picklistItem[x]).data({
                id: items[x].id
            });
        }

        $picklistItem.click(function () {
            // Unbind all click event on the picklist.
            $("#" + elementIds.picklist + $this.uniqueId + " > li > a").off("click");

            renderLoading.call($this, this, true);
            var moniker = $(this).data("id");

            // Call final.
            $this.final(moniker);
        });
    };

})(jQuery, window);