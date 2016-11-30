var axios = require('axios');

const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';

module.exports = {
    getAlbum: function(artist, album){
        console.log(artist);
        var encodedArtist = encodeURIComponent(artist);
        var encodedAlbum = encodeURIComponent(album);
        var albumURL = `${SPOTIFY_SEARCH_URL}?q=album:${encodedAlbum}%20artist:${encodedArtist}&type=album`;
        console.log(albumURL);
        return axios.get(albumURL).then(function(resp){
            if (resp.data.albums.items[0]){
                return resp.data.albums.items[0];
            }
        }).catch(function(err){
            return err;
        });
    }
};
