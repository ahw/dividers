var TreeView = Backbone.View.extend({

    el : 'body',
    
    initialize : function(options) {
        this.model = options.model;
    },

    render : function() {
        var s = sprintf("<ul>%s</ul>", this.renderTree(this.model));
        $(this.el).append(s);
        console.log(JSON.stringify(this.model, null, '    '));
    },

    renderTree : function(tree) {
        var view = this;
        var s = sprintf('<li>%s <a href="#">add</a> <a href="#">remove</a>', tree.label);
        if (tree.children.length > 0) {
            s += '<ul>';
            for (var i = 0; i < tree.children.length; i++) {
                s += view.renderTree(tree.children[i]);
            }
            s += '</ul>';
        }
        s += '</li>';
        return s;
    }

});
