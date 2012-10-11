var EventTree = function(name) {

    this.label = 'root';
    this.id = null;
    this.par = null;
    this.children = [];

    if (name) {
        this.label = name;
    }

    this.appendChild = function(child) {
        var id = this.id
                ? this.id + "," + this.children.length
                : "0";
        var child = child;
        if (!child) {
            child = new EventTree();
        }
        this.children.push(child);
        child.id = id;
        child.par = this;

    };

    this.appendChildren = function(children) {
        var length = children.length;
        for(var i = 0; i < length; i++) {
            this.appendChild(children[i]);
        }
    };

    this.toString = function(padding) {
        var padding = padding ? padding : "";
        var s = padding + this.label + " (" + this.id + ")";
        for (var i = 0; i < this.children.length; i++) {
            s += "\n" + this.children[i].toString(padding + "    ");
        }
        return s;
    };

}

var a = new EventTree('andrew');
var b = new EventTree('beth');
var c = new EventTree('charlie');
var d1 = new EventTree('dan');
var d2 = new EventTree('dick');
var d3 = new EventTree('dustin');
var e1 = new EventTree('eric');
var e2 = new EventTree('ethan');
a.appendChild(b);
b.appendChild(c);
c.appendChildren([d1, d2, d3]);
b.appendChildren([e1, e2]);
console.log(a.toString());
