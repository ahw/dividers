$(document).ready(function() {

    var a = new EventTree('Life');
    var b1 = new EventTree('Work');
    var b2 = new EventTree('Sleep');
    var b3 = new EventTree('Exercise');
    var c1 = new EventTree('Sport');
    var c2 = new EventTree('Run');
    var c3 = new EventTree('Gym');

    a.appendChild(b1);
    a.appendChild(b2);
    a.appendChild(b3);
    b3.appendChild(c1);
    b3.appendChild(c2);
    b3.appendChild(c3);

    var treeView = new IndexView({model : a});
    treeView.render();
});
