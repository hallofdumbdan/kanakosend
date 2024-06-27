function startBot() {
    var reaction = document.getElementById('reaction').value.trim();
    var channelID = document.getElementById('channel').value.trim();
    var userToken = document.getElementById('token').value.trim();

    if (!reaction || !channelID || !userToken) {
        alert('Please fill in all fields');
        return;
    }

    // Construct the reaction URL
    var reactionURL = `https://discord.com/api/v9/channels/${channelID}/messages`;

    // Start reacting
    fetch(reactionURL, {
        method: 'POST',
        headers: {
            'Authorization': userToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: '/start'
        })
    })
    .then(response => {
        if (response.status === 200) {
            document.getElementById('status').innerHTML = 'Bot started reacting successfully.';
        } else {
            document.getElementById('status').innerHTML = 'Failed to start bot. Status Code: ' + response.status;
        }
    })
    .catch(error => {
        console.error('Error starting bot:', error);
        document.getElementById('status').innerHTML = 'Error starting bot: ' + error.message;
    });
}

function stopBot() {
    var channelID = document.getElementById('channel').value.trim();
    var userToken = document.getElementById('token').value.trim();

    if (!channelID || !userToken) {
        alert('Please fill in all fields');
        return;
    }

    // Construct the reaction URL
    var reactionURL = `https://discord.com/api/v9/channels/${channelID}/messages`;

    // Stop reacting
    fetch(reactionURL, {
        method: 'POST',
        headers: {
            'Authorization': userToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: '/stop'
        })
    })
    .then(response => {
        if (response.status === 200) {
            document.getElementById('status').innerHTML = 'Bot stopped reacting successfully.';
        } else {
            document.getElementById('status').innerHTML = 'Failed to stop bot. Status Code: ' + response.status;
        }
    })
    .catch(error => {
        console.error('Error stopping bot:', error);
        document.getElementById('status').innerHTML = 'Error stopping bot: ' + error.message;
    });
}
