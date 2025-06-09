const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'waifu',
  description: 'Get random waifu images from the waifu.pics API.',
  usage: 'waifu',
  async execute(senderId, args, pageAccessToken) {
    try {
      const response = await axios.get('https://api.waifu.pics/sfw/waifu');
      const waifuUrl = response.data.url;

      if (!waifuUrl) {  
        return sendMessage(senderId, { text: '𝗡𝗼 𝘄𝗮𝗶𝗳𝘂 𝗶𝗺𝗮𝗴𝗲 𝗳𝗼𝗿 𝘆𝗼𝘂 𝗿𝗶𝗴𝗵𝘁 𝗻𝗼𝘄.' }, pageAccessToken);  
      }  

      await sendMessage(senderId, {  
        attachment: {  
          type: 'image',  
          payload: { url: waifuUrl, is_reusable: true }  
        }  
      }, pageAccessToken);  

    } catch (error) {  
      console.error('waifu command error:', error.message);  
      await sendMessage(senderId, {  
        text: '𝗘𝗿𝗿𝗼𝗿: 𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗳𝗲𝘁𝗰𝗵 𝘄𝗮𝗶𝗳𝘂 𝗶𝗺𝗮𝗴𝗲.'  
      }, pageAccessToken);  
    }
  }
};