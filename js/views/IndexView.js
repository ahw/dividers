var IndexView = Backbone.View.extend({

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

    renderTree : function(tree, isSubTree) {
        var view = this;
        var s = !isSubTree ? '<ul>' : '';
        s += sprintf('<li>%s %s %s\n', tree.label, view.addLink, view.removeLink)

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
