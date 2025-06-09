const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

// Read the token once at the top level
const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'spotify',
  description: 'cici command',
  usage: 'spotify <song name>',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    if (!Array.isArray(args) || args.length === 0) {
      return await sendError(senderId, 'Error: Please provide a song name.', pageAccessToken);
    }

    const searchQuery = args.join(' ').trim();
    await handleSpotifySearch(senderId, searchQuery, pageAccessToken);
  },
};

// Function to search for a Spotify track
const handleSpotifySearch = async (senderId, searchQuery, pageAccessToken) => {
  try {
    const apiUrl = `https://hiroshi-api.onrender.com/tiktok/spotify?search=${encodeURIComponent(searchQuery)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || data.length === 0) {
      return await sendError(senderId, 'Error: No results found.', pageAccessToken);
    }

    const { name: trackName, track, image, download } = data[0];

    // Send track details
    const message = `🎶 | Now Playing\n━━━━━━━━━━━━━━━\n🎧 Track: ${trackName}\n🔗 [Listen on Spotify]\n${track}\n━━━━━━━━━━━━━━━`;
    await sendMessage(senderId, { text: message }, pageAccessToken);

    // Send the image
    if (image) {
      const imagePayload = getAttachmentPayload('image', image);
      await sendMessage(senderId, { attachment: imagePayload }, pageAccessToken);
    }

    // Send the audio
    if (download) {
      const audioPayload = getAttachmentPayload('audio', download);
      await sendMessage(senderId, { attachment: audioPayload }, pageAccessToken);
    }
  } catch (error) {
    console.error('Error fetching Spotify track:', error);
    await sendError(senderId, 'Error: An unexpected error occurred. Please try again.', pageAccessToken);
  }
};

// Function to get attachment payload based on type
const getAttachmentPayload = (type, url) => {
  const supportedTypes = {
    image: { type: 'image', payload: { url } },
    audio: { type: 'audio', payload: { url } },
  };

  return supportedTypes[type] || null;
};

// Centralized error handler for sending error messages
const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};