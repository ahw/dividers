var IndexView = Backbone.View.extend({

    el : '#eventTree',
    addLink : '<a class="add" href="#">add</a>',
    removeLink : '<a class="remove" href="#">remove</a>',

    events : {
        'click .add' : 'addNode',
        'click .remove' : 'removeNode',
        'click .event' : 'logEvent'
    },
    
    initialize : function(options) {
        this.model = options.model;
    },

    render : function() {
        var s = this.renderTree(this.model);
        $(this.el).append(s);
    },

    addNode : function(e) {
        return false;
    },

    removeNode : function(e) {
        return false;
    },

    logEvent : function(e) {
        var eventName = $(e.currentTarget).attr('data-event-name');
        console.log('eventName = ' + eventName);
        $.ajax({
            url : '/events',
            type : 'post',
            data : {
                ev : eventName,
                pev : 'unknown',
                offset : 0,
                id : 'andrew'
            },
            success : function(response) {
                console.log(response);
            }
        });
        return false;
    },

    renderTree : function(tree, isSubTree) {
        var view = this;
        var s = !isSubTree ? '<ul>' : '';
        s += sprintf('<li><a class="event" data-event-name="%s" href="#">%s</a> %s %s\n', tree.label, tree.label, view.addLink, view.removeLink)

        if (tree.children.length > 0) {
            for (var i = 0; i < tree.children.length; i++) {
                s += i == 0 ? '<ul>' : '';
                s += view.renderTree(tree.children[i], true);
                s += i == tree.children.length - 1 ? '</ul>' : '';
            }
        }
        s += '</li>\n';
        s += !isSubTree ? '</ul>' : '';
        return s;
    }

});
