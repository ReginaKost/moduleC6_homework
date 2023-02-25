const btnSend = document.querySelector('.btn-send-message');
const btnGeo = document.querySelector('.btn-geo');
const chat = document.querySelector('.chat-messages');

const wsUri = 'wss://echo-ws-service.herokuapp.com';
let websocket = new WebSocket(wsUri);
websocket.onmessage = (evt) => {
    writeToChat(evt.data);
};
websocket.onerror =  (evt) => {
    writeToChat(`ERROR: evt.data`);
};


function writeToChat(message, className=null) {
    if (!className) {
        className = 'server-msg';
        message = '<p>Server:</p>' + message;
    } else {
        message = '<p>User:</p>' + message;
    };
    let serverMsg = document.createElement('div');
    serverMsg.className = 'msg';
    serverMsg.classList.add(className);
    serverMsg.innerHTML = `<p>${message}</p>`;
    chat.appendChild(serverMsg);
    chat.scrollTop = chat.scrollHeight;
};


btnSend.addEventListener('click', () => {
    const input = document.querySelector('.text-input');
    writeToChat(input.value, 'user-msg');
    websocket.send(input.value);
    input.value = '';
})


function geoError() {
    writeToChat('Невозможно получить ваше местоположение');
};

function geoSuces(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    message = `<a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}" target="_blank">ссылка на карту</a>`
    writeToChat(message);
};


btnGeo.addEventListener('click', () => {
    if (!navigator.geolocation) {
        writeToChat('Geolocation не поддерживается вашим браузером');
    } else {
        navigator.geolocation.getCurrentPosition(geoSuces, geoError);
    };
})