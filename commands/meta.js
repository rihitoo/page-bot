const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

const fontMapping = {
  'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
  'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
  'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
  'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
  'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
  'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
  'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
  'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇'
};

function convertToBold(text) {
  return text.replace(/(?:\*\*(.*?)\*\*|## (.*?)|### (.*?))/g, (match, boldText, h2Text, h3Text) => {
    const targetText = boldText || h2Text || h3Text;
    return [...targetText].map(char => fontMapping[char] || char).join('');
  });
}

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = {
  name: 'meta', // credit: Ry & Jerome (api)
  description: 'Get a response from Facebook Meta AI.',
  usage: 'meta <ask>',
  async execute(senderId, args, pageAccessToken) {
    const message = args.join(' ');

    if (!message) {
      return sendMessage(senderId, {
        text: '𝗘𝗿𝗿𝗼𝗿: 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗽𝗿𝗼𝗺𝗽𝘁 𝗳𝗼𝗿 𝗠𝗲𝘁𝗮 𝗔𝗜.\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: meta hi there!'
      }, pageAccessToken);
    }

    try {
      const apiUrl = `https://jer-ai.gleeze.com/meta?senderid=${encodeURIComponent(senderId)}&message=${encodeURIComponent(message)}`;
      const { data } = await axios.get(apiUrl);

      if (!data.response) {
        return sendMessage(senderId, {
          text: '𝗘𝗿𝗿𝗼𝗿: 𝗡𝗼 𝗿𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗿𝗲𝗰𝗲𝗶𝘃𝗲𝗱 𝗳𝗿𝗼𝗺 𝗠𝗲𝘁𝗮 𝗔𝗜.'
        }, pageAccessToken);
      }

      const formatted = convertToBold(data.response);
      const maxMessageLength = 2000;
      const messages = splitMessageIntoChunks(formatted, maxMessageLength);

      for (let i = 0; i < messages.length; i++) {
        await sendMessage(senderId, {
          text: i === 0 ? `∞ | 𝗠𝗲𝘁𝗮 𝗔𝗜 :\n\n${messages[i]}` : messages[i]
        }, pageAccessToken);
      }

    } catch (error) {
      console.error('meta command error:', error.message);
      await sendMessage(senderId, {
        text: '𝗘𝗿𝗿𝗼𝗿: 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗰𝗼𝗻𝗻𝗲𝗰𝘁 𝘁𝗼 𝗠𝗲𝘁𝗮 𝗔𝗜 𝗔𝗣𝗜.'
      }, pageAccessToken);
    }
  }
};