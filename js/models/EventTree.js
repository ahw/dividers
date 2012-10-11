var EventTree = Backbone.DeepModel.extend({

    defaults : {
        label : null,
        title : null,
        children : []
    },

    initialize : function(options) {

        var model = this;
        if (options) {
            model.set({
                label : options.label,
                title : options.title
            });
        }
    },

    appendChild : function(eventTree) {
        var children = this.get('children');
        children.push(eventTree);
        this.set({children : children});
    }


});
