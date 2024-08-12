let interval;  // Declare interval globally so it can be accessed by both functions

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

async function startSending() {
    const message = document.getElementById('message').value;
    const channelID = document.getElementById('channel').value.trim();
    const userToken = document.getElementById('token').value.trim();
    const delayInSeconds = parseFloat(document.getElementById('delay').value.trim());

    if (!message || !channelID || !userToken || isNaN(delayInSeconds)) {
        alert('Please fill in all fields correctly');
        return;
    }

    logMessage('Starting to send messages...');

    // Send the first message immediately
    const success = await sendMessage(channelID, userToken, message);
    const time = new Date().toLocaleTimeString();

    if (success) {
        logMessage(`Message sent to ${channelID} at ${time}`);
    } else {
        logMessage(`Failed to send message to ${channelID} at ${time}`);
        return;  // Stop further attempts if the first message fails
    }

    // Set interval to send subsequent messages after the delay
    interval = setInterval(async () => {
        const success = await sendMessage(channelID, userToken, message);
        const time = new Date().toLocaleTimeString();

        if (success) {
            logMessage(`Message sent to ${channelID} at ${time}`);
        } else {
            logMessage(`Failed to send message to ${channelID} at ${time}`);
            clearInterval(interval);  // Stop further attempts if a message fails
        }
    }, delayInSeconds * 1000);  // Convert seconds to milliseconds
}

function stopSending() {
    clearInterval(interval);
    logMessage('Stopped sending messages.');
}
