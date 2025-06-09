const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

const SEARCH_URL = 'https://kaiz-apis.gleeze.com/api/ytsearch';
const DOWNLOAD_URL = 'https://kaiz-apis.gleeze.com/api/ytmp3-v2';
const API_KEY = 'ec7d563d-adae-4048-af08-0a5252f336d1';

module.exports = {
    name: 'ytmusic',
    description: 'Searches YouTube for music and provides an audio preview.',
    usage: 'ytmusic <song name>',
    author: 'Ry',

    async execute(senderId, args, pageAccessToken) {
        if (!args.length) {
            return sendMessage(senderId, { text: '𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗍𝗂𝗍𝗅𝖾.' }, pageAccessToken);
        }

        await searchYouTubeMusic(senderId, args.join(' '), pageAccessToken);
    }
};

const searchYouTubeMusic = async (senderId, songName, pageAccessToken) => {
    try {
        const searchRes = await axios.get(SEARCH_URL, {
            params: {
                q: songName,
                apikey: API_KEY
            }
        });

        const item = searchRes.data?.items?.[0];
        if (!item) {
            return sendMessage(senderId, { text: 'Error: No song found.' }, pageAccessToken);
        }

        const { title, thumbnail, url, duration } = item;

        const downloadRes = await axios.get(DOWNLOAD_URL, {
            params: {
                url,
                apikey: API_KEY
            }
        });

        const { download_url, quality } = downloadRes.data;

        // Send template message
        await sendMessage(senderId, {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: [{
                        title: `🎶 ${title}`,
                        image_url: thumbnail,
                        subtitle: `Duration: ${duration} | Quality: ${quality}`,
                        buttons: [
                            {
                                type: 'web_url',
                                url,
                                title: 'Watch on YouTube'
                            },
                            {
                                type: 'web_url',
                                url: download_url,
                                title: 'Download MP3'
                            }
                        ]
                    }]
                }
            }
        }, pageAccessToken);

        // Send audio preview
        await sendMessage(senderId, {
            attachment: {
                type: 'audio',
                payload: {
                    url: download_url,
                    is_reusable: true
                }
            }
        }, pageAccessToken);

    } catch (error) {
        console.error('Error fetching YouTube music:', error);
        sendMessage(senderId, { text: 'Error: Unexpected error occurred.' }, pageAccessToken);
    }
};