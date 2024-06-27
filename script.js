function startBot() {
    var reaction = document.getElementById('reaction').value.trim();
    var channelID = document.getElementById('channel').value.trim();
    var userToken = document.getElementById('token').value.trim();
    var userID = document.getElementById('userID').value.trim();

    if (!reaction || !channelID || !userToken || !userID) {
        alert('Please fill in all fields');
        return;
    }

    // Construct the reaction URL
    var reactionURL = `https://discord.com/api/v9/channels/${channelID}/messages/${userID}/reactions/${reaction}/@me`;

    // Start reacting
    fetch(reactionURL, {
        method: 'PUT',
        headers: {
            'Authorization': userToken
        }
    })
    .then(response => {
        if (response.status === 204) {
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
    document.getElementById('status').innerHTML = 'Bot stopped reacting.';
    // You can add additional logic here if needed
}
