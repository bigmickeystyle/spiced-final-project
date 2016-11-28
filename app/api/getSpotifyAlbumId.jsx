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
            console.log(resp.data.albums.items);
            return resp.data.albums.items[0].uri;
        }).catch(function(err){
            return err;
        });
    }
};
