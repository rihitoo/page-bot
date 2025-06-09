const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'animeme',
  description: 'Get random anime memes from the Animemes subreddit.',
  async execute(senderId, args, pageAccessToken) {
    try {
      const response = await axios.get('https://meme-api.com/gimme/animemes');
      const memeData = response.data;

      if (!memeData || memeData.nsfw) {  
        return sendMessage(senderId, { text: '𝗡𝗼 𝗮𝗻𝗶𝗺𝗲 𝗺𝗲𝗺𝗲 𝗳𝗼𝗿 𝘆𝗼𝘂 𝗿𝗶𝗴𝗵𝘁 𝗻𝗼𝘄 𝗼𝗿 𝗶𝘁 𝘄𝗮𝗹𝗹 𝗻𝗼𝘁 𝗯𝗲 𝘀𝗵𝗼𝘄𝗻.' }, pageAccessToken);  
      }  

      await sendMessage(senderId, {  
        attachment: {  
          type: 'image',  
          payload: { url: memeData.url, is_reusable: true }  
        }  
      }, pageAccessToken);  

      // Optional: Send the title as a follow-up message
      await sendMessage(senderId, {
        text: `"${memeData.title}"`
      }, pageAccessToken);

    } catch (error) {  
      console.error('animememe command error:', error.message);  
      await sendMessage(senderId, {  
        text: '𝗘𝗿𝗿𝗼𝗿: 𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗳𝗲𝘁𝗰𝗵 𝗮𝗻𝗶𝗺𝗲 𝗺𝗲𝗺𝗲.'  
      }, pageAccessToken);  
    }
  }
};