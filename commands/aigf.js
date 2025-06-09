const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Helper to split long messages into chunks
function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = {
  name: 'aigf',
  description: 'Get a reply from  Aigf.',
  usage: 'aigf <message>',
  author: 'Ry Dev',

  async execute(senderId, args, pageAccessToken) {
    const query = args.join(' ');

    if (!query) {
      return sendMessage(senderId, {
        text: '𝗘𝗿𝗿𝗼𝗿: 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗺𝗲𝘀𝘀𝗮𝗴𝗲.\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: aigf hello'
      }, pageAccessToken);
    }

    try {
      const apiUrl = `https://zen-api.gleeze.com/api/aigf?message=${encodeURIComponent(query)}`;
      const { data } = await axios.get(apiUrl);

      if (!data.response) {
        return sendMessage(senderId, {
          text: '𝗘𝗿𝗿𝗼𝗿: 𝗡𝗼 𝗿𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗳𝗿𝗼𝗺 𝗔𝗜𝗚𝗙.'
        }, pageAccessToken);
      }

      const maxMessageLength = 2000;
      const messages = splitMessageIntoChunks(data.response, maxMessageLength);

      for (let i = 0; i < messages.length; i++) {
        await sendMessage(senderId, {
          text: i === 0 ? `
🤖| 𝗔𝗜𝗚𝗙:
─────────────
${messages[i]}
─────────────` : messages[i]
        }, pageAccessToken);
      }

    } catch (error) {
      console.error('aigf command error:', error.message);
      await sendMessage(senderId, {
        text: '𝗘𝗿𝗿𝗼𝗿: 𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗿𝗲𝗮𝗰𝗵 𝗭𝗲𝗻 𝗔𝗣𝗜.'
      }, pageAccessToken);
    }
  }
};