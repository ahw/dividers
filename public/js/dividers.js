$(document).ready(function() {

    var $history= $('#history');
    $('.event').click(function(){ 
        var name = $(this).attr('data-name');
        var subname = $(this).attr('data-subname');
        var offset = 0;
        $.ajax({
            url : '/history',
            type : 'POST',
            data : {
                subname : subname ? subname : "",
                name : name ? name : "",
                offset : offset
            },
            success : function(response) {
                console.log(response);
            }
        });
    });

    // $('form[method="post"][action="/events"]').submit(function() {
    //     $.post('/events', $(this).serialize(), function(data) {
    //         console.log(data);
    //     });
    //     return false;
    // });

    $('.event-delete').click(function() {
        var deleteLink = $(this);
        $.ajax({
            url : '/events',
            type : 'DELETE',
            data : {
                name : $(this).attr('data-name'),
                subname : deleteLink.attr('data-subname'),
                fullName : deleteLink.attr('data-fullName')
            },
            success : function(response) {
                deleteLink.prev().remove();
                deleteLink.remove();
            }
        });
        return false;
    });

});
