var axios = require('axios');
const cheerio = require('cheerio');

const API_TOKEN = 'VvdON_1hLZXZhK9Isbez6awd4LBvNksFalh6CiV1d4VRP8YxQKzyPRbFTMWV3DPM';
const GENIUS_URL = 'https://api.genius.com/';

module.exports = {
    getPath: function(artist, track){
        var encodedString = encodeURIComponent(`${artist}+${track}`);
        console.log(`${GENIUS_URL}search?q=${encodedString}`);
        return axios({
            method: 'GET',
            url: `${GENIUS_URL}search?q=${encodedString}`,
            headers: {
                Authorization: `Bearer ${API_TOKEN}`
            }
        });
    },

    getLyrics: function(url){
        return axios({
            method: 'GET',
            url: url
        }).then(function(response){
            var html = response.data;
            var $ = cheerio.load(html);
            var lyrics = $('lyrics').find('p').text();
            return lyrics;
        });
    }
};
