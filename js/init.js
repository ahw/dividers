$(document).ready(function() {

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

    var treeView = new IndexView({model : a});
    treeView.render();
});
