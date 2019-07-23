jQuery(document).ready(function ($) {

    var planObject = {};
    var pricingTable = $("#pricingTable");
    var selectState = $("#selectState");
    var memberDetails = $("#memberDetails");
    var dependentDetails = $("#divDependentInfo");
    var productDetails = $("#productDetails");
    var cardDetails = $("#cardDetails");
    var successfulDetails = $("#successfulDetails");
    var enrollmentSteps = $("#divPricingSteps");

    pageInit();

    function pageInit() {
        hideAllSteps();
        pricingTable.show();

        var date = new Date();
        var currentMonth = date.getMonth();
        $("#ddlExpiryMonth").val(currentMonth + 1);
    }

    function setDoneSteps(stepNo) {
        hideAllSteps();
        $("#divPricingSteps span").removeClass('active-last');
        var activeStepId = '';
        for (var i = 1; i <= stepNo; i++) {
            $("#btnPricingSteps" + i).addClass('active');
            if (i == stepNo) {
                $("#btnPricingSteps" + i).addClass('active-last');
            }
            activeStepId = $("#btnPricingSteps" + i).attr('data-step-id');
        }
        $("#" + activeStepId).show();
        if (stepNo == 5) {
            $("#divPricingSteps span").removeClass('active');
            $("#divPricingSteps span").addClass('active-comp');
            $("#divPricingSteps").hide();
        }
    }

    function hideAllSteps() {
        pricingTable.hide();
        selectState.hide();
        memberDetails.hide();
        productDetails.hide();
        cardDetails.hide();
        successfulDetails.hide();
        registerMembership.hide();
        verificationCode.hide();
        membershipEmail.hide();
        membershipVerificationCode.hide();
        membershipCreatePassword.hide();
    }

    function hideAllSteps() {
        pricingTable.hide();
        selectState.hide();
        memberDetails.hide();
        dependentDetails.hide();
        productDetails.hide();
        cardDetails.hide();
        successfulDetails.hide();
    }

    $(document).on('click', '.btn-available', function () {//Step 1 Click event check plan availability
        hideAllSteps();
        selectState.show();
    });

    $(document).on('click', '#btnSelectedState', function () {//Step 2 Click event select state
        planObject.state = $("#ddlMemberState").val().trim();
        if (planObject.state != '') {
            //hideAllSteps();
            getAllPlans();
            setDoneSteps(1);
            enrollmentSteps.show();
            //productDetails.show();
        }
        else {
            alert('Select State');
        }
    });

    $(document).on('click', '.purchase-plan', function () {//Step 3 Click event select plan
        planObject.Plan_Type_Code = $(this).attr('data-plan-type');
        planObject.Product_ID = $(this).attr('data-product-id');
        bindPlanDetails();
        //hideAllSteps();
        //memberDetails.show();
        setDoneSteps(2);
    });



    $(document).on('click', '#btnMemberDetails', function () {//Step 4 Click event get member information
        selectState.hide();
        if (ValidatePrimaryDetails() == true) {

            planObject.term = $("input[name=selectedPlanTypeMonths]:checked").val().trim();
            planObject.memberDetails = {
                name: $("#txtFirstName").val().trim(),
                lastName: $("#txtLastName").val().trim(),
                birthDate: $("#txtBirthDate").val().trim(),
                gender: $("#ddlGender").val().trim(),
                addressLine1: $("#txtAddressLine1").val().trim(),
                addressLine2: $("#txtAddressLine2").val().trim(),
                city: $("#txtCity").val().trim(),
                state: $("#ddlState").val().trim(),
                zip: $("#txtZip").val().trim(),
                phone: $("#txtPhone").val().trim(),
                email: $("#txtEmail").val().trim(),
            };
            //hideAllSteps();
            //dependentDetails.show();
            setDoneSteps(3);
        }
    });
    //$(document).on('click', '#btnCardDetails', function () {
    //    hideAllSteps();
    //    cardDetails.show();
    //});

    $(document).on('click', '#btnCardDetails', function () {//Step 5 Click event get member card details
        if (sessionStorage.getItem("ValidCard") != "true") {
            return;
        }
        if (ValidatePaymentDetails() == true) {
            var selectedYear = $("#ddlExpiryYear option:selected").text().substr($("#selEYear option:selected").text().length - 2);
            var selectedMonth = ($("#ddlExpiryMonth option:selected").text());

            planObject.cardDetails = {
                type: $("input[name=radioCC]:checked").val().trim(),
                number: $("#txtCardNumber").val().trim(),
                expiry: selectedMonth + "" + selectedYear,
                cVV: $("#txtCVV").val().trim(),
                isBillingSame: $("#chkIsBillingSame").val().trim(),
                billingAddress: {
                    name: $("#txtFirstName").val().trim(),
                    lastName: $("#txtLastName").val().trim(),
                    addressLine1: $("#txtBillingAddressLine1").val().trim(),
                    addressLine2: $("#txtBillingAddressLine2").val().trim(),
                    city: $("#txtBillingCity").val().trim(),
                    state: $("#ddlBillingState").val().trim(),
                    zip: $("#txtBillingZip").val().trim(),
                }
            };
            //hideAllSteps();
            $('input[value=' + planObject.months + ']').prop("checked", true);
            registerMember();
        }
    });

    $(document).on('click', '#divPricingSteps span', function () {
        if ($(this).hasClass('active'))
            setDoneSteps($(this).attr('data-step-no'));
    });

    $(document).on('click', '#btnSuccessful', function () {//Step 6 Click event member registered
        alert('Flow Completed');
    });

    function registerMember() {
        ShowLoader();
        var startDate = new Date();
        var enrollmentDate = new Date(); //startDate.getFullYear() + "" + ("0" + (startDate.getMonth() + 1)).slice(-2) + "" + ("0" + startDate.getDate()).slice(-2);
        var birthDate = new Date(planObject.memberDetails.birthDate);
        var phoneNumber = planObject.memberDetails.phone.replace(/[{()}]/g, '').replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '$1-$2-$3');
        var memberBirthDate = birthDate; //birthDate.getFullYear() + "" + ("0" + (birthDate.getMonth() + 1)).slice(-2) + "" + ("0" + birthDate.getDate()).slice(-2);
        var language = "English";
        var payType = "CC";
        var billMethod = 'CRP';
        if (planObject.cardDetails.type.toLowerCase() === 'cc') {
            payType = "CC";
            billMethod = 'MEM';
        }
        var posNumber = getPOSNumber();

        var dependentCount = $("#divDependentList tr").length;
        var dependents = [];
        var dependentsList = {};
        for (var i = 0; i < dependentCount; i++) {
            dependentsList = {
                'firstname': $("#tblDependentInfo > tbody > tr")[i].attributes['Fname'].value,
                'lastname': $("#tblDependentInfo > tbody > tr")[i].attributes['Lname'].value,
                'relation': $("#tblDependentInfo > tbody > tr")[i].attributes['Reltn'].value,
                'gender': $("#tblDependentInfo > tbody > tr")[i].attributes['Gender'].value,
                'birthdate': $("#tblDependentInfo > tbody > tr")[i].attributes['Dob'].value
            }
            dependents.push(dependentsList);
        }
        var memberDetails = {
            "FIRST_NAME": planObject.memberDetails.name,
            "LAST_NAME": planObject.memberDetails.lastName,
            "APP_DATE": enrollmentDate,
            "MembershipDate": enrollmentDate,
            "PLAN_TYPE": planObject.selectedPlan.Product_ID,
            "TERM_MTHS": planObject.selectedPlan.Term_Code,
            "ISFamily": planObject.selectedPlan.Coverage_Code,
            "ADDRESS1": planObject.memberDetails.addressLine1,
            "ADDRESS2": planObject.memberDetails.addressLine2,
            "CITY": planObject.memberDetails.city,
            "STATE": planObject.memberDetails.state,
            "POSTAL_CODE": planObject.memberDetails.zip,
            "EMAIL": planObject.memberDetails.email,
            "PHONE": phoneNumber,
            "BIRTHDATE": memberBirthDate,
            "GENDER": planObject.memberDetails.gender,
            "LANG": language,
            "bill_method": billMethod,
            "GPSAccountNumber": posNumber,
            "IsPaid": "Y",
            "SendWelcomeMail": "Y",
            "agent": sessionStorage.getItem('AgentNumber'),
            "businessunitnumber": sessionStorage.getItem('BUNumber'),
            "PaymentMethod": payType,
            "CC_NUMBER": planObject.cardDetails.number,
            "CC_EXP_DATE": planObject.cardDetails.expiry,
            "custom1": "confirm",
            "BILLINGADDRESS1": planObject.cardDetails.billingAddress.addressLine1,
            "BILLINGADDRESS2": planObject.cardDetails.billingAddress.addressLine2,
            "BILLINGCITY": planObject.cardDetails.billingAddress.city,
            "BILLINGPOSTAL_CODE": planObject.cardDetails.billingAddress.state,
            "BILLINGSTATE": planObject.cardDetails.billingAddress.zip,
            "AMOUNT": planObject.selectedPlan.Retail_Sale_Price.toString(),
            "Dependents": dependents,
            "DependentsCount": dependentCount
        }

        //var memberDetails = {
        //    "firstname": planObject.memberDetails.name,
        //    "lastname": planObject.memberDetails.lastName,
        //    "bunumber": businessUnitNumber,
        //    "agent": agentNumber,
        //    "startdate": enrollmentDate,
        //    "plantype": planObject.selectedPlan.Product_ID,
        //    "term": planObject.selectedPlan.Term_Code,
        //    "coverage": planObject.selectedPlan.Coverage_Code,
        //    "addressline1": planObject.memberDetails.addressLine1,
        //    "addressline2": planObject.memberDetails.addressLine2,
        //    "addressline3": "",
        //    "city": planObject.memberDetails.city,
        //    "state": planObject.memberDetails.state,
        //    "zip": planObject.memberDetails.zip,
        //    "email": planObject.memberDetails.email,
        //    "BillingFirstName": planObject.cardDetails.billingAddress.name,
        //    "BillingLastName": planObject.cardDetails.billingAddress.lastName,
        //    "BillingAddressLine1": planObject.cardDetails.billingAddress.addressLine1,
        //    "BillingAddressLine2": planObject.cardDetails.billingAddress.addressLine2,
        //    "BillingAddressLine3": "",
        //    "BillingCity": planObject.cardDetails.billingAddress.city,
        //    "BillingState": planObject.cardDetails.billingAddress.state,
        //    "BillingZip": planObject.cardDetails.billingAddress.zip,
        //    "phone": phoneNumber,
        //    "birthdate": memberBirthDate,
        //    "gender": planObject.memberDetails.gender,
        //    "language": language,
        //    "dependentscount": 0,
        //    "dependents": [],
        //    "pay_method": payType,
        //    "ccno": planObject.cardDetails.number,
        //    "ccexp": planObject.cardDetails.expiry,
        //    "cvv": planObject.cardDetails.cVV,
        //    "amount": planObject.selectedPlan.Retail_Sale_Price.toString(),
        //    "retailamount": planObject.selectedPlan.Retail_Sale_Price.toString(),
        //    "bill_method": billMethod,
        //    "posnumber": posNumber,
        //    "ispaid": "Y",
        //    "sendwelcomemail": "Y",
        //    "custom1": "confirm",
        //    "memberno": "",
        //    "onlineEnrollmentId": "",
        //    "ProcessDuplicate": false
        //};

        sessionStorage.setItem('KeyName', 'ApiKey')
        sessionStorage.setItem('KeyValue', '51F51FDD-87EF-4A58-8980-E2D13D12208D')
        postRequest("Services/1001/OnlineEnrollment/CreateEnrollment", memberDetails, onEnrollment, true, null, "CVV:" + planObject.cardDetails.cVV);
    }

    function onEnrollment(data) {
        try {
            if (data.Customer_Number != "") {
                //hideAllSteps();
                //successfulDetails.show();
                setDoneSteps(5);
                console.log(data);
                $("#bMemberNumber").html(data.Customer_Number);
            }
            else {
                alert("Error occured in enrollment process. Please try again.");
            }
        } catch (e) {
            alert("Error occured in enrollment process. Please try again.");
        }
        HideLoader();
    }

    function bindPlanDetails() {

        var selectedPlan = sequentialArray.find(function (f) { return f.Product_ID == planObject.Product_ID });
        planObject.selectedPlan = selectedPlan;

        $(".selected-plan").html(selectedPlan.Plan_Code_Desc);
        $(".selected-price").html(selectedPlan.amountHtml);
        $(".plan-term-list").html('');

        //$("#hSelectedPlanName").html(selectedPlan.Plan_Code_Desc);
        //$("#hCardPlanName").html(selectedPlan.Plan_Code_Desc);
        //$("#hSuccessPlanName").html(selectedPlan.Plan_Code_Desc);
        //$("#divSelectedPrice").html(selectedPlan.amountHtml);
        //$("#divCardPrice").html(selectedPlan.amountHtml);
        //$("#divSuccessPrice").html(selectedPlan.amountHtml);
        $("#divSelectedPlanTerms").html('');
        $("#divCardPlanTerms").html('');
        $("#divSelectedPlanTerms5a").html('');
        termHtml = "";
        for (var i = 0; i < groupedData[selectedPlan.Plan_Type_Code].length; i++) {
            var plan = groupedData[selectedPlan.Plan_Type_Code][i];
            var term = parseInt(plan.Term_Code);
            termHtml += '<div class="price"><input name="selectedPlanTypeMonths" type="radio" '
                + ' data-product-id="' + plan.Product_ID + '" data-plan-type="' + plan.Plan_Type_Code + '" ' +
                ' "value="' + term + '"'
                + (term === parseInt(selectedPlan.Term_Code) ? " checked " : "") + '>' + plan.amountHtml + '</div>'

        }
        //$(".plan-term-list").append(termHtml);
        $("#divSelectedPlanTerms").append(termHtml);
        $("#divCardPlanTerms").append(termHtml.replace(/selectedPlanTypeMonths/gi, "checkedPlanTypeMonths"));
        $("#divSelectedPlanTerms5a").append(termHtml.replace(/selectedPlanTypeMonths/gi, "checkedPlanTypeMonths5a"));

        $("#ddlState").val(planObject.state);
        $("#ddlBillingState").val(planObject.state);
    }

    $(document).on('change', 'input[name=selectedPlanTypeMonths]', function () {
        planObject.Plan_Type_Code = $(this).attr('data-plan-type');
        planObject.Product_ID = $(this).attr('data-product-id');
        bindPlanDetails();
    });
    $(document).on('change', 'input[name=checkedPlanTypeMonths]', function () {
        planObject.Plan_Type_Code = $(this).attr('data-plan-type');
        planObject.Product_ID = $(this).attr('data-product-id');
        bindPlanDetails();
    });
    $(document).on('change', 'input[name=checkedPlanTypeMonths5a]', function () {
        planObject.Plan_Type_Code = $(this).attr('data-plan-type');
        planObject.Product_ID = $(this).attr('data-product-id');
        bindPlanDetails();
    });
    $(document).on('change', '#ddlState', function () {
        planObject.state = $(this).val().trim();
    });


    $(document).on('click', '#chkIsBillingSame', function () {
        if ($(this).prop("checked") == true) {
            $("#divBilling").show();
        }
        else {
            $("#divBilling").hide();
        }
    });

    function ShowLoader() {
        $('#divLoading').modal('show');
    }

    function HideLoader() {
        $('#divLoading').modal('hide');
    }

    function ValidatePrimaryDetails() {
        var errMsg = '';
        $('#memberDetails .required').each(function () {
            if ($(this).val() == '') {
                errMsg += '<li>' + $(this).attr('placeholder') + ' is required. </li>';
            }
        });
        $('#memberDetails .required-ddl').each(function () {
            if ($(this).val() == '0') {
                errMsg += '<li>' + $(this).attr('placeholder') + ' is required. </li>';
            }
        });
        if (validateEmail($("#txtEmail").val()) == false) {
            errMsg += '<li>Valid email is required. </li>';
        }
        if (errMsg != '') {
            $('#divPrimaryErrors').html(errMsg);
            $('#divPrimaryErrors').show();
            return false;
        }
        $('#divPrimaryErrors').hide();
        return true;
    }

    function ValidatePaymentDetails() {
        var errMsg = '';
        $('.required-cc').each(function () {
            if ($(this).val() == '') {
                errMsg += '<li>' + $(this).attr('placeholder') + ' is required. </li>';
            }
        });
        $('.required-cc-ddl').each(function () {
            if ($(this).val() == '0') {
                errMsg += '<li>' + $(this).attr('placeholder') + ' is required. </li>';
            }
        });
        if (errMsg != '') {
            $('#divPaymentErrors').html(errMsg);
            $('#divPaymentErrors').show();
            return false;
        }
        $('#divPaymentErrors').hide();
        return true;
    }


    ///**Dependent Scripts**///
    $(document).on('click', '#btnAddDependent', function () {
        AddDependent();
    });
    function AddDependent() {
        if (ValidateDependent() == true) {

            var isValid = true;

            var DFName = $('#txtDepFirstName').val();
            var DLName = $('#txtDepLastName').val();
            var DDOB = $('#txtDepBirthDate').val();
            var DRelation = $('#ddlDepRelation').val();
            var DGender = $('#ddlDepGender').val();
            var DGenderText = '';
            var DRelationText = $("#ddlDepRelation option:selected").text();
            if (DGender != "") {
                DGenderText = $("#ddlDepGender option:selected").text();
            }
            else {
                DGenderText = "Not Selected";
            }

            var errMsg = "";
            if (isValidDate(DDOB)) {
                if (CalculateAge(DDOB) < 150) {
                    if ($('#ddlDepRelation').val() == "CN") {
                        if (CalculateAge(DDOB) > 22) {
                            errMsg += "<li>Age is invalid for selected Relationship.</li>";
                            isValid = false;
                        }
                    }
                    else {
                        if (CalculateAge(DDOB) < 19) {
                            errMsg += "<li>Age is invalid for selected Relationship.</li>";
                            isValid = false;
                        }
                    }
                }
                else {
                    errMsg += "<li>Age is invalid for selected Relationship.</li>";
                    isValid = false;
                }
            }
            else {
                errMsg += "<li>Date must be in mm/dd/yyyy format.</li>";
                isValid = false;
            }
            if (isValid) {
                var dependentCount = $("#divDependentList tr").length;
                if (dependentCount < 5) {
                    var depDOB = DDOB.replace(/-/g, "");
                    $('#divDependentList').append('<tr Fname="' + DFName + '" Lname="' + DLName + '" Reltn="' + DRelation + '" Gender="' + DGender + '" Dob="' + depDOB + '"><td>'
                                                        + DFName + '</td> <td>' + DLName + '</td> <td>'
                                                        + DRelationText + '</td><td>' + DGenderText + '</td><td>'
                                                        + DDOB + '</td><td><a class="lnkRemove">Remove</a></td></tr>');
                }
                if (dependentCount >= 0) {
                    $('#btnSkipFamilyMembers').prop('disabled', true);
                    $('#btnSkipFamilyMembers').addClass('btnCustomDisabled');
                }

                $('#txtDepFirstName').val('');
                $('#txtDepLastName').val('');
                $('#ddlDepRelation').get(0).selectedIndex = 0;
                $('#ddlDepGender').get(0).selectedIndex = 0;
                $('#txtDepBirthDate').val('');
                return true;
            }
            else {
                $('#divDependentErrors').html(errMsg);
                $('#divDependentErrors').show();
                return false;
            }
        }
    }

    function isDate(txtDate) {
        var currVal = txtDate;
        if (currVal == '')
            return false;
        //Declare Regex

        var rxDatePattern = /^(\d{1,2})(\/|)(\d{1,2})(\/|-)(\d{4})$/;
        var dtArray = currVal.match(rxDatePattern); // is format OK?

        if (dtArray == null) {
            rxDatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|)(\d{1,2})$/;
            dtArray = currVal.match(rxDatePattern); // is format OK?
        }
        if (dtArray == null)
            return false;

        //Checks for mm/dd/yyyy format.
        dtMonth = dtArray[1];
        dtDay = dtArray[3];
        dtYear = dtArray[5];

        if (dtMonth < 1 || dtMonth > 12)
            return false;
        else if (dtDay < 1 || dtDay > 31)
            return false;
        else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
            return false;
        else if (dtMonth == 2) {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay > 29 || (dtDay == 29 && !isleap))
                return false;
        }
        return true;
    }

    function isValidDate(dateString) {
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateString.match(regEx)) return false;  // Invalid format
        var d = new Date(dateString);
        var dNum = d.getTime();
        if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
        return d.toISOString().slice(0, 10) === dateString;
    }

    function CalculateAge(DOB) {
        var today = new Date();
        var birthDate = new Date(DOB);

        var age = today.getFullYear() - birthDate.getFullYear();

        var m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    $(document).on('click', '.lnkRemove', function () {
        $(this).closest('tr').remove();
        var dependentCount = $("#divDependentList tr").length;
        if (dependentCount == 0) {
            $('#btnSkipFamilyMembers').prop('disabled', false);
            $('#btnSkipFamilyMembers').removeClass('btnCustomDisabled');
        }
    });

    $(document).on('click', '#btnDependentInfo', function () {
        isValidCustomData = true;
        if ($('#txtDepFirstName').val().trim() == '' && $('#txtDepLastName').val().trim() == '' && $('#txtDepBirthDate').val().trim() == '' && $('#ddlDepGender').val() == '0' && $('#ddlDepRelation').val() == '0') {
            //hideAllSteps();
            //cardDetails.show();
            setDoneSteps(4);
        }
        else {
            if (AddDependent() == true) {
                setDoneSteps(4);
                //hideAllSteps();
                //cardDetails.show();
            }
        }
    });

    $(document).on('click', '.customCalenderIcon', function () {
        var controlId = $(this).parent().find('.txtDateTimePicker').attr('id');
        $('#' + controlId).focus();
    });

    $(document).on('click', '#btnSkipFamilyMembers', function () {
        //hideAllSteps();
        //cardDetails.show();
        setDoneSteps(4);
    });

    function ValidateDependent() {
        var errMsg = '';
        $('#divDependentInfo .required').each(function () {
            if ($(this).val() == '') {
                errMsg += '<li>' + $(this).attr('placeholder') + ' is required. </li>';
            }
        });
        $('#divDependentInfo .required-ddl').each(function () {
            if ($(this).val() == '0') {
                errMsg += '<li>' + $(this).attr('placeholder') + ' is required. </li>';
            }
        });
        if (errMsg != '') {
            $('#divDependentErrors').html(errMsg);
            $('#divDependentErrors').show();
            return false;
        }
        $('#divDependentErrors').hide();
        return true;
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});