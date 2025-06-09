const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'shoti',
  description: 'Fetch a random Shoti video.',
  usage: 'shoti',
  author: 'Akimitsu',

  async execute(senderId, args, pageAccessToken) {
    await sendMessage(
      senderId,
      { text: '🎬 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝘀𝗵𝗼𝘁𝗶 𝘃𝗶𝗱𝗲𝗼, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' },
      pageAccessToken
    );

    try {
      const response = await axios.get('https://shoti.fbbot.org/api/get-shoti?type=video', {
        headers: {
          apikey: '$shoti-54c9a5966a',
        },
      });

      const data = response.data?.result;

      if (!data || !data.content) {
        return sendMessage(
          senderId,
          { text: '❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗳𝗲𝘁𝗰𝗵 𝗮 𝗦𝗵𝗼𝘁𝗶 𝘃𝗶𝗱𝗲𝗼. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.' },
          pageAccessToken
        );
      }

      await sendMessage(
        senderId,
        {
          attachment: {
            type: 'video',
            payload: {
              url: data.content,
            },
          },
        },
        pageAccessToken
      );
    } catch (error) {
      console.error('Error fetching Shoti video:', error);
      await sendMessage(
        senderId,
        {
          text: '🚫 𝗘𝗿𝗿𝗼𝗿 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗦𝗵𝗼𝘁𝗶 𝘃𝗶𝗱𝗲𝗼. 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.',
        },
        pageAccessToken
      );
    }
  },
};
// Ako importante potah? Manuelson Yasis Hacker