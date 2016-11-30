var axios = require('axios');

const API_KEY = '71ac466489df4f2214fb99c9119071d3';
const LAST_FM_URL = 'https://ws.audioscrobbler.com/2.0/';
const ALBUM_LIMIT = 10;

module.exports = {
    getTopAlbums: function(artist){
        var encodedArtist = encodeURIComponent(artist);
        var topAlbumUrl = `${LAST_FM_URL}?method=artist.gettopalbums&artist=${encodedArtist}&limit=${ALBUM_LIMIT}&api_key=${API_KEY}&format=json`;
        console.log(topAlbumUrl);
        return axios.get(topAlbumUrl).then(function(resp){
            console.log(resp.data.topalbums);
            return resp.data.topalbums;
        }).catch(function(err){
            return err;
        });
    },

    getAlbumDetails: function(artist, album){
        var encodedArtist = encodeURIComponent(artist);
        var encodedAlbum = encodeURIComponent(album);
        var albumUrl = `${LAST_FM_URL}?method=album.getinfo&api_key=${API_KEY}&artist=${encodedArtist}&album=${encodedAlbum}&format=json`;
        console.log(albumUrl);
        return axios.get(albumUrl).then(function(resp){
            return resp.data.album;
        }).catch(function(err){
            console.log('error', err);
        });
    },

    getCurrentTracks: function(user){
        var getCurrentTracksUrl = `${LAST_FM_URL}?method=user.getrecenttracks&user=${user}&api_key=${API_KEY}&format=json`;
        console.log(getCurrentTracksUrl);
        return axios.get(getCurrentTracksUrl).then(function(resp){
            console.log(resp.data);
        });
    }
};
