var TreeView = Backbone.View.extend({

    el : 'body',
    addLink : '<a href="#">add</a>',
    removeLink : '<a href="#">remove</a>',
    
    initialize : function(options) {
        this.model = options.model;
    },

    render : function() {
        var s = this.renderTree(this.model);
        console.log(s);
        $(this.el).append(s);
        console.log(JSON.stringify(this.model, null, '    '));
    },

    renderTree : function(tree) {
        var view = this;
        var s = '<ul>\n';
        s += sprintf('<li>%s %s %s\n', tree.label, view.addLink, view.removeLink)

        if (tree.children.length > 0) {
            for (var i = 0; i < tree.children.length; i++) {
                s += view.renderTree(tree.children[i]);
            }
        }
        s += '</li>\n';
        s += '</ul>\n';
        return s;
    }

});
