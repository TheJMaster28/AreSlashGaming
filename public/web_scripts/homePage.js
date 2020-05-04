const socket = io();

window.onload = function () {
    socket.emit('request posts');
};

function is_url(str) {
    regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
        return true;
    } else {
        return false;
    }
}

function login() {
    socket.emit('login');
}

function googleLogin() {
    socket.emit('googleLogin');
}

function createPost() {
    try {
        var form = document.forms['CreatePost'];
        form.pre;
        if (form['postText'].value == '') {
            alert('Cannot create empty post');
            return false;
        }

        if (!is_url(form['linkText'].value)) {
            alert('Non-valid URL');
            return false;
        }

        socket.emit('create post', { text: form['postText'].value, url: form['linkText'].value });
    } catch (err) {
        alert(err);
        return false;
    }
}

function makeHTMLPost(parent, data) {
    var child = document.createElement('div');
    var post = document.createElement('p');
    post.textContent = data.text;
    child.appendChild(post);
    parent.appendChild(child);
}

function getPosts(data) {
    try {
        var feed = document.getElementById('feed');

        // create the html object with the post information
        makeHTMLPost(feed, data);
    } catch (err) {
        alert(err);
        console.log('oof');
    }
}

socket.on('receive posts', function (data) {
    console.log('got posts');
    getPosts(data);
});
