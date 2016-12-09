var axios = require('axios');
const cheerio = require('cheerio');

const API_TOKEN = 'G1vpX856FxY8UwfGls2oZQg0l6b4M_sTco0jr51bYLjt7OaodOd3Ia53uE5T8IK0';
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
