const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'art',
  description: 'Generates AI art from a given prompt.',
  usage: 'art {prompt}',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '✦ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗽𝗿𝗼𝗺𝗽𝘁 𝘁𝗼 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗲 𝗮𝗿𝘁.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: art A cat with a collar and the tag is Ace'
      }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');
    const apiUrl = `https://mademoiselle2-rest-apis.onrender.com/api/art?prompt=${encodeURIComponent(prompt)}`;

    try {
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            is_reusable: true,
            url: apiUrl
          }
        }
      }, pageAccessToken);
    } catch (error) {
      console.error('Art generation error:', error.message);
      await sendMessage(senderId, {
        text: '𝗘𝗿𝗿𝗼𝗿: 𝗔𝗿𝘁 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗼𝗻 𝗳𝗮𝗶𝗹𝗲𝗱. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.'
      }, pageAccessToken);
    }
  }
};