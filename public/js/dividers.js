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

            if (/POST \/history/.test(key)) {
                var row = target.closest('tr');
                var originalColor = row.css('background-color');
                row.css('background-color', 'yellow');
                row.animate({backgroundColor: originalColor}, 1000);
            } else if (/POST \/events/.test(key)) {
                // TODO
            } else if (/DELETE \/history\//.test(key)) {
                var row = target.closest('tr');
                row.remove();
            }
        },

        /**
         * Handle error events for arbitrary requests.
         * The `params` object should contain a `url`, `method`, and
         * `target`.  The `target` element is a jQuery selector.
         * Example:
         *
         *  dividers.error({
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
            // TODO: Figure out a better way of handling errors. If the
            // client hacks the anchor element such that
            // `data-action="/bogus"`, for example, this handler will never
            // do anything useful, since it depends on `url` and `method`
            // being things it knows about.
            if (/POST \/history/.test(key)) {
                var row = target.closest('tr');
                var originalColor = row.css('background-color');
                row.css('background-color', 'red');
                row.animate({backgroundColor: originalColor}, 1000);
            } else if (/POST \/events/.test(key)) {
                // TODO
            } else if (/DELETE \/history\//.test(key)) {
                var row = target.closest('tr');
                row.css('background-color', 'red');
                row.animate({backgroundColor: originalColor}, 1000);
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
    $('.pseudo-submit').click(function() {
        var method = $(this).attr('data-method').toUpperCase();
        var action = $(this).attr('data-action');
        var target = $(this);
        var formId = $(this).attr('data-formid');
        var postData = {};
        if (method == 'POST') {
            var postDataString = ""; //$(this).attr('data-postData');

            // Iterate over each `.pseudo-form` element whose `data-formid`
            // matches the `data-formid` of the target element. Pull out
            // their POST data accordingly.
            $('.pseudo-form[data-formid="' + formId + '"]').each(function() {
                if ($(this).is('input') || $(this).is('select')) {
                    console.log($(this));
                    // Use the name and value.
                    postDataString += $(this).attr('name') + '=' + $(this).val();
                    postDataString += '&';
                } else {
                }
            });

            var params = postDataString.split('&');
            $.each(params, function(index, keyValPair) {
                var key = keyValPair.split('=')[0];
                var val = keyValPair.split('=')[1];
                if (key && val) {
                    postData[key] = val;
                }
            });
            console.log(postData);
        }

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

        return false;
    });

    $('input[name="offset"]').change(function() {
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

    $('#quick-event-form').submit(function() {

        var form = $(this);
        $.ajax({
            url : '/history',
            type : 'POST',
            data : {
                quick_event : $(this).find('input[name="quick_event"]').val()
            },
            success : function(response) {
                input = form.find('input[name="quick_event"]');
                input.val('');
                var originalColor = input.css('background-color');
                input.css('background-color', 'yellow');
                setTimeout(function() {
                    input.animate({backgroundColor: originalColor}, 1000);
                }, 500);
            }
        });
        return false;
    });

    /**
     * Tool tip configuration.
     */
    $('.day-block[title!="stop"]').hover(function() {
        $(this).append('<label>' + $(this).attr('data-name') + '</label>');
    }, function() {
        $(this).children('label').remove();
    });

});
