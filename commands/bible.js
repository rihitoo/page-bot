const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'bible',
  description: 'Fetch a Bible verse!',
  usage: 'say bible',
  author: 'Dale Mekumi',
  async execute(senderId, args, pageAccessToken) {
    await sendMessage(senderId, {
      text: "📖 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗕𝗶𝗯𝗹𝗲 𝘃𝗲𝗿𝘀𝗲..."
    }, pageAccessToken);

    try {
      const response = await axios.get('https://beta.ourmanna.com/api/v1/get/?format=text');
      const verse = response.data;

      if (!verse) {
        await sendMessage(senderId, {
          text: "🥺 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮 𝗕𝗶𝗯𝗹𝗲 𝘃𝗲𝗿𝘀𝗲."
        }, pageAccessToken);
        return;
      }

      await sendMessage(senderId, {
        text: `📜 𝗕𝗶𝗯𝗹𝗲 𝗩𝗲𝗿𝘀𝗲\n\n"${verse}"`
      }, pageAccessToken);

    } catch (error) {
      console.error('Bible command error:', error.message);
      await sendMessage(senderId, {
        text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}`
      }, pageAccessToken);
    }
  }
};