var EventTree = function(name) {

    this.label = 'root';
    this.children = [];

    if (name) {
        this.label = name;
    }

    this.appendChild = function(child) {
        var child = child;
        if (!child) {
            child = new EventTree();
        }
        this.children.push(child);

    };

    this.appendChildren = function(children) {
        var length = children.length;
        for(var i = 0; i < length; i++) {
            this.appendChild(children[i]);
        }
    };

    this.toString = function(padding) {
        var padding = padding ? padding : "";
        var s = padding + this.label;
        for (var i = 0; i < this.children.length; i++) {
            s += "\n" + this.children[i].toString(padding + "    ");
        }
        return s;
    };

}
