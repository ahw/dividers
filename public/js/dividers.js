$(document).ready(function() {

    /**
     * Namespace for dividers-specific functions.
     */
    var dividers = {

        /**
         * Handle success events for arbitrary requests.
         * The `params` object should contain a `url`, `method`, and
         * `target`.  The `target` element is a jQuery selector.
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
            var target = params.target;
            var key = method + " " + url;
            switch(key)  {
                case 'POST /history':
                    var row = target.closest('tr');
                    var originalColor = row.css('background-color');
                    row.css('background-color', 'yellow');
                    row.animate({backgroundColor: originalColor}, 1000);
                    break;
                case 'POST /events':
                    break;
            }
        },

        /**
         * Handle error events for arbitrary requests.
         * The `params` object should contain a `url`, `method`, and
         * `target`.  The `target` element is a jQuery selector.
         * Example:
         *
         *  dividers.success({
         *      url : '/history',
         *      method : 'POST',
         *      target : $('a.click')
         *  });
         *
         */
        error : function(params) {
            var url = (params.url || "").toLowerCase();
            var method = (params.method || "").toUpperCase();
            var key = method + " " + url;
            switch(key) {
                case 'POST /history':
                    var row = target.closest('tr');
                    var originalColor = row.css('background-color');
                    row.css('background-color', 'red');
                    row.animate({backgroundColor: originalColor}, 1000);
                    break;
                case 'POST /events':
                    break;
            }
        }
    };

    /**
     * Provide a sort-of general framework for making AJAX requests with
     * links. Request method (GET, POST, PUT, DELETE) is contained in
     * the "data-method" attribute, request endpoint is contained in the
     * "data-action" attribute. POST data is contained in the
     * "data-postdata" attribute, formatted in a `key1=val1&key2=val2`
     * syntax. This should remain view-agnostic.
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
