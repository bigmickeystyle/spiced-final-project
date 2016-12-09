var axios = require('axios');

const SPOTIFY_URL = 'https://api.spotify.com/v1';
const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';

module.exports = {

    searchArtist: function(artist) {
        var encodedArtist = encodeURIComponent(artist);
        var trackURL = `${SPOTIFY_SEARCH_URL}?q=${encodedArtist}&type=artist`;
        return axios.get(trackURL).then(function(resp){
            return resp.data.artists.items;
        }).catch(function(err){
            return err;
        });
    },

    getAlbums: function(id) {
        var albumsURL = `${SPOTIFY_URL}/artists/${id}/albums?q=limit=50&market=DE`;
        console.log(albumsURL);
        return axios.get(albumsURL).then(function(resp){
            return resp.data.items;
        });
    },

    getAlbum: function(id){
        var albumURL = `${SPOTIFY_URL}/albums/${id}`;
        return axios.get(albumURL).then(function(resp){
            if (resp.data){
                return resp.data;
            }
        }).catch(function(err){
            return err;
        });
    }
};
