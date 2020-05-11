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
    socket.emit('debug', query);
    for (var i = 0; i < query.length; i++) {
        var obj = query[i];
        var clip = $('<iframe/>');
        clip.attr({
            width: 560,
            height: 315,
            src: obj.url,
            frameborder: 0
        });
        $('#clipContainer').append(clip);
    }
});
