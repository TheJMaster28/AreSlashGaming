var socket = io();

// creates url for embedding videos
function makeEmbedURL(url) {
    // regular expressions for url filtering
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|(?<=clip\/))([^#&?]*).*/;
    const match = url.match(regExp);
    const regExp2 = /(youtube|youtu\.be|twitch)/;
    const match2 = url.match(regExp2);

    // not match for a youtube link or twitch clip
    if (!match) throw 'Not an acceptable video link';

    // do youtube embed url for youtube urls
    if ((match2 && match2[0] == 'youtube') || match2[0] == 'youtu.be') {
        return 'https://www.youtube.com/embed/' + match[2];
    }
    // do twitch embed for twitch urls
    if (match2 && match2[0] == 'twitch') {
        return 'https://clips.twitch.tv/embed?clip=' + match[2];
    }

    throw 'Not an acceptable video link';
}

// submit url to server when user hits submit
window.onload = function () {
    var form = document.getElementById('chatForm');

    form.onsubmit = function (e) {
        e.preventDefault();
        var messageInput = document.getElementById('m');

        // sends input to server after changing the url to an embedded url and takes you back to home page
        try {
            socket.emit('post clip', makeEmbedURL(messageInput.value));
            messageInput.value = '';
            setTimeout(function () {
                window.location.href = '/';
            }, 500);
            return false;
        } catch (err) {
            alert(err);
        }
    };
};
