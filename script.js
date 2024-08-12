let interval;  // Declare interval globally so it can be accessed by both functions

function logMessage(message) {
    const logs = document.getElementById('logs');
    logs.innerHTML += message + '<br>';
    logs.scrollTop = logs.scrollHeight;
}

async function sendMessage(channelID, userToken, content) {
    try {
        const response = await fetch(`https://discord.com/api/v9/channels/${channelID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${userToken}`,  // Ensure the token is prefixed correctly if needed
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });

        if (response.status === 429) {  // Rate limit exceeded
            const retryAfter = parseFloat(response.headers.get('Retry-After')) || 5;
            logMessage(`Rate limit exceeded. Retrying after ${retryAfter} seconds.`);
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            return sendMessage(channelID, userToken, content);  // Retry the message send
        }

        if (response.ok) {
            logMessage(`Message successfully sent to ${channelID}.`);
            return true;
        } else {
            logMessage(`Failed to send message. Status Code: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error('Error sending message:', error);
        logMessage('Error occurred while sending message.');
        return false;
    }
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

    // Function to handle sending the message with retry logic
    async function attemptSendMessage() {
        const success = await sendMessage(channelID, userToken, message);
        const time = new Date().toLocaleTimeString();

        if (success) {
            logMessage(`Message sent to ${channelID} at ${time}`);
        } else {
            logMessage(`Failed to send message to ${channelID} at ${time}. Attempting to send again in 3 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 3000));  // Wait 3 seconds before retrying

            const retrySuccess = await sendMessage(channelID, userToken, message);
            const retryTime = new Date().toLocaleTimeString();

            if (retrySuccess) {
                logMessage(`Message successfully sent to ${channelID} on retry at ${retryTime}.`);
            } else {
                logMessage(`Failed to send message to ${channelID} on retry at ${retryTime}.`);
            }
        }
    }

    // Send the first message immediately
    await attemptSendMessage();

    // Set interval to send subsequent messages after the delay
    interval = setInterval(attemptSendMessage, delayInSeconds * 1000);  // Convert seconds to milliseconds
}

function stopSending() {
    clearInterval(interval);
    logMessage('Stopped sending messages.');
}
