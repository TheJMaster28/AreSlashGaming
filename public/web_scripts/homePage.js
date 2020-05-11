const socket = io();

window.onload = function () {
    socket.emit('request posts');
};

function login() {
    socket.emit('login');
}

function googleLogin() {
    socket.emit('googleLogin');
}

socket.on('receive posts', function (obj) {
    var query = JSON.parse(obj);
    // socket.emit('debug', query);
    console.log(query);
    // for (var i = 0; i < query.length; i++) {
    //     var obj = query[i];
    //     var clip = $('<iframe/>');
    //     clip.attr({
    //         width: 560,
    //         height: 315,
    //         src: obj.url,
    //         frameborder: 0,
    //         class: 'clip'
    //     });
    //     $('#clipContainer').append(clip);
    // }

    for (var i = query.length - 1; i >= 0; i--) {
        var obj = query[i];
        console.log(obj);
        var div = $('<div>');
        div.attr({
            class: 'clipCard'
        });
        var user = $('<h3>');
        user.attr({
            class: 'username'
        });
        user.text(obj.user + ': ' + obj.postTime);
        var clip = $('<iframe/>');
        clip.attr({
            width: 560,
            height: 315,
            src: obj.url,
            frameborder: 0,
            class: 'clip'
        });
        $('#clipContainer').append(div);
        div.append(user);
        div.append(clip);
    }
});
