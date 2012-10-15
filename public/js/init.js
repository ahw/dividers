$(document).ready(function() {

    var a = new EventTree('life');
    var b1 = new EventTree('work');
    var b2 = new EventTree('sleep');
    var b3 = new EventTree('exercise');
    var c1 = new EventTree('sports');
    var c2 = new EventTree('run');
    var c3 = new EventTree('gym');

    a.appendChild(b1);
    a.appendChild(b2);
    a.appendChild(b3);
    b3.appendChild(c1);
    b3.appendChild(c2);
    b3.appendChild(c3);

    var treeView = new IndexView({model : a});
    treeView.render();
});
