var axios = require('axios');

const SPOTIFY_URL = 'https://api.spotify.com/v1';
const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';

module.exports = {

    searchArtist: function(artist) {
        var encodedArtist = encodeURIComponent(artist);
        var searchUrl = `${SPOTIFY_SEARCH_URL}?q=${encodedArtist}&type=artist`;
        return axios.get(searchUrl).then(function(resp){
            return resp.data.artists.items;
        }).catch(function(err){
            return err;
        });
    },

    searchAlbum: function (album) {
        var encodedAlbum = encodeURIComponent(album);
        var searchUrl = `${SPOTIFY_SEARCH_URL}?q=${encodedAlbum}&type=album`;
        return axios.get(searchUrl).then(function(resp){
            return resp.data.albums.items;
        }).catch(function(err){
            return err;
        });
    },

    searchTrack: function (track) {
        var encodedTrack = encodeURIComponent(track);
        var searchUrl = `${SPOTIFY_SEARCH_URL}?q=${encodedTrack}&type=track`;
        return axios.get(searchUrl).then(function(resp){
            return resp.data.tracks.items;
        }).catch(function(err){
            return err;
        });
    },

    searchAll: function (string) {
        var encodedString = encodeURIComponent(string);
        var searchUrl = `${SPOTIFY_SEARCH_URL}?q=${encodedString}&type=album,track,artist`;
        return axios.get(searchUrl).then(function(resp){
            return resp.data;
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
