jQuery(document).ready(function ($) {

    // $ Works! You can test it with next line if you like
    console.log('scc');


    $(document).on('click', '#btnServiceCall', function () {
        var btn = this;
        LoginBranch();
        //$.get("https://reqres.in/api/users", function (response) {
        //    $content=$(btn).siblings('.serviceData');
        //    $content.html('All service data');
        //    for (var i = 0; i < response.data.length; i++) {
        //        var row=response.data[i];
        //        $content.append('<br/>id: '+row.id+' email: '+row.email+' first_name: '+row.first_name+' last_name: '+row.last_name);
        //     }
        //});
    });



    function LoginBranch() {
        var userName = $("#txtUserName").val();
        var pwd = $("#txtPassword").val();
        var dataParam = { "AppUrl": "http://betaplus.homeandauto.com" };
        var vdata = JSON.stringify(dataParam);
        $.ajax({
            type: "POST",
            url: "http://10.10.50.176/ServiceLayer/ServiceLayer/Auth/GetAuthUserIdentifier",
            contentType: "application/json; charset=utf-8",
            data: vdata,
            cache: false,
            dataType: "json",
            async: true,

            beforeSend: function setHeader(xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + btoa(userName + ':' + pwd));
            },
            success: function (data, textStatus, request) {
                onSuccessToken(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                onErrorToken(XMLHttpRequest, textStatus, errorThrown);
            }
        });
    }


    function onSuccessToken(tokenData) {
        try {
            if (tokenData.length != 0) {
                alert(tokenData.UserTokenID);
            }
            else {
                $('.lblErrMsg').html('Something went wrong');
            }
        } catch (e) {
        }
    }

    function onErrorToken(XMLHttpRequest, textStatus, errorThrown, inputData) {
        try {
            $('.lblErrMsg').html('Invalid login attempt.');
        } catch (e) {
        }
    }


});