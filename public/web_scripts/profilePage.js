const socket = io();

window.onload = function () {
    socket.emit('request profile page');
};

socket.on('sending user profile', function (data) {
    console.log('have received data', data);
});
