const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage'); // your messenger util

// Export the command
module.exports = {
  name: 'gagstock',
  description: 'Fetch all Grow A Garden stocks in one go',
  usage: 'gagstock',
  author: 'mamamo',

  run: async ({ api, event }) => {
    const { threadID } = event;

    // Inform user we’re working on it
    await sendMessage(threadID, { text: '🌾 Fetching Grow A Garden stock…' });

    try {
      // 1️⃣ Fetch everything in one request
      const res = await axios.get('http://65.108.103.151:22377/api/stocks?type=all', {
        timeout: 10000
      });

      // 2️⃣ Destructure the returned data object
      const {
        gear = [],        // array of gear names
        seeds = [],       // array of seed names
        eggs = [],        // array of egg names
        cosmetics = [],   // array of cosmetic names
        honey = []        // array of honey names
      } = res.data.data || {};

      // 3️⃣ Helper to format each category
      const fmt = (arr, label, emoji) =>
        arr.length
          ? `${emoji} **${label}**:\n${arr.map(i => `• ${i}`).join('\n')}`
          : `❌ **${label}**: none`;

      // 4️⃣ Build the message
      const message =
        `🌾 𝗚𝗿𝗼𝘄 𝗔 𝗚𝗮𝗿𝗱𝗲𝗻 — Stock Summary 🌾\n\n` +
        fmt(gear, 'Gear', '🛠️') + '\n\n' +
        fmt(seeds, 'Seeds', '🌱') + '\n\n' +
        fmt(eggs, 'Eggs', '🥚') + '\n\n' +
        fmt(cosmetics, 'Cosmetics', '🎀') + '\n\n' +
        fmt(honey, 'Honey', '🍯');

      // 5️⃣ Send the compiled summary
      await sendMessage(threadID, { text: message });

    } catch (err) {
      console.error('gagstock error:', err);
      await sendMessage(threadID, {
        text: '❌ Failed to fetch stock data. Please try again later.'
      });
    }
  }
};

