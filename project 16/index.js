const serverAddress = "http://localhost:3000";
const mainTxtBox = document.getElementById('mainTxtBox');
const msgTarget = document.getElementById('msgTarget');
const nameTxtBox = document.getElementById('nameTxtBox');

function sendMsg() {
    if (mainTxtBox.value === '' || nameTxtBox.value === '') {
        alert("Geen bericht of naam.");
        return;
    }

    const sendDate = new Date();
    createMsg(mainTxtBox.value, nameTxtBox.value);
    mainTxtBox.value = '';
}

function receiveOldMsgs() {
    fetch(`${serverAddress}/messages`, { method: "GET" })
        .then((response) => response.json())
        .then((json) => {
            msgTarget.innerHTML = '';
            Object.values(json).forEach(({ message, username }) => {
                createMsg(message, username, true);
            });
            setTimeout(receiveOldMsgs, 1000);
        });
}

function createMsg(msg, author, isFromServer = false) {
    const newElement = document.createElement('div');
    newElement.innerHTML = `<b>${author}</b><br />${msg}`;
    msgTarget.appendChild(newElement);

    if (!isFromServer) {
        msgTarget.scrollTo(0, msgTarget.scrollHeight);
        fetch(`${serverAddress}/send`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: author, message: msg })
        });
    }
}

receiveOldMsgs();