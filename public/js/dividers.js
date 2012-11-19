$(document).ready(function() {

    /**
     * Namespace for dividers-specific functions.
     */
    var dividers = {

        /**
         * Handle success events for arbitrary requests.
         * The `params` object should contain a `url`, `method`, and
         * `target`.  The `target` element is a jQuery element.
         * Example:
         *
         *  dividers.success({
         *      url : '/history',
         *      method : 'POST',
         *      target : $('a.click')
         *  });
         *
         */
        success : function(params) {
            var url = (params.url || "").toLowerCase();
            var method = (params.method || "").toUpperCase();
            // Will use this key to figure what sort of success-related
            // stuff to do.
            var key = method + " " + url;
            console.log('Success for ' + key);
            switch(key)  {
                case 'POST /history':
                    break;
                case 'POST /events':
                    break;
            }
        },

        error : function(params) {
            var url = (params.url || "").toLowerCase();
            var method = (params.method || "").toUpperCase();
            // Will use this key to figure what sort of success-related
            // stuff to do.
            var key = method + " " + url;
            console.log('Error for ' + key);
        }
    };

    /**
     * Provide a sort-of general framework for making AJAX requests with
     * links. Request method (GET, POST, PUT, DELETE) is contained in
     * the "data-method" attribute, request endpoint is contained in the
     * "data-action" attribute. POST data is contained in the
     * "data-postdata" attribute, formatted in a `key1=val1&key2=val2`
     * syntax.
     */
    $('.psuedo-form').click(function() {
        var method = $(this).attr('data-method').toUpperCase();
        var action = $(this).attr('data-action');
        var target = $(this);
        if (method == 'POST') {
            var postDataString = $(this).attr('data-postData');
            var postData = {};
            var params = postDataString.split('&');
            $.each(params, function(index, keyValPair) {
                var key = keyValPair.split('=')[0];
                var val = keyValPair.split('=')[1];
                postData[key] = val;
            });

            $.ajax({
                url : action,
                type : method,
                data : postData,
                success : function(response) {
                    // TODO. Figure out how to embed some sort of callback
                    // functionality. Since clients could mangle this before
                    // clicking the link, we'll have to hash it beforehand.
                    // Right?
                    dividers.success({
                        url : action,
                        method : method,
                        target : target
                    });
                },
                error : function() {
                    dividers.error({
                        url : action,
                        method : method,
                        target : target
                    });
                }
            });
        }
    });

    /**
     * Provide some visual feedback on event link clicks.
     */
    $('.event').click(function() {
        var row = $(this).closest('tr');
        var originalColor = row.css('background-color');
        row.css('background-color', 'yellow');
        row.animate({backgroundColor: originalColor}, 1000);
    });

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
