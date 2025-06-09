const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'aidetect',
  description: 'detects if the input text is ai or human written',
  usage: 'aidetect <your text>',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    const query = args.join(' ');
    if (!query) {
      return sendMessage(senderId, {
        text: '𝗘𝗿𝗿𝗼𝗿: 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘁𝗲𝘅𝘁 𝘁𝗼 𝗮𝗻𝗮𝗹𝘆𝘇𝗲.'
      }, pageAccessToken);
    }

    const apiUrl = `https://kaiz-apis.gleeze.com/api/aidetector?q=${encodeURIComponent(query)}&apikey=ec7d563d-adae-4048-af08-0a5252f336d1`;

    try {
      const { data } = await axios.get(apiUrl, {
        headers: {
          Accept: 'application/json'
        }
      });

      const result = data.response.data;

      const feedback = result.feedback;
      const confidence = result.isHuman;
      const input = result.input_text;

      await sendMessage(senderId, {
        text:
          `─────────────
𝗔𝗜 𝗗𝗲𝘁𝗲𝗰𝘁𝗼𝗿\n` +
          `𝗜𝗻𝗽𝘂𝘁: "${input}"\n` +
          `𝗖𝗼𝗻𝗳𝗶𝗱𝗲𝗻𝗰𝗲: ${confidence}% Human\n` +
          `𝗥𝗲𝘀𝘂𝗹𝘁: ${feedback}
─────────────`
      }, pageAccessToken);

    } catch (error) {
      console.error('AIDetector error:', error.message);
      await sendMessage(senderId, {
        text: '𝗘𝗿𝗿𝗼𝗿: 𝗔𝗜 𝗗𝗲𝘁𝗲𝗰𝘁𝗼𝗿 𝗿𝗲𝗾𝘂𝗲𝘀𝘁 𝗳𝗮𝗶𝗹𝗲𝗱.'
      }, pageAccessToken);
    }
  }
};