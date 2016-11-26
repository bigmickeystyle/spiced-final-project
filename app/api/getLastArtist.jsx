var axios = require('axios');

const API_KEY = '71ac466489df4f2214fb99c9119071d3';
const LAST_FM_URL = 'https://ws.audioscrobbler.com/2.0/';

module.exports = {
    getTopAlbums: function(artist){
        var encodedArtist = encodeURIComponent(artist);
        var topAlbumUrl = `${LAST_FM_URL}?method=artist.gettopalbums&artist=${encodedArtist}&api_key=${API_KEY}&format=json`;
        console.log(topAlbumUrl);
        return axios.get(topAlbumUrl).then(function(resp){
            console.log(resp.data.topalbums);
            return resp.data.topalbums;
        }).catch(function(err){
            return err;
        });
    }
};
