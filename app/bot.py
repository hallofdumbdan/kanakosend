import aiohttp
import asyncio
from colorama import Fore, init
from flask import Flask, render_template, request

init()

app = Flask(__name__)

USER_TOKEN = ""  # Initialize with your Discord user token
CHANNEL_ID = ""  # Initialize with the ID of the Discord channel
SKULL_EMOJI_UNICODE = "💀"  # Replace with the emoji you want to react with

@app.route('/')
def index():
    return render_template('index.html', user_token=USER_TOKEN, channel_id=CHANNEL_ID)

@app.route('/start', methods=['POST'])
def start_bot():
    global USER_TOKEN, CHANNEL_ID
    USER_TOKEN = request.form['user_token']
    CHANNEL_ID = request.form['channel_id']
    asyncio.create_task(fetch_messages_and_react())
    return 'Bot started successfully!'

@app.route('/stop')
def stop_bot():
    global USER_TOKEN, CHANNEL_ID
    USER_TOKEN = ""
    CHANNEL_ID = ""
    return 'Bot stopped successfully!'

async def fetch_messages_and_react():
    async with aiohttp.ClientSession(headers={"Authorization": f"{USER_TOKEN}"}) as session:
        latest_message_id = None
        while USER_TOKEN and CHANNEL_ID:
            url = f"https://discord.com/api/v9/channels/{CHANNEL_ID}/messages"
            params = {"limit": 1}
            try:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        messages = await response.json()
                        if messages:
                            message = messages[0]
                            message_id = message['id']
                            if message_id != latest_message_id:
                                latest_message_id = message_id
                                reaction_url = f"https://discord.com/api/v9/channels/{CHANNEL_ID}/messages/{message_id}/reactions/{SKULL_EMOJI_UNICODE}/@me"
                                async with session.put(reaction_url) as reaction_response:
                                    if reaction_response.status == 204:
                                        print(f"{Fore.GREEN}Reaction added to the message.")
                                    else:
                                        print(f"{Fore.RED}Failed to add reaction. Status Code: {reaction_response.status}")
                            else:
                                print(f"{Fore.YELLOW}No new messages detected")
                    else:
                        print(f'Failed to fetch messages. Status Code: {response.status}')
            except aiohttp.ClientResponseError as e:
                if e.status == 401:
                    print(f"{Fore.RED}Unauthorized access. Check your USER_TOKEN.")
                else:
                    print(f"{Fore.RED}Failed to fetch messages. Error: {e}")

            await asyncio.sleep(0.1)  # Fetch messages every half a second

if __name__ == '__main__':
    app.run(debug=True)
