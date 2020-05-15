const socket = io();

// tell server to request posts
window.onload = function () {
    socket.emit('request posts');
};

// tell server that a user wants to login with google
function googleLogin() {
    socket.emit('googleLogin');
}

// display query result of all the videos
socket.on('receive posts', function (obj) {
    var query = JSON.parse(obj);

    // creates each html element to display the embedded clips in the query
    for (var i = query.length - 1; i >= 0; i--) {
        var obj = query[i];
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
