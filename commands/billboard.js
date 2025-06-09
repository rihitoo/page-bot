const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'billboard',
  description: 'billboard <text>',
  usage: 'billboard <text>',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘁𝗲𝘅𝘁 ' }, pageAccessToken);
      return;
    }

    const text = args.join(' ');
    const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/billboard?text=${encodeURIComponent(text)}`;

    try {
      await sendMessage(senderId, { 
        attachment: { 
          type: 'image', 
          payload: { url: apiUrl } 
        } 
      }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: 'Error: Could not generate billboard image.' }, pageAccessToken);
    }
  }
};