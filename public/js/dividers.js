$(document).ready(function() {

    $('.event').click(function(){ 
        var ev = $(this).attr('data-ev');
        var pev = $(this).attr('data-pev');
        var offset = 0;
        console.log(sprintf('CLICK: Logging "%s:%s with offset %s', pev, ev, offset));
        $.ajax({
            url : '/events',
            type : 'post',
            data : {
                ev : ev ? ev : "",
                pev : pev ? pev : "",
                offset : offset
            },
            success : function(response) {
                console.log(response);
            }
        });
    });

});
