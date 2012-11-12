$(document).ready(function() {

    var $history= $('#history');
    $('.event').click(function(){ 
        var ev = $(this).attr('data-ev');
        var pev = $(this).attr('data-pev');
        var offset = 0;
        $.ajax({
            url : '/history',
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
