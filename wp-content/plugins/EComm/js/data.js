var planData = [];
var sequentialArray = [];
var groupedData =[];
var businessUnitNumber="000001";
var agentNumber="0000000001";

    dataInit();

    function dataInit() {
        sessionStorage.setItem('AgentNumber', '0000000001');
        sessionStorage.setItem('BUNumber', '000001');

        sessionStorage.setItem('ApiKey', '51F51FDD-87EF-4A58-8980-E2D13D12208D')
        //getAllPlans();
        getAllStates();
    }

    function getAllPlans() {
        sessionStorage.setItem('KeyName', 'ApiKey')
        sessionStorage.setItem('KeyValue', '51F51FDD-87EF-4A58-8980-E2D13D12208D')
        
        getRequest("Services/1001/Product/GetProductsByState?stateCode=" + jQuery("#ddlMemberState").val().trim(), bindPlans, true);
    }

    function bindPlans(data) {
        if (data.length != 0) {
            planData = data;
            var key = "Plan_Type_Code";
            var keys = [];
            var row = [];
            groupedData =[];
            groupedData = planData.reduce(function (rv, x) {
                var row = (rv[x[key]] = rv[x[key]] || []);
                if (row.length == 0)
                    keys.push(x[key]);
                row.push(x);
                return rv;
            }, {});
            console.log(groupedData);
            if (keys.length > 0) {
                sequentialArray = [];
                for (var i = 0; i < keys.length; i++) {
                    sequentialArray.push(groupedData[keys[i]][0]);
                }
                if (sequentialArray.length < 3) {
                    for (var i = 0; i < keys.length; i++) {
                        for (var j = 1; j < groupedData[keys[i]].length; j++)
                            sequentialArray.push(groupedData[keys[i]][j]);
                    }
                }
               
                for(var i=0;i<sequentialArray.length;i++){
                    
                    var priceArray = sequentialArray[i].Retail_Sale_Price.toString().split(".");
                    var term = parseInt(sequentialArray[i].Term_Code);
                    var priceHtml = "$ " + priceArray[0] + ".<sup>" + (priceArray.length > 1 ? priceArray[1] : "00") + "</sup><b>/" + (term > 1 ? term + " months" : " month") + "</b>";
                    sequentialArray[i].amountHtml = priceHtml;
                }

                var ids = ["One", "Two", "Three"];
                for (var i = 0; i < sequentialArray.length; i++) {
                    if (i === 3)
                        return;
                    bindPlanHtml(sequentialArray[i], ids[i]);
                    
                }
               
            }
        }
    }

    function bindPlanHtml(plan, id) {
        jQuery("#hPlan" + id + "Name").html(plan.Plan_Code_Desc);
        jQuery("#pPlan" + id + "Desc").attr("data-plan-code", plan.Plan_Code);
        jQuery("#btnPlan" + id + "CheckAvailability").attr("data-product-id", plan.Product_ID);
        
      
        jQuery("#hAvailablePlan" + id + "Name").html(plan.Plan_Code_Desc);
        jQuery("#divAvailable" + id + "Price").html(plan.amountHtml);//$ 19.<sup>99</sup><b>/month</b>        
        jQuery("#pAvailablePlan" + id + "Desc").attr("data-plan-code", plan.Plan_Code);
        jQuery("#btnAvailablePlan" + id + "PurchaseNow").attr("data-product-id", plan.Product_ID);
        jQuery("#btnAvailablePlan" + id + "PurchaseNow").attr("data-plan-type", plan.Plan_Type_Code);

        sessionStorage.setItem('KeyName', 'branchToken')
        sessionStorage.setItem('KeyValue', '55D1BE49-6B73-443E-8BED-4BDEE6928B43')
        getRequest("Membership/PlanContentInfo/" + plan.Plan_Code + "", bindPlanDescHtml, true, null, 'http://10.10.50.176/PartnerPortalApi/api/');
        
    }

    function bindPlanDescHtml(details) {
        jQuery("p[data-plan-code='"+details.PlanCode+"']").html('<span class="more">' + details.AboutPlan + '</span>');
        for(var i=0;i<sequentialArray.length;i++){
            if(sequentialArray[i].plancode===details.PlanCode){
                sequentialArray[i].aboutPlan=details.AboutPlan;
                break;
            }
        }
        setMoreLess();
    }


    function getAllStates() {
        sessionStorage.setItem('KeyName', 'ApiKey')
        sessionStorage.setItem('KeyValue', '51F51FDD-87EF-4A58-8980-E2D13D12208D')

        getRequest("Services/1001/State/GetSubsidiaryStates", bindStates, true);
    }

    function bindStates(data) {
        if (data.length != 0) {
            var strState = '';
            strState += '<option value="" selected> Not Selected </option>';
            for (var i = 0; i < data.length; i++) {
                strState += '<option value="' + data[i].State_Code + '">' + data[i].State_Name + '</option>';
            }
            jQuery('#ddlState').html(strState);
            jQuery('#ddlMemberState').html(strState.replace('selected>', '>'));
            jQuery('#ddlBillingState').html(strState.replace('selected>', '>'));

        }
    }

    function setMoreLess() {
        // Configure/customize these variables.
        var showChar = 350;  // How many characters are shown by default
        var ellipsestext = "...";
        var moretext = "More >";
        var lesstext = "Less <";


        jQuery('.more').each(function () {
            var content = jQuery(this).html();

            if (content.indexOf('moreellipses') < 0) {
                if (content.length > showChar) {

                    var c = content.substr(0, showChar);
                    var h = content.substr(showChar, content.length - showChar);

                    var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span class="more-content">' + h + '</span><a class="morelink" href="javascript:void(0)">' + moretext + '</a></span>';

                    jQuery(this).html(html);
                }
            }
        });

    }
    jQuery(document).ready(function ($) {
        $(document).on('click', '.morelink', function () {
            if ($(this).hasClass("less")) {
                $(this).removeClass("less");
                $(this).html("More >");
            } else {
                $(this).addClass("less");
                $(this).html("< Less");
            }
            $(this).parent().prev().toggle();
            $(this).prev().toggle();
            return false;
        });
    });