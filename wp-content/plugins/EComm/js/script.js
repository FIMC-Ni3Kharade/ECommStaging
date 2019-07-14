jQuery(document).ready(function ($) {
    var planObject = {};
    var pricingTable = $("#pricingTable");
    var selectState = $("#selectState");
    var memberDetails = $("#memberDetails");
    var productList = $("#productDetails");
    var cardDetails = $("#cardDetails");
    var successfulDetails = $("#successfulDetails");
    pageInit();

    function pageInit() {
        pricingTable.show();
        selectState.hide();
        memberDetails.hide();
        productList.hide();
        cardDetails.hide();
        successfulDetails.hide();
    }

    $(document).on('click', '.btn-available', function () {
        pricingTable.hide();
        selectState.show();
    });

    $(document).on('click', '.purchase-plan', function () {
        planObject.planType = $(this).attr('plan-type');
        productList.hide();
        memberDetails.show();
    });

    $(document).on('change', '#ddlState', function () {
        planObject.state = $(this).val();
    });

    $(document).on('click', '#btnSelectedState', function () {
        planObject.state = $("#ddlState").val();
        if (planObject.state != '') {
            selectState.hide();
            $("#txtState").val($('select[id=ddlState] option:selected').text());
        }
        productList.show();
    });

    $(document).on('click', '#btnMemberDetails', function () {
        planObject.months = $("input[name=radioMonths]:checked").val();
        planObject.memberDetails = {
            name: $("#txtName").val(),
            lastName: $("#txtLastName").val(),
            birthDate: $("#txtBirthDate").val(),
            gender: $("#txtGender").val(),
            addressLine1: $("#txtAddressLine1").val(),
            addressLine2: $("#txtAddressLine2").val(),
            city: $("#txtCity").val(),
            state: $("#txtState").val(),
            zip: $("#txtZip").val(),
            mobile: $("#txtMobile").val(),
            phone: $("#txtPhone").val(),
            email: $("#txtEmail").val(),
        };
        memberDetails.hide();
        $('input[value=' + planObject.months + ']').prop("checked", true);

        cardDetails.show();
        selectState.hide();
    });

    $(document).on('click', '#btnCardDetails', function () {
        planObject.cardDetails = {
            type: $("input[name=radioSelectedMonths]:checked").val(),
            number: $("#txtNumber").val(),
            expiry: $("#txtExpiration").val(),
            isBillingSame: $("#chkIsBillingSame").val(),
        };
        cardDetails.hide();
        $('input[value=' + planObject.months + ']').prop("checked", true);
        successfulDetails.show();
        selectState.hide();
    });
    $(document).on('click', '#chkIsBillingSame', function () {
        if ($(this).prop("checked") == true) {
            $("#divBilling").show();
        }
        else {
            $("#divBilling").hide();
        }
    });
    
    $(document).on('click', '#btnSuccessful', function () {
        alert('Flow Completed');
    });
});