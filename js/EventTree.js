var EventTree = function(name) {

    this.label = 'root';
    this.par = null;
    this.children = [];

    if (name) {
        this.label = name;
    }

    this.appendChild = function(child) {
        this.children.push(child);
        child.par = this;
    };

    this.appendChildren = function(children) {
        var length = children.length;
        for(var i = 0; i < length; i++) {
            this.children.push(children[i]);
            children[i].par = this;
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
