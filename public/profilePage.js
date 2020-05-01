const socket = io();
window.onload = function () {
    socket.emit('request profile page');
};
