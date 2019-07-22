/************************************************************************************************
* Name          : sample.js
* Description   : Javascript for Sample.html page. It does the initialization of the address
*                 search plugin mainly "singleline", "verification", and "intuitive". It also 
*                 does the population of the address back to the page form and the page's CSS.
************************************************************************************************/
jQuery(document).ready(function ($) {

    // Configurable address validation options to display supported countries and setting the default selected country.
    var addressOptions = {
        singleline: {
            supportedCountries: ["GBR"],
            defaultCountry: "GBR"
        },
        verification: {
            supportedCountries: ["USA", "CAN"],
            defaultCountry: "CAN"
        },
        intuitive: {
            supportedCountries: ["USA"],
            defaultCountry: "USA"
        }
    },
    elements = {
        phoneBox: "#phoneBox",
        emailBox: ".emailBox",
        topSearchContainer: "#topSearchContainer",
        bottomSearchContainer: "#bottomSearchContainer",
        inputAddress: ".inputAddress",
        inputCountry: ".inputCountry",
        success: ".success",
        buttonDiv: "#buttonDiv",
        submitButton: "#btnCheckAdress",
        resetButton: "#reset",
        addressStatus: "#addressStatus"
    },
    countryMapping = {
        "United Kingdom": "GBR",
        "United States of America": "USA",
        "Canada": "CAN"
    };

    // Load the plugins.
    function load() {
        var inlineMode = $.prototype.verificationSearch == undefined ? true : false,
            $phonePlugin = null,
            $emailPlugin = null,
            $addressPlugin = null;

        // Phone plugin.
        if ($.prototype.phoneValidate) {
            $phonePlugin = new phoneValidation(
                $(elements.phoneBox), {
                    inlineMode: inlineMode
                });
        }


        if ($.prototype.singlelineSearch) {
            // singleline.
            $addressPlugin = initializeSingleLineAddressSearch();
        } else if ($.prototype.verificationSearch) {
            // verification.
            $addressPlugin = initializeVerificationAddressSearch();

            // bind submit button.
            $(elements.submitButton).click(function () {
                // Phone plugin.

                if ($phonePlugin !== null && !isNullOrWhiteSpace($(elements.phoneBox).val())) {
                    $phonePlugin.validate();
                }

                // Email plugin.
                if ($emailPlugin !== null && !isNullOrWhiteSpace($(elements.emailBox).val())) {
                    $emailPlugin.validate();
                }

                // Address plugin.

                $(elements.inputAddress).each(function (index, value) {
                    if (value && $(value).val()) {
                       
                        $('#modalAddressValidation').modal('show');
                        $addressPlugin.verify();
                       
                    }
                });


            });



        } else if ($.prototype.intuitiveSearch) {
            // intuitive,
            $addressPlugin = initializeIntuitiveAddressSearch();
        }

        // Bind button events.
        bindButtonEvents($phonePlugin, $emailPlugin, $addressPlugin);

    };

    function isNullOrWhiteSpace(str) {
        return str == null || str.replace(/\s/g, '').length < 1;
    };

    // Initialize singleline address search.
    function initializeSingleLineAddressSearch() {
        // Add Supported Countries.
        addCountry(addressOptions.singleline);

        // Hide button.
        $(elements.submitButton).addClass("hidden");

        // Initialize the singleline plugin.
        return $(elements.topSearchContainer).singlelineSearch({
            onSuccess: populateAddress
        });
    };

    // Initialize verification address search.
    function initializeVerificationAddressSearch() {
        // Add Supported Countries.
        addCountry(addressOptions.verification);

        // Initialize the verification plugin.
        return $(elements.bottomSearchContainer).verificationSearch({
            onSuccess: populateAddress
        });
    };

    // Initialize intuitive address search.
    function initializeIntuitiveAddressSearch() {
        // Add Supported Countries.
        addCountry(addressOptions.intuitive);

        // Hide buttons.
        $(elements.submitButton).addClass("hidden");

        // Initialize the intuitive search plugin.
        return $(elements.topSearchContainer).intuitiveSearch({
            onPreSearch: clearAddress,
            onSuccess: populateAddress
        });
    };

    // Bind button events.
    function bindButtonEvents($phonePlugin, $emailPlugin, $addressPlugin) {
        $(elements.resetButton).click(function () {
            if ($phonePlugin) {
                $phonePlugin.reset();
            }

            if ($emailPlugin) {
                $emailPlugin.reset();
            }

            if ($addressPlugin) {
                $addressPlugin.reset();
            }

            clearAll();
        });
    };

    // Add country into combobox.
    function addCountry(countrySettings) {
        var $inputCountry = $(elements.inputCountry);
        var countries = countrySettings.supportedCountries;
        countries.sort();

        $.each(countries, function (index, value) {
            var html = "<option value='" + value + "'>" + value + "</option>";
            $inputCountry.append(html);
        });

        
    };

    // Populate addresses.
    function populateAddress(data) {
        if (data && $.isArray(data.fields)) {
            var country = data.fields.pop();
            var $addresses = $(elements.inputAddress);
            var $country = $(elements.inputCountry);

            $.each(data.fields, function (index, value) {
                var $current = $($addresses[index]);
                var content = $.trim(value.content);

                $current.val(content);
                //$current.addClass("success");
            });

            $country.val(countryMapping[country.content]);
            //$country.addClass("success");

            $(elements.addressStatus).remove();
            //$(elements.buttonDiv).after('<span id="addressStatus" class="successImg">Verified</span>');

            // Store returned address to page.
            var addressContent = constructAddressContent();

            // Bind return address events.
            //bindReturnedAddressEvents(addressContent);

            $('#modalAddressValidation').modal('hide');
            isValidAddress = true;
            ValidatePersonalInfo();
        }
    };

    // construct address array base on element values.
    function constructAddressContent() {
        var $returnedAddress = $(elements.inputAddress + ", " + elements.inputCountry);
        var addressContent = [];

        $returnedAddress.each(function () {
            var value = $.trim($(this).val());
            addressContent.push(value);
        });

        return addressContent;
    };

    // bind input address and input country events.
    function bindReturnedAddressEvents(addressContent) {
        var $inputAddress = $(elements.inputAddress);
        var $inputCountry = $(elements.inputCountry);

        $inputAddress.on("keyup input change", null, addressContent, function (event) {
            handleAddressChange.call($(this), event.data);
        });

        $inputCountry.on("change", null, addressContent, function (event) {
            handleAddressChange.call($(this), event.data);
        });
    };

    function handleAddressChange(content) {
        var $this = $(this);
        var updatedContent = constructAddressContent();
        var isChanged = false;

        if (updatedContent.length === content.length) {
            for (i = 0; i < updatedContent.length; i++) {
                if (updatedContent[i] !== content[i]) {
                    isChanged = true;
                    break;
                }
            }
        } else {
            isChanged = true;
        }

        if (isChanged && $this.hasClass("success")) {
            $(elements.inputAddress).removeClass("success");
            $(elements.inputCountry).removeClass("success");

            $(elements.addressStatus).addClass("hidden");
        } else if (!isChanged && !$this.hasClass("success")) {
            $(elements.inputAddress).addClass("success");
            $(elements.inputCountry).addClass("success");

            $(elements.addressStatus).removeClass("hidden");
        }
    };

    // Clear all the existing address results.
    function clearAll() {

        $(elements.phoneBox).val("");
        $(elements.emailBox).val("");
        clearAddress();

        // Clear all success class.
        if ($(elements.success).hasClass("success")) {
            $(elements.success).removeClass("success");
        }
    };

    // Clear existing address.
    function clearAddress(value) {
        var $inputAddresses = $(elements.inputAddress);
        var $inputCountry = $(elements.inputCountry);

        $.each($inputAddresses, function () {
            $(this).val("");
        });

        if ($._data($inputAddresses.get(0), "events") != undefined) {
            $inputAddresses.off("keyup input change");
            $inputCountry.off("change");
        }

        var defaultCountry = $.data($inputCountry.get(0), "defaultCountry");
        if (defaultCountry) {
            $inputCountry.val(defaultCountry);
        }

        // Remove existing success class from input address.
        if ($inputAddresses.hasClass("success")) {
            $(elements.inputAddress).removeClass("success");
        }

        // Remove existing success class from input country.
        if ($inputCountry.hasClass("success")) {
            $(elements.inputCountry).removeClass("success");
        }

        if ($(elements.addressStatus).length !== 0) {
            // Remove existing address status.
            $(elements.addressStatus).remove();
        }
    };
    function ValidateAdressExperian() {
        $addressPlugin1 = null;
        $addressPlugin1 = initializeVerificationAddressSearch();

        $(elements.inputAddress).each(function (index, value) {
            if (value && $(value).val()) {
                
                $addressPlugin1.verify();
               
            }
        });
    }


    load();
    setTimeout(function () {
        ValidateAdressExperian();
    }, 1500);

});

function ShowAdress() {
    // Address plugin.
    $addressPlugin1 = null;
    $addressPlugin1 = initializeVerificationAddressSearch();

    $(elements.inputAddress).each(function (index, value) {
        if (value && $(value).val()) {
            
            $('#modalAddressValidation').modal('show');
           
            $addressPlugin1.verify();
            //}

            //return false;
        }
    });
}