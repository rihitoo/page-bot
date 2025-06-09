const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

const API_BASE = 'https://kaiz-apis.gleeze.com/api';
const API_KEY = 'ec7d563d-adae-4048-af08-0a5252f336d1';

module.exports = {
  name: 'hentaigif',
  description: 'Fetches a random Hentai GIF.',
  
  async execute(senderId, args, pageAccessToken) {
    try {
      const response = await axios.get(`${API_BASE}/hentaigif`, {
        params: { apikey: API_KEY }
      });

      const gifUrls = response.data.gifs;

      if (!gifUrls || gifUrls.length === 0) {
        return sendMessage(senderId, {
          text: '𝗡𝗼 𝗛𝗲𝗻𝘁𝗮𝗶 𝗚𝗜𝗙 𝗳𝗼𝘂𝗻𝗱.'
        }, pageAccessToken);
      }

      const randomGif = gifUrls[Math.floor(Math.random() * gifUrls.length)];

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: { url: randomGif, is_reusable: true }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('hentaigif command error:', error.message);
      await sendMessage(senderId, {
        text: '𝗘𝗿𝗿𝗼𝗿: 𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗳𝗲𝘁𝗰𝗵 𝗛𝗲𝗻𝘁𝗮𝗶 𝗚𝗜𝗙.'
      }, pageAccessToken);
    }
  }
};