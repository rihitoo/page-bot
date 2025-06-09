const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'remini',
  description: 'enhance an image using remini api.',
  author: 'dev',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝘂𝗽𝘀𝗰𝗮𝗹𝗲𝗶" 𝘁𝗼 𝗲𝗻𝗵𝗮𝗻𝗰𝗲 𝗶𝘁.`
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ 𝗘𝗻𝗵𝗮𝗻𝗰𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const enhanceUrl = `https://kaiz-apis.gleeze.com/api/upscale?imageUrl=${encodeURIComponent(imageUrl)}&apikey=ec7d563d-adae-4048-af08-0a5252f336d1`;

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: enhanceUrl
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('Error enhancing image:', error);
      await sendMessage(senderId, {
        text: '❌ An error occurred while processing the image. Please try again later.'
      }, pageAccessToken);
    }
  }
};