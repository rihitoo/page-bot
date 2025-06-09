const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'instadl',
  description: 'Download Instagram reel video',
  author: 'developer',
  usage: 'instadl <url>',
  async execute(senderId, args, pageAccessToken) {
    const messageText = args.join(' ');
    const instagramLinkRegex = /https:\/\/www\.instagram\.com\/\S+/;

    if (!instagramLinkRegex.test(messageText)) {
      await sendMessage(senderId, {
        text: 'Please provide a valid Instagram reel link.'
      }, pageAccessToken);
      return;
    }

    try {
      await sendMessage(senderId, { text: '𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖨𝗇𝗌𝗍𝖺𝗀𝗋𝖺𝗆, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...' }, pageAccessToken);

      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/instadl?url=${encodeURIComponent(messageText)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.status || !data.result || data.result.length === 0) {
        throw new Error('Invalid API response');
      }

      const video = data.result.find(r => r.type === 'video');
      if (!video || !video.url) {
        throw new Error('No downloadable video found');
      }

      // Check video size
      const headResponse = await axios.head(video.url);
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        await sendMessage(senderId, {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: 'The Instagram video exceeds the 25 MB limit and cannot be sent directly.',
              buttons: [
                {
                  type: 'web_url',
                  url: video.url,
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
              url: video.url,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('Instagram download error:', error.message);
      await sendMessage(senderId, {
        text: 'Failed to download the Instagram video. Please try again later.\nEnsure your link looks like this:\nhttps://www.instagram.com/reel/DH9BzTFPxs8/?igsh=YzljYTk1ODg3Zg=='
      }, pageAccessToken);
    }
  }
};