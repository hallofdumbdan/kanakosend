function logMessage(message) {
    const logs = document.getElementById('logs');
    logs.innerHTML += message + '<br>';
    logs.scrollTop = logs.scrollHeight;
}

async function sendMessage(channelID, userToken, content) {
    const response = await fetch(`https://discord.com/api/v9/channels/${channelID}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': userToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    });
    return response.ok;
}

function startSending() {
    const message = document.getElementById('message').value.trim();
    const channelID = document.getElementById('channel').value.trim();
    const userToken = document.getElementById('token').value.trim();
    const delay = parseInt(document.getElementById('delay').value.trim());

    if (!message || !channelID || !userToken || isNaN(delay)) {
        alert('Please fill in all fields correctly');
        return;
    }

    logMessage('Starting to send messages...');

    let interval = setInterval(async () => {
        const success = await sendMessage(channelID, userToken, message);
        const time = new Date().toLocaleTimeString();

        if (success) {
            logMessage(`Message sent to ${channelID} at ${time}`);
        } else {
            logMessage(`Failed to send message to ${channelID} at ${time}`);
            clearInterval(interval);
        }
    }, delay);
}
