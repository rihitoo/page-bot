const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json',
};

module.exports = {
  name: 'fbdl',
  description: 'Download Facebook video',
  author: 'developer',
  usage: 'fbdl <fburl>',
  async execute(senderId, args, pageAccessToken) {
    const messageText = args.join(' ');
    const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S+/;

    if (!facebookLinkRegex.test(messageText)) {
      await sendMessage(senderId, {
        text: 'Please provide a valid Facebook video link.'
      }, pageAccessToken);
      return;
    }

    try {
      await sendMessage(senderId, { text: '𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...' }, pageAccessToken);

      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/fbdl?url=${encodeURIComponent(messageText)}`;
      const headResponse = await axios.head(apiUrl, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        await sendMessage(senderId, {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: 'The Facebook video exceeds the 25 MB limit and cannot be sent directly.',
              buttons: [
                {
                  type: 'web_url',
                  url: apiUrl,
                  title: 'Watch Video'
                }
              ]
            }
          }
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: apiUrl,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('Facebook download error:', error.message);
      await sendMessage(senderId, {
        text: 'Failed to download the Facebook video. Please try again later.'
      }, pageAccessToken);
    }
  },
};