jQuery(document).ready(function ($) {

    // $ Works! You can test it with next line if you like
    console.log('scc');


    $(document).on('click', '#btnServiceCall', function () {
        var btn=this;
        $.get("https://reqres.in/api/users", function (response) {
            $content=$(btn).siblings('.serviceData');
            $content.html('All service data');
            for (var i = 0; i < response.data.length; i++) {
                var row=response.data[i];
                $content.append('<br/>id: '+row.id+' email: '+row.email+' first_name: '+row.first_name+' last_name: '+row.last_name);
             }
        });
    });

});